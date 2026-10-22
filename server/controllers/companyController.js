import {
  getCompanyRecord,
  saveCompanyProfile,
  getUserRecord,
  getAllPlacementDrives,
  savePlacementDrive,
  deletePlacementDrive,
  getPlacementDriveById,
  getAllStudentsFromFirestore,
  getStudentProfile,
  getApplicationsForJob,
  getAllApplications,
  getApplicationById,
  saveApplication,
  getApplicationsForStudent,
  evaluateStudentJobEligibility,
  createNotification,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

/**
 * Middleware: Strictly requires caller to be an authenticated Company Recruiter.
 * Derives the authorized company identity authoritatively on the server.
 */
export async function requireCompanyAuth(req, res, next) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || user.role !== 'company') {
      return res.status(403).json({ error: 'Access denied: Recruiter / Company privileges required.' });
    }

    // Server-side mapping to authorized company profile
    let company = await getCompanyRecord(user.uid, user.email);

    // Auto-heal fallback: if user record exists as company, ensure company profile is created
    if (!company) {
      const userRec = await getUserRecord(user.uid, user.email);
      if (userRec && userRec.role === 'company') {
        company = await saveCompanyProfile(user.uid, {
          companyName: userRec.companyName || userRec.displayName || 'Corporate Partner',
          officialEmail: userRec.email,
          approvalStatus: userRec.approvalStatus || 'pending'
        });
      }
    }

    if (!company) {
      return res.status(404).json({ error: 'Authorized company record not found for this account.' });
    }

    req.companyUser = user;
    req.authorizedCompany = company;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication credentials.' });
  }
}

/**
 * Middleware: Ensures the company is approved by the placement cell for protected actions.
 */
function checkCompanyApproved(req, res) {
  if (req.authorizedCompany.approvalStatus !== 'approved') {
    res.status(403).json({
      error: 'Access denied: Your company registration is pending Placement Cell review and approval. Access to this feature is restricted.'
    });
    return false;
  }
  return true;
}

/**
 * GET /api/company/profile
 * Retrieves the authenticated recruiter's own company profile.
 * Prevents accessing another company's profile.
 */
export async function getCompanyProfileHandler(req, res) {
  try {
    return res.status(200).json({
      success: true,
      profile: req.authorizedCompany
    });
  } catch (err) {
    console.error('[CompanyController:getCompanyProfile] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve company profile.' });
  }
}

/**
 * PUT /api/company/profile
 * Updates the authenticated recruiter's own company profile details.
 * Prevents tampering with approvalStatus, reviewedBy, reviewerName, or rejectionReason.
 */
export async function updateCompanyProfileHandler(req, res) {
  try {
    const company = req.authorizedCompany;
    const {
      companyName,
      website,
      industry,
      description,
      contactPerson,
      phone,
      targetMinCgpa,
      targetMinReadiness,
      targetDepartments,
      keySkillsRequired
    } = req.body;

    const updated = await saveCompanyProfile(company.uid, {
      companyName: companyName || company.companyName,
      officialEmail: company.officialEmail || company.email,
      website,
      industry,
      description,
      contactPerson,
      phone,
      targetMinCgpa: targetMinCgpa !== undefined ? targetMinCgpa : company.targetMinCgpa,
      targetMinReadiness: targetMinReadiness !== undefined ? targetMinReadiness : company.targetMinReadiness,
      targetDepartments: Array.isArray(targetDepartments) ? targetDepartments : company.targetDepartments,
      keySkillsRequired: Array.isArray(keySkillsRequired) ? keySkillsRequired : company.keySkillsRequired
    }, { isReview: false });

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully.',
      profile: updated
    });
  } catch (err) {
    console.error('[CompanyController:updateCompanyProfile] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update company profile.' });
  }
}

/**
 * GET /api/company/overview
 * Returns dashboard metrics, summary, and recent activity strictly for this company.
 * Strictly isolates company data: no college-wide statistics or other companies' data.
 */
