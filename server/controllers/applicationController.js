import {
  saveApplication,
  getApplicationById,
  getApplicationsForStudent,
  getApplicationsForJob,
  getAllApplications,
  createNotification,
  getNotificationsForUser,
  markNotificationRead,
  markAllNotificationsRead,
  getAllPlacementDrives,
  getStudentProfile,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

/**
 * POST /api/applications/apply
 * Allows an authenticated student to apply directly to an active campus recruitment drive.
 */
export async function applyToJob(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required to apply.' });
    }

    const { jobId, coverNote } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    // 1. Fetch recruitment drive
    const drives = await getAllPlacementDrives();
    const drive = drives.find(d => d.id === jobId);
    if (!drive) {
      return res.status(404).json({ error: 'Recruitment drive not found.' });
    }

    // Validate drive status
    if (drive.status === 'Completed') {
      return res.status(400).json({ error: 'Applications for this recruitment drive have closed.' });
    }

    // 2. Fetch student profile to validate eligibility
    const student = await getStudentProfile(user.uid);
    if (!student || !student.personalInfo?.fullName) {
      return res.status(400).json({
        error: 'Please complete your Placement Profile before applying to campus drives.'
      });
    }

    const studentBranch = student.department || student.education?.branch || '';
    const studentCgpa = parseFloat(student.education?.cgpa || '0') || 0;
    const studentReadiness = student.placementScores?.overallReadiness || 0;

    // Validate CGPA eligibility
    if (drive.minCgpa && studentCgpa < drive.minCgpa) {
      return res.status(400).json({
        error: `Ineligible: This drive requires minimum ${drive.minCgpa} CGPA (Your current CGPA: ${studentCgpa || 'Not specified'}).`
      });
    }

    // Validate Readiness eligibility
    if (drive.minReadiness && studentReadiness < drive.minReadiness) {
      return res.status(400).json({
        error: `Ineligible: This drive requires minimum ${drive.minReadiness}% Placement Readiness (Your score: ${studentReadiness}%). Complete more assessments to boost your score.`
      });
    }

    // Validate Department eligibility
    if (drive.eligibleDepartments && drive.eligibleDepartments.length > 0 && !drive.eligibleDepartments.includes('All')) {
      const match = drive.eligibleDepartments.some(d =>
        studentBranch.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(studentBranch.toLowerCase())
      );
      if (!match) {
        return res.status(400).json({
          error: `Ineligible: This position is open to [${drive.eligibleDepartments.join(', ')}] branches only.`
        });
      }
    }

    // 3. Check for existing application
    const appId = `app_${user.uid}_${jobId}`;
    const existing = await getApplicationById(appId);

    if (existing && existing.hasDirectApplication && existing.status !== 'Withdrawn') {
      return res.status(400).json({
        error: 'You have already submitted an active application for this recruitment drive.'
      });
    }

    // 4. Construct unified application record
    const applicationPayload = {
      id: appId,
      jobId: drive.id,
      companyName: drive.companyName,
      companyId: drive.companyId || null,
      jobRole: drive.jobRole,
      packageCTC: drive.packageCTC || 'Competitive',
      driveDate: drive.driveDate || 'TBA',
      location: drive.location || 'Campus',
      jobDescription: drive.jobDescription || '',
      studentId: user.uid,
      studentName: student.personalInfo?.fullName || user.email.split('@')[0],
      studentEmail: user.email,
      studentDepartment: studentBranch || 'Engineering',
      studentCgpa: student.education?.cgpa || 'N/A',
      studentReadiness,
      source: existing?.hasNomination ? 'both' : 'direct',
      hasDirectApplication: true,
      hasNomination: existing?.hasNomination || false,
      appliedAt: new Date().toISOString(),
      withdrawnAt: null,
      coverNote: (coverNote || '').trim(),
      status: existing?.status === 'Withdrawn' ? 'Applied' : (existing?.status || 'Applied'),
      statusHistory: [
        ...(existing?.statusHistory || []),
        {
          status: 'Applied',
          changedAt: new Date().toISOString(),
          changedBy: 'Student',
          note: 'Direct student application submitted.'
        }
      ]
    };

    const saved = await saveApplication(applicationPayload);

    // 5. Emit confirmation in-app notification
    await createNotification({
      recipientId: user.uid,
      recipientRole: 'student',
      title: 'Application Submitted',
      message: `Your application for ${drive.jobRole} at ${drive.companyName} was submitted successfully.`,
      type: 'application',
      relatedJobId: drive.id,
      relatedAppId: saved.id
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: saved
    });
  } catch (err) {
    console.error('[ApplicationController:applyToJob] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to submit application.' });
  }
}

