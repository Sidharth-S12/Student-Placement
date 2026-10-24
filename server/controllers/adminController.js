import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllPlacementOfficers,
  addPlacementOfficer,
  updatePlacementOfficer,
  toggleOfficerStatus,
  removePlacementOfficer,
  getAllPlacementDrives,
  savePlacementDrive,
  deletePlacementDrive,
  getAllStudentsFromFirestore,
  getAllCompanies,
  getAllCompaniesFull,
  getCompanyRecord,
  reviewCompanyAccount,
  reviewJobRole,
  getAllApplications,
  getApplicationById,
  saveApplication,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Authorized Super Administrator emails permitted to create and manage placement officers.
 */
export const PRIMARY_ADMIN_EMAILS = [
  'sidharths4669@gmail.com',
  'admin@placement.edu',
  (process.env.PRIMARY_ADMIN_EMAIL || '').toLowerCase().trim()
].filter(Boolean);

/**
 * Middleware: Requires caller to be an authenticated Administrator/Placement Officer.
 */
export async function requireAdminAuth(req, res, next) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
    }
    req.adminUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication credentials.' });
  }
}

/**
 * Middleware: Requires caller to be the Original Primary Super Administrator.
 * Only the original admin account created can register or modify placement officers.
 */
export async function requirePrimaryAdminAuth(req, res, next) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
    }
    const cleanEmail = (user.email || req.headers['x-user-email'] || '').toLowerCase().trim();
    if (!PRIMARY_ADMIN_EMAILS.includes(cleanEmail)) {
      return res.status(403).json({
        error: 'Access denied: Only the original primary administrator is authorized to create or manage officer accounts.'
      });
    }
    req.adminUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication credentials.' });
  }
}

/**
 * GET /api/admin/companies
 * Lists all registered companies with approval statuses, contact info, and job role counts.
 */
export async function listCompaniesAdmin(req, res) {
  try {
    const { status, search } = req.query;
    const allCompanies = await getAllCompaniesFull();

    let filtered = [...allCompanies];

    if (status && status !== 'all') {
      filtered = filtered.filter(c => (c.approvalStatus || 'pending').toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(c =>
        (c.companyName || '').toLowerCase().includes(q) ||
        (c.officialEmail || '').toLowerCase().includes(q) ||
        (c.industry || '').toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      companies: filtered,
      totalCount: filtered.length,
      counts: {
        total: allCompanies.length,
        pending: allCompanies.filter(c => (c.approvalStatus || 'pending') === 'pending').length,
        approved: allCompanies.filter(c => c.approvalStatus === 'approved').length,
        rejected: allCompanies.filter(c => c.approvalStatus === 'rejected').length,
        suspended: allCompanies.filter(c => c.approvalStatus === 'suspended').length
      }
    });
  } catch (err) {
    console.error('[AdminController:listCompaniesAdmin] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve company registrations.' });
  }
}

/**
 * GET /api/admin/companies/:id
 * Retrieves full company profile details along with all submitted job roles.
 */
export async function getCompanyDetailsAdmin(req, res) {
  try {
    const { id } = req.params;
    const company = await getCompanyRecord(id);
    if (!company) {
      return res.status(404).json({ error: 'Company record not found.' });
    }

    const allDrives = await getAllPlacementDrives({ role: 'admin' });
    const companyJobs = allDrives.filter(d =>
      (d.companyId && d.companyId === id) ||
      (d.companyName && company.companyName && d.companyName.toLowerCase().trim() === company.companyName.toLowerCase().trim())
    );

    return res.status(200).json({
      company,
      jobs: companyJobs,
      totalJobs: companyJobs.length
    });
  } catch (err) {
    console.error('[AdminController:getCompanyDetailsAdmin] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve company profile.' });
  }
}

/**
 * POST /api/admin/companies/:id/review
 * Approves, rejects, or suspends a registered company account.
 */
export async function reviewCompanyAdmin(req, res) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid decision status. Must be approved, rejected, or suspended.' });
    }

    if (status === 'rejected' && (!reason || !reason.trim())) {
      return res.status(400).json({ error: 'A specific rejection reason is required to notify the company.' });
    }

    const reviewer = req.adminUser || { uid: 'admin_officer', displayName: 'Placement Officer' };
    const updated = await reviewCompanyAccount(id, {
      status,
      reason,
      reviewerUid: reviewer.uid,
      reviewerName: reviewer.displayName || reviewer.email
    });

    return res.status(200).json({
      success: true,
      message: `Company registration ${status} successfully.`,
      company: updated
    });
  } catch (err) {
    console.error('[AdminController:reviewCompanyAdmin] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to review company registration.' });
  }
}