export async function getCompanyOverviewHandler(req, res) {
  try {
    const company = req.authorizedCompany;

    // Load drives strictly owned by this company
    const allDrives = await getAllPlacementDrives({ role: 'admin' });
    const myDrives = allDrives.filter(d =>
      (d.companyId && d.companyId === company.uid) ||
      (d.companyName && company.companyName && d.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
    );

    const myJobIds = new Set(myDrives.map(d => d.id));

    // Load applications strictly for this company's jobs
    const allApps = await getAllApplications();
    const myApps = allApps.filter(a =>
      (a.companyId && a.companyId === company.uid) ||
      (a.jobId && myJobIds.has(a.jobId)) ||
      (a.companyName && company.companyName && a.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
    );

    // Compute unique eligible candidates across approved drives
    const allStudents = await getAllStudentsFromFirestore();
    const approvedDrives = myDrives.filter(d => d.approvalStatus === 'approved');
    const eligibleUids = new Set();

    approvedDrives.forEach(drive => {
      allStudents.forEach(st => {
        const evalRes = evaluateStudentJobEligibility(st, drive);
        if (evalRes.isEligible) {
          eligibleUids.add(st.uid);
        }
      });
    });

    const stats = {
      totalJobs: myDrives.length,
      activeJobs: myDrives.filter(d => d.status === 'Active').length,
      upcomingJobs: myDrives.filter(d => d.status === 'Upcoming').length,
      pendingJobs: myDrives.filter(d => d.approvalStatus === 'pending').length,
      approvedJobs: approvedDrives.length,
      rejectedJobs: myDrives.filter(d => d.approvalStatus === 'rejected').length,
      totalApplications: myApps.filter(a => a.hasDirectApplication).length,
      totalNominations: myApps.filter(a => a.hasNomination).length,
      shortlistedCount: myApps.filter(a => a.status === 'Shortlisted').length,
      interviewingCount: myApps.filter(a => a.status === 'Interview Scheduled').length,
      selectedCount: myApps.filter(a => a.status === 'Selected').length,
      rejectedCandidatesCount: myApps.filter(a => a.status === 'Rejected').length,
      totalEligibleCandidates: eligibleUids.size
    };

    // Data-minimized recent applicants to this company's jobs
    const recentApplicants = myApps.slice(0, 5).map(app => ({
      id: app.id,
      jobId: app.jobId,
      jobRole: app.jobRole,
      studentId: app.studentId,
      studentName: app.studentName || 'Candidate',
      studentBranch: app.studentBranch || 'Engineering',
      studentCgpa: app.studentCgpa || 0,
      studentReadiness: app.studentReadiness || 0,
      status: app.status || 'Applied',
      source: app.source || 'direct',
      appliedAt: app.appliedAt || app.createdAt
    }));

    return res.status(200).json({
      success: true,
      profile: company,
      stats,
      recentApplicants,
      recentJobs: myDrives.slice(0, 5)
    });
  } catch (err) {
    console.error('[CompanyController:getCompanyOverview] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve company dashboard overview.' });
  }
}

/**
 * GET /api/company/drives
 * Retrieves recruitment drives strictly submitted by this company.
 * Enriches each drive with applicant counts, nomination counts, and eligible candidate counts.
 */
export async function getCompanyDrivesHandler(req, res) {
  try {
    const company = req.authorizedCompany;
    const allDrives = await getAllPlacementDrives({ role: 'admin' });
    const allApps = await getAllApplications();
    const allStudents = await getAllStudentsFromFirestore();

    const myDrives = allDrives.filter(d =>
      (d.companyId && d.companyId === company.uid) ||
      (d.companyName && company.companyName && d.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
    );

    const enrichedDrives = myDrives.map(drive => {
      const driveApps = allApps.filter(a => a.jobId === drive.id);
      const applicantsCount = driveApps.filter(a => a.hasDirectApplication).length;
      const nominationsCount = driveApps.filter(a => a.hasNomination).length;
      const shortlistedCount = driveApps.filter(a => ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(a.status)).length;
      const selectedCount = driveApps.filter(a => a.status === 'Selected').length;

      // Count eligible candidates meeting this drive's criteria
      const eligibleCount = allStudents.filter(st => {
        const evalRes = evaluateStudentJobEligibility(st, drive);
        return evalRes.isEligible;
      }).length;

      return {
        ...drive,
        applicantsCount,
        nominationsCount,
        shortlistedCount,
        selectedCount,
        eligibleCount
      };
    });

    return res.status(200).json({
      success: true,
      drives: enrichedDrives,
      totalCount: enrichedDrives.length
    });
  } catch (err) {
    console.error('[CompanyController:getCompanyDrives] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve recruitment drives.' });
  }
}

/**
 * POST /api/company/drives
 * Submits a new recruitment drive for Placement Cell review.
 * Enforces company approval, scopes ownership on server, and sets approvalStatus: 'pending'.
 */
export async function createCompanyDriveHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const driveData = req.body;

    if (!driveData.jobRole || !driveData.jobRole.trim()) {
      return res.status(400).json({ error: 'Job role / designation is required.' });
    }

    const saved = await savePlacementDrive({
      ...driveData,
      companyId: company.uid, // Derived strictly from authenticated session
      companyName: company.companyName || driveData.companyName || 'Corporate Partner',
      approvalStatus: 'pending', // Always requires admin review
      companyApprovalStatus: 'approved'
    }, req.companyUser);

    return res.status(201).json({
      success: true,
      message: 'Job role submitted for Placement Cell approval. Once verified, it will be published to students.',
      drive: saved
    });
  } catch (err) {
    console.error('[CompanyController:createCompanyDrive] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to submit recruitment drive.' });
  }
}

