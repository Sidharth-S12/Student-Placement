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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">

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
                  {personal.fullName || 'Student Profile'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                  {student.department || education.branch || 'General'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                  Read-Only Inspection
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{personal.email || student.email || 'No email specified'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={downloadingResume}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
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
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert if any */}
        {feedbackMsg && (
          <div className="px-6 py-2 bg-brand-50 border-b border-brand-100 text-brand-900 text-xs flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button type="button" onClick={() => setFeedbackMsg(null)}><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 bg-white flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Education
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'skills' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Skills ({student.normalizedSkills?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'projects' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Projects & Experience ({projects.length + experience.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Assessment History ({history.technical.length + history.aptitude.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {/* TAB 1: OVERVIEW & EDUCATION */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Placement Readiness</div>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">{scores.overallReadiness || 0}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Technical Score</div>
                  <div className="text-xl font-black text-blue-900 mt-0.5">{scores.technicalScore || 0}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">Aptitude Score</div>
                  <div className="text-xl font-black text-indigo-900 mt-0.5">{scores.aptitudeScore || 0}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
                  <div className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">Communication</div>
                  <div className="text-xl font-black text-purple-900 mt-0.5">{scores.communicationScore || 75}%</div>
                </div>
              </div>

              {/* Personal & Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Contact & Demographics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{personal.email || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{personal.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{personal.location || 'Not provided'}</span>
                  </div>
                </div>
                {personal.summary && (
                  <p className="text-xs text-slate-600 pt-2 border-t border-slate-200/60 leading-relaxed italic">
                    "{personal.summary}"
                  </p>
                )}
              </div>

              {/* Education Background */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Academic Background</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
                    <div className="font-bold text-slate-900">{education.degree || 'B.Tech'} — {education.branch || student.department || 'General'}</div>
                    <div className="text-slate-500">{education.college || 'Engineering College'}</div>
                    <div className="flex justify-between pt-1 font-semibold text-[11px] text-slate-600">
                      <span>CGPA: {education.cgpa ? `${education.cgpa} / 10` : '—'}</span>
                      <span>Graduation: {education.graduationYear || '—'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-1">
                    <div className="font-bold text-slate-900">Secondary & Higher Secondary</div>
                    <div className="text-slate-600 flex justify-between">
                      <span>12th / PUC: {education.twelfthPercentage ? `${education.twelfthPercentage}` : '—'}</span>
                      <span>{education.twelfthBoard || ''} ({education.twelfthYear || ''})</span>
                    </div>
                    <div className="text-slate-600 flex justify-between">
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
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Programming Languages</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(skills.programmingLanguages || []).length > 0 ? (
                      skills.programmingLanguages.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          {typeof item === 'string' ? item : item.name}
                          {item.level && <span className="ml-1 text-[10px] text-brand-600 font-normal">({item.level})</span>}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None listed</span>
                    )}
                  </div>
                </div>

                {/* Frameworks */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Frameworks & Libraries</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(skills.frameworks || []).length > 0 ? (
                      skills.frameworks.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          {typeof item === 'string' ? item : item.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None listed</span>
                    )}
                  </div>
                </div>

                {/* Databases & Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-xs font-bold text-slate-700">Databases</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(skills.databases || []).length > 0 ? (
                        skills.databases.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                            {typeof item === 'string' ? item : item.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None listed</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-xs font-bold text-slate-700">Tools & Technologies</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(skills.toolsTechnologies || []).length > 0 ? (
                        skills.toolsTechnologies.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                            {typeof item === 'string' ? item : item.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None listed</span>
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
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900">{proj.name || proj.title || 'Untitled Project'}</div>
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline text-[11px] flex items-center space-x-1">
                            <span>Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                      {proj.technologies && (
                        <div className="text-[11px] text-slate-500 pt-1">
                          <span className="font-semibold text-slate-700">Tech Stack:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No projects documented yet.
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Work & Internships</h4>
                {experience.length > 0 ? (
                  experience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{exp.role || 'Intern'}</span>
                        <span className="text-slate-500">{exp.duration || ''}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-brand-700">{exp.organization || exp.company || ''}</div>
                      {exp.description && <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
                          {exp.responsibilities.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
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
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Loading assessment history from database...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Technical Assessment Runs */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Technical Skill Assessments</span>
                      <span className="text-[11px] text-slate-400 font-normal">{history.technical.length} recorded</span>
                    </div>

                    {history.technical.length > 0 ? (
                      history.technical.map((run, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900">Score: {run.technicalScore}%</div>
                            <div className="text-[11px] text-slate-500">
                              Completed: {run.completedAt ? new Date(run.completedAt).toLocaleDateString() : 'Recent'} • Correct: {run.correctAnswers || 0} / 15
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            (run.technicalScore || 0) >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {(run.technicalScore || 0) >= 75 ? 'Proficient' : 'Needs Practice'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No technical assessment attempts recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Aptitude Assessment Runs */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Campus Aptitude Assessments</span>
                      <span className="text-[11px] text-slate-400 font-normal">{history.aptitude.length} recorded</span>
                    </div>

                    {history.aptitude.length > 0 ? (
                      history.aptitude.map((run, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900">Score: {run.finalScore ?? run.score ?? 0}%</div>
                            <div className="text-[11px] text-slate-500">
                              Completed: {run.completedAt ? new Date(run.completedAt).toLocaleDateString() : 'Recent'} • Correct: {run.correctAnswers || 0} / {run.totalQuestions || 20}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-800 border border-indigo-200">
                            Verified
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
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
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Student ID: <code className="text-slate-700 font-mono text-[11px]">{student.uid}</code></span>
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