/**
 * GET /api/admin/jobs
 * Lists all submitted job roles across all companies for review.
 */
export async function listJobsAdmin(req, res) {
  try {
    const { status, search } = req.query;
    const allDrives = await getAllPlacementDrives({ role: 'admin' });

    let filtered = [...allDrives];

    if (status && status !== 'all') {
      filtered = filtered.filter(j => (j.approvalStatus || 'pending').toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(j =>
        (j.jobRole || '').toLowerCase().includes(q) ||
        (j.companyName || '').toLowerCase().includes(q) ||
        (j.packageCTC || '').toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      jobs: filtered,
      totalCount: filtered.length,
      counts: {
        total: allDrives.length,
        pending: allDrives.filter(j => (j.approvalStatus || 'pending') === 'pending').length,
        approved: allDrives.filter(j => j.approvalStatus === 'approved').length,
        rejected: allDrives.filter(j => j.approvalStatus === 'rejected').length
      }
    });
  } catch (err) {
    console.error('[AdminController:listJobsAdmin] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve job roles.' });
  }
}

/**
 * POST /api/admin/jobs/:id/review
 * Approves or rejects a specific submitted job role.
 */
export async function reviewJobAdmin(req, res) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Decision status must be approved or rejected.' });
    }

    if (status === 'rejected' && (!reason || !reason.trim())) {
      return res.status(400).json({ error: 'A specific rejection reason is required when rejecting a job role.' });
    }

    const reviewer = req.adminUser || { uid: 'admin_officer', displayName: 'Placement Officer' };
    const updated = await reviewJobRole(id, {
      status,
      reason,
      reviewerUid: reviewer.uid,
      reviewerName: reviewer.displayName || reviewer.email
    });

    return res.status(200).json({
      success: true,
      message: `Job role ${status} successfully.`,
      drive: updated
    });
  } catch (err) {
    console.error('[AdminController:reviewJobAdmin] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to review job role.' });
  }
}

/**
 * GET /api/admin/drives
 * Lists recruitment drives with role-based visibility.
 * Students only receive approved job roles from approved companies!
 */
export async function listDrives(req, res) {
  try {
    const user = await verifyAuthToken(req).catch(() => null);
    const drives = await getAllPlacementDrives(user);
    return res.status(200).json({
      drives,
      totalCount: drives.length
    });
  } catch (err) {
    console.error('[AdminController:listDrives] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve recruitment drives.' });
  }
}

/**
 * POST /api/admin/drives
 * Creates or updates a recruitment drive.
 */
export async function createOrUpdateDrive(req, res) {
  try {
    const user = await verifyAuthToken(req).catch(() => null);
    const driveData = req.body;
    if (!driveData.companyName || !driveData.companyName.trim()) {
      return res.status(400).json({ error: 'Company name is required.' });
    }
    if (!driveData.jobRole || !driveData.jobRole.trim()) {
      return res.status(400).json({ error: 'Job role / designation is required.' });
    }

    // Numerical validation
    const minCgpa = typeof driveData.minCgpa === 'number'
      ? Math.min(10, Math.max(0, driveData.minCgpa))
      : Math.min(10, Math.max(0, parseFloat(driveData.minCgpa) || 0));

    const minReadiness = typeof driveData.minReadiness === 'number'
      ? Math.min(100, Math.max(0, driveData.minReadiness))
      : Math.min(100, Math.max(0, parseInt(driveData.minReadiness, 10) || 0));

    // Normalize driveDate (handles DD-MM-YYYY -> YYYY-MM-DD or standard ISO/date string)
    let driveDate = driveData.driveDate ? String(driveData.driveDate).trim() : '';
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(driveDate)) {
      const parts = driveDate.split('-');
      driveDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }

    // Department normalization
    let eligibleDepartments = Array.isArray(driveData.eligibleDepartments)
      ? driveData.eligibleDepartments
      : (driveData.eligibleDepartments ? [driveData.eligibleDepartments] : ['All']);

    if (eligibleDepartments.length === 0 || eligibleDepartments.includes('All')) {
      eligibleDepartments = ['All'];
    }

    const cleanedDriveData = {
      ...driveData,
      companyName: driveData.companyName.trim(),
      jobRole: driveData.jobRole.trim(),
      minCgpa,
      minReadiness,
      driveDate,
      eligibleDepartments,
      packageCTC: driveData.packageCTC?.trim() || 'Negotiable',
      location: driveData.location?.trim() || 'Campus / Virtual',
      status: driveData.status || 'Upcoming',
      jobDescription: driveData.jobDescription?.trim() || ''
    };

    // If submitted via /api/admin/drives (the Admin/Placement Officer portal):
    // By default, campus drives created by the placement cell are approved
    const effectiveUser = user || { role: 'admin', uid: 'admin_officer' };
    if (!cleanedDriveData.approvalStatus && (!user || user.role === 'admin')) {
      cleanedDriveData.approvalStatus = 'approved';
      cleanedDriveData.companyApprovalStatus = 'approved';
    }

    const saved = await savePlacementDrive(cleanedDriveData, effectiveUser);
    return res.status(200).json({
      success: true,
      message: saved.approvalStatus === 'pending'
        ? 'Recruitment drive submitted for Placement Cell approval.'
        : 'Recruitment drive published successfully.',
      drive: saved
    });
  } catch (err) {
    console.error('[AdminController:createOrUpdateDrive] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to save drive.' });
  }
}

