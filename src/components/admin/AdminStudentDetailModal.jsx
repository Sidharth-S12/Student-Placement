import React, { useState, useEffect } from 'react';
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
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  BarChart2
} from 'lucide-react';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import { fetchStudentAssessmentHistory } from '../../services/studentProfileService';

export const AdminStudentDetailModal = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'skills' | 'history' | 'projects'
  const [history, setHistory] = useState({ technical: [], aptitude: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    if (isOpen && student?.uid) {
      setLoadingHistory(true);
      fetchStudentAssessmentHistory(student.uid)
        .then(data => setHistory(data))
        .catch(err => console.warn('History fetch error:', err))
        .finally(() => setLoadingHistory(false));
    }
  }, [isOpen, student?.uid]);

  if (!isOpen || !student) return null;

  const personal = student.personalInfo || {};
  const education = student.education || {};
  const skills = student.technicalSkills || {};
  const scores = student.placementScores || {};
  const projects = student.projects || [];
  const experience = student.experience || [];
  const certifications = student.certifications || [];
  const achievements = student.achievements || [];

  const handleDownloadResume = () => {
    try {
      setDownloadingResume(true);
      if (!personal.fullName && !education.college && projects.length === 0) {
        setFeedbackMsg('Resume not available: student has not completed profile data.');
        setTimeout(() => setFeedbackMsg(null), 3500);
        return;
      }
      generateATSResumePDF(student);
      setFeedbackMsg('ATS Resume generated & downloaded successfully.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error('Failed to generate resume:', err);
      setFeedbackMsg('Resume not available.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } finally {
      setDownloadingResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden text-slate-100">

        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shadow-xs">
              {personal.profilePhoto ? (
                <img src={personal.profilePhoto} alt={personal.fullName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white leading-none">
                  {personal.fullName || 'Student Profile'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80 text-[10px] font-bold">
                  {student.department || education.branch || 'General'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                  Read-Only Inspection
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{personal.email || student.email || 'No email specified'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={downloadingResume}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              {downloadingResume ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download Resume</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert if any */}
        {feedbackMsg && (
          <div className="px-6 py-2 bg-brand-500/20 border-b border-brand-500/40 text-brand-200 text-xs flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button type="button" onClick={() => setFeedbackMsg(null)}><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-800 bg-slate-900 flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Education
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'skills' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Skills ({student.normalizedSkills?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'projects' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Projects & Experience ({projects.length + experience.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Assessment History ({history.technical.length + history.aptitude.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 bg-slate-900">

          {/* TAB 1: OVERVIEW & EDUCATION */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Placement Readiness</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">{scores.overallReadiness || 0}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">Technical Score</div>
                  <div className="text-xl font-black text-blue-400 mt-0.5">{scores.technicalScore || 0}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">Aptitude Score</div>
                  <div className="text-xl font-black text-indigo-400 mt-0.5">{scores.aptitudeScore || 0}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-purple-400 tracking-wider">Communication</div>
                  <div className="text-xl font-black text-purple-400 mt-0.5">{scores.communicationScore || 75}%</div>
                </div>
              </div>

              {/* Personal & Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Contact & Demographics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{personal.email || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{personal.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{personal.location || 'Not provided'}</span>
                  </div>
                </div>
                {personal.summary && (
                  <p className="text-xs text-slate-300 pt-2 border-t border-slate-800 leading-relaxed italic">
                    "{personal.summary}"
                  </p>
                )}
              </div>

              {/* Education Background */}
              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-brand-400" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Academic Background</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white">{education.degree || 'B.Tech'} — {education.branch || student.department || 'General'}</div>
                    <div className="text-slate-400">{education.college || 'Engineering College'}</div>
                    <div className="flex justify-between pt-1 font-semibold text-[11px] text-slate-300">
                      <span>CGPA: {education.cgpa ? `${education.cgpa} / 10` : '—'}</span>
                      <span>Graduation: {education.graduationYear || '—'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-white">Secondary & Higher Secondary</div>
                    <div className="text-slate-300 flex justify-between">
                      <span>12th / PUC: {education.twelfthPercentage ? `${education.twelfthPercentage}` : '—'}</span>
                      <span>{education.twelfthBoard || ''} ({education.twelfthYear || ''})</span>
                    </div>
                    <div className="text-slate-300 flex justify-between">
                      <span>10th / SSLC: {education.tenthPercentage ? `${education.tenthPercentage}` : '—'}</span>
                      <span>{education.tenthBoard || ''} ({education.tenthYear || ''})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Technical Skills Breakdown</h4>

                {/* Languages */}
                <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300">Programming Languages</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(skills.programmingLanguages || []).length > 0 ? (
                      skills.programmingLanguages.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                          {typeof item === 'string' ? item : item.name}
                          {item.level && <span className="ml-1 text-[10px] text-brand-400 font-normal">({item.level})</span>}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">None listed</span>
                    )}
                  </div>
                </div>

                {/* Frameworks */}
                <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300">Frameworks & Libraries</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(skills.frameworks || []).length > 0 ? (
                      skills.frameworks.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                          {typeof item === 'string' ? item : item.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">None listed</span>
                    )}
                  </div>
                </div>

                {/* Databases & Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300">Databases</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(skills.databases || []).length > 0 ? (
                        skills.databases.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                            {typeof item === 'string' ? item : item.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">None listed</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300">Tools & Technologies</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(skills.toolsTechnologies || []).length > 0 ? (
                        skills.toolsTechnologies.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                            {typeof item === 'string' ? item : item.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">None listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS & EXPERIENCE */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              {/* Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Technical Projects</h4>
                {projects.length > 0 ? (
                  projects.map((proj, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-white">{proj.name || proj.title || 'Untitled Project'}</div>
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline text-[11px] flex items-center space-x-1">
                            <span>Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                      {proj.technologies && (
                        <div className="text-[11px] text-slate-400 pt-1">
                          <span className="font-semibold text-slate-300">Tech Stack:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-850/40 rounded-2xl border border-dashed border-slate-800">
                    No projects documented yet.
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Work & Internships</h4>
                {experience.length > 0 ? (
                  experience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{exp.role || 'Intern'}</span>
                        <span className="text-slate-400">{exp.duration || ''}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-brand-400">{exp.organization || exp.company || ''}</div>
                      {exp.description && <p className="text-xs text-slate-300 leading-relaxed pt-1">{exp.description}</p>}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-0.5 pt-0.5">
                          {exp.responsibilities.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-850/40 rounded-2xl border border-dashed border-slate-800">
                    No internship experience listed yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ASSESSMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Verified Assessment Records</h4>

              {loadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span>Loading assessment history from database...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Technical Assessment Runs */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Technical Skill Assessments</span>
                      <span className="text-[11px] text-slate-400 font-normal">{history.technical.length} recorded</span>
                    </div>

                    {history.technical.length > 0 ? (
                      history.technical.map((run, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white">Score: {run.technicalScore}%</div>
                            <div className="text-[11px] text-slate-400">
                              Completed: {run.completedAt ? new Date(run.completedAt).toLocaleDateString() : 'Recent'} • Correct: {run.correctAnswers || 0} / 15
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            (run.technicalScore || 0) >= 75 ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {(run.technicalScore || 0) >= 75 ? 'Proficient' : 'Needs Practice'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-850/40 rounded-xl border border-dashed border-slate-800">
                        No technical assessment attempts recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Aptitude Assessment Runs */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Campus Aptitude Assessments</span>
                      <span className="text-[11px] text-slate-400 font-normal">{history.aptitude.length} recorded</span>
                    </div>

                    {history.aptitude.length > 0 ? (
                      history.aptitude.map((run, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white">Score: {run.finalScore ?? run.score ?? 0}%</div>
                            <div className="text-[11px] text-slate-400">
                              Completed: {run.completedAt ? new Date(run.completedAt).toLocaleDateString() : 'Recent'} • Correct: {run.correctAnswers || 0} / {run.totalQuestions || 20}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            Verified
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-850/40 rounded-xl border border-dashed border-slate-800">
                        No aptitude assessment attempts recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Student ID: <code className="text-slate-300 font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">{student.uid}</code></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 font-semibold text-slate-200 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
