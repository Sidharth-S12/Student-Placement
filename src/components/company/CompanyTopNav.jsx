import React from 'react';
import {
  Menu,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  LogOut,
  Building2,
  BookmarkCheck
} from 'lucide-react';
import { Button, Badge } from '../ui';

export const CompanyTopNav = ({
  activeTab,
  onToggleMobile,
  companyName,
  recruiterEmail,
  shortlistCount = 0,
  onOpenPostDrive,
  onSignOut
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Dashboard Overview';
      case 'candidates':
        return 'Job Candidates & Talent Pool';
      case 'shortlist':
        return 'Shortlisted Candidates';
      case 'drives':
        return 'Recruitment Drives & Jobs';
      case 'profile':
        return 'Company Profile & Criteria';
      default:
        return 'Recruiter Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between select-none">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium truncate">
          <span className="text-slate-500 hidden sm:inline">Recruiter Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-white font-semibold truncate">{getTabTitle()}</span>
        </div>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5 flex-shrink-0">
        <Badge variant="indigo" size="sm" className="hidden sm:inline-flex">
          <ShieldCheck className="w-3 h-3 text-indigo-400 mr-1" />
          <span>Verified Recruiter</span>
        </Badge>

        {onOpenPostDrive && (
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={onOpenPostDrive}
            className="shadow-sm"
          >
            <span className="hidden sm:inline">Post Drive</span>
            <span className="sm:hidden">Post</span>
          </Button>
        )}

        <div className="hidden lg:flex flex-col text-right pr-1">
          <span className="text-xs font-bold text-white leading-tight truncate max-w-[160px]">
            {companyName || 'Campus Recruiter'}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
            {recruiterEmail || 'Official Account'}
          </span>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