/**
 * DELETE /api/admin/drives/:id
 * Deletes a recruitment drive.
 */
export async function removeDrive(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Drive ID is required.' });
    }

    await deletePlacementDrive(id);
    return res.status(200).json({
      success: true,
      message: 'Recruitment drive deleted successfully.'
    });
  } catch (err) {
    console.error('[AdminController:removeDrive] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete drive.' });
  }
}

/**
 * GET /api/admin/officers
 * Lists all registered placement cell officers with access scopes and account statuses.
 */
export async function listOfficers(req, res) {
  try {
    const officers = await getAllPlacementOfficers();
    return res.status(200).json({
      officers,
      totalCount: officers.length
    });
  } catch (err) {
    console.error('[AdminController:listOfficers] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve placement officers.' });
  }
}

/**
 * POST /api/admin/officers
 * Creates and registers a new Placement Officer with configurable access scope and status.
 */
export async function createOfficer(req, res) {
  try {
    // Defense-in-depth: Ensure caller is the original primary super administrator
    const callerEmail = (req.adminUser?.email || req.headers['x-user-email'] || '').toLowerCase().trim();
    if (callerEmail && !PRIMARY_ADMIN_EMAILS.includes(callerEmail)) {
      return res.status(403).json({
        error: 'Access denied: Only the original primary administrator is authorized to register new placement officers.'
      });
    }

    const {
      name,
      email,
      designation,
      department,
      phone,
      accessScope,
      assignedDepartment,
      status,
      initialPassword,
      uid
    } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Official email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const officer = await addPlacementOfficer({
      name: name?.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      designation: designation?.trim() || 'Placement Officer',
      department: department?.trim() || 'Central Placement Cell',
      phone: phone?.trim() || '',
      accessScope: accessScope || (department && department !== 'Central Placement Cell' ? 'department' : 'college'),
      assignedDepartment: accessScope === 'department' ? (assignedDepartment || department) : null,
      status: status || 'active',
      initialPassword: initialPassword || undefined,
      uid: uid || null
    });

    console.log(`[AdminController] Successfully registered Placement Officer: ${officer.email} (Scope: ${officer.accessScope})`);

    return res.status(201).json({
      success: true,
      message: 'Placement officer registered successfully.',
      officer
    });
  } catch (err) {
    console.error('[AdminController:createOfficer] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to add placement officer.' });
  }
}

/**
 * PUT /api/admin/officers/:uid
 * Updates existing Placement Officer details, access scope, department, and status.
 */
export async function updateOfficer(req, res) {
  try {
    const { uid } = req.params;
    const updates = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'Officer UID is required.' });
    }

    const updated = await updatePlacementOfficer(uid, updates);
    return res.status(200).json({
      success: true,
      message: 'Placement officer updated successfully.',
      officer: updated
    });
  } catch (err) {
    console.error('[AdminController:updateOfficer] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update placement officer.' });
  }
}

/**
 * PATCH /api/admin/officers/:uid/status
 * Activates or deactivates a Placement Officer account.
 */
