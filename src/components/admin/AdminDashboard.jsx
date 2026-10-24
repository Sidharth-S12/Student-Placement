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
  updateApplicationStatus,
  fetchAdminCompanies,
  reviewCompany,
  fetchAdminJobs,
  reviewJob
} from '../../services/adminService';
import {
  exportStudentsToCSV,
  exportKMeansGroupsToCSV,
  exportSingleGroupToCSV,
  exportFilteredStudentsWithGroupsToCSV
} from '../../utils/exportCsv';
import { runKMeansClustering, fetchKMeansFromPython } from '../../utils/kmeansClustering';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';
import { AdminAddOfficerModal } from './AdminAddOfficerModal';
import { AdminEditOfficerModal } from './AdminEditOfficerModal';
import { AdminAddDriveModal } from './AdminAddDriveModal';
import { AdminCompanyReviewModal } from './AdminCompanyReviewModal';
import { AdminJobRoleReviewModal } from './AdminJobRoleReviewModal';
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
  FileSpreadsheet,
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
  Database,
  LayoutGrid,
  Table,
  ArrowUpDown,
  GraduationCap
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();

  // Navigation tab state: 6 dedicated sections
  // 'overview' | 'officers' | 'students' | 'departments' | 'kmeans' | 'drives'
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

  // Jobs & Companies Sub-navigation and Approvals
  const [jobsCompaniesSubTab, setJobsCompaniesSubTab] = useState('drives'); // 'drives' | 'company_approvals' | 'job_approvals'

  // Company Approvals Management States
  const [adminCompanies, setAdminCompanies] = useState([]);
  const [companyCounts, setCompanyCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [companyStatusFilter, setCompanyStatusFilter] = useState('all');
  const [selectedCompanyForReview, setSelectedCompanyForReview] = useState(null);
  const [isCompanyReviewModalOpen, setIsCompanyReviewModalOpen] = useState(false);

  // Job Role Approvals Management States
  const [adminJobs, setAdminJobs] = useState([]);
  const [jobCounts, setJobCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobReviewSearch, setJobReviewSearch] = useState('');
  const [jobReviewStatusFilter, setJobReviewStatusFilter] = useState('all');
  const [selectedJobForReview, setSelectedJobForReview] = useState(null);
  const [isJobReviewModalOpen, setIsJobReviewModalOpen] = useState(false);

  // Applications Tracker Filter States
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appTypeFilter, setAppTypeFilter] = useState('all');

  // Student Readiness Groups Configuration States (Python ML Engine)
  const [kmeansDeptFilter, setKmeansDeptFilter] = useState('all');
  const [kmeansGroupFilter, setKmeansGroupFilter] = useState('all');
  const [currentKmeansPage, setCurrentKmeansPage] = useState(1);
  const [isRefreshingKmeans, setIsRefreshingKmeans] = useState(false);
  const [kmeansError, setKmeansError] = useState(null);
  const [kmeansRecalcTrigger, setKmeansRecalcTrigger] = useState(0);
  const [pythonKmeansResult, setPythonKmeansResult] = useState(null);
  const [isPythonLoading, setIsPythonLoading] = useState(false);

  // Department Analytics View States
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [deptViewMode, setDeptViewMode] = useState('cards'); // 'cards' | 'table'
  const [deptSortBy, setDeptSortBy] = useState('placement'); // 'placement' | 'students' | 'readiness' | 'name'

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

  // 6. Fetch Admin Companies
  const loadAdminCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const res = await fetchAdminCompanies({
        status: companyStatusFilter,
        search: companySearch
      });
      setAdminCompanies(res.companies || []);
      setCompanyCounts(res.counts || {});
    } catch (err) {
      console.error('Failed to load companies for review:', err);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // 7. Fetch Admin Jobs for Review
  const loadAdminJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetchAdminJobs({
        status: jobReviewStatusFilter,
        search: jobReviewSearch
      });
      setAdminJobs(res.jobs || []);
      setJobCounts(res.counts || {});
    } catch (err) {
      console.error('Failed to load jobs for review:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadStudents();
    loadOfficers();
    loadDrives();
    loadApplications();
    loadCampusSummary();
    loadAdminCompanies();
    loadAdminJobs();
  }, []);

  // Reload companies on filter change
  useEffect(() => {
    loadAdminCompanies();
  }, [companyStatusFilter, companySearch]);

  // Reload jobs on filter change
  useEffect(() => {
    loadAdminJobs();
  }, [jobReviewStatusFilter, jobReviewSearch]);

  // Handle Company Review Submission
  const handleReviewCompanySubmit = async (companyId, { status, reason }) => {
    await reviewCompany(companyId, { status, reason });
    await loadAdminCompanies();
    await loadCampusSummary();
    showToast(status === 'approved' ? 'Company registration approved successfully!' : 'Company registration rejected.');
  };

  // Handle Job Role Review Submission
  const handleReviewJobSubmit = async (jobId, { status, reason }) => {
    await reviewJob(jobId, { status, reason });
    await loadAdminJobs();
    await loadDrives();
    await loadAdminCompanies();
    await loadCampusSummary();
    showToast(status === 'approved' ? 'Job role approved and published to students!' : 'Job role rejected with officer notes.');
  };

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

  // Synchronous client fallback clustering (8 groups)
  const syncKmeansResult = useMemo(() => {
    const studentsToCluster = kmeansDeptFilter === 'all'
      ? students
      : students.filter(s => (s.department || '').toLowerCase() === kmeansDeptFilter.toLowerCase());

    return runKMeansClustering(studentsToCluster, 8);
  }, [students, kmeansDeptFilter, kmeansRecalcTrigger]);

  // Asynchronous execution via Python Machine Learning Backend
  useEffect(() => {
    let isMounted = true;
    const studentsToCluster = kmeansDeptFilter === 'all'
      ? students
      : students.filter(s => (s.department || '').toLowerCase() === kmeansDeptFilter.toLowerCase());

    setIsPythonLoading(true);
    fetchKMeansFromPython(studentsToCluster)
      .then((pyResult) => {
        if (isMounted && pyResult && Array.isArray(pyResult.clusters) && pyResult.clusters.length > 0) {
          setPythonKmeansResult(pyResult);
        }
      })
      .catch((err) => {
        console.warn('[AdminDashboard:PythonKMeans] Falling back to client algorithm:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsPythonLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [students, kmeansDeptFilter, kmeansRecalcTrigger]);

  // Primary active K-Means dataset (Python ML output prioritized)
  const kmeansResult = pythonKmeansResult || syncKmeansResult;

  // Map student UID to cluster for filtering and badges
  const studentClusterMap = useMemo(() => {
    const map = {};
    if (kmeansResult && kmeansResult.clusters) {
      kmeansResult.clusters.forEach((c, cIdx) => {
        const groupNum = c.clusterIndex !== undefined ? c.clusterIndex + 1 : cIdx + 1;
        c.students.forEach(st => {
          map[st.uid] = {
            id: c.id,
            name: c.name,
            color: c.color,
            dotClass: c.dotClass,
            badgeClass: c.badgeClass,
            groupNumber: groupNum,
            clusterIndex: c.clusterIndex !== undefined ? c.clusterIndex : cIdx,
            recommendedAction: c.recommendedAction,
            targetPersona: c.targetPersona
          };
        });
      });
    }
    return map;
  }, [kmeansResult]);

  // Filtered students for the Readiness Groups table
  const filteredGroupStudents = useMemo(() => {
    return students.filter(st => {
      if (kmeansDeptFilter !== 'all' && (st.department || '').toLowerCase() !== kmeansDeptFilter.toLowerCase()) {
        return false;
      }
      if (kmeansGroupFilter !== 'all') {
        const studentCluster = studentClusterMap[st.uid];
        if (!studentCluster || (studentCluster.id !== kmeansGroupFilter && studentCluster.name !== kmeansGroupFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [students, kmeansDeptFilter, kmeansGroupFilter, studentClusterMap]);

  const kmeansPageSize = 10;
  const totalKmeansPages = Math.max(1, Math.ceil(filteredGroupStudents.length / kmeansPageSize));
  const paginatedKmeansStudents = useMemo(() => {
    const start = (currentKmeansPage - 1) * kmeansPageSize;
    return filteredGroupStudents.slice(start, start + kmeansPageSize);
  }, [filteredGroupStudents, currentKmeansPage]);

  const handleRefreshGroups = async () => {
    setIsRefreshingKmeans(true);
    setKmeansError(null);
    try {
      const data = await fetchAllStudents({
        department: 'all',
        search: '',
        skill: ''
      });
      if (data && Array.isArray(data.students)) {
        setStudents(data.students);
        if (data.departments && data.departments.length > 0) {
          setDiscoveredDepts(data.departments);
        }
      }
      setKmeansRecalcTrigger(prev => prev + 1);
      showToast('Student Readiness Groups refreshed with latest assessment scores.');
    } catch (err) {
      console.error('[AdminDashboard:handleRefreshGroups] Error:', err);
      setKmeansError('Failed to refresh student readiness groups. Please check network connection and try again.');
    } finally {
      setIsRefreshingKmeans(false);
    }
  };

  const handleSelectGroupFilter = (groupId) => {
    setKmeansGroupFilter(groupId);
    setCurrentKmeansPage(1);
    const tableEl = document.getElementById('student-readiness-table');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  // Department-wise Breakdown with accurate calculations
  const departmentBreakdown = useMemo(() => {
    // Identify uniquely placed candidates across applications and profiles
    const selectedStudentUids = new Set();
    const selectedStudentEmails = new Set();
    const selectedStudentNames = new Set();

    applications.forEach(app => {
      const st = (app.status || '').toLowerCase();
      if (st === 'selected' || st === 'hired' || st === 'offer accepted') {
        if (app.studentId) selectedStudentUids.add(app.studentId);
        if (app.studentEmail) selectedStudentEmails.add(app.studentEmail.toLowerCase().trim());
        if (app.studentName) selectedStudentNames.add(app.studentName.toLowerCase().trim());
      }
    });

    const isStudentPlaced = (s) => {
      const email = (s.personalInfo?.email || s.email || '').toLowerCase().trim();
      const name = (s.personalInfo?.fullName || s.displayName || '').toLowerCase().trim();
      const pStatus = (s.placementStatus || '').toLowerCase();
      return pStatus === 'placed' ||
             selectedStudentUids.has(s.uid) ||
             selectedStudentUids.has(s.studentId) ||
             (email && selectedStudentEmails.has(email)) ||
             (name && selectedStudentNames.has(name));
    };

    // Discover departments from students and discoveredDepts
    const deptsSet = new Set(discoveredDepts);
    students.forEach(s => {
      const d = s.department || s.education?.branch || 'Other';
      if (d) deptsSet.add(d);
    });

    const deptMap = {};
    Array.from(deptsSet).forEach(d => {
      deptMap[d] = {
        dept: d,
        totalStudents: 0,
        placedCount: 0,
        assessedStudentsCount: 0,
        totalTech: 0,
        techCount: 0,
        totalApt: 0,
        aptCount: 0,
        totalComm: 0,
        commCount: 0,
        totalReadiness: 0,
        readinessCount: 0,
        totalCgpa: 0,
        cgpaCount: 0,
        applicationsCount: 0,
        shortlistedCount: 0,
        selectedOffersCount: 0,
        cohortCounts: {}
      };
    });

    students.forEach(s => {
      const d = s.department || s.education?.branch || 'Other';
      if (!deptMap[d]) {
        deptMap[d] = {
          dept: d,
          totalStudents: 0,
          placedCount: 0,
          assessedStudentsCount: 0,
          totalTech: 0,
          techCount: 0,
          totalApt: 0,
          aptCount: 0,
          totalComm: 0,
          commCount: 0,
          totalReadiness: 0,
          readinessCount: 0,
          totalCgpa: 0,
          cgpaCount: 0,
          applicationsCount: 0,
          shortlistedCount: 0,
          selectedOffersCount: 0,
          cohortCounts: {}
        };
      }

      deptMap[d].totalStudents++;

      const rawTech = s.placementScores?.technicalScore ?? s.latestTechnicalScore ?? s.technicalScore ?? null;
      const rawApt = s.placementScores?.aptitudeScore ?? s.latestAptitudeAssessment?.score ?? s.aptitudeScore ?? null;
      const rawComm = s.placementScores?.communicationScore ?? s.latestCommunicationAssessment?.score ?? s.communicationScore ?? null;
      const rawReadiness = s.placementScores?.overallReadiness ?? s.overallReadiness ?? null;
      const rawCgpa = (s.education?.cgpa !== undefined && s.education?.cgpa !== null && !isNaN(Number(s.education.cgpa)))
        ? Number(s.education.cgpa)
        : (s.cgpa !== undefined && s.cgpa !== null && !isNaN(Number(s.cgpa)) ? Number(s.cgpa) : null);

      let hasAssessed = false;
      if (rawTech !== null) {
        deptMap[d].totalTech += Number(rawTech);
        deptMap[d].techCount++;
        hasAssessed = true;
      }
      if (rawApt !== null) {
        deptMap[d].totalApt += Number(rawApt);
        deptMap[d].aptCount++;
        hasAssessed = true;
      }
      if (rawComm !== null) {
        deptMap[d].totalComm += Number(rawComm);
        deptMap[d].commCount++;
        hasAssessed = true;
      }
      if (rawReadiness !== null) {
        deptMap[d].totalReadiness += Number(rawReadiness);
        deptMap[d].readinessCount++;
      }
      if (rawCgpa !== null) {
        deptMap[d].totalCgpa += Number(rawCgpa);
        deptMap[d].cgpaCount++;
      }
      if (hasAssessed || s.latestAssessmentId) {
        deptMap[d].assessedStudentsCount++;
      }

      if (isStudentPlaced(s)) {
        deptMap[d].placedCount++;
      }

      // Check student's cluster in studentClusterMap
      const cluster = studentClusterMap[s.uid];
      if (cluster && cluster.name) {
        deptMap[d].cohortCounts[cluster.name] = (deptMap[d].cohortCounts[cluster.name] || 0) + 1;
      }
    });

    applications.forEach(app => {
      const candidate = students.find(s => s.uid === app.studentId || (s.personalInfo?.email && app.studentEmail && s.personalInfo.email.toLowerCase() === app.studentEmail.toLowerCase()));
      const d = candidate?.department || candidate?.education?.branch || app.studentDepartment || 'Other';
      if (deptMap[d]) {
        deptMap[d].applicationsCount++;
        const st = (app.status || '').toLowerCase();
        if (st === 'shortlisted' || st === 'interview scheduled' || st === 'under review') {
          deptMap[d].shortlistedCount++;
        }
        if (st === 'selected' || st === 'hired' || st === 'offer accepted') {
          deptMap[d].selectedOffersCount++;
        }
      }
    });

    return Object.values(deptMap).map(d => {
      const placed = Math.min(d.totalStudents, d.placedCount);
      const rate = d.totalStudents > 0 ? Math.min(100, Math.round((placed / d.totalStudents) * 100)) : 0;
      const unplaced = Math.max(0, d.totalStudents - placed);
      const coverage = d.totalStudents > 0 ? Math.min(100, Math.round((d.assessedStudentsCount / d.totalStudents) * 100)) : 0;
      const inProcess = Math.min(unplaced, d.shortlistedCount > 0 ? Math.min(unplaced, d.shortlistedCount) : (d.applicationsCount > 0 ? Math.min(unplaced, 1) : 0));

      return {
        dept: d.dept,
        totalStudents: d.totalStudents,
        uniquelyPlacedCount: placed,
        placementPercentage: rate,
        unplacedCount: unplaced,
        inProcessCount: inProcess,
        assessmentCompletedCount: d.assessedStudentsCount,
        assessmentCompletionRate: coverage,
        avgTechnical: d.techCount > 0 ? Math.round(d.totalTech / d.techCount) : null,
        techAssessedCount: d.techCount,
        avgAptitude: d.aptCount > 0 ? Math.round(d.totalApt / d.aptCount) : null,
        aptAssessedCount: d.aptCount,
        avgCommunication: d.commCount > 0 ? Math.round(d.totalComm / d.commCount) : null,
        commAssessedCount: d.commCount,
        avgReadiness: d.readinessCount > 0 ? Math.round(d.totalReadiness / d.readinessCount) : null,
        readinessCount: d.readinessCount,
        avgCGPA: d.cgpaCount > 0 ? Number((d.totalCgpa / d.cgpaCount).toFixed(2)) : null,
        applicationsCount: d.applicationsCount,
        shortlistedCount: d.shortlistedCount,
        selectedOffersCount: d.selectedOffersCount,
        cohortCounts: d.cohortCounts
      };
    }).filter(d => d.totalStudents > 0 || discoveredDepts.includes(d.dept))
      .sort((a, b) => b.totalStudents - a.totalStudents);
  }, [students, applications, discoveredDepts, studentClusterMap]);

  // Filtered & Sorted Departments
  const filteredDepartments = useMemo(() => {
    let list = [...departmentBreakdown];
    if (deptSearchQuery.trim()) {
      const q = deptSearchQuery.trim().toLowerCase();
      list = list.filter(d => d.dept.toLowerCase().includes(q));
    }

    if (deptSortBy === 'placement') {
      list.sort((a, b) => b.placementPercentage - a.placementPercentage || b.totalStudents - a.totalStudents);
    } else if (deptSortBy === 'students') {
      list.sort((a, b) => b.totalStudents - a.totalStudents || b.placementPercentage - a.placementPercentage);
    } else if (deptSortBy === 'readiness') {
      list.sort((a, b) => (b.avgReadiness || 0) - (a.avgReadiness || 0));
    } else if (deptSortBy === 'name') {
      list.sort((a, b) => a.dept.localeCompare(b.dept));
    }
    return list;
  }, [departmentBreakdown, deptSearchQuery, deptSortBy]);

  // College-Wide Academic Diagnostics
  const departmentDiagnostics = useMemo(() => {
    const totalDepts = departmentBreakdown.length;
    const totalEnrolled = departmentBreakdown.reduce((acc, d) => acc + d.totalStudents, 0);
    const totalPlaced = departmentBreakdown.reduce((acc, d) => acc + d.uniquelyPlacedCount, 0);
    const collegePlacementRate = totalEnrolled > 0 ? Math.min(100, Math.round((totalPlaced / totalEnrolled) * 100)) : 0;
    const totalAssessed = departmentBreakdown.reduce((acc, d) => acc + d.assessmentCompletedCount, 0);
    const collegeAssessmentCoverage = totalEnrolled > 0 ? Math.min(100, Math.round((totalAssessed / totalEnrolled) * 100)) : 0;

    const activeDepts = departmentBreakdown.filter(d => d.totalStudents > 0);
    const topPlacedDept = [...activeDepts].sort((a, b) => b.placementPercentage - a.placementPercentage)[0];
    const topReadinessDept = [...activeDepts].sort((a, b) => (b.avgReadiness || 0) - (a.avgReadiness || 0))[0];

    return {
      totalDepts,
      totalEnrolled,
      totalPlaced,
      collegePlacementRate,
      collegeAssessmentCoverage,
      topPlacedDept,
      topReadinessDept
    };
  }, [departmentBreakdown]);

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

  // Export All K-Means Readiness Groups to Excel (.csv) with Group Numbers
  const handleExportAllKMeansGroups = () => {
    if (!kmeansResult?.clusters || kmeansResult.clusters.length === 0) {
      showToast('No student readiness groups available to export.');
      return;
    }
    const success = exportKMeansGroupsToCSV(
      kmeansResult.clusters,
      `Student_Readiness_Groups_Training_Roster_${new Date().toISOString().slice(0, 10)}.csv`,
      { departmentFilter: kmeansDeptFilter }
    );
    if (success) {
      const deptSuffix = kmeansDeptFilter !== 'all' ? ` for ${kmeansDeptFilter}` : '';
      showToast(`Training groups Excel exported successfully${deptSuffix}!`);
    }
  };

  // Export a Single Cluster Group to Excel (.csv)
  const handleExportSingleKMeansGroup = (cluster) => {
    const success = exportSingleGroupToCSV(cluster);
    if (success) {
      const groupNum = cluster.clusterIndex !== undefined ? cluster.clusterIndex + 1 : '';
      showToast(`Group ${groupNum} (${cluster.name}) training roster exported to Excel!`);
    }
  };

  // Export current students shown in Readiness Table to Excel (.csv)
  const handleExportReadinessTable = () => {
    if (!filteredGroupStudents || filteredGroupStudents.length === 0) {
      showToast('No students to export in current table view.');
      return;
    }
    const success = exportFilteredStudentsWithGroupsToCSV(
      filteredGroupStudents,
      studentClusterMap,
      `Student_Readiness_Directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    if (success) {
      showToast(`Exported ${filteredGroupStudents.length} students to Excel.`);
    }
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
              { id: 'kmeans', label: 'Readiness Groups', icon: Brain, badgeText: `${kmeansResult?.clusters?.length || 8} Groups` },
              {
                id: 'drives',
                label: 'Jobs & Companies',
                icon: Briefcase,
                badge: ((companyCounts?.pending || 0) + (jobCounts?.pending || 0)) > 0
                  ? `${(companyCounts?.pending || 0) + (jobCounts?.pending || 0)} pending`
                  : drives.length
              }
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
                  onClick={() => setActiveTab('drives')}
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
                  onClick={() => setActiveTab('students')}
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
                    <Badge variant="neutral" size="sm" className="bg-slate-800 text-slate-300 border-slate-700">
                      Live Feed
                    </Badge>
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
              TAB 4: ACADEMIC DEPARTMENTS PERFORMANCE & BENCHMARKS
             ========================================================================= */}
          {activeTab === 'departments' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Title and Interactive View / Filter Controls */}
              <PageHeader
                breadcrumb={['Admin Portal', 'Departments']}
                title="Academic Department Performance"
                subtitle="Live comparative placement outcomes, assessed competencies, and cohort distributions across academic branches."
                actions={
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex items-center p-1 bg-slate-850 rounded-xl border border-slate-750">
                      <button
                        type="button"
                        onClick={() => setDeptViewMode('cards')}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          deptViewMode === 'cards'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Card Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Cards</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeptViewMode('table')}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          deptViewMode === 'table'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Comparative Table View"
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Matrix</span>
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center space-x-1 bg-slate-850 px-2.5 py-1.5 rounded-xl border border-slate-750 text-xs">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={deptSortBy}
                        onChange={(e) => setDeptSortBy(e.target.value)}
                        className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="placement">Sort: Placement Rate</option>
                        <option value="students">Sort: Most Students</option>
                        <option value="readiness">Sort: Highest Readiness</option>
                        <option value="name">Sort: Branch (A-Z)</option>
                      </select>
                    </div>
                  </div>
                }
              />

              {/* College-Wide Academic Diagnostics (Top 4 Summary Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Academic Branches"
                  value={departmentDiagnostics.totalDepts}
                  subtext={`${departmentDiagnostics.totalEnrolled} total registered candidates`}
                  icon={Building2}
                  colorScheme="brand"
                />
                <StatCard
                  title="College Placement Rate"
                  value={`${departmentDiagnostics.collegePlacementRate}%`}
                  subtext={`${departmentDiagnostics.totalPlaced} of ${departmentDiagnostics.totalEnrolled} placed uniquely`}
                  icon={TrendingUp}
                  colorScheme={departmentDiagnostics.collegePlacementRate >= 60 ? 'emerald' : 'amber'}
                />
                <StatCard
                  title="Top Performing Branch"
                  value={departmentDiagnostics.topPlacedDept ? departmentDiagnostics.topPlacedDept.dept : '—'}
                  subtext={
                    departmentDiagnostics.topPlacedDept
                      ? `${departmentDiagnostics.topPlacedDept.placementPercentage}% placed (${departmentDiagnostics.topPlacedDept.uniquelyPlacedCount}/${departmentDiagnostics.topPlacedDept.totalStudents})`
                      : 'Awaiting placement records'
                  }
                  icon={Award}
                  colorScheme="emerald"
                />
                <StatCard
                  title="Assessment Coverage"
                  value={`${departmentDiagnostics.collegeAssessmentCoverage}%`}
                  subtext="Candidates with completed assessments"
                  icon={Brain}
                  colorScheme="purple"
                />
              </div>

              {/* Search & Active Department Filter Bar */}
              <Card className="p-4 bg-slate-850/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by branch name or code (e.g., CSE, AI & DS)..."
                    value={deptSearchQuery}
                    onChange={(e) => setDeptSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  {deptSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDeptSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400 justify-end">
                  <span>
                    Showing <strong className="text-white">{filteredDepartments.length}</strong> of{' '}
                    <strong className="text-white">{departmentBreakdown.length}</strong> branches
                  </span>
                  {deptSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDeptSearchQuery('')}
                      className="text-brand-400 hover:text-brand-300 font-bold ml-2 underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </Card>

              {/* View Mode 1: CARDS (Grid View) */}
              {deptViewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDepartments.map((deptItem) => {
                    const cohorts = Object.entries(deptItem.cohortCounts || {});
                    return (
                      <Card
                        key={deptItem.dept}
                        className="p-5 flex flex-col justify-between border border-slate-800 bg-slate-900/95 hover:border-slate-700 transition-all space-y-4"
                      >
                        <div className="space-y-4">
                          {/* Branch Header */}
                          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 font-extrabold text-xs">
                                {deptItem.dept.slice(0, 4)}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-white leading-tight">
                                  {deptItem.dept}
                                </h4>
                                <span className="text-xs text-slate-400">
                                  {deptItem.totalStudents} Enrolled Candidate{deptItem.totalStudents === 1 ? '' : 's'}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                deptItem.placementPercentage >= 60
                                  ? 'emerald'
                                  : deptItem.placementPercentage > 0
                                  ? 'amber'
                                  : 'neutral'
                              }
                              size="sm"
                              className="font-bold flex-shrink-0"
                            >
                              {deptItem.placementPercentage}% Placed
                            </Badge>
                          </div>

                          {/* Visual Placement Funnel Bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-medium text-slate-300">
                              <span>Placement Distribution</span>
                              <span className="font-bold text-white">
                                {deptItem.uniquelyPlacedCount} of {deptItem.totalStudents} placed
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-slate-800 flex overflow-hidden shadow-inner">
                              {deptItem.totalStudents > 0 ? (
                                <>
                                  <div
                                    style={{
                                      width: `${(deptItem.uniquelyPlacedCount / deptItem.totalStudents) * 100}%`
                                    }}
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    title={`Placed: ${deptItem.uniquelyPlacedCount} candidates`}
                                  />
                                  <div
                                    style={{
                                      width: `${(deptItem.inProcessCount / deptItem.totalStudents) * 100}%`
                                    }}
                                    className="h-full bg-indigo-500 transition-all duration-500"
                                    title={`In Process: ${deptItem.inProcessCount} candidates`}
                                  />
                                  <div
                                    style={{
                                      width: `${(deptItem.unplacedCount / deptItem.totalStudents) * 100}%`
                                    }}
                                    className="h-full bg-slate-750 transition-all duration-500"
                                    title={`Open / Unplaced: ${deptItem.unplacedCount} candidates`}
                                  />
                                </>
                              ) : null}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                              <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                <span>Placed: {deptItem.uniquelyPlacedCount}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                                <span>In Process: {deptItem.inProcessCount}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                                <span>Open: {deptItem.unplacedCount}</span>
                              </span>
                            </div>
                          </div>

                          {/* 4-Box Key Metrics Grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Avg Readiness
                              </span>
                              <span
                                className={`text-sm font-extrabold font-mono ${
                                  deptItem.avgReadiness === null
                                    ? 'text-slate-500'
                                    : deptItem.avgReadiness >= 75
                                    ? 'text-emerald-400'
                                    : deptItem.avgReadiness >= 60
                                    ? 'text-blue-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {deptItem.avgReadiness !== null ? `${deptItem.avgReadiness}%` : '—'}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {deptItem.readinessCount} assessed
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Average CGPA
                              </span>
                              <span className="text-sm font-extrabold font-mono text-white">
                                {deptItem.avgCGPA !== null ? deptItem.avgCGPA.toFixed(2) : '—'}
                              </span>
                              <span className="text-[10px] text-slate-500 block">Scale 10.0</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Assessed Rate
                              </span>
                              <span className="text-sm font-extrabold font-mono text-purple-300">
                                {deptItem.assessmentCompletionRate}%
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                {deptItem.assessmentCompletedCount} of {deptItem.totalStudents} tests
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Applications
                              </span>
                              <span className="text-sm font-extrabold font-mono text-cyan-300">
                                {deptItem.applicationsCount}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                {deptItem.shortlistedCount} shortlisted
                              </span>
                            </div>
                          </div>

                          {/* Assessed Competency Breakdown (Real Authenticated Averages) */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                              Assessment Pillar Averages
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-center text-xs">
                              <div>
                                <span className="text-[9px] uppercase font-semibold text-slate-500 block">Tech</span>
                                <span className="font-mono font-bold text-blue-400 text-xs">
                                  {deptItem.avgTechnical !== null ? `${deptItem.avgTechnical}%` : '—'}
                                </span>
                                <span className="text-[9px] text-slate-500 block font-mono">
                                  {deptItem.techAssessedCount}/{deptItem.totalStudents}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-semibold text-slate-500 block">Aptitude</span>
                                <span className="font-mono font-bold text-indigo-400 text-xs">
                                  {deptItem.avgAptitude !== null ? `${deptItem.avgAptitude}%` : '—'}
                                </span>
                                <span className="text-[9px] text-slate-500 block font-mono">
                                  {deptItem.aptAssessedCount}/{deptItem.totalStudents}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-semibold text-slate-500 block">Comm</span>
                                <span className="font-mono font-bold text-purple-400 text-xs">
                                  {deptItem.avgCommunication !== null ? `${deptItem.avgCommunication}%` : '—'}
                                </span>
                                <span className="text-[9px] text-slate-500 block font-mono">
                                  {deptItem.commAssessedCount}/{deptItem.totalStudents}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Readiness Cohort Distribution Badges */}
                          {cohorts.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                Top Readiness Cohorts
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {cohorts.map(([cName, count]) => (
                                  <span
                                    key={cName}
                                    className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700/60 inline-flex items-center space-x-1"
                                  >
                                    <span className="truncate max-w-[130px]">{cName}</span>
                                    <strong className="text-white font-mono">{count}</strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive Card Action Footer */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDept(deptItem.dept);
                              setCurrentPage(1);
                              setActiveTab('students');
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                          >
                            <span>Inspect Students</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setKmeansDeptFilter(deptItem.dept);
                              setCurrentKmeansPage(1);
                              setActiveTab('kmeans');
                            }}
                            className="py-2 px-3 rounded-xl bg-brand-600/15 hover:bg-brand-600/25 text-brand-300 hover:text-white border border-brand-500/30 text-xs font-bold transition-all flex items-center space-x-1"
                            title="Filter Readiness Groups for this Branch"
                          >
                            <Brain className="w-3.5 h-3.5" />
                            <span>Groups</span>
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* View Mode 2: TABLE (Comparative Performance Matrix) */}
              {deptViewMode === 'table' && (
                <Card className="p-5 space-y-4 bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="py-3 px-3">Academic Branch</th>
                          <th className="py-3 px-3">Students</th>
                          <th className="py-3 px-3">Placement Rate</th>
                          <th className="py-3 px-3">Placed / In Process</th>
                          <th className="py-3 px-3">Avg CGPA</th>
                          <th className="py-3 px-3">Technical</th>
                          <th className="py-3 px-3">Aptitude</th>
                          <th className="py-3 px-3">Communication</th>
                          <th className="py-3 px-3">Overall Readiness</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredDepartments.map((deptItem) => (
                          <tr key={deptItem.dept} className="hover:bg-slate-850/50 transition-colors">
                            <td className="py-3 px-3 font-semibold text-white">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-300 font-extrabold text-xs">
                                  {deptItem.dept.slice(0, 4)}
                                </div>
                                <div>
                                  <div className="font-bold text-white">{deptItem.dept}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {deptItem.assessmentCompletionRate}% assessed ({deptItem.assessmentCompletedCount}/{deptItem.totalStudents})
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-300">
                              {deptItem.totalStudents}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    deptItem.placementPercentage >= 60
                                      ? 'emerald'
                                      : deptItem.placementPercentage > 0
                                      ? 'amber'
                                      : 'neutral'
                                  }
                                  size="xs"
                                >
                                  {deptItem.placementPercentage}%
                                </Badge>
                                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                                  <div
                                    className={`h-full ${
                                      deptItem.placementPercentage >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${deptItem.placementPercentage}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                                <span className="font-bold text-emerald-400">{deptItem.uniquelyPlacedCount} placed</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-indigo-400">{deptItem.inProcessCount} active</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-medium text-slate-300">
                              {deptItem.avgCGPA !== null ? deptItem.avgCGPA.toFixed(2) : '—'}
                            </td>
                            <td className="py-3 px-3 font-mono">
                              {deptItem.avgTechnical !== null ? (
                                <span className="font-bold text-blue-400">{deptItem.avgTechnical}%</span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono">
                              {deptItem.avgAptitude !== null ? (
                                <span className="font-bold text-indigo-400">{deptItem.avgAptitude}%</span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono">
                              {deptItem.avgCommunication !== null ? (
                                <span className="font-bold text-purple-400">{deptItem.avgCommunication}%</span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              {deptItem.avgReadiness !== null ? (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                                    deptItem.avgReadiness >= 75
                                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                      : deptItem.avgReadiness >= 60
                                      ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                  }`}
                                >
                                  {deptItem.avgReadiness}% Readiness
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Unassessed</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDept(deptItem.dept);
                                    setCurrentPage(1);
                                    setActiveTab('students');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors"
                                >
                                  Students
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setKmeansDeptFilter(deptItem.dept);
                                    setCurrentKmeansPage(1);
                                    setActiveTab('kmeans');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-brand-600/15 hover:bg-brand-600/25 text-brand-300 text-xs font-semibold border border-brand-500/30 transition-colors"
                                  title="Readiness Groups"
                                >
                                  Groups
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Empty Search Result Fallback */}
              {filteredDepartments.length === 0 && (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800 space-y-3">
                  <Building2 className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="font-semibold text-white">No academic branches match your search "{deptSearchQuery}".</p>
                  <p className="text-slate-500">Check spelling or clear the search query to view all departments.</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDeptSearchQuery('')}
                    className="mx-auto"
                  >
                    Clear Filter
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 5: K-MEANS MACHINE LEARNING STUDENT CLUSTERS
             ========================================================================= */}
          {activeTab === 'kmeans' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Title, Explanation, and Refresh Groups Action */}
              <PageHeader
                breadcrumb={['Admin Portal', 'Readiness Analytics']}
                title="Student Readiness Groups"
                subtitle="Students are grouped into 8 strength and development profiles using Python K-Means Machine Learning across technical, aptitude, and communication assessments."
                actions={
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
                      <span>{kmeansResult?.engine === 'python_kmeans_ml' ? 'Python ML Engine (K=8)' : 'Python ML Algorithm (K=8)'}</span>
                      {kmeansResult?.iterationsRun ? (
                        <span className="ml-1.5 text-emerald-300/70 font-mono text-[10px]">({kmeansResult.iterationsRun} iters)</span>
                      ) : null}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FileSpreadsheet}
                      onClick={handleExportAllKMeansGroups}
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow-xs"
                      title="Download Excel spreadsheet containing all student names, group numbers, scores, and training actions"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-400" />
                      <span>Download Groups (Excel)</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={RefreshCw}
                      disabled={isRefreshingKmeans || isPythonLoading}
                      onClick={handleRefreshGroups}
                      className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                    >
                      {isRefreshingKmeans || isPythonLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                          <span>Training ML Model...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1.5" />
                          <span>Re-cluster Students</span>
                        </>
                      )}
                    </Button>
                  </div>
                }
              />

              {/* Error State Banner */}
              {kmeansError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{kmeansError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshGroups}
                    className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Limited Dataset Explanation (if dataset supports fewer than 8 groups) */}
              {kmeansResult.isLimitedDataset && kmeansResult.datasetExplanation && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Dataset Notice:</strong>
                    <span>{kmeansResult.datasetExplanation}</span>
                  </div>
                </div>
              )}

              {/* Two Summary Cards at the Top */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  title="Students Analyzed"
                  value={kmeansResult.totalStudents}
                  subtext={kmeansDeptFilter === 'all' ? 'All enrolled academic profiles' : `Filtered to ${kmeansDeptFilter}`}
                  icon={Users}
                  colorScheme="brand"
                />
                <StatCard
                  title="Number of Groups"
                  value={kmeansResult.clusters.length}
                  subtext="Distinct readiness cohorts identified"
                  icon={Layers}
                  colorScheme="emerald"
                />
              </div>

              {/* Single Simple Group-Distribution Chart */}
              <Card className="p-4 bg-slate-850/80 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-brand-400" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                      Cohort Distribution Breakdown
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Proportion across {kmeansResult.totalStudents} evaluated students
                  </span>
                </div>

                {/* Multi-segment progress bar */}
                <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden shadow-inner">
                  {kmeansResult.clusters.map((cluster) =>
                    cluster.percentage > 0 ? (
                      <div
                        key={cluster.id}
                        style={{ width: `${cluster.percentage}%` }}
                        className={`h-full transition-all duration-500 ${
                          cluster.color === 'emerald'
                            ? 'bg-emerald-500'
                            : cluster.color === 'blue'
                            ? 'bg-blue-500'
                            : cluster.color === 'purple'
                            ? 'bg-purple-500'
                            : cluster.color === 'teal'
                            ? 'bg-teal-500'
                            : cluster.color === 'sky'
                            ? 'bg-sky-500'
                            : cluster.color === 'indigo'
                            ? 'bg-indigo-500'
                            : cluster.color === 'rose' || cluster.color === 'red'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                        title={`${cluster.name}: ${cluster.count} students (${cluster.percentage}%)`}
                      />
                    ) : null
                  )}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                  {kmeansResult.clusters.map((cluster) => (
                    <div key={cluster.id} className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cluster.dotClass}`} />
                      <span className="truncate text-slate-300 font-medium">{cluster.name}</span>
                      <span className="font-mono font-bold text-slate-400 text-[11px]">
                        {cluster.count} ({cluster.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Group Cards Grid: 8 Clean, Responsive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kmeansResult.clusters.map((cluster) => {
                  const isSelected = kmeansGroupFilter === cluster.id;
                  return (
                    <Card
                      key={cluster.id}
                      className={`p-4 flex flex-col justify-between border transition-all ${
                        isSelected
                          ? 'border-brand-500 ring-1 ring-brand-500/50 bg-slate-850'
                          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Group Name & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cluster.dotClass}`} />
                            <h4 className="font-extrabold text-sm text-white leading-tight">
                              {cluster.name}
                            </h4>
                          </div>
                        </div>

                        {/* Student Count and Readiness Metric */}
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="neutral" size="sm" className={cluster.badgeClass}>
                            {cluster.count} Students ({cluster.percentage}%)
                          </Badge>
                          <span className="text-[11px] font-mono text-slate-400">
                            Avg: <strong className="text-white">{cluster.avgScores.readiness}%</strong>
                          </span>
                        </div>

                        {/* Average Scores Mini-Grid */}
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-center text-[10px]">
                          <div>
                            <span className="text-slate-500 uppercase block font-semibold">Tech</span>
                            <span className="font-bold text-blue-400 font-mono">{cluster.avgScores.technical}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase block font-semibold">Aptitude</span>
                            <span className="font-bold text-indigo-400 font-mono">{cluster.avgScores.aptitude}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 uppercase block font-semibold">Comm</span>
                            <span className="font-bold text-purple-400 font-mono">{cluster.avgScores.communication}%</span>
                          </div>
                        </div>

                        {/* Measured Strengths / Focus Explanation */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Assessment Profile
                          </span>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            {cluster.explanation}
                          </p>
                        </div>

                        {/* Practical Recommended Action */}
                        <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider block">
                            Recommended Action
                          </span>
                          <p className="text-slate-200 text-xs leading-relaxed font-medium">
                            {cluster.recommendedAction}
                          </p>
                        </div>
                      </div>

                      {/* View Students in this Group Button & Quick Excel Download */}
                      <div className="pt-3 mt-3 border-t border-slate-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectGroupFilter(cluster.id)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80'
                          }`}
                        >
                          <span>{isSelected ? 'Viewing Group' : `View (${cluster.count})`}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportSingleKMeansGroup(cluster);
                          }}
                          disabled={!cluster.students || cluster.students.length === 0}
                          title={`Download Group ${cluster.clusterIndex !== undefined ? cluster.clusterIndex + 1 : ''} (${cluster.name}) Excel Roster`}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-700/80 hover:border-emerald-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Student Table Section */}
              <Card id="student-readiness-table" className="p-5 space-y-4 bg-slate-900 border border-slate-800">
                {/* Table Header and Essential Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Student Readiness Directory
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Showing {filteredGroupStudents.length} of {students.length} students
                      {kmeansGroupFilter !== 'all' ? ` in ${kmeansResult.clusters.find(c => c.id === kmeansGroupFilter)?.name || 'selected group'}` : ''}
                    </p>
                  </div>

                  {/* Essential Filters: Department and Group */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Department Filter */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Department:</span>
                      <select
                        value={kmeansDeptFilter}
                        onChange={(e) => {
                          setKmeansDeptFilter(e.target.value);
                          setCurrentKmeansPage(1);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:border-brand-500 focus:outline-none"
                      >
                        <option value="all">All Departments</option>
                        {discoveredDepts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Group Filter */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Group:</span>
                      <select
                        value={kmeansGroupFilter}
                        onChange={(e) => {
                          setKmeansGroupFilter(e.target.value);
                          setCurrentKmeansPage(1);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:border-brand-500 focus:outline-none"
                      >
                        <option value="all">All Groups</option>
                        {kmeansResult.clusters.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Reset Filters */}
                    {(kmeansDeptFilter !== 'all' || kmeansGroupFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setKmeansDeptFilter('all');
                          setKmeansGroupFilter('all');
                          setCurrentKmeansPage(1);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}

                    {/* Export Table to Excel Button */}
                    <Button
                      variant="secondary"
                      size="xs"
                      icon={FileSpreadsheet}
                      onClick={handleExportReadinessTable}
                      disabled={filteredGroupStudents.length === 0}
                      className="bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold py-1.5"
                      title="Download students in this table with their group numbers and recommendations to Excel"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span>Export Table (Excel)</span>
                    </Button>
                  </div>
                </div>

                {/* Table Content */}
                {filteredGroupStudents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <p>No students match the selected department and group filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setKmeansDeptFilter('all');
                        setKmeansGroupFilter('all');
                        setCurrentKmeansPage(1);
                      }}
                      className="text-brand-400 hover:text-brand-300 font-bold underline"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                            <th className="py-3 px-3">Student Name</th>
                            <th className="py-3 px-3">Department</th>
                            <th className="py-3 px-3">Readiness Group</th>
                            <th className="py-3 px-3">CGPA</th>
                            <th className="py-3 px-3">Technical</th>
                            <th className="py-3 px-3">Aptitude</th>
                            <th className="py-3 px-3">Communication</th>
                            <th className="py-3 px-3">Overall</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {paginatedKmeansStudents.map((st) => {
                            const clusterInfo = studentClusterMap[st.uid];
                            const rawTech = st.placementScores?.technicalScore ?? st.latestTechnicalScore ?? null;
                            const rawApt = st.placementScores?.aptitudeScore ?? st.latestAptitudeAssessment?.score ?? null;
                            const rawComm = st.placementScores?.communicationScore ?? st.latestCommunicationAssessment?.score ?? null;
                            const rawReadiness = st.placementScores?.overallReadiness ?? null;
                            const cgpa = st.education?.cgpa || st.cgpa || null;

                            return (
                              <tr key={st.uid} className="hover:bg-slate-850/50 transition-colors">
                                <td className="py-3 px-3 font-medium text-white">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[11px] font-bold text-brand-300 border border-slate-700">
                                      {(st.personalInfo?.fullName || 'S')[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-semibold">{st.personalInfo?.fullName || 'Student'}</div>
                                      <div className="text-[10px] text-slate-400">{st.personalInfo?.email || '—'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-slate-300">
                                  {st.department || st.education?.branch || 'General'}
                                </td>
                                <td className="py-3 px-3">
                                  {clusterInfo ? (
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center space-x-1 ${clusterInfo.badgeClass}`}>
                                      <span className="font-mono opacity-80 mr-1">#{clusterInfo.groupNumber}</span>
                                      <span>{clusterInfo.name}</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[10px]">Unassigned</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 font-mono font-medium text-slate-300">
                                  {cgpa !== null ? cgpa : '—'}
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  {rawTech !== null ? (
                                    <span className="font-bold text-blue-400">{Math.round(rawTech)}%</span>
                                  ) : (
                                    <span className="text-slate-500">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  {rawApt !== null ? (
                                    <span className="font-bold text-indigo-400">{Math.round(rawApt)}%</span>
                                  ) : (
                                    <span className="text-slate-500">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  {rawComm !== null ? (
                                    <span className="font-bold text-purple-400">{Math.round(rawComm)}%</span>
                                  ) : (
                                    <span className="text-slate-500">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 font-mono">
                                  {rawReadiness !== null ? (
                                    <span className="font-extrabold text-emerald-400">{Math.round(rawReadiness)}%</span>
                                  ) : (
                                    <span className="text-slate-500">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <Button
                                    variant="secondary"
                                    size="xs"
                                    onClick={() => handleOpenStudent(st)}
                                    className="text-[11px]"
                                  >
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalKmeansPages > 1 && (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                        <div>
                          Page {currentKmeansPage} of {totalKmeansPages}
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            disabled={currentKmeansPage <= 1}
                            onClick={() => setCurrentKmeansPage(prev => Math.max(1, prev - 1))}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            disabled={currentKmeansPage >= totalKmeansPages}
                            onClick={() => setCurrentKmeansPage(prev => Math.min(totalKmeansPages, prev + 1))}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}

          {/* =========================================================================
              TAB 6: JOBS & COMPANIES (Corporate Approvals & Campus Drives)
             ========================================================================= */}
          {activeTab === 'drives' && (
            <div className="space-y-5 animate-fade-in">
              <PageHeader
                breadcrumb={['Admin Portal', 'Jobs & Companies']}
                title="Jobs & Corporate Partners"
                subtitle="Review incoming company registrations, authorize job role eligibility, and manage active campus recruitment drives."
                actions={
                  jobsCompaniesSubTab === 'drives' ? (
                    <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddDriveModalOpen(true)}>
                      Schedule New Drive
                    </Button>
                  ) : null
                }
              />

              {/* Subtabs Bar: Campus Drives | Company Approvals | Job Role Approvals */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-subtle">
                <button
                  type="button"
                  onClick={() => setJobsCompaniesSubTab('drives')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    jobsCompaniesSubTab === 'drives'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Campus Drives</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    jobsCompaniesSubTab === 'drives' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {drives.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setJobsCompaniesSubTab('company_approvals')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    jobsCompaniesSubTab === 'company_approvals'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Company Approvals</span>
                  {(companyCounts.pending || 0) > 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30 animate-pulse">
                      {companyCounts.pending} Pending
                    </span>
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      jobsCompaniesSubTab === 'company_approvals' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {companyCounts.total || adminCompanies.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setJobsCompaniesSubTab('job_approvals')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    jobsCompaniesSubTab === 'job_approvals'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Job Role Approvals</span>
                  {(jobCounts.pending || 0) > 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30 animate-pulse">
                      {jobCounts.pending} Pending
                    </span>
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      jobsCompaniesSubTab === 'job_approvals' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {jobCounts.total || adminJobs.length}
                    </span>
                  )}
                </button>
              </div>

              {/* -------------------------------------------------------------
                  SUBVIEW 1: CAMPUS RECRUITMENT DRIVES
                 ------------------------------------------------------------- */}
              {jobsCompaniesSubTab === 'drives' && (
                <div className="space-y-4">
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
                                <div className="flex items-center space-x-1.5">
                                  {drive.approvalStatus && drive.approvalStatus !== 'approved' && (
                                    <Badge variant="amber" size="sm">
                                      {drive.approvalStatus === 'rejected' ? 'Rejected' : 'Pending Review'}
                                    </Badge>
                                  )}
                                  <Badge variant={drive.status === 'Active' ? 'emerald' : 'neutral'} size="sm">
                                    {drive.status || 'Upcoming'}
                                  </Badge>
                                </div>
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

              {/* -------------------------------------------------------------
                  SUBVIEW 2: COMPANY REGISTRATION APPROVALS
                 ------------------------------------------------------------- */}
              {jobsCompaniesSubTab === 'company_approvals' && (
                <div className="space-y-4">
                  {/* Search and Status Filters */}
                  <Card className="p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          placeholder="Search companies by name, email, or industry..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                        />
                      </div>
                      <div className="w-full sm:w-52">
                        <select
                          value={companyStatusFilter}
                          onChange={(e) => setCompanyStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850"
                        >
                          <option value="all">All Approval Statuses ({companyCounts.total || 0})</option>
                          <option value="pending">Pending Review ({companyCounts.pending || 0})</option>
                          <option value="approved">Approved & Active ({companyCounts.approved || 0})</option>
                          <option value="rejected">Rejected ({companyCounts.rejected || 0})</option>
                          <option value="suspended">Suspended Accounts</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Company Summary Cards */}
                  {loadingCompanies ? (
                    <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                      <span>Loading registered companies...</span>
                    </div>
                  ) : adminCompanies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminCompanies.map((comp) => {
                        const status = comp.approvalStatus || 'pending';
                        return (
                          <Card
                            key={comp.id || comp.uid}
                            className="p-5 space-y-4 bg-slate-900/90 border-slate-800 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Header: Company Name & Approval Badge */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center space-x-3 min-w-0">
                                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-base shrink-0">
                                    {comp.companyName ? comp.companyName.charAt(0).toUpperCase() : <Building2 className="w-5 h-5" />}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-extrabold text-sm text-white truncate">
                                      {comp.companyName || 'Corporate Partner'}
                                    </h4>
                                    <p className="text-xs text-slate-400 truncate">
                                      {comp.industry || 'Industry unspecified'}
                                    </p>
                                  </div>
                                </div>

                                <Badge
                                  variant={
                                    status === 'approved'
                                      ? 'emerald'
                                      : status === 'rejected'
                                      ? 'rose'
                                      : status === 'suspended'
                                      ? 'rose'
                                      : 'amber'
                                  }
                                  size="sm"
                                >
                                  {status === 'approved'
                                    ? 'Approved'
                                    : status === 'rejected'
                                    ? 'Rejected'
                                    : status === 'suspended'
                                    ? 'Suspended'
                                    : 'Pending Review'}
                                </Badge>
                              </div>

                              {/* Contact & Registration Meta */}
                              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-850/80 p-3 rounded-xl border border-slate-800">
                                <div className="truncate">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Official Email</span>
                                  <span className="font-semibold text-slate-200 truncate block">
                                    {comp.officialEmail || comp.email || 'N/A'}
                                  </span>
                                </div>
                                <div className="truncate">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Phone / Contact</span>
                                  <span className="font-semibold text-slate-200 truncate block">
                                    {comp.phone || comp.contactPerson || 'N/A'}
                                  </span>
                                </div>
                                <div className="truncate">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Website</span>
                                  <span className="font-semibold text-brand-400 truncate block">
                                    {comp.website || 'Not provided'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Registered</span>
                                  <span className="font-semibold text-slate-300">
                                    {comp.createdAt ? new Date(comp.createdAt).toLocaleDateString() : 'Active'}
                                  </span>
                                </div>
                              </div>

                              {/* Description Snippet */}
                              {(comp.companyDescription || comp.description) && (
                                <p className="text-xs text-slate-400 line-clamp-2">
                                  {comp.companyDescription || comp.description}
                                </p>
                              )}
                            </div>

                            {/* Card Footer: Submitted Job Roles & VIEW DETAILS Action */}
                            {/* Requirement: Do not allow direct approval from summary list without reviewing details */}
                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                              <span className="text-slate-400 flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                                <span><strong>{comp.jobCount || 0}</strong> job role{(comp.jobCount || 0) === 1 ? '' : 's'}</span>
                              </span>

                              <Button
                                variant="primary"
                                size="sm"
                                icon={Eye}
                                onClick={() => {
                                  setSelectedCompanyForReview(comp);
                                  setIsCompanyReviewModalOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800 space-y-3">
                      <Building2 className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="font-semibold text-slate-300">No company registrations match the selected filter.</p>
                      <p className="text-slate-500">Corporate recruiters registering through the portal will appear here for verification.</p>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBVIEW 3: JOB ROLE APPROVALS
                 ------------------------------------------------------------- */}
              {jobsCompaniesSubTab === 'job_approvals' && (
                <div className="space-y-4">
                  {/* Filters */}
                  <Card className="p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={jobReviewSearch}
                          onChange={(e) => setJobReviewSearch(e.target.value)}
                          placeholder="Search job roles by role title, company name, or location..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                        />
                      </div>
                      <div className="w-full sm:w-52">
                        <select
                          value={jobReviewStatusFilter}
                          onChange={(e) => setJobReviewStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850"
                        >
                          <option value="all">All Role Statuses ({jobCounts.total || 0})</option>
                          <option value="pending">Pending Approval ({jobCounts.pending || 0})</option>
                          <option value="approved">Approved & Published ({jobCounts.approved || 0})</option>
                          <option value="rejected">Rejected Roles ({jobCounts.rejected || 0})</option>
                        </select>
                      </div>
                    </div>
                  </Card>

                  {/* Job Cards */}
                  {loadingJobs ? (
                    <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                      <span>Loading job roles for review...</span>
                    </div>
                  ) : adminJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminJobs.map((jb) => {
                        const status = jb.approvalStatus || 'pending';
                        return (
                          <Card
                            key={jb.id}
                            className="p-5 space-y-4 bg-slate-900/90 border-slate-800 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Header: Role & Status */}
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs uppercase font-bold text-slate-400">
                                      {jb.companyName || 'Corporate Partner'}
                                    </span>
                                  </div>
                                  <h4 className="font-extrabold text-sm text-white mt-0.5">
                                    {jb.jobRole}
                                  </h4>
                                </div>

                                <Badge
                                  variant={
                                    status === 'approved'
                                      ? 'emerald'
                                      : status === 'rejected'
                                      ? 'rose'
                                      : 'amber'
                                  }
                                  size="sm"
                                >
                                  {status === 'approved'
                                    ? 'Approved for Students'
                                    : status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending Review'}
                                </Badge>
                              </div>

                              {/* Key Details Grid */}
                              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-850/80 p-3 rounded-xl border border-slate-800">
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Package / CTC</span>
                                  <span className="font-bold text-emerald-400">{jb.packageCTC || 'Negotiable'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Location</span>
                                  <span className="font-bold text-slate-200">{jb.location || 'Campus / Virtual'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Cutoff CGPA</span>
                                  <span className="font-bold text-slate-200">{jb.minCgpa || 'None'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Deadline</span>
                                  <span className="font-bold text-slate-200">{jb.applicationDeadline || 'Open'}</span>
                                </div>
                              </div>

                              {/* Department Badges */}
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">Depts:</span>
                                {(jb.eligibleDepartments || ['All']).slice(0, 3).map((d, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                                    {d}
                                  </span>
                                ))}
                                {(jb.eligibleDepartments || []).length > 3 && (
                                  <span className="text-[10px] text-slate-500">+{jb.eligibleDepartments.length - 3} more</span>
                                )}
                              </div>
                            </div>

                            {/* Card Footer: Review Action */}
                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                              <span className="text-slate-400">
                                {jb.employmentType || 'Full-time'}
                              </span>

                              <Button
                                variant="primary"
                                size="sm"
                                icon={Eye}
                                onClick={() => {
                                  setSelectedJobForReview(jb);
                                  setIsJobReviewModalOpen(true);
                                }}
                              >
                                Review Role Details
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-dashed border-slate-800 space-y-3">
                      <Briefcase className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="font-semibold text-slate-300">No job roles match the selected filter.</p>
                      <p className="text-slate-500">Recruiters submitting new campus job openings will appear here for placement approval.</p>
                    </div>
                  )}
                </div>
              )}
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

      <AdminCompanyReviewModal
        company={selectedCompanyForReview}
        isOpen={isCompanyReviewModalOpen}
        onClose={() => {
          setIsCompanyReviewModalOpen(false);
          setSelectedCompanyForReview(null);
        }}
        onReviewSubmit={handleReviewCompanySubmit}
        onOpenJobRoleReview={(job) => {
          setSelectedJobForReview(job);
          setIsJobReviewModalOpen(true);
        }}
      />

      <AdminJobRoleReviewModal
        job={selectedJobForReview}
        isOpen={isJobReviewModalOpen}
        onClose={() => {
          setIsJobReviewModalOpen(false);
          setSelectedJobForReview(null);
        }}
        onReviewSubmit={handleReviewJobSubmit}
      />

    </div>
  );
};