/**
 * GET /api/applications/my-applications
 * Retrieves the current student's direct applications.
 */
export async function getMyApplications(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const allStudentApps = await getApplicationsForStudent(user.uid);
    // Filter only those where student explicitly applied directly
    const directApps = allStudentApps.filter(a => a.hasDirectApplication && a.status !== 'Withdrawn');

    return res.status(200).json({
      applications: directApps,
      totalCount: directApps.length
    });
  } catch (err) {
    console.error('[ApplicationController:getMyApplications] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve your applications.' });
  }
}

/**
 * GET /api/applications/my-nominations
 * Retrieves officer nominations designated for the current student.
 */
export async function getMyNominations(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const allStudentApps = await getApplicationsForStudent(user.uid);
    // Filter those with officer nomination
    const nominations = allStudentApps.filter(a => a.hasNomination);

    return res.status(200).json({
      nominations,
      totalCount: nominations.length
    });
  } catch (err) {
    console.error('[ApplicationController:getMyNominations] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve your nominations.' });
  }
}

/**
 * POST /api/applications/respond-nomination
 * Allows a student to accept or decline an officer nomination requiring consent.
 */
export async function respondNomination(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { appId, action } = req.body; // action: 'accept' | 'decline'
    if (!appId || !['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: "Valid appId and action ('accept' or 'decline') are required." });
    }

    const application = await getApplicationById(appId);
    if (!application) {
      return res.status(404).json({ error: 'Nomination record not found.' });
    }

    if (application.studentId !== user.uid) {
      return res.status(403).json({ error: 'Unauthorized to respond to this nomination.' });
    }

    const isAccepting = action === 'accept';
    const updatedPayload = {
      ...application,
      nominationStatus: isAccepting ? 'Consent Accepted' : 'Consent Declined',
      hasDirectApplication: isAccepting ? true : application.hasDirectApplication,
      source: isAccepting ? (application.hasDirectApplication ? 'both' : 'nomination') : application.source,
      status: isAccepting ? (application.status === 'Withdrawn' ? 'Applied' : (application.status || 'Applied')) : application.status,
      statusHistory: [
        ...(application.statusHistory || []),
        {
          status: isAccepting ? 'Consent Accepted' : 'Consent Declined',
          changedAt: new Date().toISOString(),
          changedBy: 'Student',
          note: isAccepting ? 'Student accepted placement officer nomination.' : 'Student declined placement officer nomination.'
        }
      ]
    };

    const saved = await saveApplication(updatedPayload);

    // Notify student
    await createNotification({
      recipientId: user.uid,
      recipientRole: 'student',
      title: isAccepting ? 'Nomination Accepted' : 'Nomination Declined',
      message: isAccepting
        ? `You accepted the nomination for ${application.jobRole} at ${application.companyName}. Your candidate profile is now active in the recruitment pipeline.`
        : `You declined the nomination for ${application.jobRole} at ${application.companyName}.`,
      type: 'nomination',
      relatedJobId: application.jobId,
      relatedAppId: application.id
    });

    return res.status(200).json({
      success: true,
      message: isAccepting ? 'Nomination accepted successfully!' : 'Nomination declined.',
      application: saved
    });
  } catch (err) {
    console.error('[ApplicationController:respondNomination] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update nomination response.' });
  }
}

/**
 * POST /api/applications/:id/withdraw
 * Allows a student to withdraw an application before interview scheduling.
 */
