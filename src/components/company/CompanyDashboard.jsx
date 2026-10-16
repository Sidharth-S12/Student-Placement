import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllStudents } from '../../services/studentProfileService';
import { CompanyStudentDetailModal } from './CompanyStudentDetailModal';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import { Card, Button, Badge, PageHeader } from '../ui';
import {
  Building2,
  LogOut,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Loader2,
  X,
  LayoutGrid,
  List
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

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
      const cleaned = skillQuery
        .split(/\s+/)
        .filter(tok => tok.toLowerCase() !== skill.toLowerCase())
        .join(' ');
      setSkillQuery(cleaned);
    } else {
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
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-subtle flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-subtle">
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-none font-display">
                Placement Genie
              </h1>
              <Badge variant="indigo">Recruiter Portal</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Verified Campus Talent Discovery</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-900">{currentUser?.displayName || 'Campus Recruiter'}</div>
            <div className="text-[11px] text-slate-400">{currentUser?.email}</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={LogOut}
            onClick={logout}
          >
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
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
        
        {/* Page Header */}
        <PageHeader
          breadcrumb={['Company Portal', 'Candidate Discovery']}
          title="Campus Talent Discovery"
          subtitle="Search and evaluate verified campus talent based on evaluated programming skills, aptitude ratings, and placement readiness."
          badge={
            <Badge variant="neutral">
              {filteredCandidates.length} Candidates Available
            </Badge>
          }
        />

        {/* Search & Filter Workspace Card */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="Search skills (e.g. Python, React, Java, SQL, Machine Learning)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all bg-slate-50/50"
              />
              {skillQuery && (
                <button
                  type="button"
                  onClick={() => setSkillQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <div className="w-full sm:w-48">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
              >
                <option value="all">All Departments</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Min Readiness Dropdown */}
            <div className="w-full sm:w-44">
              <select
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
              >
                <option value={0}>Any Readiness</option>
                <option value={50}>&ge; 50% Readiness</option>
                <option value={70}>&ge; 70% Readiness</option>
                <option value={80}>&ge; 80% (Day-1 Ready)</option>
              </select>
            </div>
          </div>

          {/* Quick Skill Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Popular:</span>
            {COMMON_SKILLS.map((sk) => {
              const isSelected = skillQuery.toLowerCase().includes(sk.toLowerCase());
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleQuickSkillClick(sk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Results Bar & View Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Matching Talent ({filteredCandidates.length})
            </h3>
            <p className="text-xs text-slate-500">
              {skillQuery ? `Filtered by skills matching "${skillQuery}"` : 'All registered campus talent'}
            </p>
          </div>

          <div className="flex items-center space-x-1 p-1 bg-white rounded-xl border border-slate-200/80 shadow-subtle">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List / Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-white rounded-2xl border border-slate-200/80 shadow-card">
            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
            <span>Searching candidate profiles...</span>
          </div>
        ) : filteredCandidates.length > 0 ? (
          viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCandidates.map((student) => {
                const personal = student.personalInfo || {};
                const education = student.education || {};
                const scores = student.placementScores || {};
                const readiness = scores.overallReadiness || 0;

                return (
                  <Card
                    key={student.uid}
                    hover
                    className="p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top: Avatar & Information */}
                      <div className="flex items-start space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {personal.profilePhoto ? (
                            <img src={personal.profilePhoto} alt={personal.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-extrabold text-base text-slate-400">
                              {(personal.fullName || 'C').charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-sm text-slate-900 truncate">
                              {personal.fullName || 'Anonymous Candidate'}
                            </h4>
                            <Badge variant={readiness >= 80 ? "emerald" : "neutral"} size="sm">
                              {readiness >= 80 ? 'Day-1 Ready' : `${readiness}% Ready`}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {education.degree || 'Degree'} {education.branch ? `• ${education.branch}` : ''}
                            {education.cgpa && <span> • CGPA: {education.cgpa}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {(student.normalizedSkills || []).slice(0, 6).map((sk, idx) => {
                            const isMatch = skillQuery && skillQuery.toLowerCase().includes(sk.toLowerCase());
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                                  isMatch
                                    ? 'bg-slate-900 text-white font-semibold'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {sk}
                              </span>
                            );
                          })}
                          {(student.normalizedSkills || []).length > 6 && (
                            <span className="text-[10px] text-slate-400 font-semibold self-center">
                              +{student.normalizedSkills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score Metrics Strip */}
                      <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60 grid grid-cols-4 gap-2 text-center text-xs">
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400">Readiness</div>
                          <div className="font-extrabold text-emerald-600">{readiness}%</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400">Technical</div>
                          <div className="font-extrabold text-blue-600">{scores.technicalScore || student.latestTechnicalScore || 0}%</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400">Aptitude</div>
                          <div className="font-extrabold text-indigo-600">{scores.aptitudeScore || 0}%</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400">Interview</div>
                          <div className="font-extrabold text-purple-600">{scores.communicationScore || 75}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                          setSelectedCandidate(student);
                          setIsModalOpen(true);
                        }}
                      >
                        View Profile
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={Download}
                        onClick={(e) => handleDownloadResume(e, student)}
                      >
                        Download Resume
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Key Skills</th>
                      <th className="py-3 px-4 text-center">Tech Score</th>
                      <th className="py-3 px-4 text-center">Readiness</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map((student) => {
                      const personal = student.personalInfo || {};
                      const education = student.education || {};
                      const scores = student.placementScores || {};
                      const readiness = scores.overallReadiness || 0;

                      return (
                        <tr key={student.uid} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{personal.fullName || 'Candidate'}</div>
                            <div className="text-[11px] text-slate-400">{education.degree || 'Degree'} {education.cgpa ? `• CGPA: ${education.cgpa}` : ''}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {student.department || education.branch || 'General'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(student.normalizedSkills || []).slice(0, 3).map((sk, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-extrabold text-blue-600">
                            {scores.technicalScore || student.latestTechnicalScore || 0}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={readiness >= 80 ? "emerald" : "neutral"} size="sm">
                              {readiness}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center space-x-1.5">
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={Eye}
                                onClick={() => {
                                  setSelectedCandidate(student);
                                  setIsModalOpen(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                icon={Download}
                                onClick={(e) => handleDownloadResume(e, student)}
                              >
                                Resume
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        ) : (
          <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">No candidates match your search filters.</p>
            <p className="text-slate-400">Try adjusting your skill keywords or selecting another department.</p>
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
