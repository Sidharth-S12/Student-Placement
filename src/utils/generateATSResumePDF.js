import { jsPDF } from 'jspdf';

/**
 * Generates an ATS-compliant PDF with real selectable vector text using Times New Roman.
 * Automatically handles page breaks, margin spacing, orphan headings, and multi-page continuation.
 */
export const generateATSResumePDF = (studentData) => {
  if (!studentData) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const {
    personalInfo = {},
    education = {},
    professionalLinks = {},
    technicalSkills = {},
    projects = [],
    experience = [],
    certifications = [],
    achievements = []
  } = studentData;

  // Page Dimensions & Margins
  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 18;
  const rightMargin = 18;
  const topMargin = 18;
  const bottomMargin = 18;
  const maxWidth = pageWidth - leftMargin - rightMargin; // 174mm
  const maxY = pageHeight - bottomMargin; // 279mm

  let yPos = topMargin;

  // Helper to handle automatic page breaks
  const checkPageBreak = (neededHeight) => {
    if (yPos + neededHeight > maxY) {
      doc.addPage();
      yPos = topMargin;
      return true;
    }
    return false;
  };

  // Helper to draw clean section header with bottom rule
  const renderSectionHeader = (title) => {
    checkPageBreak(12);
    yPos += 3;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), leftMargin, yPos);
    
    yPos += 1.5;
    doc.setLineWidth(0.35);
    doc.setDrawColor(0, 0, 0);
    doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
    yPos += 4.5;
  };

  // -------------------------------------------------------------
  // HEADER SECTION: NAME & CONTACT DETAILS
  // -------------------------------------------------------------
  // Student Name
  doc.setFont('times', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(0, 0, 0);
  const fullNameStr = (personalInfo.fullName || 'STUDENT NAME').toUpperCase();
  doc.text(fullNameStr, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  // Contact Line 1: Location | Phone | Email
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  const contactParts = [];
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.email) contactParts.push(personalInfo.email);

  if (contactParts.length > 0) {
    const contactLine = contactParts.join(' | ');
    doc.text(contactLine, pageWidth / 2, yPos, { align: 'center' });
    yPos += 4.5;
  }

  // Contact Line 2: LinkedIn | GitHub | Portfolio
  const linkParts = [];
  if (professionalLinks.linkedin) linkParts.push(professionalLinks.linkedin);
  if (professionalLinks.github) linkParts.push(professionalLinks.github);
  if (professionalLinks.portfolio) linkParts.push(professionalLinks.portfolio);

  if (linkParts.length > 0) {
    const linkLine = linkParts.join(' | ');
    doc.setFont('times', 'italic');
    doc.text(linkLine, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5.5;
  } else {
    yPos += 1.5;
  }

  // -------------------------------------------------------------
  // 1. PROFESSIONAL SUMMARY
  // -------------------------------------------------------------
  if (personalInfo.summary) {
    renderSectionHeader('PROFESSIONAL SUMMARY');
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    
    const summaryLines = doc.splitTextToSize(personalInfo.summary, maxWidth);
    checkPageBreak(summaryLines.length * 4.2);
    doc.text(summaryLines, leftMargin, yPos);
    yPos += summaryLines.length * 4.2 + 2;
  }

  // -------------------------------------------------------------
  // 2. EDUCATION
  // -------------------------------------------------------------
  if (education.college || education.degree) {
    renderSectionHeader('EDUCATION');

    // College & Graduation Year
    checkPageBreak(16);
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text(education.college || '', leftMargin, yPos);
    if (education.graduationYear) {
      doc.text(`Graduation: ${education.graduationYear}`, pageWidth - rightMargin, yPos, { align: 'right' });
    }
    yPos += 4.5;

    // Degree & CGPA
    doc.setFont('times', 'italic');
    const degreeStr = `${education.degree || ''}${education.branch ? ` in ${education.branch}` : ''}`;
    doc.text(degreeStr, leftMargin, yPos);
    if (education.cgpa) {
      doc.setFont('times', 'bold');
      doc.text(`CGPA: ${education.cgpa}`, pageWidth - rightMargin, yPos, { align: 'right' });
    }
    yPos += 5;

    // Class XII & Class X
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    
    if (education.twelfthPercentage) {
      const xiiStr = `Class XII (${education.twelfthBoard || 'CBSE'})`;
      const xiiScore = `Score: ${education.twelfthPercentage}${education.twelfthYear ? ` (${education.twelfthYear})` : ''}`;
      doc.text(xiiStr, leftMargin, yPos);
      doc.text(xiiScore, pageWidth - rightMargin, yPos, { align: 'right' });
      yPos += 4;
    }

    if (education.tenthPercentage) {
      const xStr = `Class X (${education.tenthBoard || 'CBSE'})`;
      const xScore = `Score: ${education.tenthPercentage}${education.tenthYear ? ` (${education.tenthYear})` : ''}`;
      doc.text(xStr, leftMargin, yPos);
      doc.text(xScore, pageWidth - rightMargin, yPos, { align: 'right' });
      yPos += 5;
    }
  }

  // -------------------------------------------------------------
  // 3. TECHNICAL SKILLS
  // -------------------------------------------------------------
  if (technicalSkills) {
    const categories = [
      { label: 'Programming Languages', items: technicalSkills.programmingLanguages },
      { label: 'Frameworks & Libraries', items: technicalSkills.frameworks },
      { label: 'Databases & Storage', items: technicalSkills.databases },
      { label: 'Tools & Technologies', items: technicalSkills.toolsTechnologies },
    ];

    const hasSkills = categories.some(cat => cat.items && cat.items.length > 0);

    if (hasSkills) {
      renderSectionHeader('TECHNICAL SKILLS');
      doc.setFontSize(9.5);

      categories.forEach(cat => {
        if (!cat.items || cat.items.length === 0) return;
        
        const skillNames = cat.items.map(item => typeof item === 'string' ? item : item.name).join(', ');
        const labelText = `${cat.label}: `;
        
        doc.setFont('times', 'bold');
        const labelWidth = doc.getTextWidth(labelText);
        
        // Wrap full line nicely
        const fullStr = labelText + skillNames;
        const wrappedLines = doc.splitTextToSize(fullStr, maxWidth);

        checkPageBreak(wrappedLines.length * 4.2);

        // Render first line with bold prefix
        doc.setFont('times', 'bold');
        doc.text(labelText, leftMargin, yPos);

        doc.setFont('times', 'normal');
        const line1Content = wrappedLines[0].substring(labelText.length);
        doc.text(line1Content, leftMargin + labelWidth, yPos);
        yPos += 4.2;

        // Subsequent wrapped lines
        for (let i = 1; i < wrappedLines.length; i++) {
          doc.text(wrappedLines[i], leftMargin, yPos);
          yPos += 4.2;
        }
      });
      yPos += 2;
    }
  }

  // -------------------------------------------------------------
  // 4. PROJECTS (ALWAYS INCLUDED if student has projects)
  // -------------------------------------------------------------
  if (projects && projects.length > 0) {
    renderSectionHeader('PROJECTS');

    projects.forEach((proj, index) => {
      // Calculate estimated project height to prevent orphan header or split item
      const descLines = proj.description ? doc.splitTextToSize(proj.description, maxWidth) : [];
      let estimatedHeight = 9 + descLines.length * 4;
      if (proj.highlights) estimatedHeight += proj.highlights.length * 4.5;
      
      checkPageBreak(estimatedHeight > 50 ? 25 : estimatedHeight);

      // Project Name & Tech Stack
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.text(proj.name, leftMargin, yPos);

      if (proj.technologies && proj.technologies.length > 0) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        const techStr = proj.technologies.join(', ');
        doc.text(techStr, pageWidth - rightMargin, yPos, { align: 'right' });
      }
      yPos += 4.5;

      // GitHub or Project Link if present
      if (proj.githubLink || proj.projectLink) {
        doc.setFont('times', 'italic');
        doc.setFontSize(8.5);
        const linkStr = proj.githubLink || proj.projectLink;
        doc.text(`Link: ${linkStr}`, leftMargin, yPos);
        yPos += 4;
      }

      // Project Description
      if (proj.description) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9.5);
        const wrappedDesc = doc.splitTextToSize(proj.description, maxWidth);
        doc.text(wrappedDesc, leftMargin, yPos);
        yPos += wrappedDesc.length * 4;
      }

      // Highlights Bullets
      if (proj.highlights && proj.highlights.length > 0) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        proj.highlights.forEach(bullet => {
          const bulletStr = `• ${bullet}`;
          const wrappedBullet = doc.splitTextToSize(bulletStr, maxWidth - 4);
          checkPageBreak(wrappedBullet.length * 3.8);
          doc.text(wrappedBullet, leftMargin + 3, yPos);
          yPos += wrappedBullet.length * 3.8;
        });
      }

      yPos += 3;
    });
  }

  // -------------------------------------------------------------
  // 5. EXPERIENCE / INTERNSHIPS
  // -------------------------------------------------------------
  if (experience && experience.length > 0) {
    renderSectionHeader('EXPERIENCE / INTERNSHIPS');

    experience.forEach((exp) => {
      checkPageBreak(18);

      // Role & Duration
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      const roleOrgStr = `${exp.role}${exp.organization ? ` - ${exp.organization}` : ''}`;
      doc.text(roleOrgStr, leftMargin, yPos);

      if (exp.duration) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9.5);
        doc.text(exp.duration, pageWidth - rightMargin, yPos, { align: 'right' });
      }
      yPos += 4.5;

      // Location
      if (exp.location) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.text(exp.location, leftMargin, yPos);
        yPos += 4;
      }

      // Description
      if (exp.description) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9.5);
        const expDesc = doc.splitTextToSize(exp.description, maxWidth);
        doc.text(expDesc, leftMargin, yPos);
        yPos += expDesc.length * 4;
      }

      // Responsibilities Bullets
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        exp.responsibilities.forEach(bullet => {
          const bulletStr = `• ${bullet}`;
          const wrappedResp = doc.splitTextToSize(bulletStr, maxWidth - 4);
          checkPageBreak(wrappedResp.length * 3.8);
          doc.text(wrappedResp, leftMargin + 3, yPos);
          yPos += wrappedResp.length * 3.8;
        });
      }

      yPos += 3;
    });
  }

  // -------------------------------------------------------------
  // 6. CERTIFICATIONS
  // -------------------------------------------------------------
  if (certifications && certifications.length > 0) {
    renderSectionHeader('CERTIFICATIONS');
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);

    certifications.forEach(cert => {
      let certLine = `• ${cert.name}${cert.organization ? ` – ${cert.organization}` : ''}${cert.date ? ` (${cert.date})` : ''}`;
      if (cert.credentialId) certLine += ` [Credential ID: ${cert.credentialId}]`;
      
      const wrappedCert = doc.splitTextToSize(certLine, maxWidth);
      checkPageBreak(wrappedCert.length * 4.2);
      doc.text(wrappedCert, leftMargin, yPos);
      yPos += wrappedCert.length * 4.2;
    });
    yPos += 2;
  }

  // -------------------------------------------------------------
  // 7. ACHIEVEMENTS
  // -------------------------------------------------------------
  if (achievements && achievements.length > 0) {
    renderSectionHeader('ACHIEVEMENTS');
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);

    achievements.forEach(ach => {
      let achHead = `• ${ach.title}${ach.organization ? ` (${ach.organization}` : ''}${ach.date ? `, ${ach.date})` : ach.organization ? ')' : ''}`;
      const wrappedAchHead = doc.splitTextToSize(achHead, maxWidth);
      checkPageBreak(wrappedAchHead.length * 4 + 4);

      doc.setFont('times', 'bold');
      doc.text(wrappedAchHead, leftMargin, yPos);
      yPos += wrappedAchHead.length * 4;

      if (ach.description) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        const wrappedAchDesc = doc.splitTextToSize(ach.description, maxWidth - 4);
        doc.text(wrappedAchDesc, leftMargin + 4, yPos);
        yPos += wrappedAchDesc.length * 3.8 + 1.5;
      }
    });
  }

  // Save the vector PDF file
  const fileName = `${personalInfo.fullName ? personalInfo.fullName.replace(/\s+/g, '_') : 'Student'}_ATS_Resume.pdf`;
  doc.save(fileName);
};
