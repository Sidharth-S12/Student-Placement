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
  getAllApplications,
  getApplicationById,
  saveApplication,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

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
 * GET /api/admin/drives
 * Lists all campus recruitment drives.
 */
export async function listDrives(req, res) {
  try {
    const drives = await getAllPlacementDrives();
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
    const driveData = req.body;
    if (!driveData.companyName || !driveData.companyName.trim()) {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    const saved = await savePlacementDrive(driveData);
    return res.status(200).json({
      success: true,
      message: 'Recruitment drive saved successfully.',
      drive: saved
    });
  } catch (err) {
    console.error('[AdminController:createOrUpdateDrive] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save drive.' });
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
    const selectedApps = allApplications.filter(a => a.status === 'Selected');

    // Unique placed student IDs (prevent duplicate counting)
    const uniquePlacedStudentIds = new Set(selectedApps.map(a => a.studentId));
    const uniquePlacedCount = uniquePlacedStudentIds.size;

    // Defined placement percentage: Uniquely placed candidates / total registered student population
    const overallPlacementPercentage = totalStudents > 0
      ? Math.round((uniquePlacedCount / totalStudents) * 100)
      : 0;

    // Department-wise aggregated metrics
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept] = {
        dept,
        totalStudents: 0,
        assessedStudents: 0,
        totalTech: 0,
        totalApt: 0,
        totalComm: 0,
        totalReadiness: 0,
        applicationsCount: 0,
        shortlistedCount: 0,
        selectedCount: 0,
        uniquePlacedIds: new Set()
      };
    });

    let collegeTotalTech = 0;
    let collegeTotalApt = 0;
    let collegeTotalComm = 0;
    let collegeTotalReadiness = 0;
    let highReadyCount = 0;
    let modReadyCount = 0;
    let remedialCount = 0;

    allStudents.forEach(s => {
      const dept = s.department || 'Other';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          dept,
          totalStudents: 0,
          assessedStudents: 0,
          totalTech: 0,
          totalApt: 0,
          totalComm: 0,
          totalReadiness: 0,
          applicationsCount: 0,
          shortlistedCount: 0,
          selectedCount: 0,
          uniquePlacedIds: new Set()
        };
      }

      deptMap[dept].totalStudents++;

      const scores = s.placementScores || {};
      const tech = Number(scores.technicalScore || s.latestTechnicalScore || 0);
      const apt = Number(scores.aptitudeScore || 0);
      const comm = Number(scores.communicationScore || 75);
      const readiness = Number(scores.overallReadiness || 0);

      if (s.latestAssessmentId || scores.technicalScore !== undefined) {
        deptMap[dept].assessedStudents++;
      }

      deptMap[dept].totalTech += tech;
      deptMap[dept].totalApt += apt;
      deptMap[dept].totalComm += comm;
      deptMap[dept].totalReadiness += readiness;

      collegeTotalTech += tech;
      collegeTotalApt += apt;
      collegeTotalComm += comm;
      collegeTotalReadiness += readiness;

      if (readiness >= 80) highReadyCount++;
      else if (readiness >= 60) modReadyCount++;
      else remedialCount++;
    });

    // Populate applications into departments
    allApplications.forEach(app => {
      // Find candidate's department
      const candidate = allStudents.find(s => s.uid === app.studentId);
      const dept = candidate?.department || app.studentDepartment || 'Other';
      if (deptMap[dept]) {
        deptMap[dept].applicationsCount++;
        if (app.status === 'Shortlisted') deptMap[dept].shortlistedCount++;
        if (app.status === 'Selected') {
          deptMap[dept].selectedCount++;
          deptMap[dept].uniquePlacedIds.add(app.studentId);
        }
      }
    });

    // Format department summaries
    const departmentBreakdown = Object.values(deptMap).map(d => {
      const uniquePlacedInDept = d.uniquePlacedIds.size;
      const deptPlacementRate = d.totalStudents > 0
        ? Math.round((uniquePlacedInDept / d.totalStudents) * 100)
        : 0;

      return {
        dept: d.dept,
        totalStudents: d.totalStudents,
        assessmentCompletedCount: d.assessedStudents,
        assessmentCompletionRate: d.totalStudents > 0
          ? Math.round((d.assessedStudents / d.totalStudents) * 100)
          : 0,
        avgReadiness: d.totalStudents > 0 ? Math.round(d.totalReadiness / d.totalStudents) : 0,
        avgTechnical: d.totalStudents > 0 ? Math.round(d.totalTech / d.totalStudents) : 0,
        avgAptitude: d.totalStudents > 0 ? Math.round(d.totalApt / d.totalStudents) : 0,
        avgCommunication: d.totalStudents > 0 ? Math.round(d.totalComm / d.totalStudents) : 0,
        applicationsCount: d.applicationsCount,
        shortlistedCount: d.shortlistedCount,
        selectedCount: d.selectedCount,
        uniquelyPlacedCount: uniquePlacedInDept,
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