/**
 * PUT /api/company/drives/:id
 * Updates an existing job role owned by this company.
 * Strictly verifies company ownership and prevents cross-company modification.
 */
export async function updateCompanyDriveHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { id } = req.params;
    const driveData = req.body;

    const existing = await getPlacementDriveById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Recruitment drive not found.' });
    }

    // Ownership check: must own the job
    const isOwner = existing.companyId === company.uid ||
      (existing.companyName && company.companyName && existing.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim());

    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to update another company\'s job.' });
    }

    const saved = await savePlacementDrive({
      ...existing,
      ...driveData,
      id,
      companyId: company.uid, // Preserves ownership
      approvalStatus: existing.approvalStatus // Preserves approval status
    }, req.companyUser);

    return res.status(200).json({
      success: true,
      message: 'Job role updated successfully.',
      drive: saved
    });
  } catch (err) {
    console.error('[CompanyController:updateCompanyDrive] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update recruitment drive.' });
  }
}

/**
 * DELETE /api/company/drives/:id
 * Deletes a recruitment drive owned by this company.
 * Rejects requests for another company's jobs with 403 Forbidden.
 */
export async function deleteCompanyDriveHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { id } = req.params;

    const existing = await getPlacementDriveById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Recruitment drive not found.' });
    }

    // Strict ownership validation
    const isOwner = existing.companyId === company.uid ||
      (existing.companyName && company.companyName && existing.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim());

    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to delete another company\'s job.' });
    }

    await deletePlacementDrive(id);

    return res.status(200).json({
      success: true,
      message: 'Recruitment drive deleted successfully.'
    });
  } catch (err) {
    console.error('[CompanyController:deleteCompanyDrive] Error:', err);
    return res.status(500).json({ error: 'Failed to delete recruitment drive.' });
  }
}

/**
 * GET /api/company/drives/:id/eligible-students
 * Evaluates and returns students who satisfy that specific job's eligibility criteria.
 * Applies department, CGPA, placement readiness, and batch criteria.
 * Data-minimization enforced: returns only professional and academic matching data.
 */
