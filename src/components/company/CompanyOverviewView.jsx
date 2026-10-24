import React from 'react';
import {
  Briefcase,
  Users,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Eye,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  Building2,
  Bookmark,
  ShieldCheck,
  Clock,
  Award,
  UserCheck
} from 'lucide-react';
import { Card, Button, Badge, StatCard } from '../ui';

export const CompanyOverviewView = ({
  companyProfile = {},
  overviewData = null,
  drives = [],
  shortlist = [],
  onNavigate,
  onOpenPostDrive,
  onSelectCandidate,
  onToggleShortlist,
  onDownloadResume
}) => {
  const company = overviewData?.company || companyProfile || {};
  const stats = overviewData?.stats || {
    totalJobs: drives.length,
    activeJobs: drives.filter((d) => d.status === 'Active').length,
    upcomingJobs: drives.filter((d) => d.status === 'Upcoming').length,
    pendingJobs: drives.filter((d) => d.approvalStatus === 'pending').length,
    totalApplications: 0,
    directApplicationsCount: 0,
    nominationsCount: 0,
    shortlistedCount: shortlist.length,
    interviewingCount: 0,
    selectedCount: 0,
    rejectedCount: 0,
    totalEligibleCandidates: 0
  };

  const recentApplications = overviewData?.recentApplications || [];
  const shortlistedUids = new Set(shortlist.map((item) => item.uid));

  const companyDisplayName = company.companyName || 'Campus Recruiter';
  const approvalStatus = company.approvalStatus || 'approved';

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* 1. Welcome Hero Banner */}
      <Card className="p-6 sm:p-7 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {approvalStatus === 'approved' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Approved Partner Portal
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Verification Pending
                </span>
              )}
              <span className="text-xs text-slate-400">• Official Recruiter Access</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, {companyDisplayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Manage your company's campus recruitment drives, review eligible students, evaluate
              direct applicants, and track your interview pipeline.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => onNavigate('candidates')}
            >
              View Candidates
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={onOpenPostDrive}
            >
              Post Drive
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Key Metrics Row (Scraped exclusively from this company's jobs & candidates) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Your Job Postings"
          value={stats.totalJobs}
          subtext={`${stats.activeJobs} active • ${stats.pendingJobs} pending approval`}
          icon={Briefcase}
          colorScheme="indigo"
          onClick={() => onNavigate('drives')}
        />

        <StatCard
          title="Eligible Students"
          value={stats.totalEligibleCandidates}
          subtext="Meeting your role cutoffs"
          icon={Users}
          colorScheme="brand"
          onClick={() => onNavigate('candidates')}
        />

        <StatCard
          title="Applicants in Pipeline"
          value={stats.totalApplications}
          subtext={`${stats.directApplicationsCount} direct • ${stats.nominationsCount} nominated`}
          icon={BookmarkCheck}
          colorScheme="amber"
          onClick={() => onNavigate('candidates')}
        />

        <StatCard
          title="Selections & Offers"
          value={stats.selectedCount}
          subtext={`${stats.interviewingCount} in active interviews`}
          icon={Sparkles}
          colorScheme="emerald"
          onClick={() => onNavigate('candidates')}
        />
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Your Jobs & Recent Applicants (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Your Company's Job Postings */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Your Recruitment Drives
                </h3>
                <p className="text-xs text-slate-400">
                  Approved jobs and pending placement cell reviews
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('drives')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 group"
              >
                <span>All Drives ({drives.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {drives.length > 0 ? (
              <div className="space-y-3">
                {drives.slice(0, 4).map((dr) => (
                  <div
                    key={dr.id}
                    className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white truncate">
                          {dr.jobRole}
                        </span>
                        {dr.approvalStatus === 'approved' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Published to Students
                          </span>
                        ) : dr.approvalStatus === 'rejected' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-400" /> Rejected
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> Pending Approval
                          </span>
                        )}
                        <Badge
                          variant={dr.status === 'Active' ? 'emerald' : dr.status === 'Upcoming' ? 'indigo' : 'neutral'}
                          size="sm"
                        >
                          {dr.status}
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
                        <span>CTC: <strong className="text-emerald-400">{dr.packageCTC || 'TBD'}</strong></span>
                        <span>Cutoff CGPA: <strong className="text-white">{dr.minCgpa || 0}+</strong></span>
                        <span>Drive Date: <strong className="text-slate-300">{dr.driveDate || 'TBD'}</strong></span>
                      </div>
                    </div>

                    {/* Candidate Counts Strip */}
                    <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[9px] uppercase font-bold text-slate-400">Eligible</div>
                        <div className="text-xs font-extrabold text-brand-400">{dr.eligibleCount || 0}</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[9px] uppercase font-bold text-slate-400">Applicants</div>
                        <div className="text-xs font-extrabold text-indigo-400">{dr.applicantsCount || 0}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('candidates')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold"
                      >
                        Candidates
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 space-y-2">
                <Briefcase className="w-6 h-6 mx-auto text-slate-500" />
                <p className="font-semibold text-slate-300">No recruitment drives posted yet.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={PlusCircle}
                  onClick={onOpenPostDrive}
                >
                  Post Your First Drive
                </Button>
              </div>
            )}
          </Card>

          {/* Section B: Recent Applicants for Your Jobs */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Recent Applications for Your Company
                </h3>
                <p className="text-xs text-slate-400">
                  Students who submitted applications for your posted jobs
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('candidates')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 group"
              >
                <span>View All Candidates</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {recentApplications.length > 0 ? (
              <div className="space-y-2.5">
                {recentApplications.map((app) => {
                  const student = app.student || {};
                  const personal = student.personalInfo || {};
                  const education = student.education || {};
                  const isShortlisted = shortlistedUids.has(app.studentId);

                  return (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-slate-850/70 hover:bg-slate-850 border border-slate-800 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-400 shrink-0 overflow-hidden">
                          {personal.profilePhoto ? (
                            <img
                              src={personal.profilePhoto}
                              alt={personal.fullName || app.studentName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (personal.fullName || app.studentName || 'A').charAt(0)
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs sm:text-sm text-white truncate">
                              {personal.fullName || app.studentName || 'Applicant'}
                            </span>
                            <Badge
                              variant={
                                app.status === 'selected'
                                  ? 'emerald'
                                  : app.status === 'rejected'
                                  ? 'neutral'
                                  : 'indigo'
                              }
                              size="sm"
                            >
                              {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            Role: <strong className="text-slate-300">{app.jobRole || 'Engineer'}</strong> •{' '}
                            {student.department || education.branch || 'Engineering'}{' '}
                            {education.cgpa ? `• CGPA: ${education.cgpa}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onSelectCandidate(student)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span className="hidden sm:inline">Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => onDownloadResume(e, student)}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-brand-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1"
                          title="Download Resume"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Resume</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 space-y-1">
                <Users className="w-6 h-6 mx-auto text-slate-500" />
                <p className="font-semibold text-slate-300">No student applications received yet.</p>
                <p className="text-[11px] text-slate-500">
                  Applications will appear here once eligible students apply to your approved jobs.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Company Profile Card & Pipeline Snapshot (1 col) */}
        <div className="space-y-6">
          {/* Company Profile Card */}
          <Card className="p-5 space-y-3.5 bg-gradient-to-br from-slate-900 to-indigo-950/30 border-slate-800">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider truncate">
                  {companyDisplayName}
                </h4>
                <span className="text-[10px] text-slate-400 truncate block">
                  {company.industry || 'Technology & Engineering'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Approval Status:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {approvalStatus.toUpperCase()}
                </span>
              </div>

              {company.website && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand-400 hover:underline truncate max-w-[150px]"
                  >
                    {company.website.replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}

              {company.contactPerson && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Contact Lead:</span>
                  <span className="font-semibold text-white">{company.contactPerson}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Target CGPA Cutoff:</span>
                <span className="font-semibold text-white">{company.targetMinCgpa || 7.0}+</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Target Readiness:</span>
                <span className="font-semibold text-emerald-400">
                  {company.targetMinReadiness || 65}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors text-center"
            >
              Manage Company Profile &rarr;
            </button>
          </Card>

          {/* Hiring Workflow Assistance Card */}
          <Card className="p-5 space-y-3 border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Authorized Recruiter Security
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your session is securely scoped to <strong className="text-white">{companyDisplayName}</strong>. Only authorized recruiters from your organization can view your posted drives and candidates.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Company-Isolated Jobs</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Verified Match Criteria</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Placement Cell Approvals</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
