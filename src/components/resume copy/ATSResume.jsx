import React from 'react';

export const ATSResume = ({ studentData }) => {
  if (!studentData) return null;

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

  const renderSkillList = (list) => {
    if (!list || list.length === 0) return '';
    return list.map(item => typeof item === 'string' ? item : item.name).join(', ');
  };

  return (
    <div
      id="ats-resume-document"
      className="bg-white text-black font-serif p-8 sm:p-12 max-w-[800px] mx-auto text-left shadow-lg border border-slate-200 print:shadow-none print:border-none leading-normal select-text"
      style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '11pt', color: '#000000' }}
    >
      {/* 1. HEADER: NAME & CONTACT INFO */}
      <div className="text-center pb-3 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black mb-1">
          {personalInfo.fullName || 'STUDENT NAME'}
        </h1>

        <div className="text-xs text-black space-x-2">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>|</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
        </div>

        {/* Links Line */}
        <div className="text-xs text-black space-x-2 mt-1 font-sans underline">
          {professionalLinks.linkedin && (
            <a href={professionalLinks.linkedin} target="_blank" rel="noreferrer" className="text-black">
              LinkedIn
            </a>
          )}
          {professionalLinks.linkedin && professionalLinks.github && <span>|</span>}
          {professionalLinks.github && (
            <a href={professionalLinks.github} target="_blank" rel="noreferrer" className="text-black">
              GitHub
            </a>
          )}
          {professionalLinks.github && professionalLinks.portfolio && <span>|</span>}
          {professionalLinks.portfolio && (
            <a href={professionalLinks.portfolio} target="_blank" rel="noreferrer" className="text-black">
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* 2. PROFESSIONAL SUMMARY */}
      {personalInfo.summary && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-xs leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* 3. EDUCATION */}
      <div className="mt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
          EDUCATION
        </h2>

        <div className="space-y-2 text-xs">
          {/* Degree */}
          <div>
            <div className="flex justify-between font-bold">
              <span>{education.college}</span>
              <span>Graduation: {education.graduationYear}</span>
            </div>
            <div className="flex justify-between italic">
              <span>{education.degree} in {education.branch}</span>
              <span>CGPA: {education.cgpa}</span>
            </div>
          </div>

          {/* 12th & 10th */}
          <div className="text-[11px] pt-1">
            <div className="flex justify-between">
              <span>Class XII ({education.twelfthBoard})</span>
              <span>Score: {education.twelfthPercentage} ({education.twelfthYear})</span>
            </div>
            <div className="flex justify-between">
              <span>Class X ({education.tenthBoard})</span>
              <span>Score: {education.tenthPercentage} ({education.tenthYear})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TECHNICAL SKILLS */}
      <div className="mt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
          TECHNICAL SKILLS
        </h2>

        <div className="text-xs space-y-1">
          {technicalSkills.programmingLanguages?.length > 0 && (
            <div>
              <span className="font-bold">Programming Languages: </span>
              <span>{renderSkillList(technicalSkills.programmingLanguages)}</span>
            </div>
          )}

          {technicalSkills.frameworks?.length > 0 && (
            <div>
              <span className="font-bold">Frameworks & Libraries: </span>
              <span>{renderSkillList(technicalSkills.frameworks)}</span>
            </div>
          )}

          {technicalSkills.databases?.length > 0 && (
            <div>
              <span className="font-bold">Databases & Storage: </span>
              <span>{renderSkillList(technicalSkills.databases)}</span>
            </div>
          )}

          {technicalSkills.toolsTechnologies?.length > 0 && (
            <div>
              <span className="font-bold">Developer Tools & Infrastructure: </span>
              <span>{renderSkillList(technicalSkills.toolsTechnologies)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. PROJECTS */}
      {projects && projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            PROJECTS
          </h2>

          <div className="space-y-3 text-xs">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">
                    {proj.name}
                    {proj.githubLink && <span className="font-normal font-sans text-[10px] ml-1">({proj.githubLink})</span>}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="italic text-[11px]">
                      {proj.technologies.join(', ')}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 leading-normal text-slate-900">
                  {proj.description}
                </p>

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[11px]">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. INTERNSHIP / EXPERIENCE */}
      {experience && experience.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            INTERNSHIP / EXPERIENCE
          </h2>

          <div className="space-y-3 text-xs">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between font-bold">
                  <span>{exp.role} - {exp.organization}</span>
                  <span>{exp.duration}</span>
                </div>
                {exp.location && <div className="italic text-[11px] text-slate-700">{exp.location}</div>}

                {exp.description && <p className="mt-0.5">{exp.description}</p>}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[11px]">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CERTIFICATIONS */}
      {certifications && certifications.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            CERTIFICATIONS
          </h2>

          <ul className="list-disc pl-5 text-xs space-y-0.5">
            {certifications.map((cert, idx) => (
              <li key={cert.id || idx}>
                <span className="font-bold">{cert.name}</span> - {cert.organization} ({cert.date})
                {cert.credentialId && <span className="text-[11px] italic"> [ID: {cert.credentialId}]</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 8. ACHIEVEMENTS */}
      {achievements && achievements.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            ACHIEVEMENTS
          </h2>

          <ul className="list-disc pl-5 text-xs space-y-1">
            {achievements.map((ach, idx) => (
              <li key={ach.id || idx}>
                <span className="font-bold">{ach.title}</span> ({ach.organization}, {ach.date})
                {ach.description && <p className="text-[11px] text-slate-800">{ach.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