export async function withdrawApplication(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { id } = req.params;
    const application = await getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    if (application.studentId !== user.uid) {
      return res.status(403).json({ error: 'You are only authorized to withdraw your own applications.' });
    }

    // Validate stage: cannot withdraw if already scheduled or selected
    if (['Interview Scheduled', 'Selected'].includes(application.status)) {
      return res.status(400).json({
        error: 'Cannot withdraw an application once an interview has been scheduled or an offer has been extended. Please consult the Placement Cell.'
      });
    }

    const updated = await saveApplication({
      ...application,
      status: 'Withdrawn',
      withdrawnAt: new Date().toISOString(),
      statusHistory: [
        ...(application.statusHistory || []),
        {
          status: 'Withdrawn',
          changedAt: new Date().toISOString(),
          changedBy: 'Student',
          note: 'Application withdrawn by student.'
        }
      ]
    });

    await createNotification({
      recipientId: user.uid,
      recipientRole: 'student',
      title: 'Application Withdrawn',
      message: `You withdrew your application for ${application.jobRole} at ${application.companyName}.`,
      type: 'application',
      relatedJobId: application.jobId,
      relatedAppId: application.id
    });

    return res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.',
      application: updated
    });
  } catch (err) {
    console.error('[ApplicationController:withdrawApplication] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to withdraw application.' });
  }
}

/**
 * POST /api/applications/nominate
 * Placement Officer / Admin nominates eligible candidates for a specific drive.
 */
