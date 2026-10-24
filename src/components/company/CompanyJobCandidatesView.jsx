import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  X,
  Filter,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Eye,
  Download,
  Bookmark,
  BookmarkCheck,
  Send,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Award,
  ArrowRight
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import {
  fetchJobEligibleStudents,
  fetchJobCandidates,
  updateApplicationStatus
} from '../../services/companyService';

export const CompanyJobCandidatesView = ({
  drives = [],
  initialDriveId = null,
  companyProfile = null,
  shortlist = [],
  onToggleShortlist,
  onSelectCandidate,
  onDownloadResume,
  onNavigate,
  onOpenPostDrive,
  showToast
}) => {
  // 1. Selected Job Drive
  const [selectedDriveId, setSelectedDriveId] = useState(
    initialDriveId || (drives[0]?.id || '')
  );

  // Synchronize dynamic currentDrive state with latest backend record
  const [currentDrive, setCurrentDrive] = useState(() =>
    drives.find((d) => d.id === (initialDriveId || drives[0]?.id)) || drives[0] || null
  );

  // Update selectedDriveId when drives change if not set
  useEffect(() => {
    if (!selectedDriveId && drives.length > 0) {
      setSelectedDriveId(drives[0].id);
    }
    const matched = drives.find((d) => d.id === selectedDriveId);
    if (matched) {
      setCurrentDrive((prev) => (prev?.id === matched.id ? { ...matched, ...prev } : matched));
    }
  }, [drives, selectedDriveId]);

  // 2. Active Tab: 'eligible' | 'applicants' | 'nominations'
  const [subTab, setSubTab] = useState('eligible');

  // 3. Data States
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [directApplicants, setDirectApplicants] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // 4. Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('All');

  // 5. Interview / Status Update Modal State
  const [updatingApp, setUpdatingApp] = useState(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewRound, setInterviewRound] = useState('Round 1: Technical Screening');
  const [interviewRemarks, setInterviewRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch candidate data whenever selected drive changes
  const loadJobData = async (driveId) => {
    if (!driveId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [eligibleRes, candData] = await Promise.all([
        fetchJobEligibleStudents(driveId),
        fetchJobCandidates(driveId)
      ]);
      const list = Array.isArray(eligibleRes)
        ? eligibleRes
        : (eligibleRes?.eligibleStudents || []);
      setEligibleStudents(list);
      setDirectApplicants(candData?.directApplicants || []);
      setNominations(candData?.nominations || []);

      const freshDrive = eligibleRes?.drive || candData?.drive;
      if (freshDrive) {
        setCurrentDrive(freshDrive);
      }
    } catch (err) {
      console.error('Failed to load candidate data for job:', err);
      setErrorMsg(err.message || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDriveId) {
      loadJobData(selectedDriveId);
    }
  }, [selectedDriveId]);

  const activeDrive = currentDrive || drives.find((d) => d.id === selectedDriveId) || drives[0];

  // Helper set for quick shortlist check
  const shortlistedUids = new Set(shortlist.map((item) => item.uid));

  // Direct applicant IDs for marking applied status in eligible list
  const directApplicantStudentIds = new Set(
    directApplicants.map((app) => app.studentId)
  );

  // Filtered lists with comprehensive query matching (name, department, email, college, skills)
  const filteredEligible = eligibleStudents.filter((s) => {
    const name = s.personalInfo?.fullName || s.fullName || '';
    const dept = s.department || s.education?.branch || '';
    const email = s.personalInfo?.email || s.email || '';
    const college = s.education?.college || s.college || '';
    const skills = [
      ...(s.normalizedSkills || []),
      ...(s.skills || [])
    ].join(' ');
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      name.toLowerCase().includes(query) ||
      dept.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      college.toLowerCase().includes(query) ||
      skills.toLowerCase().includes(query)
    );
  });

  const filteredApplicants = directApplicants.filter((app) => {
    if (applicantStatusFilter !== 'All' && app.status !== applicantStatusFilter) {
      return false;
    }
    const name = app.student?.personalInfo?.fullName || app.student?.fullName || app.studentName || '';
    const dept = app.student?.department || app.student?.education?.branch || app.studentDepartment || app.studentBranch || '';
    const email = app.student?.personalInfo?.email || app.studentEmail || '';
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      name.toLowerCase().includes(query) ||
      dept.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query)
    );
  });

  const filteredNominations = nominations.filter((nom) => {
    const name = nom.student?.personalInfo?.fullName || nom.student?.fullName || nom.studentName || '';
    const dept = nom.student?.department || nom.student?.education?.branch || nom.studentDepartment || nom.studentBranch || '';
    const email = nom.student?.personalInfo?.email || nom.studentEmail || '';
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      name.toLowerCase().includes(query) ||
      dept.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query)
    );
  });

  // Status update handler
  const handleStatusChange = async (applicationId, newStatus, extraData = {}) => {
    setActionLoading(true);
    try {
      const payload = { status: newStatus, ...extraData };
      await updateApplicationStatus(applicationId, payload);
      if (showToast) {
        showToast(`Candidate status updated to "${newStatus.replace('_', ' ').toUpperCase()}".`);
      }
      // Reload current job data
      await loadJobData(selectedDriveId);
      setInterviewModalOpen(false);
      setUpdatingApp(null);
    } catch (err) {
      console.error('Failed to update candidate status:', err);
      if (showToast) {
        showToast(err.message || 'Failed to update candidate status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header & Job Selector Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Job Candidates & Talent Pool
            </h1>
            <Badge variant="indigo">
              {drives.length} {drives.length === 1 ? 'Job' : 'Jobs'} Posted
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            View verified eligible students matching your role criteria, manage direct applicants,
            and review officer nominations.
          </p>
        </div>

        {/* Post new drive button */}
        {onOpenPostDrive && (
          <Button
            variant="secondary"
            size="sm"
            icon={Briefcase}
            onClick={onOpenPostDrive}
          >
            Post New Job
          </Button>
        )}
      </div>

      {/* 2. Job Selector Dropdown Card */}
      {drives.length > 0 ? (
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/30 border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                Select Recruitment Drive / Job Role
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedDriveId}
                  onChange={(e) => setSelectedDriveId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-brand-500 w-full sm:w-auto min-w-[280px]"
                >
                  {drives.map((dr) => {
                    const status = dr.id === activeDrive?.id ? (activeDrive.approvalStatus || dr.approvalStatus) : dr.approvalStatus;
                    const label = status === 'approved' ? '✓ Approved' : status === 'rejected' ? '✗ Rejected' : '⏳ Pending';
                    return (
                      <option key={dr.id} value={dr.id}>
                        {dr.jobRole} ({dr.status}) — {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Active Job Summary Badges */}
            {activeDrive && (
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Cutoff CGPA</span>
                  <span className="font-extrabold text-white">{activeDrive.minCgpa || 0}+</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Min Readiness</span>
                  <span className="font-extrabold text-emerald-400">{activeDrive.minReadiness || 0}%</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Departments</span>
                  <span className="font-semibold text-slate-200">
                    {(activeDrive.eligibleDepartments || ['All']).join(', ')}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Configured Batch</span>
                  <span className="font-semibold text-indigo-300">
                    {activeDrive.batch || activeDrive.graduationBatch || activeDrive.batchEligibility || 'All'}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Job Role Approval</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    activeDrive.approvalStatus === 'approved'
                      ? 'text-emerald-400'
                      : activeDrive.approvalStatus === 'rejected'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}>
                    {activeDrive.approvalStatus === 'approved'
                      ? '✓ Published to Students'
                      : activeDrive.approvalStatus === 'rejected'
                      ? '✗ Rejected by Placement Cell'
                      : '⏳ Pending Review'}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Company Registration</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    (companyProfile?.approvalStatus === 'approved' || activeDrive.companyApprovalStatus === 'approved')
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>
                      {(companyProfile?.approvalStatus === 'approved' || activeDrive.companyApprovalStatus === 'approved')
                        ? 'Approved Partner'
                        : 'Pending Registration'}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-3">
          <Briefcase className="w-8 h-8 mx-auto text-slate-500" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">No recruitment drives posted yet.</p>
            <p className="text-slate-400">Post a recruitment drive to view eligible candidates and receive applications.</p>
          </div>
          {onOpenPostDrive && (
            <Button variant="primary" size="sm" icon={Briefcase} onClick={onOpenPostDrive}>
              Post Your First Drive
            </Button>
          )}
        </Card>
      )}

      {/* 3. Three Separate, Clearly Labelled Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start shadow-subtle">
          <button
            type="button"
            onClick={() => setSubTab('eligible')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              subTab === 'eligible'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Eligible Students</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {eligibleStudents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('applicants')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              subTab === 'applicants'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direct Applicants</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {directApplicants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('nominations')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              subTab === 'nominations'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Officer Nominations</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {nominations.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${subTab}...`}
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Tab Content */}
      {loading ? (
        <Card className="p-16 text-center text-xs text-slate-400 border border-slate-800">
          <Sparkles className="w-6 h-6 mx-auto text-brand-400 animate-spin mb-2" />
          <p className="font-semibold text-slate-300">Loading candidates for "{activeDrive?.jobRole}"...</p>
        </Card>
      ) : (
        <>
          {/* TAB 1: ELIGIBLE STUDENTS */}
          {subTab === 'eligible' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Showing students verified against this role's criteria (CGPA &ge; {activeDrive?.minCgpa || 0}, Readiness &ge; {activeDrive?.minReadiness || 0}%, Batch: {activeDrive?.batch || 'All'}, Dept: {(activeDrive?.eligibleDepartments || ['All']).join(', ')}).
                  </span>
                </div>
                <span className="font-bold text-white shrink-0">
                  {filteredEligible.length} Eligible Candidates
                </span>
              </div>

              {filteredEligible.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEligible.map((student) => {
                    const personal = student.personalInfo || {};
                    const education = student.education || {};
                    const scores = student.placementScores || {};

                    const studentName = personal.fullName || student.fullName || 'Candidate';
                    const deptName = student.department || education.branch || 'Engineering';
                    const batchYear = education.graduationYear || student.graduationYear || student.batch;

                    const rawCgpa = education.cgpa ?? student.cgpa;
                    const hasCgpa = rawCgpa !== null && rawCgpa !== undefined && rawCgpa !== '' && !isNaN(Number(rawCgpa));
                    const formattedCgpa = hasCgpa ? Number(rawCgpa).toFixed(1) : 'Not available';

                    const rawReadiness = scores.overallReadiness ?? student.overallReadiness;
                    const hasReadiness = rawReadiness !== null && rawReadiness !== undefined && rawReadiness !== '' && !isNaN(Number(rawReadiness));
                    const readinessVal = hasReadiness ? Number(rawReadiness) : null;

                    const rawTech = scores.technicalScore ?? scores.technical ?? student.latestTechnicalScore ?? student.technicalScore;
                    const hasTech = rawTech !== null && rawTech !== undefined && rawTech !== '' && !isNaN(Number(rawTech));
                    const techVal = hasTech ? Number(rawTech) : null;

                    const rawApt = scores.aptitudeScore ?? scores.aptitude ?? student.latestAptitudeScore ?? student.aptitudeScore;
                    const hasApt = rawApt !== null && rawApt !== undefined && rawApt !== '' && !isNaN(Number(rawApt));
                    const aptVal = hasApt ? Number(rawApt) : null;

                    const isShortlisted = shortlistedUids.has(student.uid);
                    const hasApplied = directApplicantStudentIds.has(student.uid) || student.hasApplied;

                    return (
                      <Card
                        key={student.uid}
                        hover
                        className="p-5 flex flex-col justify-between space-y-4 bg-slate-900/90 border-slate-800"
                      >
                        <div className="space-y-3">
                          {/* Top: Avatar & Details */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-400 shrink-0 overflow-hidden">
                                {personal.profilePhoto ? (
                                  <img
                                    src={personal.profilePhoto}
                                    alt={studentName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  studentName.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-extrabold text-sm text-white truncate">
                                  {studentName}
                                </h4>
                                <div className="text-xs text-slate-400 truncate">
                                  {deptName}{batchYear ? ` (${batchYear})` : ''} • CGPA: <strong className="text-white">{formattedCgpa}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Application Status Distinction */}
                            <div>
                              {hasApplied ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Applied
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                  Eligible • Not Applied
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Scores Strip: Distinguishes genuine 0 from unassessed */}
                          <div className="p-2.5 bg-slate-850/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                              <div className="text-[9px] font-bold uppercase text-slate-400">Readiness</div>
                              <div className={`font-extrabold ${hasReadiness ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {hasReadiness ? `${readinessVal}%` : 'Not assessed'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold uppercase text-slate-400">Technical</div>
                              <div className={`font-extrabold ${hasTech ? 'text-blue-400' : 'text-slate-400'}`}>
                                {hasTech ? `${techVal}%` : 'Not assessed'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold uppercase text-slate-400">Aptitude</div>
                              <div className={`font-extrabold ${hasApt ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {hasApt ? `${aptVal}%` : 'Not assessed'}
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1">
                            {(student.normalizedSkills || student.skills || []).slice(0, 5).map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleShortlist(student, activeDrive)}
                            className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                              isShortlisted
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {isShortlisted ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className="hidden sm:inline">
                              {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                            </span>
                          </button>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Eye}
                              onClick={() => onSelectCandidate(student)}
                            >
                              Profile
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Download}
                              onClick={(e) => onDownloadResume(e, student)}
                            >
                              Resume
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-2">
                  <GraduationCap className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="font-semibold text-slate-200">
                    No eligible students meet the criteria for this role.
                  </p>
                  <p className="text-slate-400">
                    Students must meet the cutoffs (CGPA &ge; {activeDrive?.minCgpa || 0}, Readiness &ge; {activeDrive?.minReadiness || 0}%) and be in an eligible department. Missing profile data is never marked as eligible.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: DIRECT APPLICANTS */}
          {subTab === 'applicants' && (
            <div className="space-y-4">
              {/* Applicant Status Filter */}
              <div className="flex items-center space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start inline-flex">
                {['All', 'applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'].map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setApplicantStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        applicantStatusFilter === st
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              {filteredApplicants.length > 0 ? (
                <div className="space-y-3">
                  {filteredApplicants.map((app) => {
                    const student = app.student || {};
                    const personal = student.personalInfo || {};
                    const education = student.education || {};
                    const studentName = personal.fullName || student.fullName || app.studentName || 'Applicant';
                    const deptName = student.department || education.branch || app.studentDepartment || app.studentBranch || 'Engineering';
                    const rawCgpa = education.cgpa ?? student.cgpa ?? app.studentCgpa;
                    const formattedCgpa = (rawCgpa !== null && rawCgpa !== undefined && rawCgpa !== '' && !isNaN(Number(rawCgpa)))
                      ? Number(rawCgpa).toFixed(1)
                      : null;

                    return (
                      <Card
                        key={app.id}
                        hover
                        className="p-5 bg-slate-900/90 border-slate-800 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Student Details */}
                          <div className="flex items-start space-x-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-400 shrink-0 overflow-hidden">
                              {personal.profilePhoto ? (
                                <img
                                  src={personal.profilePhoto}
                                  alt={studentName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                studentName.charAt(0)
                              )}
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                                  {studentName}
                                </h3>
                                <Badge
                                  variant={
                                    app.status === 'selected'
                                      ? 'emerald'
                                      : app.status === 'rejected'
                                      ? 'neutral'
                                      : app.status === 'shortlisted' || app.status === 'interview_scheduled'
                                      ? 'amber'
                                      : 'indigo'
                                  }
                                  size="sm"
                                >
                                  {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                                </Badge>
                                <span className="text-[11px] text-slate-400">
                                  Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}
                                </span>
                              </div>

                              <div className="text-xs text-slate-400 truncate">
                                {education.degree || 'B.Tech'} • {deptName}
                                {formattedCgpa && (
                                  <span className="text-emerald-400 font-semibold"> • CGPA: {formattedCgpa}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Action Buttons for Recruiter Status Management */}
                          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                            {/* Shortlist Action */}
                            {app.status !== 'shortlisted' && (
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleStatusChange(app.id, 'shortlisted')}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold transition-colors"
                              >
                                Shortlist
                              </button>
                            )}

                            {/* Schedule Interview Action */}
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => {
                                setUpdatingApp(app);
                                setInterviewModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Interview</span>
                            </button>

                            {/* Select / Make Offer Action */}
                            {app.status !== 'selected' && (
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleStatusChange(app.id, 'selected')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold transition-colors"
                              >
                                Select
                              </button>
                            )}

                            {/* Reject Action */}
                            {app.status !== 'rejected' && (
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-semibold transition-colors"
                              >
                                Reject
                              </button>
                            )}

                            {/* View Profile */}
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Eye}
                              onClick={() => onSelectCandidate(student)}
                            >
                              Profile
                            </Button>

                            {/* Download Resume */}
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Download}
                              onClick={(e) => onDownloadResume(e, student)}
                            >
                              Resume
                            </Button>
                          </div>
                        </div>

                        {/* Interview info or remarks strip if scheduled */}
                        {(app.interviewDate || app.remarks) && (
                          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-center justify-between">
                            <div className="space-y-0.5">
                              {app.interviewDate && (
                                <div className="font-semibold flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Interview Scheduled: {app.interviewDate} ({app.interviewRound || 'Technical'})</span>
                                </div>
                              )}
                              {app.remarks && (
                                <div className="text-slate-300 italic">Notes: {app.remarks}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="font-semibold text-slate-200">
                    No direct applicants found for this job yet.
                  </p>
                  <p className="text-slate-400">
                    As eligible students submit applications for "{activeDrive?.jobRole}", they will appear here.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 3: OFFICER NOMINATIONS */}
          {subTab === 'nominations' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    Candidates nominated directly by College Placement Officers for "{activeDrive?.jobRole}".
                  </span>
                </div>
                <span className="font-bold text-white shrink-0">
                  {filteredNominations.length} Nominated Candidates
                </span>
              </div>

              {filteredNominations.length > 0 ? (
                <div className="space-y-3">
                  {filteredNominations.map((nom) => {
                    const student = nom.student || {};
                    const personal = student.personalInfo || {};
                    const education = student.education || {};
                    const studentName = personal.fullName || student.fullName || nom.studentName || 'Nominated Candidate';
                    const deptName = student.department || education.branch || nom.studentDepartment || nom.studentBranch || 'Engineering';
                    const rawCgpa = education.cgpa ?? student.cgpa ?? nom.studentCgpa;
                    const formattedCgpa = (rawCgpa !== null && rawCgpa !== undefined && rawCgpa !== '' && !isNaN(Number(rawCgpa)))
                      ? Number(rawCgpa).toFixed(1)
                      : null;

                    return (
                      <Card
                        key={nom.id}
                        hover
                        className="p-5 bg-slate-900/90 border-slate-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start space-x-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-900/40 border border-indigo-700/60 flex items-center justify-center font-bold text-indigo-400 shrink-0">
                              <Award className="w-6 h-6" />
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                                  {studentName}
                                </h3>
                                <Badge variant="indigo" size="sm">
                                  Officer Nominated
                                </Badge>
                                <span className="text-[11px] text-slate-400">
                                  Consent: <strong className="text-slate-200">{nom.studentConsentStatus || 'Pending'}</strong>
                                </span>
                              </div>

                              <div className="text-xs text-slate-400 truncate">
                                {education.degree || 'B.Tech'} ({deptName})
                                {formattedCgpa && (
                                  <span className="text-emerald-400 font-semibold"> • CGPA: {formattedCgpa}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 self-end sm:self-center">
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleStatusChange(nom.id, 'shortlisted')}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold transition-colors"
                            >
                              Shortlist
                            </button>

                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => {
                                setUpdatingApp(nom);
                                setInterviewModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Interview</span>
                            </button>

                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Eye}
                              onClick={() => onSelectCandidate(student)}
                            >
                              Profile
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              icon={Download}
                              onClick={(e) => onDownloadResume(e, student)}
                            >
                              Resume
                            </Button>
                          </div>
                        </div>

                        {/* Officer Notes */}
                        {nom.officerNotes && (
                          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-0.5">
                            <span className="font-bold text-indigo-400">Placement Officer Recommendation Note:</span>
                            <p className="italic text-slate-300">{nom.officerNotes}</p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-2">
                  <Award className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="font-semibold text-slate-200">
                    No officer nominations for this drive yet.
                  </p>
                  <p className="text-slate-400">
                    Placement Officers can nominate top matched departmental students for your verified recruitment drives.
                  </p>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* 5. Schedule Interview Modal */}
      {interviewModalOpen && updatingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-base text-white">Schedule Candidate Interview</h3>
              </div>
              <button
                type="button"
                onClick={() => setInterviewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Candidate
                </label>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 font-bold text-white">
                  {updatingApp.student?.personalInfo?.fullName || updatingApp.studentName || 'Candidate'}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Interview Round
                </label>
                <input
                  type="text"
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  placeholder="e.g. Round 1: Technical Architecture Interview"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Remarks / Meeting Link / Instructions
                </label>
                <textarea
                  rows={3}
                  value={interviewRemarks}
                  onChange={(e) => setInterviewRemarks(e.target.value)}
                  placeholder="e.g. Google Meet link: meet.google.com/xyz, please prepare system design presentation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInterviewModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={actionLoading}
                onClick={() =>
                  handleStatusChange(updatingApp.id, 'interview_scheduled', {
                    interviewDate,
                    interviewRound,
                    remarks: interviewRemarks
                  })
                }
              >
                Confirm & Notify Candidate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
