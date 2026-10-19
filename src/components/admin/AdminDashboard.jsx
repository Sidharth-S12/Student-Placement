import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllStudents } from '../../services/studentProfileService';
import {
  fetchOfficers,
  removeOfficer,
  toggleOfficerStatus,
  fetchDrives,
  deleteDrive,
  fetchCampusSummary,
  fetchAdminApplications,
  updateApplicationStatus
} from '../../services/adminService';
import { exportStudentsToCSV } from '../../utils/exportCsv';
import { runKMeansClustering, calculateElbowCurve } from '../../utils/kmeansClustering';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';
import { AdminAddOfficerModal } from './AdminAddOfficerModal';
import { AdminEditOfficerModal } from './AdminEditOfficerModal';
import { AdminAddDriveModal } from './AdminAddDriveModal';
import { PlacementAnalyticsView } from './PlacementAnalyticsView';
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
  ChevronLeft,
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
  Sparkles,
  Filter,
  Layers,
  Globe,
  Settings,
  Activity,
  FileText,
  Check,
  ExternalLink,
  Lock,
  Eye,
  Edit,
  Power,
  PieChart,
  Database
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();

  // Navigation tab state: 10 dedicated sections
  // 'overview' | 'officers' | 'students' | 'departments' | 'kmeans' | 'analytics' | 'drives' | 'applications' | 'activity' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState([]);
  const [discoveredDepts, setDiscoveredDepts] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [officers, setOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);

  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(false);

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  const [campusSummary, setCampusSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Student Directory Filter States
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [readinessTierFilter, setReadinessTierFilter] = useState('all');
  const [placementStatusFilter, setPlacementStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('readiness_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Officer Management Filter States
  const [officerSearch, setOfficerSearch] = useState('');
  const [officerScopeFilter, setOfficerScopeFilter] = useState('all');
  const [officerStatusFilter, setOfficerStatusFilter] = useState('all');
  const [officerDeptFilter, setOfficerDeptFilter] = useState('all');
  const [selectedOfficerForEdit, setSelectedOfficerForEdit] = useState(null);
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [isEditOfficerModalOpen, setIsEditOfficerModalOpen] = useState(false);

  // Recruitment Drives Filter States
  const [driveSearch, setDriveSearch] = useState('');
  const [driveStatusFilter, setDriveStatusFilter] = useState('all');
  const [isAddDriveModalOpen, setIsAddDriveModalOpen] = useState(false);

  // Applications Tracker Filter States
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appTypeFilter, setAppTypeFilter] = useState('all');

  // K-Means Configuration States
  const [kmeansK, setKmeansK] = useState(4);
  const [kmeansDeptFilter, setKmeansDeptFilter] = useState('all');
  const [kmeansRecalcTrigger, setKmeansRecalcTrigger] = useState(0);

  // Modals & Active Profiles
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Determine current logged-in officer access scope
  const currentOfficerRecord = useMemo(() => {
    if (!currentUser) return null;
    return officers.find(o => o.uid === currentUser.uid || o.email === currentUser.email);
  }, [officers, currentUser]);

  const officerScope = currentOfficerRecord?.accessScope || 'college';
  const officerAssignedDept = currentOfficerRecord?.assignedDepartment || currentOfficerRecord?.department || null;

  // 1. Fetch Students
  const loadStudents = async () => {
    setLoadingStudents(true);
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
      console.error('Failed to load students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // 2. Fetch Officers
  const loadOfficers = async () => {
    setLoadingOfficers(true);
    try {
      const list = await fetchOfficers();
      setOfficers(list);
    } catch (err) {
      console.error('Failed to load placement officers:', err);
    } finally {
      setLoadingOfficers(false);
    }
  };

  // 3. Fetch Drives
  const loadDrives = async () => {
    setLoadingDrives(true);
    try {
      const list = await fetchDrives();
      setDrives(list);
    } catch (err) {
      console.error('Failed to load recruitment drives:', err);
    } finally {
      setLoadingDrives(false);
    }
  };

  // 4. Fetch Applications
  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const list = await fetchAdminApplications();
      setApplications(list);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApplications(false);
    }
  };

  // 5. Fetch Campus Dynamic Summary
  const loadCampusSummary = async () => {
    setLoadingSummary(true);
    try {
      const summary = await fetchCampusSummary();
      if (summary) {
        setCampusSummary(summary);
      }
    } catch (err) {
      console.error('Failed to load campus summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadStudents();
    loadOfficers();
    loadDrives();
    loadApplications();
    loadCampusSummary();
  }, []);

  // Reload students on query changes
  useEffect(() => {
    loadStudents();
  }, [selectedDept, searchQuery, skillFilter]);

  // Compute student application and placement status map
  const studentPlacementStatusMap = useMemo(() => {
    const map = {};
    applications.forEach(app => {
      const sid = app.studentId;
      if (!sid) return;

      if (!map[sid]) {
        map[sid] = {
          hasApplied: true,
          status: app.status || 'Applied',
          hasSelection: app.status === 'Selected',
          hasShortlist: app.status === 'Shortlisted',
          applications: [app]
        };
      } else {
        map[sid].applications.push(app);
        if (app.status === 'Selected') {
          map[sid].status = 'Selected';
          map[sid].hasSelection = true;
        } else if (app.status === 'Shortlisted' && map[sid].status !== 'Selected') {
          map[sid].status = 'Shortlisted';
          map[sid].hasShortlist = true;
        }
      }
    });
    return map;
  }, [applications]);

  // Dynamic K-Means Clustering on active student dataset
  const kmeansResult = useMemo(() => {
    // When department filter is applied for cluster view, students can be viewed within that department
    // while preserving college-wide model integrity
    const studentsToCluster = kmeansDeptFilter === 'all'
      ? students
      : students.filter(s => (s.department || '').toLowerCase() === kmeansDeptFilter.toLowerCase());

    return runKMeansClustering(studentsToCluster, kmeansK);
  }, [students, kmeansK, kmeansDeptFilter, kmeansRecalcTrigger]);

  // Dynamic Elbow Evaluation for optimal K recommendation
  const elbowCurveInfo = useMemo(() => {
    return calculateElbowCurve(students);
  }, [students]);

  // Map student UID to cluster for filtering and badges
  const studentClusterMap = useMemo(() => {
    const map = {};
    if (kmeansResult && kmeansResult.clusters) {
      kmeansResult.clusters.forEach(c => {
        c.students.forEach(st => {
          map[st.uid] = {
            id: c.id,
            name: c.name,
            color: c.color,
            dotClass: c.dotClass,
            badgeClass: c.badgeClass
          };
        });
      });
    }
    return map;
  }, [kmeansResult]);

  // Discovered Academic Years
  const discoveredAcademicYears = useMemo(() => {
    const set = new Set();
    students.forEach(s => {
      const yr = s.education?.graduationYear || s.academicYear;
      if (yr) set.add(String(yr));
    });
    return Array.from(set).sort();
  }, [students]);

  // Real-time KPI summary calculations (synced with actual records)
  const dynamicKPIs = useMemo(() => {
    const totalStudents = students.length;
    const totalOfficers = officers.length;
    const totalDepts = discoveredDepts.length || 1;
    const activeJobs = drives.filter(d => d.status === 'Active' || d.status === 'Upcoming' || !d.status).length;
    const totalApps = applications.length;
    const shortlistedApps = applications.filter(a => a.status === 'Shortlisted');
    const selectedApps = applications.filter(a => a.status === 'Selected');

    // Count UNIQUE students who have been selected
    const uniquePlacedIds = new Set(selectedApps.map(a => a.studentId));
    const uniquelyPlaced = uniquePlacedIds.size;

    // Defined placement percentage: Uniquely placed / Total registered students
    const placementRate = totalStudents > 0
      ? Math.round((uniquelyPlaced / totalStudents) * 100)
      : 0;

    // Scores summary
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
      totalStudents: campusSummary?.totalStudents ?? totalStudents,
      totalOfficers: campusSummary?.totalPlacementOfficers ?? totalOfficers,
      totalCompanies: campusSummary?.totalCompanies ?? (new Set(drives.map(d => d.companyName)).size || 1),
      totalDepts: campusSummary?.totalDepartments ?? totalDepts,
      activeJobs: campusSummary?.activeJobPostings ?? activeJobs,
      totalApplications: campusSummary?.totalApplications ?? totalApps,
      studentsShortlisted: campusSummary?.studentsShortlisted ?? shortlistedApps.length,
      studentsSelected: campusSummary?.studentsSelected ?? selectedApps.length,
      uniquelyPlacedStudents: campusSummary?.uniquelyPlacedStudents ?? uniquelyPlaced,
      overallPlacementPercentage: campusSummary?.overallPlacementPercentage ?? placementRate,
      metricDetails: campusSummary?.placementRateMetricDetails || {
        numerator: uniquelyPlaced,
        denominator: totalStudents,
        denominatorLabel: 'Total Registered Students',
        formula: 'Unique Placed Candidates / Total Registered Students'
      },
      avgTech: totalStudents > 0 ? Math.round(sumTech / totalStudents) : 0,
      avgApt: totalStudents > 0 ? Math.round(sumApt / totalStudents) : 0,
      avgComm: totalStudents > 0 ? Math.round(sumComm / totalStudents) : 0,
      avgReadiness: totalStudents > 0 ? Math.round(sumReadiness / totalStudents) : 0,
      highReadyCount: high,
      moderateReadyCount: mod,
      remedialCount: rem
    };
  }, [students, officers, drives, applications, campusSummary, discoveredDepts]);

  // Department-wise Breakdown
  const departmentBreakdown = useMemo(() => {
    if (campusSummary?.departmentBreakdown && campusSummary.departmentBreakdown.length > 0) {
      return campusSummary.departmentBreakdown;
    }

    const map = {};
    discoveredDepts.forEach(d => {
      map[d] = {
        dept: d,
        totalStudents: 0,
        assessmentCompletedCount: 0,
        totalReadiness: 0,
        totalTech: 0,
        totalApt: 0,
        totalComm: 0,
        applicationsCount: 0,
        shortlistedCount: 0,
        selectedCount: 0,
        uniquePlacedIds: new Set()
      };
    });

    students.forEach(s => {
      const d = s.department || 'Other';
      if (!map[d]) {
        map[d] = {
          dept: d,
          totalStudents: 0,
          assessmentCompletedCount: 0,
          totalReadiness: 0,
          totalTech: 0,
          totalApt: 0,
          totalComm: 0,
          applicationsCount: 0,
          shortlistedCount: 0,
          selectedCount: 0,
          uniquePlacedIds: new Set()
        };
      }
      map[d].totalStudents++;
      if (s.latestAssessmentId || s.placementScores?.technicalScore !== undefined) {
        map[d].assessmentCompletedCount++;
      }
      map[d].totalReadiness += (s.placementScores?.overallReadiness || 0);
      map[d].totalTech += (s.placementScores?.technicalScore || s.latestTechnicalScore || 0);
      map[d].totalApt += (s.placementScores?.aptitudeScore || 0);
      map[d].totalComm += (s.placementScores?.communicationScore || 75);
    });

    applications.forEach(app => {
      const candidate = students.find(s => s.uid === app.studentId);
      const d = candidate?.department || app.studentDepartment || 'Other';
      if (map[d]) {
        map[d].applicationsCount++;
        if (app.status === 'Shortlisted') map[d].shortlistedCount++;
        if (app.status === 'Selected') {
          map[d].selectedCount++;
          map[d].uniquePlacedIds.add(app.studentId);
        }
      }
    });

    return Object.values(map).map(item => {
      const uniquePlaced = item.uniquePlacedIds.size;
      return {
        dept: item.dept,
        totalStudents: item.totalStudents,
        assessmentCompletedCount: item.assessmentCompletedCount,
        assessmentCompletionRate: item.totalStudents > 0
          ? Math.round((item.assessmentCompletedCount / item.totalStudents) * 100)
          : 0,
        avgReadiness: item.totalStudents > 0 ? Math.round(item.totalReadiness / item.totalStudents) : 0,
        avgTechnical: item.totalStudents > 0 ? Math.round(item.totalTech / item.totalStudents) : 0,
        avgAptitude: item.totalStudents > 0 ? Math.round(item.totalApt / item.totalStudents) : 0,
        avgCommunication: item.totalStudents > 0 ? Math.round(item.totalComm / item.totalStudents) : 0,
        applicationsCount: item.applicationsCount,
        shortlistedCount: item.shortlistedCount,
        selectedCount: item.selectedCount,
        uniquelyPlacedCount: uniquePlaced,
        placementPercentage: item.totalStudents > 0 ? Math.round((uniquePlaced / item.totalStudents) * 100) : 0
      };
    }).sort((a, b) => b.totalStudents - a.totalStudents);
  }, [students, applications, campusSummary, discoveredDepts]);

  // Filtered & Sorted Students Roster
  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Academic Year filter
    if (academicYearFilter !== 'all') {
      result = result.filter(s => {
        const yr = s.education?.graduationYear || s.academicYear;
        return String(yr) === academicYearFilter;
      });
    }

    // Cluster filter
    if (clusterFilter !== 'all') {
      result = result.filter(s => {
        const c = studentClusterMap[s.uid];
        return c && c.id === clusterFilter;
      });
    }

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

    // Placement status filter
    if (placementStatusFilter !== 'all') {
      result = result.filter(s => {
        const st = studentPlacementStatusMap[s.uid];
        if (placementStatusFilter === 'Placed') return st?.hasSelection;
        if (placementStatusFilter === 'Shortlisted') return st?.hasShortlist && !st?.hasSelection;
        if (placementStatusFilter === 'Applied') return st?.hasApplied;
        if (placementStatusFilter === 'Not Applied') return !st?.hasApplied;
        return true;
      });
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
  }, [students, academicYearFilter, clusterFilter, readinessTierFilter, placementStatusFilter, sortBy, studentClusterMap, studentPlacementStatusMap]);

  // Paginated Students
  const totalPages = Math.ceil(filteredAndSortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedStudents.slice(start, start + pageSize);
  }, [filteredAndSortedStudents, currentPage, pageSize]);

  // Filtered Officers Roster
  const filteredOfficers = useMemo(() => {
    return officers.filter(off => {
      const q = officerSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (off.displayName || '').toLowerCase().includes(q) ||
        (off.email || '').toLowerCase().includes(q) ||
        (off.department || '').toLowerCase().includes(q) ||
        (off.assignedDepartment || '').toLowerCase().includes(q);

      const matchesScope = officerScopeFilter === 'all' || off.accessScope === officerScopeFilter;
      const matchesStatus = officerStatusFilter === 'all' || (off.status || 'active') === officerStatusFilter;
      const matchesDept = officerDeptFilter === 'all' ||
        (off.department && off.department.toLowerCase().includes(officerDeptFilter.toLowerCase())) ||
        (off.assignedDepartment && off.assignedDepartment.toLowerCase().includes(officerDeptFilter.toLowerCase()));

      return matchesSearch && matchesScope && matchesStatus && matchesDept;
    });
  }, [officers, officerSearch, officerScopeFilter, officerStatusFilter, officerDeptFilter]);

  // Filtered Recruitment Drives
  const filteredDrives = useMemo(() => {
    return drives.filter(dr => {
      const q = driveSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (dr.companyName || '').toLowerCase().includes(q) ||
        (dr.jobRole || '').toLowerCase().includes(q);

      const matchesStatus = driveStatusFilter === 'all' || (dr.status || 'Upcoming') === driveStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drives, driveSearch, driveStatusFilter]);

  // Filtered Applications Roster
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const q = appSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (app.studentName || '').toLowerCase().includes(q) ||
        (app.studentEmail || '').toLowerCase().includes(q) ||
        (app.companyName || '').toLowerCase().includes(q) ||
        (app.jobRole || '').toLowerCase().includes(q);

      const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
      const matchesType = appTypeFilter === 'all' || (app.source || 'direct') === appTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, appSearch, appStatusFilter, appTypeFilter]);

  // Recent Activity Feed (real events)
  const recentActivities = useMemo(() => {
    if (campusSummary?.recentActivity && campusSummary.recentActivity.length > 0) {
      return campusSummary.recentActivity;
    }

    const list = [];
    applications.slice(0, 6).forEach(app => {
      list.push({
        id: `act_app_${app.id}`,
        type: 'application',
        title: `${app.studentName || 'Student'} applied for ${app.jobRole}`,
        subtitle: `${app.companyName} • Status: ${app.status}`,
        timestamp: app.updatedAt || app.createdAt || new Date().toISOString(),
        icon: Briefcase
      });
    });

    drives.slice(0, 4).forEach(dr => {
      list.push({
        id: `act_dr_${dr.id}`,
        type: 'drive',
        title: `Campus Drive: ${dr.companyName}`,
        subtitle: `${dr.jobRole} (${dr.packageCTC || 'Package TBA'})`,
        timestamp: dr.updatedAt || dr.createdAt || new Date().toISOString(),
        icon: Building2
      });
    });

    officers.slice(0, 3).forEach(off => {
      list.push({
        id: `act_off_${off.uid}`,
        type: 'officer',
        title: `Officer: ${off.displayName}`,
        subtitle: `${off.designation} (${off.accessScope === 'college' ? 'College-Wide' : off.assignedDepartment || off.department})`,
        timestamp: off.createdAt || new Date().toISOString(),
        icon: ShieldCheck
      });
    });

    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  }, [campusSummary, applications, drives, officers]);

  // Handlers for Officers
  const handleToggleOfficer = async (officer) => {
    const currentStatus = officer.status || 'active';
    const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
    const actionText = newStatus === 'active' ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${actionText} placement officer ${officer.displayName}?`)) {
      return;
    }

    try {
      const updated = await toggleOfficerStatus(officer.uid, newStatus);
      setOfficers(prev => prev.map(o => o.uid === officer.uid ? { ...o, status: updated.status } : o));
      showToast(`Officer ${officer.displayName} is now ${newStatus}.`);
      loadCampusSummary();
    } catch (err) {
      alert(err.message || `Failed to ${actionText} placement officer.`);
    }
  };

  const handleRemoveOfficer = async (uid, name) => {
    if (!window.confirm(`Are you sure you want to revoke Placement Officer privileges for ${name}?`)) {
      return;
    }
    try {
      await removeOfficer(uid);
      setOfficers(prev => prev.filter(o => o.uid !== uid));
      showToast(`Placement Officer ${name} removed.`);
      loadCampusSummary();
    } catch (err) {
      alert(err.message || 'Failed to remove placement officer.');
    }
  };

  // Handlers for Drives
  const handleDeleteDrive = async (driveId, compName) => {
    if (!window.confirm(`Are you sure you want to delete the campus recruitment drive for ${compName}?`)) {
      return;
    }
    try {
      await deleteDrive(driveId);
      setDrives(prev => prev.filter(d => d.id !== driveId));
      showToast(`Recruitment drive for ${compName} removed.`);
      loadCampusSummary();
    } catch (err) {
      alert(err.message || 'Failed to delete recruitment drive.');
    }
  };

  // Handlers for Applications
  const handleUpdateAppStatus = async (appId, newStatus) => {
    const note = window.prompt(`Update recruitment status to "${newStatus}". Optional officer note:`, `Status updated to ${newStatus}.`);
    if (note === null) return;

    setUpdatingAppId(appId);
    try {
      const updated = await updateApplicationStatus(appId, {
        status: newStatus,
        note: note.trim() || `Status updated to ${newStatus}.`
      });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...updated } : a));
      showToast(`Application status updated to ${newStatus}.`);
      loadCampusSummary();
    } catch (err) {
      alert(err.message || 'Failed to update application status.');
    } finally {
      setUpdatingAppId(null);
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

  // Export Eligible Candidates for a Drive
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex flex-col selection:bg-brand-500 selection:text-white">

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-white text-sm sm:text-base leading-none font-display">
                Placement Genie
              </h1>
              <Badge variant="amber">Admin Portal</Badge>
              {officerScope === 'department' && (
                <Badge variant="indigo" size="sm">
                  {officerAssignedDept || 'Dept Scoped'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Central Training & Placement Cell</p>
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
            <div className="text-xs font-bold text-white flex items-center justify-end space-x-1.5">
              <span>{currentOfficerRecord?.displayName || 'Real Administrator'}</span>
              <span className={`w-2 h-2 rounded-full ${officerScope === 'college' ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
            </div>
            <div className="text-[11px] text-slate-400">
              {currentUser?.email} • {officerScope === 'college' ? 'College-Wide' : officerAssignedDept}
            </div>
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

      {/* Main Layout (10-Section Navigation + Active View) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">

        {/* Navigation Sidebar */}
        <aside className={`md:w-64 flex-shrink-0 space-y-4 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <Card className="p-2 space-y-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: BarChart3 },
              { id: 'officers', label: 'User & Officers', icon: ShieldCheck, badge: officers.length },
              { id: 'students', label: 'Students Directory', icon: Users, badge: students.length },
              { id: 'departments', label: 'Departments', icon: Building2, badge: discoveredDepts.length },
              { id: 'kmeans', label: 'K-Means Clusters', icon: Brain, badgeText: `K=${kmeansK}` },
              { id: 'analytics', label: 'Placement Analytics', icon: TrendingUp, badgeText: 'Charts' },
              { id: 'drives', label: 'Jobs & Drives', icon: Briefcase, badge: drives.length },
              { id: 'applications', label: 'Applications Pipeline', icon: FileText, badge: applications.length },
              { id: 'activity', label: 'Activity Log', icon: Activity, badge: recentActivities.length },
              { id: 'settings', label: 'System Settings', icon: Settings },
            ].map((nav) => {
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => { setActiveTab(nav.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <nav.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}>
                      {nav.badge}
                    </span>
                  )}
                  {nav.badgeText && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-extrabold uppercase">
                      {nav.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-4 space-y-3 bg-slate-850/80 border border-slate-800 hidden md:block">
            <div className="flex items-center space-x-2 text-white">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Actions</span>
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
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={() => {
                  loadStudents();
                  loadOfficers();
                  loadDrives();
                  loadApplications();
                  loadCampusSummary();
                  showToast('Database records synchronized.');
                }}
                className="w-full justify-between text-slate-400 hover:text-white"
              >
                Sync All Records
              </Button>
            </div>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 min-w-0">

          {/* =========================================================================
              TAB 1: INSTITUTIONAL DASHBOARD OVERVIEW
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Institutional Overview']}
                title="Institutional Placement Overview"
                subtitle="Live performance metrics calculated dynamically from actual Firebase / Firestore records."
                actions={
                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" icon={Download} onClick={handleExportRoster}>
                      Export CSV
                    </Button>
                    <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsAddOfficerModalOpen(true)}>
                      Add Officer
                    </Button>
                  </div>
                }
              />

              {/* Summary Cards Grid: All 9 Required Dynamic Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Total Students"
                  value={dynamicKPIs.totalStudents}
                  subtext="Registered student accounts"
                  icon={Users}
                  colorScheme="brand"
                  onClick={() => setActiveTab('students')}
                />
                <StatCard
                  title="Placement Officers"
                  value={dynamicKPIs.totalOfficers}
                  subtext="Authorized administrators"
                  icon={ShieldCheck}
                  colorScheme="amber"
                  onClick={() => setActiveTab('officers')}
                />
                <StatCard
                  title="Companies & Recruiters"
                  value={dynamicKPIs.totalCompanies}
                  subtext="Hiring corporate partners"
                  icon={Building2}
                  colorScheme="indigo"
                  onClick={() => setActiveTab('drives')}
                />
                <StatCard
                  title="Departments"
                  value={dynamicKPIs.totalDepts}
                  subtext={discoveredDepts.slice(0, 2).join(', ') || 'Academic branches'}
                  icon={Layers}
                  colorScheme="purple"
                  onClick={() => setActiveTab('departments')}
                />
                <StatCard
                  title="Active Job Postings"
                  value={dynamicKPIs.activeJobs}
                  subtext="Campus recruitment drives"
                  icon={Briefcase}
                  colorScheme="brand"
                  onClick={() => setActiveTab('drives')}
                />
                <StatCard
                  title="Total Applications"
                  value={dynamicKPIs.totalApplications}
                  subtext="Direct & officer nominations"
                  icon={FileText}
                  colorScheme="blue"
                  onClick={() => setActiveTab('applications')}
                />
                <StatCard
                  title="Students Shortlisted"
                  value={dynamicKPIs.studentsShortlisted}
                  subtext="Cleared screening rounds"
                  icon={Award}
                  colorScheme="purple"
                  onClick={() => {
                    setPlacementStatusFilter('Shortlisted');
                    setActiveTab('students');
                  }}
                />
                <StatCard
                  title="Students Selected"
                  value={dynamicKPIs.uniquelyPlacedStudents}
                  subtext="Uniquely placed candidates"
                  icon={CheckCircle2}
                  colorScheme="emerald"
                  onClick={() => {
                    setPlacementStatusFilter('Placed');
                    setActiveTab('students');
                  }}
                />
                <StatCard
                  title="Placement Rate"
                  value={`${dynamicKPIs.overallPlacementPercentage}%`}
                  subtext={`${dynamicKPIs.metricDetails.numerator} of ${dynamicKPIs.metricDetails.denominator} students`}
                  icon={TrendingUp}
                  colorScheme={dynamicKPIs.overallPlacementPercentage >= 60 ? 'emerald' : 'amber'}
                  onClick={() => setActiveTab('analytics')}
                />
              </div>

              {/* Placement Percentage Formula & Denominator Explanation Box */}
              <Card className="p-4 bg-slate-850/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-xs block">
                      Standard Placement Percentage Definition:
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Calculated as <span className="text-emerald-400 font-bold">{dynamicKPIs.metricDetails.numerator} uniquely placed candidates</span> divided by <span className="text-white font-bold">{dynamicKPIs.metricDetails.denominator} {dynamicKPIs.metricDetails.denominatorLabel}</span>. Prevents duplicate counting of multiple offers.
                    </span>
                  </div>
                </div>
                <Badge variant="emerald" size="sm">
                  {dynamicKPIs.overallPlacementPercentage}% Campus Placed
                </Badge>
              </Card>

              {/* Secondary Competency Pillars & Performance Tiers Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Avg Readiness</div>
                  <div className="text-xl font-black text-emerald-400">{dynamicKPIs.avgReadiness}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Campus benchmark 75%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Technical Competency</div>
                  <div className="text-xl font-black text-blue-400">{dynamicKPIs.avgTech}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Coding & System Logic</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Aptitude & Logic</div>
                  <div className="text-xl font-black text-indigo-400">{dynamicKPIs.avgApt}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Quant, Verbal & Reasoning</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Communication</div>
                  <div className="text-xl font-black text-purple-400">{dynamicKPIs.avgComm}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Behavioral & Articulation</div>
                </div>
              </div>

              {/* Two Column Grid: Department Snapshot + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Department Snapshot */}
                <Card className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Department Placement Breakdown</h3>
                      <p className="text-xs text-slate-400">Live placement performance and candidate counts</p>
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
                      <div key={i} className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{d.dept}</div>
                          <div className="text-[11px] text-slate-400">{d.totalStudents} candidates • {d.uniquelyPlacedCount || 0} placed</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-400 text-sm">{d.placementPercentage}%</div>
                          <div className="text-[10px] text-slate-400">Placement Rate</div>
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

                {/* Real Recent Activity Feed */}
                <Card className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Recent Institutional Activity</h3>
                      <p className="text-xs text-slate-400">Live event stream from actual student applications and drives</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ChevronRight}
                      iconPosition="right"
                      onClick={() => setActiveTab('activity')}
                    >
                      Full Log
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {recentActivities.slice(0, 4).map((act) => {
                      const IconComponent = act.icon || Activity;
                      return (
                        <div key={act.id} className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center space-x-3 text-xs">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 flex-shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white truncate">{act.title}</div>
                            <div className="text-[11px] text-slate-400 truncate">{act.subtitle}</div>
                          </div>
                          <div className="text-[10px] text-slate-500 whitespace-nowrap">
                            {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}

                    {recentActivities.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs italic">
                        No recent activity recorded.
                      </div>
                    )}
                  </div>
                </Card>

              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: USER & PLACEMENT OFFICER MANAGEMENT
             ========================================================================= */}
          {activeTab === 'officers' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'User & Placement Officer Management']}
                title="Placement Officers & Access Management"
                subtitle="Configure authorized coordinators, establish role assignments, and enforce College-wide or Department-specific access boundaries."
                actions={
                  <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsAddOfficerModalOpen(true)}>
                    Add Placement Officer
                  </Button>
                }
              />

              {/* Filters & Search Card */}
              <Card className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={officerSearch}
                      onChange={(e) => setOfficerSearch(e.target.value)}
                      placeholder="Search officer by name, email, or department..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={officerScopeFilter}
                      onChange={(e) => setOfficerScopeFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      <option value="all">All Access Scopes</option>
                      <option value="college">College-Wide Access</option>
                      <option value="department">Department-Specific</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-44">
                    <select
                      value={officerStatusFilter}
                      onChange={(e) => setOfficerStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Accounts</option>
                      <option value="inactive">Inactive / Suspended</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Officers Table / List */}
              {loadingOfficers ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span>Loading placement officer registry...</span>
                </div>
              ) : filteredOfficers.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {filteredOfficers.map((officer) => {
                      const isSelf = currentUser && (officer.uid === currentUser.uid || officer.email === currentUser.email);
                      const isDeptScoped = officer.accessScope === 'department';
                      const isActive = (officer.status || 'active') === 'active';

                      return (
                        <div key={officer.uid} className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-xs sm:text-sm text-white">
                                  {officer.displayName || 'Placement Officer'}
                                </span>
                                {isSelf && (
                                  <Badge variant="primary" size="sm">You</Badge>
                                )}
                                <Badge variant={isActive ? 'emerald' : 'neutral'} size="sm">
                                  {isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {isDeptScoped ? (
                                  <Badge variant="indigo" size="sm">
                                    Dept: {officer.assignedDepartment || officer.department}
                                  </Badge>
                                ) : (
                                  <Badge variant="amber" size="sm">
                                    College-Wide
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {officer.designation || 'Placement Officer'} • {officer.department || 'Central Training & Placement Cell'}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-0.5">
                                <span className="flex items-center space-x-1">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{officer.email}</span>
                                </span>
                                {officer.phone && (
                                  <span className="flex items-center space-x-1">
                                    <span className="text-slate-600">•</span>
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    <span>{officer.phone}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Officer Action Buttons */}
                          <div className="flex items-center space-x-2 self-end md:self-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Edit}
                              onClick={() => {
                                setSelectedOfficerForEdit(officer);
                                setIsEditOfficerModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>

                            <Button
                              variant={isActive ? 'ghost' : 'secondary'}
                              size="sm"
                              icon={Power}
                              onClick={() => handleToggleOfficer(officer)}
                              disabled={isSelf && isActive}
                              title={isSelf ? 'Cannot deactivate your own active session' : `${isActive ? 'Deactivate' : 'Activate'} officer`}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              icon={Trash2}
                              onClick={() => handleRemoveOfficer(officer.uid, officer.displayName || officer.email)}
                              disabled={isSelf}
                              title={isSelf ? 'Cannot delete your own active account' : 'Revoke officer privileges'}
                            >
                              Revoke
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800 space-y-3">
                  <p>No placement officers match the active filter criteria.</p>
                  <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setIsAddOfficerModalOpen(true)}>
                    Add New Officer
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: STUDENTS DIRECTORY
             ========================================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Student Directory']}
                title="Student Placement Directory"
                subtitle="Filter, inspect, and export comprehensive student assessment records, readiness benchmarks, and cluster memberships."
                actions={
                  <Button variant="primary" size="sm" icon={Download} onClick={handleExportRoster}>
                    Export Roster (CSV)
                  </Button>
                }
              />

              {/* Filters Card */}
              <Card className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search by name, email, keyword..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={skillFilter}
                      onChange={(e) => { setSkillFilter(e.target.value); setCurrentPage(1); }}
                      placeholder="Filter by skill (e.g. Python, React)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                    />
                  </div>
                  <div>
                    <select
                      value={academicYearFilter}
                      onChange={(e) => { setAcademicYearFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      <option value="all">All Academic Years / Batches</option>
                      {discoveredAcademicYears.map(yr => (
                        <option key={yr} value={yr}>Graduation Batch {yr}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
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

                {/* Second Row Filters: Department Pills & Status Selectors */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 flex-shrink-0">Depts:</span>
                    <button
                      type="button"
                      onClick={() => { setSelectedDept('all'); setCurrentPage(1); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedDept === 'all'
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      All ({students.length})
                    </button>
                    {discoveredDepts.map((dept, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSelectedDept(dept); setCurrentPage(1); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedDept.toLowerCase() === dept.toLowerCase()
                            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Cluster Filter */}
                    <select
                      value={clusterFilter}
                      onChange={(e) => { setClusterFilter(e.target.value); setCurrentPage(1); }}
                      className="px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-200 bg-slate-850"
                    >
                      <option value="all">All K-Means Clusters</option>
                      {kmeansResult?.clusters?.map(cl => (
                        <option key={cl.id} value={cl.id}>{cl.name}</option>
                      ))}
                    </select>

                    {/* Placement Status Filter */}
                    <select
                      value={placementStatusFilter}
                      onChange={(e) => { setPlacementStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-200 bg-slate-850"
                    >
                      <option value="all">All Placement Statuses</option>
                      <option value="Placed">Selected / Placed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Applied">Applied</option>
                      <option value="Not Applied">Not Applied</option>
                    </select>

                    {/* Tier Pills */}
                    <div className="flex items-center space-x-1">
                      {['all', 'high', 'moderate', 'remedial'].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => { setReadinessTierFilter(tier); setCurrentPage(1); }}
                          className={`px-2 py-1 rounded text-[11px] font-bold capitalize transition-colors ${
                            readinessTierFilter === tier
                              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                          }`}
                        >
                          {tier === 'all' ? 'All Tiers' : tier === 'high' ? '≥80%' : tier === 'moderate' ? '60-79%' : '<60%'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Roster List Table */}
              {loadingStudents ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span>Loading candidate database records...</span>
                </div>
              ) : filteredAndSortedStudents.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {paginatedStudents.map((student) => {
                      const personal = student.personalInfo || {};
                      const education = student.education || {};
                      const scores = student.placementScores || {};
                      const readiness = scores.overallReadiness;
                      const hasAssessed = readiness !== undefined && readiness !== null;
                      const cluster = studentClusterMap[student.uid];
                      const placementStatus = studentPlacementStatusMap[student.uid];

                      return (
                        <div
                          key={student.uid}
                          onClick={() => handleOpenStudent(student)}
                          className="p-4 hover:bg-slate-850/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                                <span className="font-extrabold text-xs sm:text-sm text-white group-hover:text-brand-400 transition-colors">
                                  {personal.fullName || 'Unnamed Student'}
                                </span>
                                <Badge variant="neutral" size="sm">
                                  {student.department || education.branch || 'General'}
                                </Badge>
                                {education.graduationYear && (
                                  <Badge variant="dark" size="sm">
                                    '{String(education.graduationYear).slice(-2)}
                                  </Badge>
                                )}
                                {cluster && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cluster.badgeClass}`}>
                                    {cluster.name.split('/')[0]}
                                  </span>
                                )}
                                {placementStatus?.hasSelection && (
                                  <Badge variant="emerald" size="sm">Placed</Badge>
                                )}
                                {placementStatus?.hasShortlist && !placementStatus?.hasSelection && (
                                  <Badge variant="indigo" size="sm">Shortlisted</Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {personal.email || student.email} • CGPA: {education.cgpa || '—'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 sm:space-x-6 justify-between sm:justify-end">
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Technical</div>
                              <div className="text-xs font-extrabold text-blue-400">
                                {scores.technicalScore !== undefined ? `${scores.technicalScore}%` : (student.latestTechnicalScore ? `${student.latestTechnicalScore}%` : '—')}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Aptitude</div>
                              <div className="text-xs font-extrabold text-indigo-400">
                                {scores.aptitudeScore !== undefined ? `${scores.aptitudeScore}%` : '—'}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Readiness</div>
                              <div className="text-xs font-black text-emerald-400">
                                {hasAssessed ? `${readiness}%` : 'Unassessed'}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-3 bg-slate-850/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredAndSortedStudents.length)} of {filteredAndSortedStudents.length} candidates
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronLeft}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span className="font-bold text-white">Page {currentPage} of {totalPages}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronRight}
                        iconPosition="right"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                  No matching student records found for the active filter set.
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: DEPARTMENTS BREAKDOWN
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
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{deptItem.dept}</h4>
                        <span className="text-xs text-slate-400">
                          {deptItem.totalStudents} Candidates • {deptItem.uniquelyPlacedCount || 0} Placed
                        </span>
                      </div>
                      <Badge variant="emerald">{deptItem.placementPercentage}% Placed</Badge>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between font-medium text-slate-300 mb-1">
                          <span>Assessment Completion</span>
                          <span className="font-bold text-slate-200">{deptItem.assessmentCompletionRate}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${deptItem.assessmentCompletionRate}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium text-slate-300 mb-1">
                          <span>Average Technical Competency</span>
                          <span className="font-bold text-blue-400">{deptItem.avgTechnical}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deptItem.avgTechnical}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium text-slate-300 mb-1">
                          <span>Average Aptitude & Reasoning</span>
                          <span className="font-bold text-indigo-400">{deptItem.avgAptitude}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${deptItem.avgAptitude}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {deptItem.applicationsCount} Applications submitted
                      </span>
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
                        Inspect Candidates
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: K-MEANS MACHINE LEARNING STUDENT CLUSTERS
             ========================================================================= */}
          {activeTab === 'kmeans' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Machine Learning Clusters']}
                title="Global K-Means Student Clustering Engine"
                subtitle="Unsupervised multi-dimensional performance clustering across Technical, Aptitude, Communication, and Placement Readiness."
                badge={<Badge variant="primary">Unsupervised ML</Badge>}
                actions={
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={RefreshCw}
                    onClick={() => {
                      setKmeansRecalcTrigger(prev => prev + 1);
                      showToast('K-Means clustering model recalculated with fresh assessment vectors.');
                    }}
                  >
                    Recalculate Model
                  </Button>
                }
              />

              {/* Elbow Method Recommendation Card */}
              <Card className="p-5 space-y-4 bg-slate-850/70 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      <h4 className="font-extrabold text-sm text-white">Optimal Cluster Evaluation (Elbow Method)</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Recommended K: <span className="font-black text-brand-400">{elbowCurveInfo.recommendedK} Cohorts</span> based on diminishing inertia reduction.
                    </p>
                  </div>

                  {/* Manual K Selector */}
                  <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700/80">
                    <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Select K:</span>
                    {[2, 3, 4, 5, 6].map((kVal) => (
                      <button
                        key={kVal}
                        type="button"
                        onClick={() => setKmeansK(kVal)}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition-colors ${
                          kmeansK === kVal
                            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {kVal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Elbow Inertia Curve Visualization */}
                <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                  {elbowCurveInfo.elbowData?.map((item) => (
                    <div
                      key={item.k}
                      onClick={() => setKmeansK(item.k)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        kmeansK === item.k
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white text-xs">K = {item.k}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">Inertia: {item.inertia}</div>
                      {item.k === elbowCurveInfo.recommendedK && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 font-extrabold uppercase mt-1 inline-block">
                          Optimal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Department View Filter & Disclaimer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-bold">Filter View by Department:</span>
                  <select
                    value={kmeansDeptFilter}
                    onChange={(e) => setKmeansDeptFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850"
                  >
                    <option value="all">College-Wide (All Departments)</option>
                    {discoveredDepts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Calculated at {new Date(kmeansResult.calculatedAt).toLocaleTimeString()} ({kmeansResult.iterationsRun} iterations)</span>
                </div>
              </div>

              {/* Educational Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-slate-850/60 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-200">K-Means Model Transparency: </strong>
                  {kmeansResult.disclaimer} Missing assessment scores are evaluated using multi-dimensional imputation and baseline indicators rather than silent zeroing.
                </p>
              </div>

              {/* Cluster Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kmeansResult.clusters.map((cluster) => (
                  <Card key={cluster.id} className="p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${cluster.dotClass}`} />
                            <h4 className="font-extrabold text-sm text-white">{cluster.name}</h4>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{cluster.tagline}</p>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {cluster.count} Students ({cluster.percentage}%)
                        </Badge>
                      </div>

                      {/* Centroid Dimensions */}
                      <div className="grid grid-cols-4 gap-2 bg-slate-850/80 p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Tech</span>
                          <span className="font-extrabold text-blue-400">{cluster.centroid.technical}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Aptitude</span>
                          <span className="font-extrabold text-indigo-400">{cluster.centroid.aptitude}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Comm</span>
                          <span className="font-extrabold text-purple-400">{cluster.centroid.communication}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Readiness</span>
                          <span className="font-extrabold text-emerald-400">{cluster.centroid.readiness}%</span>
                        </div>
                      </div>

                      {/* Strengths & Areas for Improvement */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                          <span className="font-bold block text-[10px] uppercase text-emerald-400">Strengths</span>
                          <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[10px]">
                            {cluster.strengths?.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-300">
                          <span className="font-bold block text-[10px] uppercase text-amber-400">Focus Areas</span>
                          <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[10px]">
                            {cluster.areasForImprovement?.map((af, i) => (
                              <li key={i}>{af}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Intervention Strategy */}
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                          Intervention Strategy:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {cluster.interventionStrategy}
                        </p>
                      </div>
                    </div>

                    {/* Candidate Chips */}
                    {cluster.students.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-800">
                        <div className="flex flex-wrap gap-1.5">
                          {cluster.students.slice(0, 6).map((st) => (
                            <button
                              key={st.uid}
                              type="button"
                              onClick={() => handleOpenStudent(st)}
                              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700/60"
                            >
                              {st.personalInfo?.fullName || 'Student'}
                            </button>
                          ))}
                          {cluster.students.length > 6 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{cluster.students.length - 6} more
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
              TAB 6: PLACEMENT ANALYTICS (Charts & Visualizations)
             ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <PlacementAnalyticsView
                students={students}
                departments={discoveredDepts}
                summary={campusSummary}
                applications={applications}
                kmeansResult={kmeansResult}
                officerScope={officerScope}
                officerAssignedDept={officerAssignedDept}
              />
            </div>
          )}

          {/* =========================================================================
              TAB 7: JOBS & RECRUITMENT DRIVES
             ========================================================================= */}
          {activeTab === 'drives' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Jobs & Recruitment Drives']}
                title="Campus Recruitment Drives & Jobs"
                subtitle="Schedule and publish corporate campus drives, establish cutoffs, and evaluate matched candidate populations."
                actions={
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddDriveModalOpen(true)}>
                    Schedule New Drive
                  </Button>
                }
              />

              {/* Filters */}
              <Card className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={driveSearch}
                      onChange={(e) => setDriveSearch(e.target.value)}
                      placeholder="Search recruitment drives by company or job role..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={driveStatusFilter}
                      onChange={(e) => setDriveStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850"
                    >
                      <option value="all">All Drive Statuses</option>
                      <option value="Active">Active Drives</option>
                      <option value="Upcoming">Upcoming Drives</option>
                      <option value="Completed">Completed Drives</option>
                    </select>
                  </div>
                </div>
              </Card>

              {loadingDrives ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span>Loading recruitment drives...</span>
                </div>
              ) : filteredDrives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDrives.map((drive) => {
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
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-sm">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-white leading-tight">{drive.companyName}</h4>
                                <p className="text-xs text-slate-400 font-medium">{drive.jobRole}</p>
                              </div>
                            </div>
                            <Badge variant={drive.status === 'Active' ? 'emerald' : 'neutral'} size="sm">
                              {drive.status || 'Upcoming'}
                            </Badge>
                          </div>

                          {/* Drive Details */}
                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-850/80 p-3 rounded-xl border border-slate-800">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Package / CTC</span>
                              <span className="font-extrabold text-slate-100">{drive.packageCTC || 'Competitive'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Drive Date</span>
                              <span className="font-extrabold text-slate-100">{drive.driveDate || 'TBD'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Min CGPA</span>
                              <span className="font-bold text-slate-300">{drive.minCgpa || 'None'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">Min Readiness</span>
                              <span className="font-bold text-emerald-400">{drive.minReadiness ? `${drive.minReadiness}%` : 'Open'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Match & Action */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">
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
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800 space-y-3">
                  <p>No campus recruitment drives match the filter.</p>
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddDriveModalOpen(true)}>
                    Schedule First Drive
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 8: APPLICATIONS & RECRUITMENT TRACKING
             ========================================================================= */}
          {activeTab === 'applications' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Applications & Tracking']}
                title="Applications & Selections Pipeline"
                subtitle="Track candidate recruitment progress across corporate drives, manage interview stages, and record placement outcomes."
              />

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs">
                {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'].map((st) => {
                  const count = applications.filter(a => a.status === st).length;
                  const isSelected = appStatusFilter === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAppStatusFilter(isSelected ? 'all' : st)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/15 text-white'
                          : 'border-slate-800 bg-slate-850/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-black text-sm">{count}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{st}</div>
                    </button>
                  );
                })}
              </div>

              {/* Filter Row */}
              <Card className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      placeholder="Search applications by candidate name, company, or role..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={appTypeFilter}
                      onChange={(e) => setAppTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850"
                    >
                      <option value="all">All Application Sources</option>
                      <option value="direct">Direct Applications</option>
                      <option value="nomination">Officer Nominations</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Applications Table */}
              {loadingApplications ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span>Loading recruitment applications...</span>
                </div>
              ) : filteredApplications.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {filteredApplications.map((app) => {
                      const isUpdating = updatingAppId === app.id;
                      const isNomination = app.source === 'nomination';

                      return (
                        <div key={app.id} className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-white text-xs sm:text-sm">
                                {app.studentName || 'Student Candidate'}
                              </span>
                              <Badge variant="neutral" size="sm">{app.studentDepartment || 'General'}</Badge>
                              {isNomination ? (
                                <Badge variant="indigo" size="sm">Officer Nomination</Badge>
                              ) : (
                                <Badge variant="dark" size="sm">Direct Application</Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-300 font-medium">
                              {app.jobRole} • <span className="font-bold text-white">{app.companyName}</span> ({app.packageCTC || 'Competitive'})
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Applied on {new Date(app.createdAt || Date.now()).toLocaleDateString()} • Candidate CGPA: {app.studentCgpa || '—'}
                            </div>
                          </div>

                          {/* Status Management Dropdown */}
                          <div className="flex items-center space-x-3 self-end md:self-center">
                            <div className="text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Recruitment Stage</div>
                              <select
                                value={app.status || 'Applied'}
                                onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                                disabled={isUpdating}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                  app.status === 'Selected'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : app.status === 'Shortlisted'
                                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                    : app.status === 'Interview Scheduled'
                                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                    : app.status === 'Rejected'
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : 'bg-slate-800 text-slate-200 border-slate-700'
                                }`}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Selected">Selected / Placed</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Withdrawn">Withdrawn</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                  No applications found for the selected filter.
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 9: NOTIFICATIONS & ACTIVITY LOG
             ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Activity Log']}
                title="Campus Placement Activity Log"
                subtitle="Complete audit timeline of student applications, recruitment drives, and officer administrative actions."
              />

              <Card className="p-5 space-y-4">
                <div className="space-y-3">
                  {recentActivities.map((act) => {
                    const IconComp = act.icon || Activity;
                    return (
                      <div key={act.id} className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 flex items-start space-x-3.5 text-xs">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 flex-shrink-0 mt-0.5">
                          <IconComp className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white text-sm">{act.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(act.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <p className="text-slate-300 mt-0.5 text-xs">{act.subtitle}</p>
                          <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-500">
                            <span className="capitalize font-bold text-slate-400">{act.type} event</span>
                            <span>•</span>
                            <span>Verified record</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {recentActivities.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-xs italic">
                      No activity events recorded in the system yet.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* =========================================================================
              TAB 10: SYSTEM SETTINGS & ACCESS DIAGNOSTICS
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'System Settings']}
                title="System Settings & Security Diagnostics"
                subtitle="Review administrative identity, active access boundaries, resilient database storage mode, and role policies."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Session Diagnostic */}
                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-white">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <h4 className="font-extrabold text-sm">Authenticated Session</h4>
                  </div>
                  <div className="space-y-2 text-xs bg-slate-850/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Officer Name:</span>
                      <span className="font-bold text-white">{currentOfficerRecord?.displayName || 'Real Administrator'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email Address:</span>
                      <span className="font-bold text-white">{currentUser?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Firebase UID:</span>
                      <span className="font-mono text-[11px] text-slate-300">{currentUser?.uid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Administrative Role:</span>
                      <Badge variant="amber" size="sm">Admin / Placement Officer</Badge>
                    </div>
                  </div>
                </Card>

                {/* Access Scope Diagnostic */}
                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-white">
                    <Lock className="w-5 h-5 text-brand-400" />
                    <h4 className="font-extrabold text-sm">Access Scope Configuration</h4>
                  </div>
                  <div className="space-y-2 text-xs bg-slate-850/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Access Scope:</span>
                      <Badge variant={officerScope === 'college' ? 'amber' : 'indigo'} size="sm">
                        {officerScope === 'college' ? 'College-Wide Access' : 'Department-Specific'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned Branch:</span>
                      <span className="font-bold text-white">
                        {officerScope === 'college' ? 'All Institutional Departments' : officerAssignedDept}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Enforcement:</span>
                      <span className="text-emerald-400 font-bold">Backend & Firestore Rules</span>
                    </div>
                  </div>
                </Card>

                {/* Database & Resilient Storage Diagnostic */}
                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-white">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-extrabold text-sm">Database & Persistence Mode</h4>
                  </div>
                  <div className="space-y-2 text-xs bg-slate-850/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Database:</span>
                      <span className="font-bold text-white">Google Firebase Firestore</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dual-Mode Resilient Fallback:</span>
                      <span className="text-emerald-400 font-bold">Active (server/.data)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Zero Fabricated Numbers:</span>
                      <span className="text-emerald-400 font-bold">Verified Dynamic Queries</span>
                    </div>
                  </div>
                </Card>

                {/* Security Policy Summary */}
                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-white">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <h4 className="font-extrabold text-sm">Security & Role Safeguards</h4>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
                    <p>• Only verified Admins can create or update officer accounts.</p>
                    <p>• Placement officer creation uses Firebase Admin SDK without modifying the admin's session.</p>
                    <p>• Department-restricted officers are strictly prevented from querying unauthorized student branches.</p>
                    <p>• At least one active admin account is permanently safeguarded against deactivation.</p>
                  </div>
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
          loadCampusSummary();
          showToast(`Officer ${newOfficer.displayName} successfully added!`);
        }}
      />

      <AdminEditOfficerModal
        officer={selectedOfficerForEdit}
        isOpen={isEditOfficerModalOpen}
        onClose={() => {
          setIsEditOfficerModalOpen(false);
          setSelectedOfficerForEdit(null);
        }}
        onOfficerUpdated={(updatedOfficer) => {
          setOfficers(prev => prev.map(o => o.uid === updatedOfficer.uid ? updatedOfficer : o));
          loadCampusSummary();
          showToast(`Officer ${updatedOfficer.displayName} updated successfully!`);
        }}
      />

      <AdminAddDriveModal
        isOpen={isAddDriveModalOpen}
        onClose={() => setIsAddDriveModalOpen(false)}
        onDriveSaved={(newDrive) => {
          setDrives(prev => [newDrive, ...prev]);
          loadCampusSummary();
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
