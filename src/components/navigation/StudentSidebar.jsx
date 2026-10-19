import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Target,
  Cpu,
  Brain,
  Mic,
  FileText,
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
  X,
  Send,
  Sparkles
} from 'lucide-react';

export const StudentSidebar = ({
  activeTab,
  setActiveTab,
  activeSection,
  setActiveSection,
  onNavigate,
  testCenterSubTab = 'overview',
  resumeSubTab = 'builder',
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
  applicationsCount = 0,
  nominationsCount = 0,
  pendingConsentCount = 0
}) => {
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(activeTab === 'profile');
  const [assessmentsSubmenuOpen, setAssessmentsSubmenuOpen] = useState(
    ['assessments', 'technical', 'aptitude', 'interview'].includes(activeTab)
  );
  const [resumeSubmenuOpen, setResumeSubmenuOpen] = useState(
    ['resume', 'resume-builder', 'resume-analyzer'].includes(activeTab)
  );

  React.useEffect(() => {
    if (activeTab === 'profile') setProfileSubmenuOpen(true);
    if (['assessments', 'technical', 'aptitude', 'interview'].includes(activeTab)) {
      setAssessmentsSubmenuOpen(true);
    }
    if (['resume', 'resume-builder', 'resume-analyzer'].includes(activeTab)) {
      setResumeSubmenuOpen(true);
    }
  }, [activeTab]);

  const { personalInfo = {}, education = {}, placementScores = {} } = studentData || {};

  const currentReadiness = placementScores.overallReadiness !== undefined && placementScores.overallReadiness > 0
    ? placementScores.overallReadiness
    : (readinessScore || 0);

  const handleNavClick = (tab, section = null) => {
    if (onNavigate) {
      onNavigate(tab, section);
    } else {
      setActiveTab(tab);
      if (section && setActiveSection) {
        setActiveSection(section);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const navItemClass = (isActive) =>
    `w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-xl text-xs font-medium transition-all duration-150 group relative focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
      isActive
        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold shadow-sm shadow-brand-950/40'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  const subNavItemClass = (isActive) =>
    `w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
      isActive
        ? 'bg-brand-500/15 text-brand-300 font-semibold border-l-2 border-brand-400 pl-2.5'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
    }`;

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800/80 text-slate-100 select-none">

      {/* 1. Brand Header */}
      <div className={`p-4 border-b border-slate-800/80 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight font-display">Placement Genie</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Student Portal</span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0" title="Placement Genie">
            <GraduationCap className="w-5 h-5" />
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Close menu"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Compact Placement Status Widget (when expanded) */}
      {!isCollapsed && (
        <div className="px-3 py-2 mx-3 my-2 bg-slate-850/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs shadow-subtle">
          <div className="flex items-center space-x-2 min-w-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasProfile ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-medium text-[11px] truncate">
              {hasProfile ? 'Eligible for Campus Drives' : 'Profile Setup Needed'}
            </span>
          </div>
          {hasProfile && currentReadiness > 0 && (
            <span className="text-[11px] font-bold text-emerald-400 font-mono ml-2 flex-shrink-0">
              {currentReadiness}%
            </span>
          )}
        </div>
      )}

      {/* 3. Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-4 scrollbar-thin">

        {/* GROUP 1: CORE */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Core
            </div>
          )}

          {/* Overview / Dashboard */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={navItemClass(activeTab === 'dashboard')}
            title={isCollapsed ? "Dashboard Overview" : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!isCollapsed && <span>Dashboard</span>}
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
              title={isCollapsed ? "Placement Profile" : undefined}
            >
              <div className="flex items-center space-x-2.5">
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!isCollapsed && <span>Placement Profile</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    profileSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Profile Subsections */}
            {!isCollapsed && profileSubmenuOpen && (
              <div className="pl-5 pr-1 mt-1 space-y-0.5 border-l border-slate-800 ml-4 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'academics')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'academics')}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>Academics & CGPA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'skills')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'skills')}
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Technical Skills</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'projects')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'projects')}
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'experience')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'experience')}
                >
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>Work Experience</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'certifications')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'certifications')}
                >
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  <span>Certifications</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile', 'contact')}
                  className={subNavItemClass(activeTab === 'profile' && activeSection === 'contact')}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Info</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GROUP 2: PLACEMENT & JOBS */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Placement
            </div>
          )}

          {/* Browse Jobs */}
          <button
            type="button"
            onClick={() => handleNavClick('jobs')}
            className={navItemClass(activeTab === 'jobs')}
            title={isCollapsed ? "Browse Jobs" : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Briefcase className={`w-4 h-4 ${activeTab === 'jobs' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!isCollapsed && <span>Browse Jobs</span>}
            </div>
          </button>

          {/* My Applications */}
          <button
            type="button"
            onClick={() => handleNavClick('applications')}
            className={navItemClass(activeTab === 'applications')}
            title={isCollapsed ? "My Applications" : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Send className={`w-4 h-4 ${activeTab === 'applications' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!isCollapsed && <span>My Applications</span>}
            </div>
            {!isCollapsed && applicationsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'applications' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {applicationsCount}
              </span>
            )}
          </button>

          {/* My Nominations */}
          <button
            type="button"
            onClick={() => handleNavClick('nominations')}
            className={navItemClass(activeTab === 'nominations')}
            title={isCollapsed ? "My Nominations" : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Award className={`w-4 h-4 ${activeTab === 'nominations' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!isCollapsed && <span>My Nominations</span>}
            </div>
            {!isCollapsed && nominationsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                pendingConsentCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : activeTab === 'nominations' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {pendingConsentCount > 0 ? `${pendingConsentCount} Consent` : nominationsCount}
              </span>
            )}
          </button>
        </div>

        {/* GROUP 3: TEST CENTER */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Test Center
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={() => {
                handleNavClick('assessments', 'overview');
                if (!isCollapsed) setAssessmentsSubmenuOpen(!assessmentsSubmenuOpen);
              }}
              className={navItemClass(activeTab === 'assessments' || activeTab === 'technical' || activeTab === 'aptitude' || activeTab === 'interview')}
              title={isCollapsed ? "Placement Test Center" : undefined}
            >
              <div className="flex items-center space-x-2.5">
                <Target className={`w-4 h-4 ${['assessments', 'technical', 'aptitude', 'interview'].includes(activeTab) ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!isCollapsed && <span>Test Center</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    assessmentsSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Assessment specific items */}
            {!isCollapsed && assessmentsSubmenuOpen && (
              <div className="pl-5 pr-1 mt-1 space-y-0.5 border-l border-slate-800 ml-4 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleNavClick('assessments', 'technical')}
                  className={subNavItemClass(activeTab === 'technical' || (['tests', 'assessments'].includes(activeTab) && testCenterSubTab === 'technical'))}
                >
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span className="flex-1 text-left truncate">Technical Skill Test</span>
                  {latestAssessment?.technicalScore !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold">
                      {latestAssessment.technicalScore}%
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('assessments', 'aptitude')}
                  className={subNavItemClass(activeTab === 'aptitude' || (['tests', 'assessments'].includes(activeTab) && testCenterSubTab === 'aptitude'))}
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="flex-1 text-left truncate">Aptitude & Reasoning</span>
                  {latestAptitudeAssessment?.finalScore !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                      {latestAptitudeAssessment.finalScore}%
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('assessments', 'interview')}
                  className={subNavItemClass(activeTab === 'interview' || (['tests', 'assessments'].includes(activeTab) && testCenterSubTab === 'interview'))}
                >
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span className="flex-1 text-left truncate">Mock Interview</span>
                  {latestCommunicationAssessment?.finalScore !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold">
                      {latestCommunicationAssessment.finalScore}%
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GROUP 3: RESUME & ROADMAP */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Resume & Career
            </div>
          )}

          {/* Unified Resume Studio */}
          <div>
            <button
              type="button"
              onClick={() => {
                handleNavClick('resume', 'builder');
                if (!isCollapsed) setResumeSubmenuOpen(!resumeSubmenuOpen);
              }}
              className={navItemClass(activeTab === 'resume' || activeTab === 'resume-builder' || activeTab === 'resume-analyzer')}
              title={isCollapsed ? "Resume Studio" : undefined}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className={`w-4 h-4 ${['resume', 'resume-builder', 'resume-analyzer'].includes(activeTab) ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!isCollapsed && <span>Resume Studio</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    resumeSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {!isCollapsed && resumeSubmenuOpen && (
              <div className="pl-5 pr-1 mt-1 space-y-0.5 border-l border-slate-800 ml-4 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleNavClick('resume', 'builder')}
                  className={subNavItemClass(activeTab === 'resume-builder' || (activeTab === 'resume' && resumeSubTab === 'builder'))}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="flex-1 text-left truncate">ATS Resume PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('resume', 'analyzer')}
                  className={subNavItemClass(activeTab === 'resume-analyzer' || (activeTab === 'resume' && resumeSubTab === 'analyzer'))}
                >
                  <Search className="w-3.5 h-3.5 text-teal-400" />
                  <span className="flex-1 text-left truncate">AI Keyword Gap</span>
                </button>
              </div>
            )}
          </div>

          {/* Career Roadmap */}
          <button
            type="button"
            onClick={() => handleNavClick('roadmap')}
            className={navItemClass(activeTab === 'roadmap')}
            title={isCollapsed ? "Personalized Roadmap" : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Map className={`w-4 h-4 ${activeTab === 'roadmap' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!isCollapsed && <span>Career Roadmap</span>}
            </div>
          </button>

          {/* Full Page View Mode */}
          <button
            type="button"
            onClick={() => handleNavClick('all')}
            className={navItemClass(activeTab === 'all')}
            title={isCollapsed ? "Full Page View (All Sections)" : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Layers className={`w-4 h-4 ${activeTab === 'all' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!isCollapsed && <span>Full Page View</span>}
            </div>
          </button>
        </div>

        {/* GROUP 4: QUICK ACTIONS */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Quick Actions
            </div>

            <button
              type="button"
              onClick={onOpenEditProfile}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-850/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
            >
              <div className="flex items-center space-x-2">
                <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                <span>Edit Profile</span>
              </div>
            </button>

            <button
              type="button"
              onClick={onQuickDownloadATS}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-850/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download ATS PDF</span>
              </div>
            </button>
          </div>
        )}

      </div>

      {/* 4. Bottom User Profile & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
                alt={personalInfo.fullName || 'Student'}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700 flex-shrink-0"
              />
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {personalInfo.fullName || 'Student'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30 flex-shrink-0">
                    Student
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {education.branch || education.degree || 'Candidate'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <img
              src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
              alt={personalInfo.fullName || 'Student'}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
              title={personalInfo.fullName || 'Student'}
            />
            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              title="Sign Out"
              aria-label="Sign Out"
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
        className={`hidden md:block h-screen sticky top-0 transition-all duration-200 z-30 flex-shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent()}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};
