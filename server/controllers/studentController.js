import {
  getStudentProfile,
  saveStudentProfile,
  migrateLegacyStudentAccount,
  getAllStudentsFromFirestore,
  getStudentAssessmentHistory,
  getUserRecord,
  getCompanyRecord,
  getAllPlacementDrives,
  getApplicationsForStudent,
  evaluateStudentJobEligibility,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

/**
 * GET /api/students
 * Lists students registered in the system with search and dynamic department filtering.
 * Used by Admin and Company portals.
 * Enforces department-specific access scope restrictions for department officers.
 * Blocks unapproved/pending/rejected companies from accessing the student directory.
 */
export async function listStudents(req, res) {
  try {
    const user = req.user || await verifyAuthToken(req);

    // Authorization check: Students cannot access the candidate directory
    if (user.role === 'student' && !user.isDevMock) {
      return res.status(403).json({ error: 'Access denied: Students are not authorized to access candidate directory.' });
    }

    // Authorization check: Recruiters cannot access the college-wide student directory
    if (user.role === 'company') {
      return res.status(403).json({
        error: 'Access denied: Recruiters can only access candidates eligible for or applying to their company\'s authorized job postings.'
      });
    }

    // Check officer access scope (college-wide vs department-specific)
    let officerScope = user.accessScope || 'college';
    let officerAssignedDept = user.assignedDepartment || null;

    if (user.role === 'admin' && user.uid && (!user.accessScope || user.accessScope === 'college')) {
      const officerRecord = await getUserRecord(user.uid, user.email);
      if (officerRecord && officerRecord.accessScope === 'department' && officerRecord.assignedDepartment) {
        officerScope = 'department';
        officerAssignedDept = officerRecord.assignedDepartment;
      }
    }

    const { department, search, skill } = req.query;

    // Backend scope enforcement: If officer is department-specific, deny attempts to query other departments
    if (officerScope === 'department' && officerAssignedDept) {
      if (department && department.toLowerCase() !== 'all' && department.toLowerCase() !== officerAssignedDept.toLowerCase()) {
        return res.status(403).json({
          error: `Access denied: As a department-specific officer for ${officerAssignedDept}, you are not authorized to view students in ${department}.`
        });
      }
    }

    const allStudents = await getAllStudentsFromFirestore();

    // Dynamically discover all unique departments present in actual student records
    const discoveredDepartments = Array.from(
      new Set(allStudents.map(s => s.department).filter(Boolean))
    ).sort();

    let filtered = [...allStudents];

    // Restrict strictly to assigned department if officer is department-specific
    if (officerScope === 'department' && officerAssignedDept) {
      filtered = filtered.filter(s =>
        (s.department || '').toLowerCase() === officerAssignedDept.toLowerCase()
      );
    } else if (department && department.toLowerCase() !== 'all') {
      const targetDept = department.trim().toLowerCase();
      filtered = filtered.filter(s => (s.department || '').toLowerCase() === targetDept);
    }

    // Filter by search query (name, email, department)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(s => {
        const name = (s.personalInfo?.fullName || '').toLowerCase();
        const email = (s.personalInfo?.email || s.email || '').toLowerCase();
        const dept = (s.department || '').toLowerCase();
        return name.includes(q) || email.includes(q) || dept.includes(q);
      });
    }

    // Filter by skill (multi-skill token support)
    if (skill && skill.trim()) {
      const skillTokens = skill.trim().toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter(s => {
        const studentSkills = (s.normalizedSkills || []).map(sk => sk.toLowerCase());
        return skillTokens.some(token => 
          studentSkills.some(sk => sk.includes(token))
        );
      });
    }

    return res.status(200).json({
      students: filtered,
      departments: officerScope === 'department' && officerAssignedDept ? [officerAssignedDept] : discoveredDepartments,
      totalCount: filtered.length,
      accessScope: officerScope,
      assignedDepartment: officerAssignedDept
    });
  } catch (err) {
    console.error('[Student Controller:listStudents] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to list students.' });
  }
}

/**
 * GET /api/students/:studentId/history
 * Fetches assessment history for a specific student.
 */
export async function getStudentHistory(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required.' });
    }

    if (user.role === 'company') {
      const company = await getCompanyRecord(user.uid, user.email);
      if (!company || company.approvalStatus !== 'approved') {
        return res.status(403).json({ error: 'Access denied: Company approval required.' });
      }
      const allDrives = await getAllPlacementDrives({ role: 'admin' });
      const myDrives = allDrives.filter(d =>
        (d.companyId && d.companyId === company.uid) ||
        (d.companyName && company.companyName && d.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
      );
      const myJobIds = new Set(myDrives.map(d => d.id));
      const studentApps = await getApplicationsForStudent(studentId);
      if (!studentApps.some(a => myJobIds.has(a.jobId))) {
        return res.status(403).json({ error: 'Access denied: Assessment history is restricted to applicants for your company\'s jobs.' });
      }
    }

    const history = await getStudentAssessmentHistory(studentId);
    return res.status(200).json(history);
  } catch (err) {
    console.error('[Student Controller:getStudentHistory] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch student assessment history.' });
  }
}