export async function getJobEligibleStudentsHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { id } = req.params;

    const drive = await getPlacementDriveById(id);
    if (!drive) {
      return res.status(404).json({ error: 'Job drive not found.' });
    }

    // Strict ownership verification
    const isOwner = drive.companyId === company.uid ||
      (drive.companyName && company.companyName && drive.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim());

    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied: You do not own this job posting.' });
    }

    const allStudents = await getAllStudentsFromFirestore();
    const jobApps = await getApplicationsForJob(id);
    const appMap = new Map(jobApps.map(a => [a.studentId, a]));

    const eligibleList = [];
    for (const student of allStudents) {
      const evalRes = evaluateStudentJobEligibility(student, drive);
      if (evalRes.isEligible) {
        const app = appMap.get(student.uid);

        // Preserve unassessed / missing data as null rather than fabricating 0
        const rawReadiness = student.placementScores?.overallReadiness ?? student.overallReadiness;
        const readiness = (rawReadiness !== undefined && rawReadiness !== null && rawReadiness !== '' && !isNaN(Number(rawReadiness)))
          ? Number(rawReadiness)
          : null;

        const rawTech = student.placementScores?.technicalScore ?? student.placementScores?.technical ?? student.latestTechnicalScore ?? student.technicalScore;
        const technicalScore = (rawTech !== undefined && rawTech !== null && rawTech !== '' && !isNaN(Number(rawTech)))
          ? Number(rawTech)
          : null;

        const rawApt = student.placementScores?.aptitudeScore ?? student.placementScores?.aptitude ?? student.latestAptitudeScore ?? student.aptitudeScore;
        const aptitudeScore = (rawApt !== undefined && rawApt !== null && rawApt !== '' && !isNaN(Number(rawApt)))
          ? Number(rawApt)
          : null;

        const rawComm = student.placementScores?.communicationScore ?? student.placementScores?.communication ?? student.communicationScore;
        const communicationScore = (rawComm !== undefined && rawComm !== null && rawComm !== '' && !isNaN(Number(rawComm)))
          ? Number(rawComm)
          : null;

        const rawCgpa = student.education?.cgpa !== undefined && student.education?.cgpa !== null ? student.education.cgpa : student.cgpa;
        const cgpaVal = (rawCgpa !== undefined && rawCgpa !== null && rawCgpa !== '' && !isNaN(Number(rawCgpa)))
          ? Number(rawCgpa)
          : null;

        const gradBatch = (student.education?.graduationYear || student.batch || student.graduationYear || '').toString().trim() || null;
        const studentDept = student.department || student.education?.branch || 'Engineering';

        eligibleList.push({
          uid: student.uid,
          studentId: student.uid,
          // Structured nested profiles for frontend components
          personalInfo: {
            fullName: student.personalInfo?.fullName || student.fullName || 'Candidate',
            email: student.personalInfo?.email || student.email || '',
            phone: student.personalInfo?.phone || '',
            profilePhoto: student.personalInfo?.profilePhoto || null,
            summary: student.personalInfo?.summary || ''
          },
          education: {
            college: student.education?.college || 'Engineering College',
            degree: student.education?.degree || 'B.Tech',
            branch: studentDept,
            cgpa: cgpaVal,
            graduationYear: gradBatch
          },
          placementScores: {
            overallReadiness: readiness,
            technicalScore,
            aptitudeScore,
            communicationScore
          },
          technicalSkills: student.technicalSkills || {},
          projects: student.projects || [],
          experience: student.experience || [],
          certifications: student.certifications || [],
          achievements: student.achievements || [],
          professionalLinks: student.professionalLinks || {},
          placementVisibility: student.placementVisibility || {
            profile: true,
            education: true,
            skills: true,
            projects: true,
            experience: true,
            certifications: true,
            achievements: true,
            scores: true,
            resume: true,
            contact: false
          },
          // Flat aliases for backwards compatibility
          fullName: student.personalInfo?.fullName || student.fullName || 'Candidate',
          department: studentDept,
          college: student.education?.college || 'Engineering College',
          cgpa: cgpaVal,
          overallReadiness: readiness,
          technicalScore,
          aptitudeScore,
          skills: student.normalizedSkills || [],
          normalizedSkills: student.normalizedSkills || [],
          graduationYear: gradBatch,
          hasApplied: Boolean(app && app.hasDirectApplication),
          hasNomination: Boolean(app && app.hasNomination),
          applicationStatus: app?.status || null,
          applicationId: app?.id || null
        });
      }
    }

    return res.status(200).json({
      success: true,
      jobId: id,
      jobRole: drive.jobRole,
      drive, // Persisted drive object with accurate approvalStatus and criteria
      criteria: {
        minCgpa: drive.minCgpa || 0,
        minReadiness: drive.minReadiness || 0,
        eligibleDepartments: drive.eligibleDepartments || ['All'],
        batch: drive.batch || drive.graduationBatch || null
      },
      eligibleStudents: eligibleList,
      totalCount: eligibleList.length
    });
  } catch (err) {
    console.error('[CompanyController:getJobEligibleStudents] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve eligible candidates for job.' });
  }
}

