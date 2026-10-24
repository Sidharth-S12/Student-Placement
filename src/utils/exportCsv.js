/**
 * CSV / Excel Export Utility for Placement Portals & K-Means Readiness Groups
 * Generates RFC-4180 compliant CSV files with UTF-8 BOM (\uFEFF) for native Microsoft Excel compatibility.
 */

const cleanCsvCell = (val) => {
  const str = String(val === undefined || val === null ? '' : val);
  return `"${str.replace(/"/g, '""')}"`;
};

function triggerDownload(csvContent, filename) {
  // Prepend \uFEFF (UTF-8 Byte Order Mark) so Microsoft Excel opens UTF-8 text flawlessly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Standard Placement Candidate Roster Export
 */
export function exportStudentsToCSV(students = [], filename = 'placement_candidates.csv') {
  if (!students || students.length === 0) {
    alert('No student records to export.');
    return false;
  }

  const headers = [
    'Student Name',
    'Email Address',
    'Department',
    'Degree',
    'CGPA',
    'Graduation Year',
    'Technical Score (%)',
    'Aptitude Score (%)',
    'Communication Score (%)',
    'Overall Readiness (%)',
    'Key Skills'
  ];

  const rows = students.map(s => {
    const p = s.personalInfo || {};
    const e = s.education || {};
    const sc = s.placementScores || {};
    const skills = (s.normalizedSkills || []).join('; ');

    return [
      cleanCsvCell(p.fullName || s.name || 'Student'),
      cleanCsvCell(p.email || s.email || ''),
      cleanCsvCell(s.department || e.branch || 'General'),
      cleanCsvCell(e.degree || 'B.Tech'),
      cleanCsvCell(e.cgpa || s.cgpa || ''),
      cleanCsvCell(e.graduationYear || '2025'),
      cleanCsvCell(sc.technicalScore ?? s.latestTechnicalScore ?? 0),
      cleanCsvCell(sc.aptitudeScore ?? s.latestAptitudeAssessment?.score ?? 0),
      cleanCsvCell(sc.communicationScore ?? s.latestCommunicationAssessment?.score ?? 75),
      cleanCsvCell(sc.overallReadiness ?? 0),
      cleanCsvCell(skills)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerDownload(csvContent, filename);
  return true;
}

/**
 * Export All Students segregated by K-Means Readiness Groups into an Excel-ready file.
 * Organizes by Group 1 through 8 so the admin can seamlessly assign and conduct group-specific training.
 *
 * @param {Array} clusters Array of cluster objects from K-Means engine (each having clusterIndex, name, students, etc.)
 * @param {string} filename Output file name
 * @param {Object} options Optional filters { departmentFilter, sortAlphabetical }
 */
export function exportKMeansGroupsToCSV(clusters = [], filename = null, options = {}) {
  if (!clusters || clusters.length === 0) {
    alert('No cluster group data available to export.');
    return false;
  }

  const { departmentFilter = 'all', sortAlphabetical = true } = options;

  // Flatten and prepare rows grouped by cluster
  const headers = [
    'Group Number',
    'Group Name',
    'Student Name',
    'Email Address',
    'Phone Number',
    'Department',
    'Degree',
    'Graduation Year',
    'CGPA',
    'Technical Score (%)',
    'Aptitude Score (%)',
    'Communication Score (%)',
    'Overall Readiness (%)',
    'Recommended Training Action',
    'Target Training Focus / Persona'
  ];

  const rows = [];
  let totalExportedStudents = 0;

  clusters.forEach((cluster, idx) => {
    const groupNum = cluster.clusterIndex !== undefined ? cluster.clusterIndex + 1 : idx + 1;
    const groupLabel = `Group ${groupNum}`;
    const groupName = cluster.name || `Readiness Group ${groupNum}`;
    const recommendation = cluster.recommendedAction || cluster.interventionStrategy || '';
    const targetPersona = cluster.targetPersona || cluster.tagline || '';

    let groupStudents = Array.isArray(cluster.students) ? [...cluster.students] : [];

    // Filter by department if requested
    if (departmentFilter && departmentFilter !== 'all') {
      groupStudents = groupStudents.filter(s =>
        (s.department || s.education?.branch || '').toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    // Sort students alphabetically inside the group
    if (sortAlphabetical) {
      groupStudents.sort((a, b) => {
        const nameA = (a.personalInfo?.fullName || a.name || '').toLowerCase();
        const nameB = (b.personalInfo?.fullName || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    groupStudents.forEach(s => {
      totalExportedStudents++;
      const p = s.personalInfo || {};
      const e = s.education || {};
      const sc = s.placementScores || {};

      const rawTech = sc.technicalScore ?? s.latestTechnicalScore ?? null;
      const rawApt = sc.aptitudeScore ?? s.latestAptitudeAssessment?.score ?? null;
      const rawComm = sc.communicationScore ?? s.latestCommunicationAssessment?.score ?? null;
      const rawReadiness = sc.overallReadiness ?? null;
      const cgpa = e.cgpa || s.cgpa || '';

      rows.push([
        cleanCsvCell(groupLabel),
        cleanCsvCell(groupName),
        cleanCsvCell(p.fullName || s.name || 'Student'),
        cleanCsvCell(p.email || s.email || ''),
        cleanCsvCell(p.phone || s.phone || ''),
        cleanCsvCell(s.department || e.branch || 'General'),
        cleanCsvCell(e.degree || 'B.Tech'),
        cleanCsvCell(e.graduationYear || '2025'),
        cleanCsvCell(cgpa),
        cleanCsvCell(rawTech !== null ? Math.round(rawTech) : '—'),
        cleanCsvCell(rawApt !== null ? Math.round(rawApt) : '—'),
        cleanCsvCell(rawComm !== null ? Math.round(rawComm) : '—'),
        cleanCsvCell(rawReadiness !== null ? Math.round(rawReadiness) : '—'),
        cleanCsvCell(recommendation),
        cleanCsvCell(targetPersona)
      ].join(','));
    });
  });

  if (totalExportedStudents === 0) {
    alert('No students found in the selected groups to export.');
    return false;
  }

  const defaultName = `Student_Readiness_Groups_Training_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
  const finalFilename = filename || defaultName;

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerDownload(csvContent, finalFilename);
  return true;
}

/**
 * Export a single group's student roster to Excel-ready CSV for targeted training modules.
 *
 * @param {Object} cluster Single cluster object with students
 * @param {string} filename Output file name
 */
export function exportSingleGroupToCSV(cluster, filename = null) {
  if (!cluster || !cluster.students || cluster.students.length === 0) {
    alert(`No student records present in ${cluster?.name || 'this group'}.`);
    return false;
  }

  const groupNum = cluster.clusterIndex !== undefined ? cluster.clusterIndex + 1 : 1;
  const sanitizedName = (cluster.name || `Group_${groupNum}`).replace(/[^a-zA-Z0-9]/g, '_');
  const defaultFilename = filename || `Group_${groupNum}_${sanitizedName}_Training_Roster_${new Date().toISOString().slice(0, 10)}.csv`;

  return exportKMeansGroupsToCSV([cluster], defaultFilename, { departmentFilter: 'all' });
}

/**
 * Export filtered student table view with assigned Group Numbers and Names.
 *
 * @param {Array} students List of students (e.g. filteredGroupStudents)
 * @param {Object} studentClusterMap Map of student UID to cluster info
 * @param {string} filename Output file name
 */
export function exportFilteredStudentsWithGroupsToCSV(students = [], studentClusterMap = {}, filename = null) {
  if (!students || students.length === 0) {
    alert('No student records to export.');
    return false;
  }

  const headers = [
    'Group Number',
    'Group Name',
    'Student Name',
    'Email Address',
    'Phone Number',
    'Department',
    'Degree',
    'Graduation Year',
    'CGPA',
    'Technical Score (%)',
    'Aptitude Score (%)',
    'Communication Score (%)',
    'Overall Readiness (%)',
    'Recommended Training Action'
  ];

  const rows = students.map(s => {
    const cluster = studentClusterMap[s.uid] || {};
    const groupNum = cluster.groupNumber ? `Group ${cluster.groupNumber}` : (cluster.id ? cluster.id : 'Unassigned');
    const groupName = cluster.name || 'Unassigned';
    const recommendation = cluster.recommendedAction || '';

    const p = s.personalInfo || {};
    const e = s.education || {};
    const sc = s.placementScores || {};

    const rawTech = sc.technicalScore ?? s.latestTechnicalScore ?? null;
    const rawApt = sc.aptitudeScore ?? s.latestAptitudeAssessment?.score ?? null;
    const rawComm = sc.communicationScore ?? s.latestCommunicationAssessment?.score ?? null;
    const rawReadiness = sc.overallReadiness ?? null;
    const cgpa = e.cgpa || s.cgpa || '';

    return [
      cleanCsvCell(groupNum),
      cleanCsvCell(groupName),
      cleanCsvCell(p.fullName || s.name || 'Student'),
      cleanCsvCell(p.email || s.email || ''),
      cleanCsvCell(p.phone || s.phone || ''),
      cleanCsvCell(s.department || e.branch || 'General'),
      cleanCsvCell(e.degree || 'B.Tech'),
      cleanCsvCell(e.graduationYear || '2025'),
      cleanCsvCell(cgpa),
      cleanCsvCell(rawTech !== null ? Math.round(rawTech) : '—'),
      cleanCsvCell(rawApt !== null ? Math.round(rawApt) : '—'),
      cleanCsvCell(rawComm !== null ? Math.round(rawComm) : '—'),
      cleanCsvCell(rawReadiness !== null ? Math.round(rawReadiness) : '—'),
      cleanCsvCell(recommendation)
    ].join(',');
  });

  const defaultName = `Student_Readiness_Directory_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  const finalFilename = filename || defaultName;

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  triggerDownload(csvContent, finalFilename);
  return true;
}