/**
 * GET /api/students/:studentId
 * Fetches a student's placement profile.
 * Security: Validates that the authenticated user matches the requested studentId or is admin.
 * If admin is department-specific, validates student department matches.
 */
export async function getProfile(req, res) {
  try {
    const user = req.user || await verifyAuthToken(req);
    const requestedStudentId = req.params.studentId;

    // Admin / Company can view profiles; student can only view their own
    const studentId = requestedStudentId || user.uid;
    const profile = await getStudentProfile(studentId);

    if (!profile) {
      return res.status(200).json({ found: false, profile: null });
    }

    // Company authorization check: Must be associated with at least one job
    if (user.role === 'company') {
      const company = await getCompanyRecord(user.uid, user.email);
      if (!company || company.approvalStatus !== 'approved') {
        return res.status(403).json({ error: 'Access denied: Company account is pending administrative approval.' });
      }
      const allDrives = await getAllPlacementDrives({ role: 'admin' });
      const myDrives = allDrives.filter(d =>
        (d.companyId && d.companyId === company.uid) ||
        (d.companyName && company.companyName && d.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
      );
      const myJobIds = new Set(myDrives.map(d => d.id));
      const studentApps = await getApplicationsForStudent(studentId);
      const hasAppliedOrNominated = studentApps.some(a => myJobIds.has(a.jobId));

      let isEligible = false;
      for (const drive of myDrives) {
        if (drive.approvalStatus === 'approved') {
          const evalRes = evaluateStudentJobEligibility(profile, drive);
          if (evalRes.isEligible) {
            isEligible = true;
            break;
          }
        }
      }

      if (!hasAppliedOrNominated && !isEligible) {
        return res.status(403).json({
          error: 'Access denied: You are not authorized to view students not associated with your recruitment drives.'
        });
      }
    }

    // Check officer access scope (college-wide vs department-specific)
    let officerScope = user.accessScope || 'college';
    let officerAssignedDept = user.assignedDepartment || null;

    if (user.role === 'admin' && user.uid && (!user.accessScope || user.accessScope === 'college')) {
      const officerRecord = await getUserRecord(user.uid, user.email);
      if (officerRecord && officerRecord.accessScope === 'department' && officerRecord.assignedDepartment) {
        officerScope = 'department';
        officerAssignedDept = officerRecord.assignedDepartment;
      }
    }

    // If requester is a department-specific officer, ensure requested student belongs to officer's department
    if (user.role === 'admin' && officerScope === 'department' && officerAssignedDept && requestedStudentId && requestedStudentId !== user.uid) {
      const studentDept = profile.department || profile.education?.branch || '';
      if (studentDept && studentDept.toLowerCase() !== officerAssignedDept.toLowerCase()) {
        return res.status(403).json({
          error: `Access denied: As a department-specific officer for ${officerAssignedDept}, you are not authorized to view student records in ${studentDept}.`
        });
      }
    }

    return res.status(200).json({
      found: true,
      profile
    });
  } catch (err) {
    console.error('[Student Controller:getProfile] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch student profile.' });
  }
}

/**
 * POST /api/students/profile
 * Saves or updates a student profile.
 */
export async function updateProfile(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = (!user.isDevMock && user.uid) ? user.uid : (req.body.studentId || user.uid);

    if (!studentId) {
      return res.status(400).json({ error: 'Student UID is required.' });
    }

    const profileData = req.body.profile || {};
    const saved = await saveStudentProfile(studentId, profileData);

    return res.status(200).json({
      success: true,
      profile: saved
    });
  } catch (err) {
    console.error('[Student Controller:updateProfile] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save student profile.' });
  }
}

/**
 * POST /api/students/migrate-legacy
 * Safely migrates an older legacy record (e.g. crsid542@gmail.com) to the authenticated UID.
 */
export async function migrateLegacy(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const { legacyEmail, displayName } = req.body;

    if (!legacyEmail) {
      return res.status(400).json({ error: 'Legacy email is required for migration.' });
    }

    // Security: Only allow migration if authenticated user's email matches the legacy email
    if (user.email && user.email.toLowerCase().trim() !== legacyEmail.toLowerCase().trim()) {
      return res.status(403).json({ error: 'Cannot migrate record: authenticated email does not match legacy account.' });
    }

    const targetUid = user.uid || req.body.uid;
    const migrated = await migrateLegacyStudentAccount(legacyEmail, targetUid, displayName);

    if (!migrated) {
      return res.status(404).json({ error: 'Legacy record not found or already migrated.' });
    }

    return res.status(200).json({
      success: true,
      profile: migrated
    });
  } catch (err) {
    console.error('[Student Controller:migrateLegacy] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to migrate legacy account.' });
  }
}