export async function nominateCandidates(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Placement Officer / Admin privileges required to nominate candidates.' });
    }

    const { jobId, studentIds = [], officerNotes = '', requiresConsent = true } = req.body;
    if (!jobId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'jobId and an array of studentIds are required.' });
    }

    const drives = await getAllPlacementDrives();
    const drive = drives.find(d => d.id === jobId);
    if (!drive) {
      return res.status(404).json({ error: 'Recruitment drive not found.' });
    }

    const results = [];
    for (const studentId of studentIds) {
      const student = await getStudentProfile(studentId);
      const studentName = student?.personalInfo?.fullName || 'Student Candidate';
      const studentBranch = student?.department || student?.education?.branch || 'Engineering';
      const studentCgpa = student?.education?.cgpa || 'N/A';
      const studentReadiness = student?.placementScores?.overallReadiness || 0;

      const appId = `app_${studentId}_${jobId}`;
      const existing = await getApplicationById(appId);

      const isBoth = Boolean(existing && existing.hasDirectApplication);
      const payload = {
        id: appId,
        jobId: drive.id,
        companyName: drive.companyName,
        companyId: drive.companyId || null,
        jobRole: drive.jobRole,
        packageCTC: drive.packageCTC || 'Competitive',
        driveDate: drive.driveDate || 'TBA',
        location: drive.location || 'Campus',
        studentId,
        studentName,
        studentEmail: student?.personalInfo?.email || `${studentId}@college.edu`,
        studentDepartment: studentBranch,
        studentCgpa,
        studentReadiness,
        source: isBoth ? 'both' : 'nomination',
        hasDirectApplication: Boolean(existing?.hasDirectApplication),
        hasNomination: true,
        nominatedAt: new Date().toISOString(),
        nominatedByOfficerId: user.uid,
        nominatedByOfficerName: user.displayName || 'Central Placement Officer',
        officerNotes: (officerNotes || '').trim(),
        requiresConsent: Boolean(requiresConsent),
        nominationStatus: requiresConsent ? 'Pending Consent' : 'Directly Nominated',
        status: existing?.status || (requiresConsent ? 'Applied' : 'Shortlisted'),
        statusHistory: [
          ...(existing?.statusHistory || []),
          {
            status: 'Nominated',
            changedAt: new Date().toISOString(),
            changedBy: `Placement Officer (${user.displayName || user.email})`,
            note: officerNotes ? `Officer note: ${officerNotes}` : 'Candidate nominated by Placement Cell.'
          }
        ]
      };

      const saved = await saveApplication(payload);
      results.push(saved);

      // Create notification for student
      await createNotification({
        recipientId: studentId,
        recipientRole: 'student',
        title: 'Placement Officer Nomination',
        message: `You have been nominated by the Placement Cell for ${drive.jobRole} at ${drive.companyName}.${requiresConsent ? ' Please review and provide your consent in the portal.' : ''}`,
        type: 'nomination',
        relatedJobId: drive.id,
        relatedAppId: saved.id
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully nominated ${results.length} candidate(s) for ${drive.companyName}.`,
      nominations: results
    });
  } catch (err) {
    console.error('[ApplicationController:nominateCandidates] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to nominate candidates.' });
  }
}

/**
 * GET /api/applications/job/:jobId
 * Retrieves all candidates (direct applicants and officer-nominated) for a job.
 * Accessible to authorized Recruiters and Admins.
 */
export async function getJobCandidates(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !['company', 'admin'].includes(user.role)) {
      return res.status(403).json({ error: 'Recruiter or Admin authorization required.' });
    }

    const { jobId } = req.params;
    const candidates = await getApplicationsForJob(jobId);

    return res.status(200).json({
      candidates,
      totalCount: candidates.length
    });
  } catch (err) {
    console.error('[ApplicationController:getJobCandidates] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve candidates for job.' });
  }
}

/**
 * GET /api/applications/all
 * Retrieves all applications across all campus drives (Placement Officer view).
 */
export async function getAllApplicationsAdmin(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin authorization required.' });
    }

    const applications = await getAllApplications();
    return res.status(200).json({
      applications,
      totalCount: applications.length
    });
  } catch (err) {
    console.error('[ApplicationController:getAllApplicationsAdmin] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve all applications.' });
  }
}

/**
 * PATCH /api/applications/:id/status
 * Updates candidate recruitment stage and records interview/outcome details.
 * Accessible to authorized Company Recruiters and Admins.
 */
export async function updateCandidateStatus(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !['company', 'admin'].includes(user.role)) {
      return res.status(403).json({ error: 'Recruiter or Admin authorization required.' });
    }

    const { id } = req.params;
    const { status, interviewDetails, notes } = req.body;

    const validStatuses = ['Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Candidate application not found.' });
    }

    const updated = await saveApplication({
      ...application,
      status,
      interviewDetails: interviewDetails || application.interviewDetails || null,
      statusHistory: [
        ...(application.statusHistory || []),
        {
          status,
          changedAt: new Date().toISOString(),
          changedBy: user.displayName || user.email || 'Recruiter',
          note: notes || `Candidate moved to ${status}.`
        }
      ]
    });

    // Notify the student regarding status advancement
    let notifTitle = 'Application Status Updated';
    let notifMessage = `Your application for ${application.jobRole} at ${application.companyName} is now: ${status}.`;

    if (status === 'Shortlisted') {
      notifTitle = '🎉 Candidate Shortlisted!';
      notifMessage = `Congratulations! You have been shortlisted by ${application.companyName} for the ${application.jobRole} role.`;
    } else if (status === 'Interview Scheduled') {
      notifTitle = '📅 Interview Scheduled';
      notifMessage = `Your interview with ${application.companyName} has been scheduled for ${interviewDetails?.scheduledDate || 'upcoming date'}. Mode: ${interviewDetails?.mode || 'Online'}.`;
    } else if (status === 'Selected') {
      notifTitle = '🌟 Placement Offer Selected!';
      notifMessage = `Congratulations! You have been selected by ${application.companyName} for the ${application.jobRole} position!`;
    }

    await createNotification({
      recipientId: application.studentId,
      recipientRole: 'student',
      title: notifTitle,
      message: notifMessage,
      type: status.toLowerCase().includes('interview') ? 'interview' : 'outcome',
      relatedJobId: application.jobId,
      relatedAppId: application.id
    });

    return res.status(200).json({
      success: true,
      message: `Candidate updated to ${status}.`,
      application: updated
    });
  } catch (err) {
    console.error('[ApplicationController:updateCandidateStatus] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update candidate status.' });
  }
}

/**
 * GET /api/notifications
 * Retrieves in-app notifications for the logged-in user.
 */
export async function getNotifications(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const notifications = await getNotificationsForUser(user.uid);
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (err) {
    console.error('[ApplicationController:getNotifications] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a notification as read.
 */
export async function markNotificationAsRead(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { id } = req.params;
    await markNotificationRead(id, user.uid);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ApplicationController:markNotificationAsRead] Error:', err);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications for current user as read.
 */
export async function markAllNotificationsAsRead(req, res) {
  try {
    const user = await verifyAuthToken(req);
    if (!user || !user.uid) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    await markAllNotificationsRead(user.uid);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ApplicationController:markAllNotificationsAsRead] Error:', err);
    return res.status(500).json({ error: 'Failed to update notifications.' });
  }
}