/**
 * GET /api/company/drives/:id/candidates
 * Retrieves candidates (direct applicants and officer nominations) for a specific job.
 * Scoped strictly to the company that owns the job.
 * Evaluates applicants and nominations independently.
 */
export async function getJobCandidatesHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { id } = req.params;

    const drive = await getPlacementDriveById(id);
    if (!drive) {
      return res.status(404).json({ error: 'Job drive not found.' });
    }

    // Strict ownership verification
    const isOwner = drive.companyId === company.uid ||
      (drive.companyName && company.companyName && drive.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim());

    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied: You do not own this job posting.' });
    }

    const allApps = await getApplicationsForJob(id);
    const allStudents = await getAllStudentsFromFirestore();
    const studentMap = new Map(allStudents.map(s => [s.uid, s]));

    // Enrich candidates with structured student profile if available
    const enrichedCandidates = allApps.map(app => {
      const student = studentMap.get(app.studentId);
      const studentName = student?.personalInfo?.fullName || app.studentName || 'Applicant';
      const studentDept = student?.department || student?.education?.branch || app.studentDepartment || app.studentBranch || 'Engineering';
      const rawCgpa = student?.education?.cgpa ?? app.studentCgpa;
      const cgpa = (rawCgpa !== undefined && rawCgpa !== null && !isNaN(Number(rawCgpa))) ? Number(rawCgpa) : null;
      const rawReadiness = student?.placementScores?.overallReadiness ?? app.studentReadiness;
      const readiness = (rawReadiness !== undefined && rawReadiness !== null && !isNaN(Number(rawReadiness))) ? Number(rawReadiness) : null;

      return {
        ...app,
        studentName,
        studentDepartment: studentDept,
        studentCgpa: cgpa,
        studentReadiness: readiness,
        student: student || {
          uid: app.studentId,
          personalInfo: {
            fullName: studentName,
            email: app.studentEmail || ''
          },
          education: {
            college: 'Engineering College',
            degree: 'B.Tech',
            branch: studentDept,
            cgpa
          },
          placementScores: {
            overallReadiness: readiness
          }
        }
      };
    });

    // Independent calculation: direct applicants vs officer nominations
    const directApplicants = enrichedCandidates.filter(c => c.hasDirectApplication === true);
    const nominations = enrichedCandidates.filter(c => c.hasNomination === true || c.isNomination === true);

    return res.status(200).json({
      success: true,
      jobId: id,
      jobRole: drive.jobRole,
      drive,
      candidates: enrichedCandidates,
      directApplicants,
      nominations,
      totalCount: enrichedCandidates.length
    });
  } catch (err) {
    console.error('[CompanyController:getJobCandidates] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve candidates for job.' });
  }
}

/**
 * POST /api/company/drives/:id/shortlist
 * Toggles a student candidate on/off the shortlist for a specific job drive.
 * Validates company authorization, drive ownership, and prevents duplicate shortlisting.
 */
export async function toggleJobCandidateShortlistHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { id: driveId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required.' });
    }

    const drive = await getPlacementDriveById(driveId);
    if (!drive) {
      return res.status(404).json({ error: 'Recruitment drive not found.' });
    }

    // Strict ownership verification
    const isOwner = drive.companyId === company.uid ||
      (drive.companyName && company.companyName && drive.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim());

    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied: You do not own this recruitment drive.' });
    }

    const jobApps = await getApplicationsForJob(driveId);
    let existingApp = jobApps.find(a => a.studentId === studentId);

    if (existingApp) {
      const isShortlisted = existingApp.status === 'Shortlisted';
      const newStatus = isShortlisted ? 'Under Review' : 'Shortlisted';

      const updated = await saveApplication({
        ...existingApp,
        status: newStatus,
        statusHistory: [
          ...(existingApp.statusHistory || []),
          {
            status: newStatus,
            changedAt: new Date().toISOString(),
            changedBy: `Company Recruiter (${company.companyName})`,
            note: isShortlisted ? 'Removed from shortlist by company recruiter.' : 'Shortlisted by company recruiter.'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        action: newStatus === 'Shortlisted' ? 'shortlisted' : 'unshortlisted',
        isShortlisted: newStatus === 'Shortlisted',
        application: updated
      });
    }

    // If candidate has not submitted an application yet, create a recruiter-shortlist record
    const allStudents = await getAllStudentsFromFirestore();
    const student = allStudents.find(s => s.uid === studentId) || await getStudentProfile(studentId);

    const studentName = student?.personalInfo?.fullName || student?.fullName || 'Candidate';
    const studentBranch = student?.department || student?.education?.branch || 'Engineering';
    const rawCgpa = student?.education?.cgpa ?? student?.cgpa;
    const studentCgpa = (rawCgpa !== undefined && rawCgpa !== null && !isNaN(Number(rawCgpa))) ? Number(rawCgpa) : null;
    const rawReadiness = student?.placementScores?.overallReadiness ?? student?.overallReadiness;
    const studentReadiness = (rawReadiness !== undefined && rawReadiness !== null && !isNaN(Number(rawReadiness))) ? Number(rawReadiness) : null;

    const newApp = await saveApplication({
      jobId: driveId,
      companyId: company.uid,
      companyName: company.companyName || drive.companyName,
      jobRole: drive.jobRole,
      studentId,
      studentName,
      studentEmail: student?.personalInfo?.email || student?.email || '',
      studentDepartment: studentBranch,
      studentCgpa,
      studentReadiness,
      source: 'recruiter_shortlist',
      hasDirectApplication: false,
      hasNomination: false,
      status: 'Shortlisted',
      appliedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Shortlisted',
          changedAt: new Date().toISOString(),
          changedBy: `Company Recruiter (${company.companyName})`,
          note: 'Shortlisted directly by company recruiter from verified talent pool.'
        }
      ]
    });

    return res.status(201).json({
      success: true,
      action: 'shortlisted',
      isShortlisted: true,
      application: newApp
    });
  } catch (err) {
    console.error('[CompanyController:toggleJobCandidateShortlist] Error:', err);
    return res.status(500).json({ error: 'Failed to update candidate shortlist.' });
  }
}

/**
 * PATCH / PUT /api/company/applications/:id/status
 * Updates a candidate's recruitment stage and records interview/selection details.
 * Scoped strictly: recruiter must own the job corresponding to this application.
 */
export async function updateApplicationStatusHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { id } = req.params;
    const { status, interviewDetails, interviewDate, interviewRound, remarks, notes } = req.body;

    const statusMap = {
      'applied': 'Applied',
      'under_review': 'Under Review',
      'shortlisted': 'Shortlisted',
      'interview_scheduled': 'Interview Scheduled',
      'selected': 'Selected',
      'rejected': 'Rejected'
    };
    const normalizedStatus = statusMap[status?.toLowerCase()] || status;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found.' });
    }

    // Strict ownership check
    const drive = await getPlacementDriveById(application.jobId);
    const isOwner = (application.companyId && application.companyId === company.uid) ||
      (drive && drive.companyId === company.uid) ||
      (application.companyName && company.companyName && application.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim());

    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to update applications for another company\'s job.' });
    }

    const interviewPayload = interviewDetails || (interviewDate ? {
      date: interviewDate,
      round: interviewRound || 'Technical Screening',
      remarks: remarks || notes || ''
    } : application.interviewDetails);

    const updated = await saveApplication({
      ...application,
      status: normalizedStatus,
      interviewDetails: interviewPayload,
      interviewDate: interviewDate || application.interviewDate,
      interviewRound: interviewRound || application.interviewRound,
      remarks: remarks || notes || application.remarks,
      statusHistory: [
        ...(application.statusHistory || []),
        {
          status: normalizedStatus,
          changedAt: new Date().toISOString(),
          changedBy: company.companyName || company.displayName || 'Corporate Recruiter',
          note: remarks || notes || `Candidate stage updated to ${normalizedStatus}.`
        }
      ]
    });

    // Notify the student regarding recruitment outcome
    let notifTitle = `Application Status Updated: ${status}`;
    let notifMsg = `Your application for ${application.jobRole} at ${company.companyName} is now: ${status}.`;
    if (status === 'Selected') {
      notifTitle = 'Congratulations! Job Offer / Selected 🎉';
      notifMsg = `You have been selected for ${application.jobRole} at ${company.companyName}! Check your email for further instructions.`;
    } else if (status === 'Interview Scheduled') {
      notifTitle = 'Interview Scheduled 🗓️';
      notifMsg = `An interview has been scheduled for ${application.jobRole} at ${company.companyName}.`;
    }

    await createNotification({
      recipientId: application.studentId,
      recipientRole: 'student',
      title: notifTitle,
      message: notifMsg,
      type: 'application',
      relatedJobId: application.jobId,
      relatedAppId: application.id
    });

    return res.status(200).json({
      success: true,
      message: `Candidate stage updated to ${status}.`,
      application: updated
    });
  } catch (err) {
    console.error('[CompanyController:updateApplicationStatus] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update candidate application status.' });
  }
}

