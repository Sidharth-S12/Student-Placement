import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllStudents } from '../../services/studentProfileService';
import { fetchDrives } from '../../services/adminService';
import { generateATSResumePDF } from '../../utils/generateATSResumePDF';
import {
  getRecruiterShortlist,
  saveRecruiterShortlist,
  getRecruiterProfile,
  saveRecruiterProfile
} from './recruiterShortlistService';
import { CompanySidebar } from './CompanySidebar';
import { CompanyTopNav } from './CompanyTopNav';
import { CompanyOverviewView } from './CompanyOverviewView';
import { CompanyTalentDiscoveryView } from './CompanyTalentDiscoveryView';
import { CompanyShortlistView } from './CompanyShortlistView';
import { CompanyDrivesView } from './CompanyDrivesView';
import { CompanyProfileView } from './CompanyProfileView';
import { CompanyStudentDetailModal } from './CompanyStudentDetailModal';
import { CompanyPostDriveModal } from './CompanyPostDriveModal';
import { CheckCircle2 } from 'lucide-react';

export const CompanyDashboard = () => {
  const { currentUser, logout } = useAuth();

  // Navigation state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'candidates' | 'shortlist' | 'drives' | 'profile'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search & filter state (Talent Discovery)
  const [skillQuery, setSkillQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [minReadiness, setMinReadiness] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Candidates & departments data
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recruitment drives data
  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(false);

  // Recruiter shortlist & company profile
  const [shortlist, setShortlist] = useState(() =>
    getRecruiterShortlist(currentUser?.uid)
  );
  const [profile, setProfile] = useState(() =>
    getRecruiterProfile(currentUser?.uid, currentUser)
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

  // 1. Fetch Students
  const loadCandidates = async () => {
    setLoading(true);
    try {
      const data = await fetchAllStudents({
        skill: skillQuery,
        department: departmentFilter
      });
      setStudents(data.students || []);
      if (data.departments && data.departments.length > 0) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error('Failed to load students for recruiter:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Drives
  const loadDrives = async () => {
    setLoadingDrives(true);
    try {
      const list = await fetchDrives();
      setDrives(list || []);
    } catch (err) {
      console.error('Failed to load drives for recruiter:', err);
    } finally {
      setLoadingDrives(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [skillQuery, departmentFilter]);

  useEffect(() => {
    loadDrives();
  }, []);

  // Sync shortlist changes with persistent local storage
  const handleToggleShortlist = (student) => {
    if (!student || !student.uid) return;
    const exists = shortlist.some((item) => item.uid === student.uid);

    let updated = [];
    if (exists) {
      updated = shortlist.filter((item) => item.uid !== student.uid);
      showToast(`Removed ${student.personalInfo?.fullName || 'Candidate'} from shortlist.`);
    } else {
      updated = [
        {
          uid: student.uid,
          student,
          shortlistedAt: new Date().toISOString(),
          stage: 'Shortlisted',
          notes: ''
        },
        ...shortlist
      ];
      showToast(`Shortlisted ${student.personalInfo?.fullName || 'Candidate'} successfully!`);
    }

    setShortlist(updated);
    saveRecruiterShortlist(currentUser?.uid, updated);
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
    setDrives((prev) => [newDrive, ...prev.filter((d) => d.id !== newDrive.id)]);
    showToast(`Recruitment drive "${newDrive.companyName} - ${newDrive.jobRole}" posted.`);
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

  // Filter students based on min readiness if specified
  const filteredCandidates = students.filter((s) => {
    const r = s.placementScores?.overallReadiness || 0;
    return r >= minReadiness;
  });

  const companyDisplayName =
    profile.companyName || currentUser?.displayName || 'Campus Recruiter';
  const recruiterDisplayEmail =
    profile.recruiterEmail || currentUser?.email || 'recruiter@company.com';

  const isCurrentCandidateShortlisted = selectedCandidate
    ? shortlist.some((item) => item.uid === selectedCandidate.uid)
    : false;

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
        candidatesCount={students.length}
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
          {activeTab === 'overview' && (
            <CompanyOverviewView
              companyName={companyDisplayName}
              students={students}
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
            <CompanyTalentDiscoveryView
              skillQuery={skillQuery}
              setSkillQuery={setSkillQuery}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              minReadiness={minReadiness}
              setMinReadiness={setMinReadiness}
              viewMode={viewMode}
              setViewMode={setViewMode}
              departments={departments}
              filteredCandidates={filteredCandidates}
              loading={loading}
              shortlist={shortlist}
              onToggleShortlist={handleToggleShortlist}
              onSelectCandidate={(cand) => {
                setSelectedCandidate(cand);
                setIsCandidateModalOpen(true);
              }}
              onDownloadResume={handleDownloadResume}
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
            />
          )}

          {activeTab === 'profile' && (
            <CompanyProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              showToast={showToast}
            />
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
