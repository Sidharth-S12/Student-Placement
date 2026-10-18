import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllStudents } from '../../services/studentProfileService';
import {
  fetchOfficers,
  removeOfficer,
  fetchDrives,
  deleteDrive
} from '../../services/adminService';
import { exportStudentsToCSV } from '../../utils/exportCsv';
import { runKMeansClustering } from '../../utils/kmeansClustering';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';
import { AdminAddOfficerModal } from './AdminAddOfficerModal';
import { AdminAddDriveModal } from './AdminAddDriveModal';
import { Card, Button, Badge, StatCard, PageHeader } from '../ui';
import {
  ShieldCheck,
  LogOut,
  Users,
  Building2,
  TrendingUp,
  Award,
  BarChart3,
  Search,
  ChevronRight,
  Brain,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Loader2,
  Download,
  UserPlus,
  Plus,
  Briefcase,
  Trash2,
  Mail,
  Phone,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();

  // Navigation tabs: 'overview' | 'students' | 'drives' | 'officers' | 'kmeans' | 'departments' | 'performance'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Student data & filters
  const [students, setStudents] = useState([]);
  const [discoveredDepts, setDiscoveredDepts] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [readinessTierFilter, setReadinessTierFilter] = useState('all'); // 'all' | 'high' | 'moderate' | 'remedial'
  const [sortBy, setSortBy] = useState('readiness_desc');
  const [loading, setLoading] = useState(true);

  // Placement Officers state
  const [officers, setOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);

  // Recruitment Drives state
  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(false);
  const [isAddDriveModalOpen, setIsAddDriveModalOpen] = useState(false);

  // Selected student for detailed modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // UI Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch registered students
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

  // 2. Fetch Placement Officers
  const loadOfficers = async () => {
    setLoadingOfficers(true);
    try {
      const list = await fetchOfficers();
      setOfficers(list);
    } catch (err) {
      console.error('Failed to load officers:', err);
    } finally {
      setLoadingOfficers(false);
    }
  };

  // 3. Fetch Campus Recruitment Drives
  const loadDrives = async () => {
    setLoadingDrives(true);
    try {
      const list = await fetchDrives();
      setDrives(list);
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoadingDrives(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDept, searchQuery, skillFilter]);

  useEffect(() => {
    loadOfficers();
    loadDrives();
  }, []);

  // Real-Data KPI calculations
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) {
      return {
        totalStudents: 0,
        totalDepts: discoveredDepts.length,
        avgTech: 0,
        avgApt: 0,
        avgComm: 0,
        avgReadiness: 0,
        highReadyCount: 0,
        moderateReadyCount: 0,
        remedialCount: 0
      };
    }

    let sumTech = 0;
    let sumApt = 0;
    let sumComm = 0;
    let sumReadiness = 0;
    let high = 0;
    let mod = 0;
    let rem = 0;

    students.forEach(s => {
      const scores = s.placementScores || {};
      const t = Number(scores.technicalScore || s.latestTechnicalScore || 0);
      const a = Number(scores.aptitudeScore || 0);
      const c = Number(scores.communicationScore || 75);
      const r = Number(scores.overallReadiness || 0);

      sumTech += t;
      sumApt += a;
      sumComm += c;
      sumReadiness += r;

      if (r >= 80) high++;
      else if (r >= 60) mod++;
      else rem++;
    });

    return {
      totalStudents: total,
      totalDepts: discoveredDepts.length || 1,
      avgTech: Math.round(sumTech / total),
      avgApt: Math.round(sumApt / total),
      avgComm: Math.round(sumComm / total),
      avgReadiness: Math.round(sumReadiness / total),
      highReadyCount: high,
      moderateReadyCount: mod,
      remedialCount: rem
    };
  }, [students, discoveredDepts]);

  // Department-wise breakdown
  const departmentBreakdown = useMemo(() => {
    const map = {};
    discoveredDepts.forEach(d => {
      map[d] = { dept: d, count: 0, totalReadiness: 0, totalTech: 0, totalApt: 0 };
    });

    students.forEach(s => {
      const d = s.department || 'Other';
      if (!map[d]) {
        map[d] = { dept: d, count: 0, totalReadiness: 0, totalTech: 0, totalApt: 0 };
      }
      map[d].count += 1;
      map[d].totalReadiness += (s.placementScores?.overallReadiness || 0);
      map[d].totalTech += (s.placementScores?.technicalScore || s.latestTechnicalScore || 0);
      map[d].totalApt += (s.placementScores?.aptitudeScore || 0);
    });

    return Object.values(map).map(item => ({
      ...item,
      avgReadiness: item.count > 0 ? Math.round(item.totalReadiness / item.count) : 0,
      avgTech: item.count > 0 ? Math.round(item.totalTech / item.count) : 0,
      avgApt: item.count > 0 ? Math.round(item.totalApt / item.count) : 0
    })).sort((a, b) => b.avgReadiness - a.avgReadiness);
  }, [students, discoveredDepts]);

  // Filtered & Sorted Students Roster
  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Readiness Tier filter
    if (readinessTierFilter === 'high') {
      result = result.filter(s => (s.placementScores?.overallReadiness || 0) >= 80);
    } else if (readinessTierFilter === 'moderate') {
      result = result.filter(s => {
        const r = s.placementScores?.overallReadiness || 0;
        return r >= 60 && r < 80;
      });
    } else if (readinessTierFilter === 'remedial') {
      result = result.filter(s => (s.placementScores?.overallReadiness || 0) < 60);
    }

    // Sort order
    result.sort((a, b) => {
      const rA = a.placementScores?.overallReadiness || 0;
      const rB = b.placementScores?.overallReadiness || 0;
      const tA = a.placementScores?.technicalScore || a.latestTechnicalScore || 0;
      const tB = b.placementScores?.technicalScore || b.latestTechnicalScore || 0;
      const aptA = a.placementScores?.aptitudeScore || 0;
      const aptB = b.placementScores?.aptitudeScore || 0;
      const cgpaA = parseFloat(a.education?.cgpa || 0) || 0;
      const cgpaB = parseFloat(b.education?.cgpa || 0) || 0;
      const nameA = (a.personalInfo?.fullName || '').toLowerCase();
      const nameB = (b.personalInfo?.fullName || '').toLowerCase();

      switch (sortBy) {
        case 'readiness_desc': return rB - rA;
        case 'readiness_asc': return rA - rB;
        case 'tech_desc': return tB - tA;
        case 'apt_desc': return aptB - aptA;
        case 'cgpa_desc': return cgpaB - cgpaA;
        case 'name_asc': return nameA.localeCompare(nameB);
        default: return rB - rA;
      }
    });

    return result;
  }, [students, readinessTierFilter, sortBy]);

  // Real-time Machine Learning K-Means Clustering
  const kmeansResult = useMemo(() => {
    return runKMeansClustering(students, 4);
  }, [students]);

  // Officer deletion handler
  const handleRemoveOfficer = async (uid, name) => {
    if (!window.confirm(`Are you sure you want to revoke Placement Officer privileges for ${name}?`)) {
      return;
    }
    try {
      await removeOfficer(uid);
      setOfficers(prev => prev.filter(o => o.uid !== uid));
      showToast(`Placement Officer ${name} removed.`);
    } catch (err) {
      alert(err.message || 'Failed to remove placement officer.');
    }
  };

  // Drive deletion handler
  const handleDeleteDrive = async (driveId, compName) => {
    if (!window.confirm(`Are you sure you want to delete the campus recruitment drive for ${compName}?`)) {
      return;
    }
    try {
      await deleteDrive(driveId);
      setDrives(prev => prev.filter(d => d.id !== driveId));
      showToast(`Recruitment drive for ${compName} removed.`);
    } catch (err) {
      alert(err.message || 'Failed to delete recruitment drive.');
    }
  };

  // Export Roster CSV
  const handleExportRoster = () => {
    exportStudentsToCSV(
      filteredAndSortedStudents,
      `campus_placement_roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    showToast('Student roster exported to CSV successfully.');
  };

  // Export Eligible Candidates for a specific drive
  const handleExportDriveCandidates = (drive) => {
    const eligible = students.filter(s => {
      const cgpa = parseFloat(s.education?.cgpa || 0) || 0;
      const readiness = s.placementScores?.overallReadiness || 0;
      const dept = s.department || 'Other';

      const meetsCgpa = drive.minCgpa ? cgpa >= drive.minCgpa : true;
      const meetsReadiness = drive.minReadiness ? readiness >= drive.minReadiness : true;
      const meetsDept = (!drive.eligibleDepartments || drive.eligibleDepartments.includes('All'))
        ? true
        : drive.eligibleDepartments.some(d => d.toLowerCase() === dept.toLowerCase());

      return meetsCgpa && meetsReadiness && meetsDept;
    });

    if (eligible.length === 0) {
      showToast(`No registered candidates match ${drive.companyName} criteria.`);
      return;
    }

    exportStudentsToCSV(
      eligible,
      `eligible_candidates_${drive.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
    );
    showToast(`Exported ${eligible.length} eligible candidates for ${drive.companyName}.`);
  };

  const handleOpenStudent = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-subtle flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-subtle">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-none font-display">
                Placement Genie
              </h1>
              <Badge variant="amber">Admin Portal</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Central Training & Placement Cell</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setIsAddOfficerModalOpen(true)}
            className="hidden sm:inline-flex"
          >
            Add Officer
          </Button>

          <div className="hidden sm:block text-right px-2">
            <div className="text-xs font-bold text-slate-900">Placement Officer</div>
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

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">

        {/* Navigation Sidebar */}
        <aside className={`md:w-60 flex-shrink-0 space-y-4 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <Card className="p-2.5 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students Roster', icon: Users, badge: stats.totalStudents },
              { id: 'drives', label: 'Recruitment Drives', icon: Briefcase, badge: drives.length },
              { id: 'officers', label: 'Placement Officers', icon: ShieldCheck, badge: officers.length },
              { id: 'kmeans', label: 'K-Means Clusters', icon: Brain, badgeText: 'ML' },
              { id: 'departments', label: 'Departments', icon: Building2 },
              { id: 'performance', label: 'Analytics & Tiers', icon: TrendingUp },
            ].map((nav) => {
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => { setActiveTab(nav.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-subtle'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <nav.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {nav.badge}
                    </span>
                  )}
                  {nav.badgeText && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-extrabold uppercase">
                      {nav.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-4 space-y-3 bg-slate-50/80 hidden md:block">
            <div className="flex items-center space-x-2 text-slate-800">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quick Actions</span>
            </div>
            <div className="space-y-1.5">
              <Button
                variant="secondary"
                size="sm"
                icon={UserPlus}
                onClick={() => setIsAddOfficerModalOpen(true)}
                className="w-full justify-between"
              >
                Add Placement Officer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => setIsAddDriveModalOpen(true)}
                className="w-full justify-between"
              >
                Schedule New Drive
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleExportRoster}
                className="w-full justify-between"
              >
                Export Roster (CSV)
              </Button>
            </div>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 min-w-0">

          {/* =========================================================================
              TAB 1: OVERVIEW
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Institutional Overview']}
                title="Institutional Placement Overview"
                subtitle="Live performance metrics calculated across all registered student profiles, assessments, and recruitment drives."
                actions={
                  <>
                    <Button variant="secondary" size="sm" icon={Download} onClick={handleExportRoster}>
                      Export CSV
                    </Button>
                    <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsAddOfficerModalOpen(true)}>
                      Add Officer
                    </Button>
                  </>
                }
              />

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents}
                  subtext="Registered candidates"
                  icon={Users}
                  colorScheme="brand"
                  onClick={() => setActiveTab('students')}
                />
                <StatCard
                  title="Departments"
                  value={stats.totalDepts}
                  subtext={discoveredDepts.slice(0, 2).join(', ') || 'Academic branches'}
                  icon={Building2}
                  colorScheme="indigo"
                  onClick={() => setActiveTab('departments')}
                />
                <StatCard
                  title="Average Readiness"
                  value={`${stats.avgReadiness}%`}
                  subtext="Target benchmark: 75%"
                  icon={TrendingUp}
                  colorScheme={stats.avgReadiness >= 75 ? "emerald" : "brand"}
                  onClick={() => setActiveTab('performance')}
                />
                <StatCard
                  title="Technical Competency"
                  value={`${stats.avgTech}%`}
                  subtext="Adaptive AI assessments"
                  icon={Cpu}
                  colorScheme="brand"
                />
                <StatCard
                  title="Aptitude & Logic"
                  value={`${stats.avgApt}%`}
                  subtext="Quant & verbal battery"
                  icon={Award}
                  colorScheme="purple"
                />
                <StatCard
                  title="Placement Officers"
                  value={officers.length}
                  subtext="Authorized coordinators"
                  icon={ShieldCheck}
                  colorScheme="amber"
                  onClick={() => setActiveTab('officers')}
                />
              </div>

              {/* Department Snapshot & Active Recruitment Drives */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Department Snapshot */}
                <Card className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Department Readiness Breakdown</h3>
                      <p className="text-xs text-slate-500">Live candidate competency by department</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ChevronRight}
                      iconPosition="right"
                      onClick={() => setActiveTab('departments')}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {departmentBreakdown.slice(0, 4).map((d, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{d.dept}</div>
                          <div className="text-[11px] text-slate-500">{d.count} candidates</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-600 text-sm">{d.avgReadiness}%</div>
                          <div className="text-[10px] text-slate-400">Avg Readiness</div>
                        </div>
                      </div>
                    ))}

                    {departmentBreakdown.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs italic">
                        No department records found.
                      </div>
                    )}
                  </div>
                </Card>

                {/* Recruitment Drives Snapshot */}
                <Card className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Active Recruitment Drives</h3>
                      <p className="text-xs text-slate-500">Real-time student matching against company cutoffs</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ChevronRight}
                      iconPosition="right"
                      onClick={() => setActiveTab('drives')}
                    >
                      Manage Drives
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {drives.slice(0, 3).map((dr) => {
                      const eligibleCount = students.filter(s => {
                        const cgpa = parseFloat(s.education?.cgpa || 0) || 0;
                        const readiness = s.placementScores?.overallReadiness || 0;
                        const dept = s.department || 'Other';
                        const okCgpa = dr.minCgpa ? cgpa >= dr.minCgpa : true;
                        const okR = dr.minReadiness ? readiness >= dr.minReadiness : true;
                        const okDept = (!dr.eligibleDepartments || dr.eligibleDepartments.includes('All'))
                          ? true
                          : dr.eligibleDepartments.some(d => d.toLowerCase() === dept.toLowerCase());
                        return okCgpa && okR && okDept;
                      }).length;

                      return (
                        <div key={dr.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-extrabold text-slate-900">{dr.companyName}</div>
                            <div className="text-[11px] text-slate-500">{dr.jobRole} • {dr.packageCTC || 'Negotiable'}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant="emerald" size="sm">{eligibleCount} Eligible</Badge>
                            <div className="text-[10px] text-slate-400 mt-0.5">{dr.driveDate || 'Upcoming'}</div>
                          </div>
                        </div>
                      );
                    })}

                    {drives.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs italic">
                        No campus recruitment drives scheduled yet.
                      </div>
                    )}
                  </div>
                </Card>

              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: STUDENTS ROSTER
             ========================================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Student Directory']}
                title="Student Placement Directory"
                subtitle="Filter, inspect, and export comprehensive student assessment records."
                actions={
                  <Button variant="primary" size="sm" icon={Download} onClick={handleExportRoster}>
                    Export Roster (CSV)
                  </Button>
                }
              />

              {/* Filters Card */}
              <Card className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student by name, email, or keywords..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-slate-50/50"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <input
                      type="text"
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                      placeholder="Filter by skill..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-slate-50/50"
                    />
                  </div>
                  <div className="w-full sm:w-52">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                    >
                      <option value="readiness_desc">Sort: Readiness (High to Low)</option>
                      <option value="readiness_asc">Sort: Readiness (Low to High)</option>
                      <option value="tech_desc">Sort: Technical Score</option>
                      <option value="apt_desc">Sort: Aptitude Score</option>
                      <option value="cgpa_desc">Sort: CGPA Cutoff</option>
                      <option value="name_asc">Sort: Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 flex-shrink-0">Depts:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDept('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedDept === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({stats.totalStudents})
                    </button>
                    {discoveredDepts.map((dept, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDept(dept)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedDept.toLowerCase() === dept.toLowerCase()
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Tier:</span>
                    {['all', 'high', 'moderate', 'remedial'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setReadinessTierFilter(tier)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize transition-colors ${
                          readinessTierFilter === tier
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tier === 'all' ? 'All' : tier === 'high' ? '≥80%' : tier === 'moderate' ? '60-79%' : '<60%'}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Roster List Table */}
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Loading candidate database records...</span>
                </div>
              ) : filteredAndSortedStudents.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {filteredAndSortedStudents.map((student) => {
                      const personal = student.personalInfo || {};
                      const education = student.education || {};
                      const scores = student.placementScores || {};
                      const readiness = scores.overallReadiness || 0;

                      return (
                        <div
                          key={student.uid}
                          onClick={() => handleOpenStudent(student)}
                          className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {personal.profilePhoto ? (
                                <img src={personal.profilePhoto} alt={personal.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-extrabold text-sm text-slate-400">
                                  {(personal.fullName || 'S').charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                                  {personal.fullName || 'Unnamed Student'}
                                </span>
                                <Badge variant="neutral" size="sm">
                                  {student.department || education.branch || 'General'}
                                </Badge>
                                {readiness >= 80 && (
                                  <Badge variant="emerald" size="sm">Ready</Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                {personal.email || student.email} • CGPA: {education.cgpa || '—'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 sm:space-x-6 justify-between sm:justify-end">
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
                              <div className="text-xs font-black text-emerald-600">{readiness}%</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  No matching student records found.
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: RECRUITMENT DRIVES
             ========================================================================= */}
          {activeTab === 'drives' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Recruitment Drives']}
                title="Campus Recruitment Drives"
                subtitle="Schedule on-campus hiring drives and automatically match candidates against corporate criteria."
                actions={
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddDriveModalOpen(true)}>
                    Schedule Drive
                  </Button>
                }
              />

              {loadingDrives ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Loading recruitment drives...</span>
                </div>
              ) : drives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drives.map((drive) => {
                    const matchedStudents = students.filter(s => {
                      const cgpa = parseFloat(s.education?.cgpa || 0) || 0;
                      const readiness = s.placementScores?.overallReadiness || 0;
                      const dept = s.department || 'Other';
                      const okCgpa = drive.minCgpa ? cgpa >= drive.minCgpa : true;
                      const okR = drive.minReadiness ? readiness >= drive.minReadiness : true;
                      const okDept = (!drive.eligibleDepartments || drive.eligibleDepartments.includes('All'))
                        ? true
                        : drive.eligibleDepartments.some(d => d.toLowerCase() === dept.toLowerCase());
                      return okCgpa && okR && okDept;
                    });

                    return (
                      <Card key={drive.id} className="p-5 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-sm">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{drive.companyName}</h4>
                                <p className="text-xs text-slate-500 font-medium">{drive.jobRole}</p>
                              </div>
                            </div>
                            <Badge variant={drive.status === 'Active' ? "emerald" : "neutral"} size="sm">
                              {drive.status || 'Upcoming'}
                            </Badge>
                          </div>

                          {/* Drive Details */}
                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Package / CTC</span>
                              <span className="font-extrabold text-slate-800">{drive.packageCTC || 'Competitive'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Drive Date</span>
                              <span className="font-extrabold text-slate-800">{drive.driveDate || 'TBD'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Min CGPA</span>
                              <span className="font-bold text-slate-700">{drive.minCgpa || 'None'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Min Readiness</span>
                              <span className="font-bold text-emerald-700">{drive.minReadiness ? `${drive.minReadiness}%` : 'Open'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Match & Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700">
                            {matchedStudents.length} candidate{matchedStudents.length === 1 ? '' : 's'} eligible
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Download}
                              onClick={() => handleExportDriveCandidates(drive)}
                            >
                              Export Roster
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={Trash2}
                              onClick={() => handleDeleteDrive(drive.id, drive.companyName)}
                              title="Delete drive"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <p>No recruitment drives scheduled yet.</p>
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddDriveModalOpen(true)}>
                    Schedule First Drive
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: PLACEMENT OFFICERS
             ========================================================================= */}
          {activeTab === 'officers' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Placement Officers']}
                title="Placement Officers & Coordinators"
                subtitle="Authorized administrators managing institutional placement and campus recruitments."
                actions={
                  <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsAddOfficerModalOpen(true)}>
                    Add Officer
                  </Button>
                }
              />

              {loadingOfficers ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Loading officer registry...</span>
                </div>
              ) : officers.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {officers.map((officer) => (
                      <div key={officer.uid} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-subtle flex-shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                {officer.displayName || 'Placement Officer'}
                              </span>
                              <Badge variant="amber" size="sm">Administrator</Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              {officer.designation || 'Placement Officer'} • {officer.department || 'Central Placement Cell'}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-0.5">
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{officer.email}</span>
                              </span>
                              {officer.phone && (
                                <span className="flex items-center space-x-1">
                                  <span>•</span>
                                  <Phone className="w-3 h-3" />
                                  <span>{officer.phone}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleRemoveOfficer(officer.uid, officer.displayName || officer.email)}
                        >
                          Revoke Access
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  No placement officers configured yet.
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 5: K-MEANS MACHINE LEARNING STUDENT CLUSTERS
             ========================================================================= */}
          {activeTab === 'kmeans' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Machine Learning Clusters']}
                title="K-Means Student Clustering Engine"
                subtitle="Unsupervised 4-dimensional performance clustering across Technical, Aptitude, Communication, and Placement Readiness."
                badge={<Badge variant="primary">Unsupervised ML</Badge>}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kmeansResult.clusters.map((cluster) => (
                  <Card key={cluster.id} className="p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${cluster.dotClass}`} />
                            <h4 className="font-extrabold text-sm text-slate-900">{cluster.name}</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{cluster.tagline}</p>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {cluster.count} Students ({cluster.percentage}%)
                        </Badge>
                      </div>

                      {/* Centroid Dimensions */}
                      <div className="grid grid-cols-4 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-center text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Tech</span>
                          <span className="font-extrabold text-blue-600">{cluster.centroid.technical}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Aptitude</span>
                          <span className="font-extrabold text-indigo-600">{cluster.centroid.aptitude}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Comm</span>
                          <span className="font-extrabold text-purple-600">{cluster.centroid.communication}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Readiness</span>
                          <span className="font-extrabold text-emerald-600">{cluster.centroid.readiness}%</span>
                        </div>
                      </div>

                      {/* Strategy */}
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                          Pedagogical Intervention:
                        </span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {cluster.interventionStrategy}
                        </p>
                      </div>
                    </div>

                    {/* Candidate Chips */}
                    {cluster.students.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                          {cluster.students.slice(0, 5).map((st) => (
                            <button
                              key={st.uid}
                              type="button"
                              onClick={() => handleOpenStudent(st)}
                              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                            >
                              {st.personalInfo?.fullName || 'Student'}
                            </button>
                          ))}
                          {cluster.students.length > 5 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{cluster.students.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: DEPARTMENTS
             ========================================================================= */}
          {activeTab === 'departments' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Departments']}
                title="Department-Wise Placement Analytics"
                subtitle="Comparative academic branch readiness discovered dynamically from registered student profiles."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departmentBreakdown.map((deptItem, idx) => (
                  <Card key={idx} className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{deptItem.dept}</h4>
                        <span className="text-xs text-slate-500">{deptItem.count} candidates</span>
                      </div>
                      <Badge variant="emerald">{deptItem.avgReadiness}% Readiness</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between font-medium text-slate-600 mb-1">
                          <span>Average Technical Competency</span>
                          <span className="font-bold text-blue-600">{deptItem.avgTech}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${deptItem.avgTech}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium text-slate-600 mb-1">
                          <span>Average Aptitude & Reasoning</span>
                          <span className="font-bold text-indigo-600">{deptItem.avgApt}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${deptItem.avgApt}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronRight}
                        iconPosition="right"
                        onClick={() => {
                          setSelectedDept(deptItem.dept);
                          setActiveTab('students');
                        }}
                      >
                        Inspect candidates in {deptItem.dept}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 7: PERFORMANCE ANALYTICS & TIERS
             ========================================================================= */}
          {activeTab === 'performance' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Performance Tiers']}
                title="Readiness Performance Tiers"
                subtitle="Campus candidate distribution categorized by placement readiness benchmarks."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 space-y-2 border-emerald-200/80">
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="text-xs font-bold uppercase tracking-wider">High Readiness</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-black text-emerald-900">{stats.highReadyCount}</div>
                  <p className="text-xs text-slate-500">Readiness Score &ge; 80%. Interview ready for Day-1 recruiters.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReadinessTierFilter('high');
                      setActiveTab('students');
                    }}
                  >
                    View High-Readiness Cohort →
                  </Button>
                </Card>

                <Card className="p-5 space-y-2 border-blue-200/80">
                  <div className="flex items-center justify-between text-blue-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Moderate Readiness</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-black text-blue-900">{stats.moderateReadyCount}</div>
                  <p className="text-xs text-slate-500">Readiness Score 60% – 79%. Requires mock polishing & final tuning.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReadinessTierFilter('moderate');
                      setActiveTab('students');
                    }}
                  >
                    View Moderate Cohort →
                  </Button>
                </Card>

                <Card className="p-5 space-y-2 border-amber-200/80">
                  <div className="flex items-center justify-between text-amber-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Remedial Focus</span>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-black text-amber-900">{stats.remedialCount}</div>
                  <p className="text-xs text-slate-500">Readiness Score &lt; 60%. Foundation bootcamps required.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReadinessTierFilter('remedial');
                      setActiveTab('students');
                    }}
                  >
                    View Remedial Cohort →
                  </Button>
                </Card>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AdminAddOfficerModal
        isOpen={isAddOfficerModalOpen}
        onClose={() => setIsAddOfficerModalOpen(false)}
        onOfficerAdded={(newOfficer) => {
          setOfficers(prev => [newOfficer, ...prev]);
          showToast(`Officer ${newOfficer.displayName} successfully added!`);
        }}
      />

      <AdminAddDriveModal
        isOpen={isAddDriveModalOpen}
        onClose={() => setIsAddDriveModalOpen(false)}
        onDriveSaved={(newDrive) => {
          setDrives(prev => [newDrive, ...prev]);
          showToast(`Recruitment drive for ${newDrive.companyName} published!`);
        }}
      />

      <AdminStudentDetailModal
        student={selectedStudent}
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedStudent(null);
        }}
      />

    </div>
  );
};
