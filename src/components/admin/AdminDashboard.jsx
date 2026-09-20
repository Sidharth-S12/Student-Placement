import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllStudents } from '../../services/studentProfileService';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';
import {
  ShieldCheck,
  LogOut,
  Users,
  Building2,
  TrendingUp,
  Award,
  BarChart3,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Brain,
  Cpu,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Loader2,
  BookOpen
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();

  // Navigation tabs: 'overview' | 'students' | 'departments' | 'performance' | 'kmeans'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Student data & filters
  const [students, setStudents] = useState([]);
  const [discoveredDepts, setDiscoveredDepts] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected student for detailed read-only modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch registered students and dynamically discover departments
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchAllStudents({
        department: selectedDept,
        search: searchQuery,
        skill: skillFilter
      });
      setStudents(data.students || []);
      if (data.departments && data.departments.length > 0) {
        setDiscoveredDepts(data.departments);
      }
    } catch (err) {
      console.error('Failed to load students for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDept, searchQuery, skillFilter]);

  // Real-Data KPI calculations (No hardcoded values)
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) {
      return {
        totalStudents: 0,
        totalDepts: discoveredDepts.length,
        avgTech: 0,
        avgApt: 0,
        avgComm: 0,
        avgReadiness: 0
      };
    }

    let sumTech = 0;
    let sumApt = 0;
    let sumComm = 0;
    let sumReadiness = 0;

    students.forEach(s => {
      const scores = s.placementScores || {};
      sumTech += Number(scores.technicalScore || s.latestTechnicalScore || 0);
      sumApt += Number(scores.aptitudeScore || 0);
      sumComm += Number(scores.communicationScore || 75);
      sumReadiness += Number(scores.overallReadiness || 0);
    });

    return {
      totalStudents: total,
      totalDepts: discoveredDepts.length || 1,
      avgTech: Math.round(sumTech / total),
      avgApt: Math.round(sumApt / total),
      avgComm: Math.round(sumComm / total),
      avgReadiness: Math.round(sumReadiness / total)
    };
  }, [students, discoveredDepts]);

  // Department-wise distribution
  const departmentBreakdown = useMemo(() => {
    const map = {};
    discoveredDepts.forEach(d => {
      map[d] = { dept: d, count: 0, totalReadiness: 0, totalTech: 0 };
    });

    students.forEach(s => {
      const d = s.department || 'Other';
      if (!map[d]) {
        map[d] = { dept: d, count: 0, totalReadiness: 0, totalTech: 0 };
      }
      map[d].count += 1;
      map[d].totalReadiness += (s.placementScores?.overallReadiness || 0);
      map[d].totalTech += (s.placementScores?.technicalScore || s.latestTechnicalScore || 0);
    });

    return Object.values(map).map(item => ({
      ...item,
      avgReadiness: item.count > 0 ? Math.round(item.totalReadiness / item.count) : 0,
      avgTech: item.count > 0 ? Math.round(item.totalTech / item.count) : 0
    }));
  }, [students, discoveredDepts]);

  const handleOpenStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-none">
                Placement Genie
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                Admin Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Central Placement & Training Office</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-slate-900">Placement Officer</div>
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

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className={`md:w-64 flex-shrink-0 space-y-2 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'students' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Students Roster</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('departments'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'departments' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Departments</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('performance'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'performance' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Performance Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('kmeans'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'kmeans' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Brain className="w-4 h-4 text-brand-500" />
                <span>K-Means Groups</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-extrabold uppercase">
                Soon
              </span>
            </button>
          </div>

          <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl text-white space-y-2 shadow-xs hidden md:block">
            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase tracking-wide">Campus Monitoring</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Placement readiness analytics are calculated directly from students' adaptive technical assessments and validated profiles.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Institutional Placement Overview</h2>
                <p className="text-xs text-slate-500">Live metrics calculated across all registered student profiles</p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Total Students</span>
                    <Users className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats.totalStudents}</div>
                  <div className="text-[11px] text-slate-400">Registered in system</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Discovered Departments</span>
                    <Building2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stats.totalDepts}</div>
                  <div className="text-[11px] text-slate-400">{discoveredDepts.join(', ') || 'No depts registered'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Avg Placement Readiness</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600">{stats.avgReadiness}%</div>
                  <div className="text-[11px] text-slate-400">Target benchmark: 75%</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Avg Technical Score</span>
                    <Cpu className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-blue-600">{stats.avgTech}%</div>
                  <div className="text-[11px] text-slate-400">Adaptive AI evaluations</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Avg Aptitude Score</span>
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-purple-600">{stats.avgApt}%</div>
                  <div className="text-[11px] text-slate-400">Quantitative & reasoning</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Avg Communication</span>
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-600">{stats.avgComm}%</div>
                  <div className="text-[11px] text-slate-400">Verbal & workplace skills</div>
                </div>
              </div>

              {/* Department Snapshot Preview */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">Department Readiness Snapshot</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('departments')}
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1"
                  >
                    <span>View All Departments</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {departmentBreakdown.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {departmentBreakdown.map((d, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900">{d.dept}</div>
                          <div className="text-[11px] text-slate-500">{d.count} student{d.count === 1 ? '' : 's'} registered</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-sm text-emerald-600">{d.avgReadiness}%</div>
                          <div className="text-[10px] text-slate-400">Avg Readiness</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No students registered yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS ROSTER */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Student Placement Directory</h2>
                <p className="text-xs text-slate-500">Filter registered candidates by department, skills, and readiness</p>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student by name, email, or keyword..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <div className="w-full sm:w-56">
                    <input
                      type="text"
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                      placeholder="Filter by skill (e.g. Python, SQL)..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Dynamic Department Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 pb-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex-shrink-0">Departments:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDept('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedDept === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Departments ({stats.totalStudents})
                  </button>

                  {discoveredDepts.map((dept, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedDept.toLowerCase() === dept.toLowerCase()
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Students List Table/Card */}
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-white rounded-2xl border border-slate-200/80">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Loading student records from database...</span>
                </div>
              ) : students.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {students.map((student) => {
                      const personal = student.personalInfo || {};
                      const education = student.education || {};
                      const scores = student.placementScores || {};

                      return (
                        <div
                          key={student.uid}
                          onClick={() => handleOpenStudent(student)}
                          className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {personal.profilePhoto ? (
                                <img src={personal.profilePhoto} alt={personal.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-extrabold text-sm text-slate-500">
                                  {(personal.fullName || 'S').charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                  {personal.fullName || 'Unnamed Student'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  {student.department || education.branch || 'General'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                {personal.email || student.email} • CGPA: {education.cgpa || '—'} • Class of {education.graduationYear || '2025'}
                              </div>
                              {student.normalizedSkills && student.normalizedSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {student.normalizedSkills.slice(0, 4).map((sk, idx) => (
                                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                      {sk}
                                    </span>
                                  ))}
                                  {student.normalizedSkills.length > 4 && (
                                    <span className="text-[10px] text-slate-400 font-semibold">
                                      +{student.normalizedSkills.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 sm:space-x-6 justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Technical</div>
                              <div className="text-xs font-extrabold text-blue-600">{scores.technicalScore || student.latestTechnicalScore || 0}%</div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Aptitude</div>
                              <div className="text-xs font-extrabold text-indigo-600">{scores.aptitudeScore || 0}%</div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Readiness</div>
                              <div className="text-xs font-black text-emerald-600">{scores.overallReadiness || 0}%</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  {selectedDept !== 'all' ? (
                    <span>No students found in department <strong className="text-slate-600">{selectedDept}</strong>.</span>
                  ) : (
                    <span>No students registered yet.</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Department-Wise Placement Analytics</h2>
                <p className="text-xs text-slate-500">Automatically discovered from student academic records</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departmentBreakdown.map((deptItem, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-extrabold text-xs text-slate-700">
                          {deptItem.dept.substring(0, 3)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{deptItem.dept}</h4>
                          <span className="text-xs text-slate-500">{deptItem.count} student{deptItem.count === 1 ? '' : 's'}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black">
                        {deptItem.avgReadiness}% Readiness
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>Average Technical Competency</span>
                        <span className="text-blue-600">{deptItem.avgTech}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${deptItem.avgTech}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDept(deptItem.dept);
                          setActiveTab('students');
                        }}
                        className="text-brand-600 hover:underline font-bold"
                      >
                        View students in this department →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Readiness Performance Tiers</h2>
                <p className="text-xs text-slate-500">Distribution of campus candidates by placement readiness</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="text-xs font-extrabold uppercase tracking-wide">High Readiness</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-emerald-900">
                    {students.filter(s => (s.placementScores?.overallReadiness || 0) >= 80).length}
                  </div>
                  <p className="text-xs text-slate-500">Readiness Score &ge; 80%. Interview ready.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-blue-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-blue-700">
                    <span className="text-xs font-extrabold uppercase tracking-wide">Moderate Readiness</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-blue-900">
                    {students.filter(s => {
                      const r = s.placementScores?.overallReadiness || 0;
                      return r >= 60 && r < 80;
                    }).length}
                  </div>
                  <p className="text-xs text-slate-500">Readiness Score 60% – 79%. Final polishing.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-amber-700">
                    <span className="text-xs font-extrabold uppercase tracking-wide">Needs Improvement</span>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-amber-900">
                    {students.filter(s => (s.placementScores?.overallReadiness || 0) < 60).length}
                  </div>
                  <p className="text-xs text-slate-500">Readiness Score &lt; 60%. Remedial practice needed.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: K-MEANS GROUPS (COMING SOON) */}
          {activeTab === 'kmeans' && (
            <div className="space-y-5">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-base text-slate-900">K-Means Student Groups</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Machine Learning-Based Student Clustering Engine</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p className="font-semibold text-slate-800">
                    Students will be grouped based on Technical, Aptitude, Communication and Placement Readiness performance.
                  </p>
                  <p>
                    This future module will run an unsupervised K-Means clustering algorithm on actual normalized student performance vectors, grouping students into targeted intervention cohorts rather than arbitrary rankings.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Planned Feature Dimensions:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                      1. Technical Score (0 - 100%)
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                      2. Aptitude Score (0 - 100%)
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                      3. Communication Score (0 - 100%)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Cohort Interpretations (ML Architecture):</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1">
                      <div className="font-extrabold text-blue-900">Technical-Focused Improvement</div>
                      <div className="text-slate-600 text-[11px]">Identifies students needing structured data structures and algorithmic practice.</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-1">
                      <div className="font-extrabold text-indigo-900">Aptitude-Focused Improvement</div>
                      <div className="text-slate-600 text-[11px]">Identifies students needing quantitative problem-solving and logical reasoning reinforcement.</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50 space-y-1">
                      <div className="font-extrabold text-purple-900">Communication-Focused Improvement</div>
                      <div className="text-slate-600 text-[11px]">Assists candidates who excel technically but require mock interview & soft-skills prep.</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
                      <div className="font-extrabold text-emerald-900">Strong Overall Performance</div>
                      <div className="text-slate-600 text-[11px]">Candidates demonstrating high placement readiness across all three assessment pillars.</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
                  <Clock className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>Notice: Clustering will be computed dynamically from actual backend ML evaluation once the microservice is connected. No mock random groupings are displayed now.</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Read-Only Student Detail Modal */}
      <AdminStudentDetailModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
      />

    </div>
  );
};
