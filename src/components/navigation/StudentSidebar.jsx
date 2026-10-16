import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Target,
  Cpu,
  Brain,
  MessageSquare,
  Mic,
  FileText,
  Sparkles,
  Map,
  Layers,
  Download,
  Edit3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Award,
  Briefcase,
  Code2,
  FolderGit2,
  Phone,
  Search,
  Camera,
  X
} from 'lucide-react';

export const StudentSidebar = ({
  activeTab,
  setActiveTab,
  activeSection,
  setActiveSection,
  studentData,
  hasProfile,
  readinessScore,
  latestAssessment,
  latestAptitudeAssessment,
  latestCommunicationAssessment,
  onOpenEditProfile,
  onOpenATSModal,
  onQuickDownloadATS,
  onStartTechnical,
  onStartAptitude,
  onStartCommunication,
  onSignOut,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(true);
  const [assessmentsSubmenuOpen, setAssessmentsSubmenuOpen] = useState(true);

  const { personalInfo = {}, education = {}, placementScores = {} } = studentData || {};

  const currentReadiness = placementScores.overallReadiness !== undefined && placementScores.overallReadiness > 0
    ? placementScores.overallReadiness
    : (readinessScore || 0);

  const handleNavClick = (tab, section = null) => {
    setActiveTab(tab);
    if (section && setActiveSection) {
      setActiveSection(section);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
    // Scroll smoothly to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItemClass = (isActive) =>
    `w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
      isActive
        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/25 font-bold'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;

  const subNavItemClass = (isActive) =>
    `w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
      isActive
        ? 'bg-brand-500/20 text-brand-300 font-bold border-l-2 border-brand-400'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`;

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      
      {/* 1. Header & Branding */}
      <div className={`p-4 border-b border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight">Placement Genie</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Student Portal</span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 flex-shrink-0" title="Placement Genie">
            <GraduationCap className="w-5 h-5" />
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Readiness Score Mini Widget (when expanded) */}
      {!isCollapsed && (
        <div className="px-4 py-3 mx-3 my-2.5 bg-gradient-to-br from-slate-800/90 to-slate-850/90 rounded-2xl border border-slate-700/60 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-brand-400" />
              Readiness Score
            </span>
            <span className="font-extrabold text-white text-xs">{currentReadiness}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                currentReadiness >= 75
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : currentReadiness >= 50
                  ? 'bg-gradient-to-r from-brand-500 to-indigo-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, currentReadiness))}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/40 text-[10px]">
            <span className="text-slate-400">Eligibility Status:</span>
            {hasProfile ? (
              <span className="text-emerald-400 font-bold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Eligible
              </span>
            ) : (
              <span className="text-amber-400 font-bold">Profile Setup Required</span>
            )}
          </div>
        </div>
      )}

      {/* 3. Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* GROUP 1: CORE */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Core Overview
            </div>
          )}

          {/* Overview / Dashboard */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={navItemClass(activeTab === 'dashboard')}
            title={isCollapsed ? "Dashboard Overview" : undefined}
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-brand-400'}`} />
              {!isCollapsed && <span>Dashboard Overview</span>}
            </div>
          </button>

          {/* Placement Profile */}
          <div>
            <button
              type="button"
              onClick={() => {
                handleNavClick('profile');
                if (!isCollapsed) setProfileSubmenuOpen(!profileSubmenuOpen);
              }}
              className={navItemClass(activeTab === 'profile')}
              title={isCollapsed ? "My Profile" : undefined}
            >
              <div className="flex items-center space-x-3">
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-indigo-400'}`} />
                {!isCollapsed && <span>Placement Profile</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    profileSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Profile Subsections (Expanded only) */}
            {!isCollapsed && profileSubmenuOpen && (
              <div className="pl-6 pr-1 mt-1 space-y-0.5 border-l border-slate-800 ml-5 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'academics')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'academics')}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academics & CGPA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'skills')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'skills')}
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Technical Skills</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'projects')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'projects')}
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Software Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'experience')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'experience')}
                >
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Work Experience</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'certifications')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'certifications')}
                >
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Certifications & Honors</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'contact')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'contact')}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact & Links</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GROUP 2: ASSESSMENTS */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Assessments Suite
            </div>
          )}

          {/* Assessments Hub Main Tab */}
          <div>
            <button
              type="button"
              onClick={() => {
                handleNavClick('assessments');
                if (!isCollapsed) setAssessmentsSubmenuOpen(!assessmentsSubmenuOpen);
              }}
              className={navItemClass(activeTab === 'assessments')}
              title={isCollapsed ? "Assessments Hub" : undefined}
            >
              <div className="flex items-center space-x-3">
                <Target className={`w-4 h-4 ${activeTab === 'assessments' ? 'text-white' : 'text-emerald-400'}`} />
                {!isCollapsed && <span>Assessments Hub</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    assessmentsSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Assessment specific items */}
            {!isCollapsed && assessmentsSubmenuOpen && (
              <div className="pl-6 pr-1 mt-1 space-y-0.5 border-l border-slate-800 ml-5 animate-fade-in">
                {/* Technical Test */}
                <button
                  type="button"
                  onClick={() => handleNavClick('technical')}
                  className={subNavItemClass(activeTab === 'technical')}
                >
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span className="flex-1 text-left">Technical Skill Test</span>
                  {latestAssessment?.technicalScore !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
                      {latestAssessment.technicalScore}%
                    </span>
                  )}
                </button>

                {/* Aptitude Test */}
                <button
                  type="button"
                  onClick={() => handleNavClick('aptitude')}
                  className={subNavItemClass(activeTab === 'aptitude')}
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="flex-1 text-left">Aptitude & Reasoning</span>
                  {latestAptitudeAssessment?.finalScore !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {latestAptitudeAssessment.finalScore}%
                    </span>
                  )}
                </button>

                {/* Communication & Mock Interview */}
                <button
                  type="button"
                  onClick={() => handleNavClick('interview')}
                  className={subNavItemClass(activeTab === 'interview')}
                >
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span className="flex-1 text-left">AI Mock Interview</span>
                  {latestCommunicationAssessment?.finalScore !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                      {latestCommunicationAssessment.finalScore}%
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GROUP 3: RESUME & CAREER TOOLS */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Resume & Career Tools
            </div>
          )}

          {/* ATS Resume Builder */}
          <button
            type="button"
            onClick={() => handleNavClick('resume-builder')}
            className={navItemClass(activeTab === 'resume-builder')}
            title={isCollapsed ? "ATS Resume Builder" : undefined}
          >
            <div className="flex items-center space-x-3">
              <FileText className={`w-4 h-4 ${activeTab === 'resume-builder' ? 'text-white' : 'text-amber-400'}`} />
              {!isCollapsed && <span>ATS Resume Builder</span>}
            </div>
          </button>

          {/* AI Resume Analyzer */}
          <button
            type="button"
            onClick={() => handleNavClick('resume-analyzer')}
            className={navItemClass(activeTab === 'resume-analyzer')}
            title={isCollapsed ? "AI Resume Analyzer" : undefined}
          >
            <div className="flex items-center space-x-3">
              <Search className={`w-4 h-4 ${activeTab === 'resume-analyzer' ? 'text-white' : 'text-teal-400'}`} />
              {!isCollapsed && <span>AI Resume Analyzer</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold uppercase">
                AI
              </span>
            )}
          </button>

          {/* Career Roadmap */}
          <button
            type="button"
            onClick={() => handleNavClick('roadmap')}
            className={navItemClass(activeTab === 'roadmap')}
            title={isCollapsed ? "Personalized Roadmap" : undefined}
          >
            <div className="flex items-center space-x-3">
              <Map className={`w-4 h-4 ${activeTab === 'roadmap' ? 'text-white' : 'text-pink-400'}`} />
              {!isCollapsed && <span>Personalized Roadmap</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold uppercase">
                Milestones
              </span>
            )}
          </button>

          {/* AI Appearance & Posture Analyzer */}
          <button
            type="button"
            onClick={() => handleNavClick('appearance')}
            className={navItemClass(activeTab === 'appearance')}
            title={isCollapsed ? "Appearance & Posture" : undefined}
          >
            <div className="flex items-center space-x-3">
              <Camera className={`w-4 h-4 ${activeTab === 'appearance' ? 'text-white' : 'text-purple-400'}`} />
              {!isCollapsed && <span>Appearance & Posture</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                Vision
              </span>
            )}
          </button>
        </div>

        {/* GROUP 4: VIEW OPTIONS */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              View Modes
            </div>
          )}

          {/* Full Single Page View */}
          <button
            type="button"
            onClick={() => handleNavClick('all')}
            className={navItemClass(activeTab === 'all')}
            title={isCollapsed ? "Full Page View (All Sections)" : undefined}
          >
            <div className="flex items-center space-x-3">
              <Layers className={`w-4 h-4 ${activeTab === 'all' ? 'text-white' : 'text-sky-400'}`} />
              {!isCollapsed && <span>Full Page View</span>}
            </div>
          </button>
        </div>

        {/* GROUP 5: QUICK ACTIONS (when expanded) */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Quick Actions
            </div>

            <button
              type="button"
              onClick={onOpenEditProfile}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-2.5">
                <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                <span>Edit Profile</span>
              </div>
              <span className="text-[10px] text-slate-400">Modal</span>
            </button>

            <button
              type="button"
              onClick={onQuickDownloadATS}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-2.5">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download ATS PDF</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">1-Click</span>
            </button>
          </div>
        )}

      </div>

      {/* 4. Bottom User Profile & Sign Out */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
                alt={personalInfo.fullName || 'Student'}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-700 flex-shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {personalInfo.fullName || 'Student'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {education.degree || education.branch || personalInfo.email || 'Placement Candidate'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <img
              src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
              alt={personalInfo.fullName || 'Student'}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-700"
              title={personalInfo.fullName || 'Student'}
            />
            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: sticky left side */}
      <aside
        className={`hidden md:block h-screen sticky top-0 transition-all duration-300 z-30 flex-shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        {renderContent()}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};
