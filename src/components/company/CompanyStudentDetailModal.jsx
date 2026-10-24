import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  Trophy,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Building2,
  Bookmark,
  BookmarkCheck,
  Sparkles
} from 'lucide-react';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import { Button, Badge } from '../ui';

export const CompanyStudentDetailModal = ({
  student,
  isOpen,
  onClose,
  isShortlisted = false,
  onToggleShortlist
}) => {
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  if (!isOpen || !student) return null;

  const personal = student.personalInfo || {};
  const education = student.education || {};
  const skills = student.technicalSkills || {};
  const scores = student.placementScores || {};
  const projects = student.projects || [];
  const experience = student.experience || [];
  const certifications = student.certifications || [];
  const achievements = student.achievements || [];
  const links = student.professionalLinks || {};

  const readiness = scores.overallReadiness || 0;
  const techScore = scores.technicalScore || student.latestTechnicalScore || 0;
  const aptScore = scores.aptitudeScore || 0;
  const commScore = scores.communicationScore || 75;

  // Privacy rules configured by student in placementVisibility
  const visibility = student.placementVisibility || {
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
  };

  const handleDownloadResume = () => {
    try {
      setDownloadingResume(true);
      if (visibility.resume === false) {
        setFeedbackMsg('Student has restricted resume downloads for this profile.');
        setTimeout(() => setFeedbackMsg(null), 3500);
        return;
      }
      if (!personal.fullName && !education.college && projects.length === 0) {
        setFeedbackMsg('Resume not available.');
        setTimeout(() => setFeedbackMsg(null), 3500);
        return;
      }
      generateATSResumePDF(student);
      setFeedbackMsg(`Resume for ${personal.fullName || 'student'} downloaded.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error('Failed to generate resume for company:', err);
      setFeedbackMsg('Resume generation failed.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } finally {
      setDownloadingResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {personal.profilePhoto ? (
                <img
                  src={personal.profilePhoto}
                  alt={personal.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-extrabold text-base text-brand-400">
                  {(personal.fullName || 'C').charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight truncate">
                  {personal.fullName || 'Candidate Profile'}
                </h3>
                <Badge variant="indigo" size="sm">
                  {student.department || education.branch || 'Engineering'}
                </Badge>
                <Badge variant="emerald" size="sm">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <p className="text-xs text-slate-400 mt-1 truncate">
                {education.degree || 'Degree'}{' '}
                {education.college ? `• ${education.college}` : ''}{' '}
                {education.graduationYear ? `• Class of ${education.graduationYear}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            {onToggleShortlist && (
              <button
                type="button"
                onClick={() => onToggleShortlist(student)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isShortlisted
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
                title={isShortlisted ? 'Remove from shortlist' : 'Shortlist candidate'}
              >
                {isShortlisted ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                ) : (
                  <Bookmark className="w-4 h-4 text-slate-400" />
                )}
                <span className="hidden sm:inline">
                  {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                </span>
              </button>
            )}

            {visibility.resume !== false && (
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                loading={downloadingResume}
                onClick={handleDownloadResume}
                className="hidden sm:inline-flex"
              >
                Resume
              </Button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="px-6 py-2 bg-indigo-950/80 border-b border-indigo-800/60 text-indigo-200 text-xs flex items-center justify-between animate-fade-in">
            <span>{feedbackMsg}</span>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="text-indigo-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {/* 1. Evaluation Scores Strip */}
          {visibility.scores !== false && (
            <div className="p-4 rounded-xl bg-slate-850/90 border border-slate-800 space-y-3 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  Placement Assessment Performance
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Adaptive AI Evaluated
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Readiness</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    {readiness}%
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Technical</div>
                  <div className="text-xl font-extrabold text-blue-400 mt-0.5">
                    {techScore}%
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Aptitude</div>
                  <div className="text-xl font-extrabold text-indigo-400 mt-0.5">
                    {aptScore}%
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Interview</div>
                  <div className="text-xl font-extrabold text-purple-400 mt-0.5">
                    {commScore}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Recruiter Contact & Links */}
          <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Contact & Profiles
              </span>
              {visibility.contact ? (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Public Contact</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                  <EyeOff className="w-3 h-3" />
                  <span>Privacy Protected</span>
                </span>
              )}
            </div>

            {visibility.contact ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{personal.email || '—'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{personal.phone || '—'}</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>
                  Direct contact details are held for invited recruitment drives. Placement Cell official
                  contact: <span className="font-semibold text-slate-200">{personal.email || 'Campus Candidate'}</span>
                </span>
              </div>
            )}

            {(links.linkedin || links.github || links.portfolio) && (
              <div className="flex items-center space-x-3 pt-2 text-xs text-brand-400">
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center space-x-1"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center space-x-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {links.portfolio && (
                  <a
                    href={links.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center space-x-1"
                  >
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 3. Technical Skills */}
          {visibility.skills !== false && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand-400" />
                Verified Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(student.normalizedSkills || []).length > 0 ? (
                  student.normalizedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No technical skills listed</span>
                )}
              </div>
            </div>
          )}

          {/* 4. Academic Background */}
          {visibility.education !== false && (
            <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Academic Background
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Degree & Branch</div>
                  <div className="font-bold text-white mt-0.5">
                    {education.degree || 'B.Tech'} ({education.branch || student.department || 'General'})
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Institution</div>
                  <div className="font-bold text-white mt-0.5">
                    {education.college || 'Engineering College'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Cumulative GPA</div>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {education.cgpa ? `${education.cgpa} / 10` : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Projects */}
          {visibility.projects !== false && projects.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                Key Projects ({projects.length})
              </h4>
              <div className="space-y-2">
                {projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-850/70 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        {proj.name || proj.title || 'Untitled Project'}
                      </span>
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:text-brand-300 text-[11px] flex items-center space-x-1"
                        >
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    )}
                    {proj.technologies && (
                      <div className="text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">Stack:</span>{' '}
                        {Array.isArray(proj.technologies)
                          ? proj.technologies.join(', ')
                          : proj.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Work Experience */}
          {visibility.experience !== false && experience.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                Experience & Internships
              </h4>
              <div className="space-y-2">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-850/70 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{exp.role}</span>
                      <span className="text-slate-400 text-[11px]">{exp.duration || ''}</span>
                    </div>
                    <div className="font-semibold text-brand-400 text-[11px]">
                      {exp.organization || exp.company || ''}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Certifications */}
          {visibility.certifications !== false && certifications.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Certifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-850/70 border border-slate-800 space-y-0.5"
                  >
                    <div className="font-bold text-white">{cert.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {cert.organization} {cert.date ? `• ${cert.date}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruiter Candidate Verification View</span>
          </span>

          <div className="flex items-center space-x-2">
            {visibility.resume !== false && (
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                loading={downloadingResume}
                onClick={handleDownloadResume}
                className="sm:hidden"
              >
                Resume
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