export async function toggleOfficerStatusHandler(req, res) {
  try {
    const { uid } = req.params;
    const { status } = req.body;

    if (!uid || !status) {
      return res.status(400).json({ error: 'UID and status ("active" | "inactive") are required.' });
    }

    const updated = await toggleOfficerStatus(uid, status);
    return res.status(200).json({
      success: true,
      message: `Officer account ${status === 'active' ? 'activated' : 'deactivated'} successfully.`,
      officer: updated
    });
  } catch (err) {
    console.error('[AdminController:toggleOfficerStatusHandler] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to update officer status.' });
  }
}

/**
 * DELETE /api/admin/officers/:uid
 * Removes a Placement Officer.
 */
export async function deleteOfficer(req, res) {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ error: 'Officer UID is required.' });
    }

    await removePlacementOfficer(uid);
    return res.status(200).json({
      success: true,
      message: 'Placement officer privileges revoked successfully.'
    });
  } catch (err) {
    console.error('[AdminController:deleteOfficer] Error:', err);
    return res.status(400).json({ error: err.message || 'Failed to remove placement officer.' });
  }
}



/**
 * GET /api/admin/applications
 * Lists all campus recruitment applications across all drives.
 */
export async function listApplications(req, res) {
  try {
    const applications = await getAllApplications();
    return res.status(200).json({
      applications,
      totalCount: applications.length
    });
  } catch (err) {
    console.error('[AdminController:listApplications] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
}

/**
 * PATCH /api/admin/applications/:id/status
 * Updates application recruitment stage.
 */
export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application record not found.' });
    }

    const updated = await saveApplication({
      ...application,
      status,
      statusHistory: [
        ...(application.statusHistory || []),
        {
          status,
          changedAt: new Date().toISOString(),
          changedBy: 'Placement Officer',
          note: note || `Status updated to ${status}.`
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status}.`,
      application: updated
    });
  } catch (err) {
    console.error('[AdminController:updateApplicationStatus] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update application status.' });
  }
}

/**
 * GET /api/admin/analytics/summary
 * Provides dynamically calculated summary metrics from actual database records.
 *
 * Computes:
 * - Total registered students
 * - Total placement officers
 * - Total companies and recruiters
 * - Total departments
 * - Active job postings
 * - Total student applications
 * - Students shortlisted
 * - Students selected or placed
 * - Overall placement percentage (Unique Placed Candidates / Eligible Population)
 * - Department-wise breakdown with accurate placement rates
 * - Recent activity log
 */
export async function getCampusSummary(req, res) {
  try {
    const [allStudents, allOfficers, allCompanies, allDrives, allApplications] = await Promise.all([
      getAllStudentsFromFirestore(),
      getAllPlacementOfficers(),
      getAllCompanies(),
      getAllPlacementDrives(),
      getAllApplications()
    ]);

    const totalStudents = allStudents.length;
    const totalOfficers = allOfficers.length;
    const totalCompanies = allCompanies.length;

    // Discovered unique departments from actual student records
    const departments = Array.from(
      new Set(allStudents.map(s => s.department).filter(Boolean))
    ).sort();

    // Active drives
    const activeDrives = allDrives.filter(d => d.status === 'Active' || d.status === 'Upcoming' || !d.status);

    // Applications stats
    const totalApplications = allApplications.length;
    const shortlistedApps = allApplications.filter(a => a.status === 'Shortlisted');
    const selectedApps = allApplications.filter(a => {
      const st = (a.status || '').toLowerCase();
      return st === 'selected' || st === 'hired' || st === 'offer accepted';
    });

    // Extract placed student identities to prevent duplicate offer counting across drives
    const selectedStudentUids = new Set();
    const selectedStudentEmails = new Set();
    const selectedStudentNames = new Set();

    selectedApps.forEach(app => {
      if (app.studentId) selectedStudentUids.add(app.studentId);
      if (app.studentEmail) selectedStudentEmails.add(app.studentEmail.toLowerCase().trim());
      if (app.studentName) selectedStudentNames.add(app.studentName.toLowerCase().trim());
    });

    const isStudentPlaced = (s) => {
      const email = (s.personalInfo?.email || s.email || '').toLowerCase().trim();
      const name = (s.personalInfo?.fullName || s.displayName || '').toLowerCase().trim();
      const pStatus = (s.placementStatus || '').toLowerCase();
      return pStatus === 'placed' ||
             selectedStudentUids.has(s.uid) ||
             selectedStudentUids.has(s.studentId) ||
             (email && selectedStudentEmails.has(email)) ||
             (name && selectedStudentNames.has(name));
    };

    // Calculate unique placed students from actual registered student population
    const uniquelyPlacedStudents = allStudents.filter(isStudentPlaced);
    const uniquePlacedCount = uniquelyPlacedStudents.length;

    // Defined placement percentage: Uniquely placed candidates / total registered student population
    const overallPlacementPercentage = totalStudents > 0
      ? Math.min(100, Math.round((uniquePlacedCount / totalStudents) * 100))
      : 0;

    // Department-wise aggregated metrics
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept] = {
        dept,
        totalStudents: 0,
        assessedStudentsCount: 0,
        placedStudentsCount: 0,
        totalTech: 0,
        techCount: 0,
        totalApt: 0,
        aptCount: 0,
        totalComm: 0,
        commCount: 0,
        totalReadiness: 0,
        readinessCount: 0,
        totalCgpa: 0,
        cgpaCount: 0,
        applicationsCount: 0,
        shortlistedCount: 0,
        selectedCount: 0
      };
    });

    let collegeTotalTech = 0;
    let collegeTechCount = 0;
    let collegeTotalApt = 0;
    let collegeAptCount = 0;
    let collegeTotalComm = 0;
    let collegeCommCount = 0;
    let collegeTotalReadiness = 0;
    let collegeReadinessCount = 0;
    let highReadyCount = 0;
    let modReadyCount = 0;
    let remedialCount = 0;

    allStudents.forEach(s => {
      const dept = s.department || 'Other';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          dept,
          totalStudents: 0,
          assessedStudentsCount: 0,
          placedStudentsCount: 0,
          totalTech: 0,
          techCount: 0,
          totalApt: 0,
          aptCount: 0,
          totalComm: 0,
          commCount: 0,
          totalReadiness: 0,
          readinessCount: 0,
          totalCgpa: 0,
          cgpaCount: 0,
          applicationsCount: 0,
          shortlistedCount: 0,
          selectedCount: 0
        };
      }

      deptMap[dept].totalStudents++;

      const scores = s.placementScores || {};
      const rawTech = scores.technicalScore !== undefined && scores.technicalScore !== null ? Number(scores.technicalScore) : (s.latestTechnicalScore !== undefined ? Number(s.latestTechnicalScore) : null);
      const rawApt = scores.aptitudeScore !== undefined && scores.aptitudeScore !== null ? Number(scores.aptitudeScore) : (s.latestAptitudeAssessment?.score !== undefined ? Number(s.latestAptitudeAssessment.score) : null);
      const rawComm = scores.communicationScore !== undefined && scores.communicationScore !== null ? Number(scores.communicationScore) : (s.latestCommunicationAssessment?.score !== undefined ? Number(s.latestCommunicationAssessment.score) : null);
      const rawReadiness = scores.overallReadiness !== undefined && scores.overallReadiness !== null ? Number(scores.overallReadiness) : (s.overallReadiness !== undefined ? Number(s.overallReadiness) : null);
      const rawCgpa = (s.education?.cgpa !== undefined && s.education?.cgpa !== null && !isNaN(Number(s.education.cgpa)))
        ? Number(s.education.cgpa)
        : (s.cgpa !== undefined && s.cgpa !== null && !isNaN(Number(s.cgpa)) ? Number(s.cgpa) : null);

      let hasAnyAssessment = false;

      if (rawTech !== null) {
        deptMap[dept].totalTech += rawTech;
        deptMap[dept].techCount++;
        collegeTotalTech += rawTech;
        collegeTechCount++;
        hasAnyAssessment = true;
      }
      if (rawApt !== null) {
        deptMap[dept].totalApt += rawApt;
        deptMap[dept].aptCount++;
        collegeTotalApt += rawApt;
        collegeAptCount++;
        hasAnyAssessment = true;
      }
      if (rawComm !== null) {
        deptMap[dept].totalComm += rawComm;
        deptMap[dept].commCount++;
        collegeTotalComm += rawComm;
        collegeCommCount++;
        hasAnyAssessment = true;
      }
      if (rawReadiness !== null) {
        deptMap[dept].totalReadiness += rawReadiness;
        deptMap[dept].readinessCount++;
        collegeTotalReadiness += rawReadiness;
        collegeReadinessCount++;
        if (rawReadiness >= 80) highReadyCount++;
        else if (rawReadiness >= 60) modReadyCount++;
        else remedialCount++;
      }
      if (rawCgpa !== null) {
        deptMap[dept].totalCgpa += rawCgpa;
        deptMap[dept].cgpaCount++;
      }

      if (hasAnyAssessment || s.latestAssessmentId) {
        deptMap[dept].assessedStudentsCount++;
      }

      if (isStudentPlaced(s)) {
        deptMap[dept].placedStudentsCount++;
      }
    });

    // Populate applications into departments
    allApplications.forEach(app => {
      const candidate = allStudents.find(s => s.uid === app.studentId);
      const dept = candidate?.department || app.studentDepartment || 'Other';
      if (deptMap[dept]) {
        deptMap[dept].applicationsCount++;
        if (app.status === 'Shortlisted') deptMap[dept].shortlistedCount++;
        if (app.status === 'Selected' || app.status === 'Hired') deptMap[dept].selectedCount++;
      }
    });

    // Format department summaries
    const departmentBreakdown = Object.values(deptMap).map(d => {
      const placed = d.placedStudentsCount;
      const deptPlacementRate = d.totalStudents > 0
        ? Math.min(100, Math.round((placed / d.totalStudents) * 100))
        : 0;

      return {
        dept: d.dept,
        totalStudents: d.totalStudents,
        assessmentCompletedCount: d.assessedStudentsCount,
        assessmentCompletionRate: d.totalStudents > 0
          ? Math.round((d.assessedStudentsCount / d.totalStudents) * 100)
          : 0,
        avgReadiness: d.readinessCount > 0 ? Math.round(d.totalReadiness / d.readinessCount) : null,
        avgTechnical: d.techCount > 0 ? Math.round(d.totalTech / d.techCount) : null,
        avgAptitude: d.aptCount > 0 ? Math.round(d.totalApt / d.aptCount) : null,
        avgCommunication: d.commCount > 0 ? Math.round(d.totalComm / d.commCount) : null,
        avgCGPA: d.cgpaCount > 0 ? Number((d.totalCgpa / d.cgpaCount).toFixed(2)) : null,
        applicationsCount: d.applicationsCount,
        shortlistedCount: d.shortlistedCount,
        selectedCount: d.selectedCount,
        uniquelyPlacedCount: placed,
        placementPercentage: deptPlacementRate
      };
    }).sort((a, b) => b.totalStudents - a.totalStudents);

    // Build real recent activity list from actual events
    const recentActivity = [];

    // Recent applications
    allApplications.slice(0, 5).forEach(app => {
      recentActivity.push({
        id: `act_${app.id}`,
        type: 'application',
        title: `${app.studentName || 'Student'} applied for ${app.jobRole}`,
        subtitle: `${app.companyName} • Status: ${app.status}`,
        timestamp: app.updatedAt || app.createdAt || new Date().toISOString(),
        icon: 'Briefcase'
      });
    });

    // Recent drives
    allDrives.slice(0, 3).forEach(drive => {
      recentActivity.push({
        id: `act_${drive.id}`,
        type: 'drive',
        title: `Campus Drive: ${drive.companyName}`,
        subtitle: `${drive.jobRole} (${drive.packageCTC || 'Package TBA'})`,
        timestamp: drive.updatedAt || drive.createdAt || new Date().toISOString(),
        icon: 'Building2'
      });
    });

    // Recent officers
    allOfficers.slice(0, 3).forEach(off => {
      recentActivity.push({
        id: `act_${off.uid}`,
        type: 'officer',
        title: `Officer: ${off.displayName}`,
        subtitle: `${off.designation} (${off.accessScope === 'college' ? 'College-Wide' : off.assignedDepartment || off.department})`,
        timestamp: off.createdAt || new Date().toISOString(),
        icon: 'ShieldCheck'
      });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      totalStudents,
      totalPlacementOfficers: totalOfficers,
      totalCompanies,
      totalDepartments: departments.length,
      activeJobPostings: activeDrives.length,
      totalApplications,
      studentsShortlisted: shortlistedApps.length,
      studentsSelected: selectedApps.length,
      uniquelyPlacedStudents: uniquePlacedCount,
      overallPlacementPercentage,
      placementRateMetricDetails: {
        numerator: uniquePlacedCount,
        denominator: totalStudents,
        denominatorLabel: 'Total Registered Students',
        formula: 'Unique Placed Candidates / Total Registered Students'
      },
      averages: {
        readiness: totalStudents > 0 ? Math.round(collegeTotalReadiness / totalStudents) : 0,
        technical: totalStudents > 0 ? Math.round(collegeTotalTech / totalStudents) : 0,
        aptitude: totalStudents > 0 ? Math.round(collegeTotalApt / totalStudents) : 0,
        communication: totalStudents > 0 ? Math.round(collegeTotalComm / totalStudents) : 0
      },
      tiers: {
        high: highReadyCount,
        moderate: modReadyCount,
        needsImprovement: remedialCount
      },
      departments,
      departmentBreakdown,
      recentActivity: recentActivity.slice(0, 8)
    });
  } catch (err) {
    console.error('[AdminController:getCampusSummary] Error:', err);
    return res.status(500).json({ error: 'Failed to generate campus summary.' });
  }
}

/**
 * POST /api/admin/kmeans
 * Executes K-Means Clustering Machine Learning Algorithm in Python.
 * Groups students into the exact 8 strength-based clusters:
 * 1. Technical strong
 * 2. Communication strong
 * 3. Aptitude strong
 * 4. Technical and Aptitude strong
 * 5. Technical and Communication strong
 * 6. Communication and Aptitude strong
 * 7. Technical, Aptitude and Communication strong
 * 8. Weak in technical aptitude and communication
 */
export async function runKMeansPython(req, res) {
  try {
    let students = req.body?.students;
    if (!students || !Array.isArray(students) || students.length === 0) {
      students = await getAllStudentsFromFirestore();
    }

    const scriptPath = path.join(__dirname, '../scripts/kmeans_clustering.py');
    const pythonProc = spawn('python', [scriptPath], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let outputData = '';
    let errorData = '';

    pythonProc.stdout.on('data', (data) => {
      outputData += data.toString('utf-8');
    });

    pythonProc.stderr.on('data', (data) => {
      errorData += data.toString('utf-8');
    });

    pythonProc.on('close', (code) => {
      if (code !== 0) {
        console.error(`[AdminController:runKMeansPython] Python exited with code ${code}:`, errorData);
        return res.status(500).json({
          error: 'Python K-Means machine learning script failed.',
          details: errorData
        });
      }

      try {
        const parsed = JSON.parse(outputData);
        return res.status(200).json({
          success: true,
          ...parsed
        });
      } catch (parseErr) {
        console.error('[AdminController:runKMeansPython] Parse error:', parseErr, outputData);
        return res.status(500).json({
          error: 'Failed to parse Python ML output.',
          raw: outputData
        });
      }
    });

    pythonProc.stdin.write(JSON.stringify({ students }));
    pythonProc.stdin.end();

  } catch (err) {
    console.error('[AdminController:runKMeansPython] Error:', err);
    return res.status(500).json({ error: 'Failed to execute Python K-Means clustering.' });
  }
}

/**
 * POST /api/admin/verify-login
 * Direct officer login authentication check.
 * Verifies officer email, password against initialPassword or default officer credentials,
 * and checks account status.
 */
export async function verifyOfficerLoginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const officers = await getAllPlacementOfficers();
    const officer = officers.find(o => (o.email || '').toLowerCase() === cleanEmail);

    if (!officer) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    if (officer.status === 'inactive') {
      return res.status(403).json({ error: 'This placement officer account has been deactivated. Please contact the administrator.' });
    }

    // Check credentials: check stored officer initialPassword or default officer passwords
    const expectedPassword = officer.initialPassword;
    const isMatched = expectedPassword
      ? expectedPassword === password
      : (password === 'Officer@123' || password === 'admin123' || (cleanEmail === 'admin@placement.edu' && password === 'admin123'));

    if (!isMatched) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        uid: officer.uid,
        email: officer.email || cleanEmail,
        displayName: officer.displayName || officer.name || cleanEmail.split('@')[0],
        role: 'admin',
        accessScope: officer.accessScope || 'college',
        assignedDepartment: officer.assignedDepartment || null,
        designation: officer.designation || 'Placement Officer'
      }
    });
  } catch (err) {
    console.error('[AdminController:verifyOfficerLoginHandler] Error:', err);
    return res.status(500).json({ error: 'Failed to verify officer credentials.' });
  }
}



