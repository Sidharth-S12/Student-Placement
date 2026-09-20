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
  Building2
} from 'lucide-react';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';

export const CompanyStudentDetailModal = ({ student, isOpen, onClose }) => {
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
      if (!visibility.resume) {
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
      setFeedbackMsg('ATS Resume downloaded successfully.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error('Failed to generate resume for company:', err);
      setFeedbackMsg('Resume not available.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } finally {
      setDownloadingResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-xs">
              {personal.profilePhoto ? (
                <img src={personal.profilePhoto} alt={personal.fullName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-900 leading-none">
                  {personal.fullName || 'Candidate Profile'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                  {student.department || education.branch || 'Candidate'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center space-x-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span>Verified Placement Profile</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {education.degree || 'B.Tech'} • {education.college || 'Campus Candidate'} • Class of {education.graduationYear || '2025'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {visibility.resume !== false && (
              <button
                type="button"
                onClick={handleDownloadResume}
                disabled={downloadingResume}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
              >
                {downloadingResume ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Download Resume</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="px-6 py-2 bg-indigo-50 border-b border-indigo-100 text-indigo-900 text-xs flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button type="button" onClick={() => setFeedbackMsg(null)}><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Assessment Performance Metrics */}
          {visibility.scores !== false && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Placement Assessment Performance</span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  AI Evaluated & Adaptive
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Placement Readiness</div>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">{scores.overallReadiness || 0}%</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Technical Score</div>
                  <div className="text-lg font-black text-brand-600 mt-0.5">{scores.technicalScore || 0}%</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Aptitude Score</div>
                  <div className="text-lg font-black text-indigo-600 mt-0.5">{scores.aptitudeScore || 0}%</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Communication</div>
                  <div className="text-lg font-black text-purple-600 mt-0.5">{scores.communicationScore || 75}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Notice & Contact Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Recruiter Contact Info</span>
              {visibility.contact ? (
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>Contact Visible</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                  <EyeOff className="w-3 h-3" />
                  <span>Contact Protected</span>
                </span>
              )}
            </div>

            {visibility.contact ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{personal.email || '—'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{personal.phone || '—'}</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>Direct phone & personal contact details are reserved for formal interview invites. Official placement office contact: <span className="font-semibold text-slate-800">{personal.email || 'Available via Campus Drive'}</span></span>
              </div>
            )}
          </div>

          {/* Technical Skills */}
          {visibility.skills !== false && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Candidate Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {(student.normalizedSkills || []).length > 0 ? (
                  student.normalizedSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed</span>
                )}
              </div>
            </div>
          )}

          {/* Academic Background */}
          {visibility.education !== false && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Education Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">Degree & Branch</div>
                  <div className="font-bold text-slate-900">{education.degree || 'B.Tech'} ({education.branch || student.department || 'General'})</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">College</div>
                  <div className="font-bold text-slate-900">{education.college || 'Engineering College'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Cumulative GPA</div>
                  <div className="font-bold text-emerald-700">{education.cgpa ? `${education.cgpa} / 10` : '—'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Projects */}
          {visibility.projects !== false && projects.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Highlighted Projects</h4>
              <div className="space-y-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline text-[11px] flex items-center space-x-1">
                          <span>View Code</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{proj.description}</p>
                    {proj.technologies && (
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Technologies:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {visibility.experience !== false && experience.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Experience & Internships</h4>
              <div className="space-y-2.5">
                {experience.map((exp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-slate-500">{exp.duration}</span>
                    </div>
                    <div className="font-semibold text-brand-700 text-[11px]">{exp.company}</div>
                    <p className="text-slate-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Recruiter Candidate Preview</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
