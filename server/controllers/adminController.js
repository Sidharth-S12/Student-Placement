import {
  getAllPlacementOfficers,
  addPlacementOfficer,
  removePlacementOfficer,
  getAllPlacementDrives,
  savePlacementDrive,
  deletePlacementDrive,
  getAllStudentsFromFirestore,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

/**
 * GET /api/admin/officers
 * Lists all registered placement cell officers.
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
 * Adds or updates a Placement Officer.
 */
export async function createOfficer(req, res) {
  try {
    const { name, email, designation, department, phone, uid } = req.body;

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
      uid: uid || null
    });

    console.log(`[AdminController] Successfully registered Placement Officer: ${officer.email} (${officer.displayName})`);

    return res.status(201).json({
      success: true,
      message: 'Placement officer registered successfully.',
      officer
    });
  } catch (err) {
    console.error('[AdminController:createOfficer] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to add placement officer.' });
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
 * GET /api/admin/analytics/summary
 * Provides comprehensive campus analytics for institutional reports.
 */
export async function getCampusSummary(req, res) {
  try {
    const allStudents = await getAllStudentsFromFirestore();
    const total = allStudents.length;

    // Discovered departments
    const departments = Array.from(
      new Set(allStudents.map(s => s.department).filter(Boolean))
    ).sort();

    // Skills distribution
    const skillCounts = {};
    let totalTech = 0;
    let totalApt = 0;
    let totalComm = 0;
    let totalReadiness = 0;

    let tierHigh = 0;
    let tierMod = 0;
    let tierLow = 0;

    allStudents.forEach(s => {
      const scores = s.placementScores || {};
      const tech = Number(scores.technicalScore || s.latestTechnicalScore || 0);
      const apt = Number(scores.aptitudeScore || 0);
      const comm = Number(scores.communicationScore || 75);
      const readiness = Number(scores.overallReadiness || 0);

      totalTech += tech;
      totalApt += apt;
      totalComm += comm;
      totalReadiness += readiness;

      if (readiness >= 80) tierHigh++;
      else if (readiness >= 60) tierMod++;
      else tierLow++;

      (s.normalizedSkills || []).forEach(sk => {
        const cleanSk = sk.trim();
        skillCounts[cleanSk] = (skillCounts[cleanSk] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return res.status(200).json({
      totalStudents: total,
      departments,
      averages: {
        readiness: total > 0 ? Math.round(totalReadiness / total) : 0,
        technical: total > 0 ? Math.round(totalTech / total) : 0,
        aptitude: total > 0 ? Math.round(totalApt / total) : 0,
        communication: total > 0 ? Math.round(totalComm / total) : 0
      },
      tiers: {
        high: tierHigh,
        moderate: tierMod,
        needsImprovement: tierLow
      },
      topSkills
    });
  } catch (err) {
    console.error('[AdminController:getCampusSummary] Error:', err);
    return res.status(500).json({ error: 'Failed to generate campus summary.' });
  }
}