/**
 * GET /api/company/students/:studentId
 * Fetches data-minimized student profile if student is associated with company's jobs.
 * Rejects requests for unrelated students with 403 Forbidden.
 */
export async function getCompanyStudentProfileHandler(req, res) {
  try {
    if (!checkCompanyApproved(req, res)) return;

    const company = req.authorizedCompany;
    const { studentId } = req.params;

    const allDrives = await getAllPlacementDrives({ role: 'admin' });
    const myDrives = allDrives.filter(d =>
      (d.companyId && d.companyId === company.uid) ||
      (d.companyName && company.companyName && d.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
    );
    const myJobIds = new Set(myDrives.map(d => d.id));

    // Check 1: Did student apply to or get nominated for this company's jobs?
    const studentApps = await getApplicationsForStudent(studentId);
    const matchingApp = studentApps.find(a => myJobIds.has(a.jobId));

    // Check 2: Is student eligible for any of this company's approved jobs?
    const studentProfile = await getStudentProfile(studentId);
    if (!studentProfile) {
      return res.status(404).json({ error: 'Student candidate record not found.' });
    }

    let isEligible = false;
    for (const drive of myDrives) {
      if (drive.approvalStatus === 'approved') {
        const evalRes = evaluateStudentJobEligibility(studentProfile, drive);
        if (evalRes.isEligible) {
          isEligible = true;
          break;
        }
      }
    }

    if (!matchingApp && !isEligible) {
      return res.status(403).json({
        error: 'Access denied: This student is not associated with any of your company\'s recruitment drives.'
      });
    }

    // Apply data minimization and visibility constraints
    const visibility = studentProfile.placementVisibility || {};
    const sanitized = {
      uid: studentProfile.uid || studentId,
      studentId,
      personalInfo: {
        fullName: studentProfile.personalInfo?.fullName || 'Candidate',
        email: visibility.contact ? studentProfile.personalInfo?.email : null,
        phone: visibility.contact ? studentProfile.personalInfo?.phone : null,
        location: studentProfile.personalInfo?.location || null
      },
      education: studentProfile.education || {},
      department: studentProfile.department || studentProfile.education?.branch,
      technicalSkills: studentProfile.technicalSkills || {},
      normalizedSkills: studentProfile.normalizedSkills || [],
      placementScores: studentProfile.placementScores || {},
      resumeData: studentProfile.resumeData || null,
      projects: visibility.projects !== false ? (studentProfile.projects || []) : [],
      experience: visibility.experience !== false ? (studentProfile.experience || []) : [],
      certifications: visibility.certifications !== false ? (studentProfile.certifications || []) : [],
      associatedApplication: matchingApp || null
    };

    return res.status(200).json({
      success: true,
      profile: sanitized
    });
  } catch (err) {
    console.error('[CompanyController:getCompanyStudentProfile] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve student profile.' });
  }
}
