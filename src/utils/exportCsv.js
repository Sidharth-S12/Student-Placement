/**
 * CSV Export Utility for Placement Portals
 */

export function exportStudentsToCSV(students = [], filename = 'placement_candidates.csv') {
  if (!students || students.length === 0) {
    alert('No student records to export.');
    return;
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

    const clean = (val) => {
      const str = String(val === undefined || val === null ? '' : val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    return [
      clean(p.fullName || 'Student'),
      clean(p.email || s.email || ''),
      clean(s.department || e.branch || 'General'),
      clean(e.degree || 'B.Tech'),
      clean(e.cgpa || ''),
      clean(e.graduationYear || '2025'),
      clean(sc.technicalScore || s.latestTechnicalScore || 0),
      clean(sc.aptitudeScore || 0),
      clean(sc.communicationScore || 75),
      clean(sc.overallReadiness || 0),
      clean(skills)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
