import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookmarkCheck,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export const CompanySidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  companyName,
  recruiterEmail,
  shortlistCount = 0,
  candidatesCount = 0,
  drivesCount = 0,
  onOpenPostDrive,
  onSignOut
}) => {
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (mobileOpen) {
      setMobileOpen(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItemClass = (isActive) =>
    `w-full flex items-center ${
      isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
    } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group relative ${
      isActive
        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold shadow-sm shadow-brand-950/40'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800/80 text-slate-100 select-none">
      {/* 1. Brand Header */}
      <div
        className={`p-4 border-b border-slate-800/80 flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight font-display">
                  Placement Genie
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                Recruiter Portal
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0"
            title="Placement Genie Recruiter Portal"
          >
            <Building2 className="w-5 h-5" />
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
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

      {/* 2. Recruiter Summary Card (When Expanded) */}
      {!isCollapsed && (
        <div className="px-3.5 py-3 mx-3 my-2.5 bg-slate-850/80 rounded-xl border border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px] truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{companyName || 'Campus Partner'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-800 text-center">
            <div className="bg-slate-900/60 p-1.5 rounded-lg">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Pool</div>
              <div className="text-xs font-extrabold text-white">{candidatesCount}</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded-lg">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Starred</div>
              <div className="text-xs font-extrabold text-brand-400">{shortlistCount}</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded-lg">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Drives</div>
              <div className="text-xs font-extrabold text-indigo-400">{drivesCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-4 scrollbar-thin">
        {/* Core Recruiter Workflow */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Recruiter Dashboard
            </div>
          )}

          {/* Dashboard Overview */}
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className={navItemClass(activeTab === 'overview')}
            title={isCollapsed ? 'Dashboard Overview' : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeTab === 'overview'
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span>Overview</span>}
            </div>
          </button>

          {/* Candidate Discovery */}
          <button
            type="button"
            onClick={() => handleNavClick('candidates')}
            className={navItemClass(activeTab === 'candidates')}
            title={isCollapsed ? 'Talent Discovery' : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Users
                className={`w-4 h-4 ${
                  activeTab === 'candidates'
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span>Talent Discovery</span>}
            </div>
            {!isCollapsed && candidatesCount > 0 && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'candidates'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {candidatesCount}
              </span>
            )}
          </button>

          {/* Shortlisted Candidates */}
          <button
            type="button"
            onClick={() => handleNavClick('shortlist')}
            className={navItemClass(activeTab === 'shortlist')}
            title={isCollapsed ? 'Shortlisted Candidates' : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <BookmarkCheck
                className={`w-4 h-4 ${
                  activeTab === 'shortlist'
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span>Shortlisted Candidates</span>}
            </div>
            {!isCollapsed && shortlistCount > 0 && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'shortlist'
                    ? 'bg-white/20 text-white'
                    : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                }`}
              >
                {shortlistCount}
              </span>
            )}
          </button>

          {/* Campus Recruitment Drives */}
          <button
            type="button"
            onClick={() => handleNavClick('drives')}
            className={navItemClass(activeTab === 'drives')}
            title={isCollapsed ? 'Recruitment Drives & Jobs' : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Briefcase
                className={`w-4 h-4 ${
                  activeTab === 'drives'
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span>Recruitment Drives</span>}
            </div>
            {!isCollapsed && drivesCount > 0 && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'drives'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                {drivesCount}
              </span>
            )}
          </button>

          {/* Company Profile & Hiring Criteria */}
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className={navItemClass(activeTab === 'profile')}
            title={isCollapsed ? 'Company Profile & Criteria' : undefined}
          >
            <div className="flex items-center space-x-2.5">
              <Building2
                className={`w-4 h-4 ${
                  activeTab === 'profile'
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span>Company Profile</span>}
            </div>
          </button>
        </div>

        {/* Quick Primary Action */}
        {!isCollapsed && onOpenPostDrive && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenPostDrive}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold shadow-sm transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Post Recruitment Drive</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Recruiter Account Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold flex items-center justify-center text-xs flex-shrink-0">
                {(companyName || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {companyName || 'Recruiter'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {recruiterEmail || 'Official Account'}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onSignOut}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign out of Recruiter Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out flex-shrink-0 h-screen sticky top-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent()}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-fade-in">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};
