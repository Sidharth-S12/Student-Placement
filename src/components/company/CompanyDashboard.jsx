import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import {
  fetchCompanyOverview,
  fetchCompanyDrives,
  fetchCompanyProfile,
  toggleJobCandidateShortlist
} from '../../services/companyService';
import {
  getRecruiterShortlist,
  saveRecruiterShortlist,
  getRecruiterProfile,
  saveRecruiterProfile
} from './recruiterShortlistService';
import { CompanySidebar } from './CompanySidebar';
import { CompanyTopNav } from './CompanyTopNav';
import { CompanyOverviewView } from './CompanyOverviewView';
import { CompanyJobCandidatesView } from './CompanyJobCandidatesView';
import { CompanyShortlistView } from './CompanyShortlistView';
import { CompanyDrivesView } from './CompanyDrivesView';
import { CompanyProfileView } from './CompanyProfileView';
import { CompanyStudentDetailModal } from './CompanyStudentDetailModal';
import { CompanyPostDriveModal } from './CompanyPostDriveModal';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const CompanyDashboard = ({ companyProfile: initialProfile = null }) => {
  const { currentUser, logout } = useAuth();

  // Navigation state: 'overview' | 'candidates' | 'shortlist' | 'drives' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Selected drive ID for candidate drill-down
  const [selectedDriveId, setSelectedDriveId] = useState(null);

  // Company data
  const [profile, setProfile] = useState(initialProfile || {});
  const [overviewData, setOverviewData] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recruiter shortlist
  const [shortlist, setShortlist] = useState(() =>
    getRecruiterShortlist(currentUser?.uid)
  );

  // Modals state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isPostDriveModalOpen, setIsPostDriveModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Primary Data Fetcher: Loads isolated, company-scoped data only
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [overview, driveList, prof] = await Promise.all([
        fetchCompanyOverview(),
        fetchCompanyDrives(),
        initialProfile ? Promise.resolve(initialProfile) : fetchCompanyProfile()
      ]);

      if (overview) {
        setOverviewData(overview);
        if (overview.company) {
          setProfile(overview.company);
        }
      }
      if (driveList) {
        setDrives(driveList);
        if (!selectedDriveId && driveList.length > 0) {
          setSelectedDriveId(driveList[0].id);
        }
      }
      if (prof && !overview?.company) {
        setProfile(prof);
      }
    } catch (err) {
      console.error('[CompanyDashboard] Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  // Shortlist Handlers
  // Shortlist Handlers: toggles shortlist status, preventing duplicates and syncing with backend
  const handleToggleShortlist = async (student, drive = null) => {
    if (!student || !student.uid) return;
    const studentUid = student.uid;
    const driveId = drive?.id || null;

    const exists = shortlist.some((item) =>
      item.uid === studentUid && (!driveId || !item.jobId || item.jobId === driveId)
    );

    let updated = [];
    const studentName = student.personalInfo?.fullName || student.fullName || 'Candidate';

    if (exists) {
      updated = shortlist.filter((item) =>
        !(item.uid === studentUid && (!driveId || !item.jobId || item.jobId === driveId))
      );
      showToast(`Removed ${studentName} from shortlist.`);
    } else {
      updated = [
        {
          uid: studentUid,
          jobId: driveId,
          jobRole: drive?.jobRole || null,
          student,
          shortlistedAt: new Date().toISOString(),
          stage: 'Shortlisted',
          notes: ''
        },
        ...shortlist
      ];
      showToast(`Shortlisted ${studentName} successfully!`);
    }

    setShortlist(updated);
    saveRecruiterShortlist(currentUser?.uid, updated);

    // Persist to backend if drive context is available
    if (driveId) {
      try {
        await toggleJobCandidateShortlist(driveId, studentUid);
      } catch (err) {
        console.warn('[CompanyDashboard] Backend shortlist sync error (continuing with local state):', err.message);
      }
    }
  };

  const handleUpdateShortlistStage = (studentUid, newStage) => {
    const updated = shortlist.map((item) =>
      item.uid === studentUid ? { ...item, stage: newStage } : item
    );
    setShortlist(updated);
    saveRecruiterShortlist(currentUser?.uid, updated);
    showToast(`Hiring stage updated to "${newStage}".`);
  };

  const handleUpdateShortlistNotes = (studentUid, notes) => {
    const updated = shortlist.map((item) =>
      item.uid === studentUid ? { ...item, notes } : item
    );
    setShortlist(updated);
    saveRecruiterShortlist(currentUser?.uid, updated);
    showToast('Recruiter note saved.');
  };

  const handleRemoveFromShortlist = (studentUid) => {
    const updated = shortlist.filter((item) => item.uid !== studentUid);
    setShortlist(updated);
    saveRecruiterShortlist(currentUser?.uid, updated);
    showToast('Candidate removed from shortlist.');
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    saveRecruiterProfile(currentUser?.uid, newProfile);
  };

  const handleDriveSaved = (newDrive) => {
    loadDashboardData();
    showToast(`Recruitment drive "${newDrive.companyName || ''} - ${newDrive.jobRole}" submitted for review.`);
  };

  const handleDownloadResume = (e, student) => {
    if (e) e.stopPropagation();
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

  const companyDisplayName =
    profile.companyName || currentUser?.displayName || 'Campus Recruiter';
  const recruiterDisplayEmail =
    profile.recruiterEmail || currentUser?.email || 'recruiter@company.com';

  const isCurrentCandidateShortlisted = selectedCandidate
    ? shortlist.some((item) => item.uid === selectedCandidate.uid)
    : false;

  const totalCandidatesMetric =
    overviewData?.stats?.totalEligibleCandidates ||
    overviewData?.stats?.totalApplications ||
    0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased flex selection:bg-brand-500 selection:text-white">
      {/* 1. Left Navigation Sidebar */}
      <CompanySidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        companyName={companyDisplayName}
        recruiterEmail={recruiterDisplayEmail}
        shortlistCount={shortlist.length}
        candidatesCount={totalCandidatesMetric}
        drivesCount={drives.length}
        onOpenPostDrive={() => setIsPostDriveModalOpen(true)}
        onSignOut={logout}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Top Header */}
        <CompanyTopNav
          activeTab={activeTab}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          companyName={companyDisplayName}
          recruiterEmail={recruiterDisplayEmail}
          shortlistCount={shortlist.length}
          onOpenPostDrive={() => setIsPostDriveModalOpen(true)}
          onSignOut={logout}
        />

        {/* Page Content */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
          {loading && !overviewData ? (
            <div className="p-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
              <p className="font-semibold text-slate-200">Loading authorized recruiter portal...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <CompanyOverviewView
                  companyProfile={profile}
                  overviewData={overviewData}
                  drives={drives}
                  shortlist={shortlist}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenPostDrive={() => setIsPostDriveModalOpen(true)}
                  onSelectCandidate={(cand) => {
                    setSelectedCandidate(cand);
                    setIsCandidateModalOpen(true);
                  }}
                  onToggleShortlist={handleToggleShortlist}
                  onDownloadResume={handleDownloadResume}
                />
              )}

              {activeTab === 'candidates' && (
                <CompanyJobCandidatesView
                  drives={drives}
                  initialDriveId={selectedDriveId}
                  companyProfile={profile}
                  shortlist={shortlist}
                  onToggleShortlist={handleToggleShortlist}
                  onSelectCandidate={(cand) => {
                    setSelectedCandidate(cand);
                    setIsCandidateModalOpen(true);
                  }}
                  onDownloadResume={handleDownloadResume}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenPostDrive={() => setIsPostDriveModalOpen(true)}
                  showToast={showToast}
                />
              )}

              {activeTab === 'shortlist' && (
                <CompanyShortlistView
                  shortlist={shortlist}
                  onUpdateStage={handleUpdateShortlistStage}
                  onUpdateNotes={handleUpdateShortlistNotes}
                  onRemoveFromShortlist={handleRemoveFromShortlist}
                  onSelectCandidate={(cand) => {
                    setSelectedCandidate(cand);
                    setIsCandidateModalOpen(true);
                  }}
                  onDownloadResume={handleDownloadResume}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'drives' && (
                <CompanyDrivesView
                  drives={drives}
                  companyName={companyDisplayName}
                  onOpenPostDrive={() => setIsPostDriveModalOpen(true)}
                  onSelectDriveCandidates={(driveId) => {
                    setSelectedDriveId(driveId);
                    setActiveTab('candidates');
                  }}
                  onDriveDeleted={(deletedId) => {
                    setDrives((prev) => prev.filter((d) => d.id !== deletedId));
                    loadDashboardData();
                  }}
                  showToast={showToast}
                />
              )}

              {activeTab === 'profile' && (
                <CompanyProfileView
                  profile={profile}
                  onSaveProfile={handleSaveProfile}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. Read-Only Company Student Detail Modal */}
      <CompanyStudentDetailModal
        student={selectedCandidate}
        isOpen={isCandidateModalOpen}
        onClose={() => {
          setIsCandidateModalOpen(false);
          setSelectedCandidate(null);
        }}
        isShortlisted={isCurrentCandidateShortlisted}
        onToggleShortlist={handleToggleShortlist}
      />

      {/* 4. Post Recruitment Drive Modal */}
      <CompanyPostDriveModal
        isOpen={isPostDriveModalOpen}
        onClose={() => setIsPostDriveModalOpen(false)}
        companyNameDefault={companyDisplayName}
        onDriveSaved={handleDriveSaved}
      />

      {/* 5. Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
