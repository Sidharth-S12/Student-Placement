import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllStudents } from '../../services/studentProfileService';
import { CompanyStudentDetailModal } from './CompanyStudentDetailModal';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import {
  Building2,
  LogOut,
  Search,
  Filter,
  User,
  GraduationCap,
  Sparkles,
  Download,
  Eye,
  CheckCircle2,
  Shield,
  Loader2,
  X,
  ChevronRight,
  ExternalLink,
  Award,
  TrendingUp,
  Cpu
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python',
  'React',
  'JavaScript',
  'Java',
  'SQL',
  'Machine Learning',
  'Node.js',
  'MongoDB',
  'Go',
  'C++',
  'Git'
];

export const CompanyDashboard = () => {
  const { currentUser, logout } = useAuth();

  // Search & filter state
  const [skillQuery, setSkillQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [minReadiness, setMinReadiness] = useState(0);

  // Candidates & departments
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected student for read-only preview
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const data = await fetchAllStudents({
        skill: skillQuery,
        department: departmentFilter
      });
      setStudents(data.students || []);
      if (data.departments) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error('Failed to load students for company:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [skillQuery, departmentFilter]);

  // Filter students based on min readiness if specified
  const filteredCandidates = students.filter(s => {
    const r = s.placementScores?.overallReadiness || 0;
    return r >= minReadiness;
  });

  const handleQuickSkillClick = (skill) => {
    if (skillQuery.toLowerCase().includes(skill.toLowerCase())) {
      // Remove it
      const cleaned = skillQuery
        .split(/\s+/)
        .filter(tok => tok.toLowerCase() !== skill.toLowerCase())
        .join(' ');
      setSkillQuery(cleaned);
    } else {
      // Append it
      setSkillQuery(prev => prev.trim() ? `${prev.trim()} ${skill}` : skill);
    }
  };

  const handleDownloadResume = (e, student) => {
    e.stopPropagation();
    try {
      if (student.placementVisibility?.resume === false) {
        showToast('Resume downloads restricted by student.');
        return;
      }
      const personal = student.personalInfo || {};
      const education = student.education || {};
      const projects = student.projects || [];
      if (!personal.fullName && !education.college && projects.length === 0) {
        showToast('Resume not available.');
        return;
      }
      generateATSResumePDF(student);
      showToast(`Downloaded ATS resume for ${personal.fullName || 'student'}`);
    } catch (err) {
      console.error('Resume download error:', err);
      showToast('Resume not available.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-none">
                Placement Genie
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase tracking-wider">
                Recruiter Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Campus Talent Discovery & Verified Skill Search</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-900">{currentUser?.displayName || 'Campus Recruiter'}</div>
            <div className="text-[11px] text-slate-400">{currentUser?.email}</div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-slate-600 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        
        {/* Search Students by Skills Hero Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Verified Skill-Based Talent Search</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Search Students by Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Search campus candidates based on verified programming languages, frameworks, and tools evaluated through adaptive technical assessments.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Search required skills (e.g. Python, React, Java, SQL, Machine Learning)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
            />
            {skillQuery && (
              <button
                type="button"
                onClick={() => setSkillQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Skill Filter Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Popular Skills:</span>
            {COMMON_SKILLS.map((sk) => {
              const isSelected = skillQuery.toLowerCase().includes(sk.toLowerCase());
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleQuickSkillClick(sk)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>

          {/* Optional Department & Score Sliders */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-500">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white"
              >
                <option value="all">All Departments</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-500">Min Placement Readiness:</span>
              <select
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white"
              >
                <option value={0}>Any Score</option>
                <option value={50}>50%+</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+ (Top Tier)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Matching Candidates ({filteredCandidates.length})
            </h3>
            <p className="text-xs text-slate-500">
              {skillQuery ? `Filtered by skills matching "${skillQuery}"` : 'All registered campus talent'}
            </p>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-white rounded-3xl border border-slate-200/80">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Searching candidate profiles...</span>
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCandidates.map((student) => {
              const personal = student.personalInfo || {};
              const education = student.education || {};
              const scores = student.placementScores || {};

              return (
                <div
                  key={student.uid}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Avatar & Details */}
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {personal.profilePhoto ? (
                          <img src={personal.profilePhoto} alt={personal.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-extrabold text-base text-slate-500">
                            {(personal.fullName || 'C').charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-slate-900 truncate">
                            {personal.fullName || 'Anonymous Candidate'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex-shrink-0 ml-2">
                            {student.department || education.branch || 'General'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {education.degree || 'B.Tech'} • Class of {education.graduationYear || '2025'}
                          {education.cgpa && <span> • CGPA: {education.cgpa}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {(student.normalizedSkills || []).length > 0 ? (
                          student.normalizedSkills.map((sk, idx) => {
                            const isMatch = skillQuery && skillQuery.toLowerCase().includes(sk.toLowerCase());
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                                  isMatch
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {sk}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-400 italic">No skills specified</span>
                        )}
                      </div>
                    </div>

                    {/* Performance Metrics Bar */}
                    <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-slate-400">Readiness</div>
                        <div className="text-xs font-black text-emerald-600">{scores.overallReadiness || 0}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-slate-400">Technical</div>
                        <div className="text-xs font-black text-blue-600">{scores.technicalScore || student.latestTechnicalScore || 0}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-slate-400">Aptitude</div>
                        <div className="text-xs font-black text-indigo-600">{scores.aptitudeScore || 0}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-slate-400">Communication</div>
                        <div className="text-xs font-black text-purple-600">{scores.communicationScore || 75}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Profile & Download Resume */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCandidate(student);
                        setIsModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-xs font-bold text-slate-700 transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>View Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDownloadResume(e, student)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">No students found with the selected skills.</p>
            <p className="text-slate-400">Try adjusting your skill search keywords or clearing filters.</p>
          </div>
        )}

      </main>

      {/* Read-Only Company Student Profile Modal */}
      <CompanyStudentDetailModal
        student={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
      />

    </div>
  );
};
