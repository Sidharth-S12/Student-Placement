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
  Bookmark
} from 'lucide-react';
import { Card, Button, Badge, StatCard } from '../ui';

export const CompanyOverviewView = ({
  companyName,
  students = [],
  drives = [],
  shortlist = [],
  onNavigate,
  onOpenPostDrive,
  onSelectCandidate,
  onToggleShortlist,
  onDownloadResume
}) => {
  const activeDrives = drives.filter((d) => d.status === 'Active');
  const upcomingDrives = drives.filter((d) => d.status === 'Upcoming');
  const day1ReadyCount = students.filter(
    (s) => (s.placementScores?.overallReadiness || 0) >= 75
  ).length;

  // Top candidates sorted by overall readiness
  const topCandidates = [...students]
    .sort(
      (a, b) =>
        (b.placementScores?.overallReadiness || 0) -
        (a.placementScores?.overallReadiness || 0)
    )
    .slice(0, 5);

  const shortlistedUids = new Set(shortlist.map((item) => item.uid));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Welcome Hero Banner */}
      <Card className="p-6 sm:p-7 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Badge variant="indigo" size="sm">
                Campus Hiring 2025–2026
              </Badge>
              <span className="text-xs text-slate-400">• Verified Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, {companyName || 'Campus Recruiter'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Discover evaluated campus engineering talent with verified coding assessments,
              adaptive aptitude scores, and verified placement readiness.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => onNavigate('candidates')}
            >
              Explore Talent
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

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Active Drives"
          value={activeDrives.length || drives.length}
          subtext={`${upcomingDrives.length} upcoming scheduled`}
          icon={Briefcase}
          colorScheme="indigo"
          onClick={() => onNavigate('drives')}
        />

        <StatCard
          title="Total Candidates"
          value={students.length}
          subtext="Verified campus pool"
          icon={Users}
          colorScheme="brand"
          onClick={() => onNavigate('candidates')}
        />

        <StatCard
          title="Shortlisted Talent"
          value={shortlist.length}
          subtext="In recruiter pipeline"
          icon={BookmarkCheck}
          colorScheme="amber"
          onClick={() => onNavigate('shortlist')}
        />

        <StatCard
          title="Day-1 Ready"
          value={day1ReadyCount}
          subtext="Readiness score &ge; 75%"
          icon={Sparkles}
          colorScheme="emerald"
          onClick={() => onNavigate('candidates')}
        />
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Candidates & Drives (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Top Evaluated Candidates */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Top Evaluated Candidates
                </h3>
                <p className="text-xs text-slate-400">
                  Students evaluated with highest placement readiness
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('candidates')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 group"
              >
                <span>View All Pool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {topCandidates.length > 0 ? (
              <div className="space-y-2.5">
                {topCandidates.map((student) => {
                  const personal = student.personalInfo || {};
                  const education = student.education || {};
                  const scores = student.placementScores || {};
                  const readiness = scores.overallReadiness || 0;
                  const isShortlisted = shortlistedUids.has(student.uid);

                  return (
                    <div
                      key={student.uid}
                      className="p-3 sm:p-3.5 rounded-xl bg-slate-850/70 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-400 flex-shrink-0 overflow-hidden">
                          {personal.profilePhoto ? (
                            <img
                              src={personal.profilePhoto}
                              alt={personal.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (personal.fullName || 'C').charAt(0)
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs sm:text-sm text-white truncate">
                              {personal.fullName || 'Candidate'}
                            </span>
                            <Badge
                              variant={readiness >= 80 ? 'emerald' : 'primary'}
                              size="sm"
                            >
                              {readiness}% Ready
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {education.degree || 'B.Tech'}{' '}
                            {student.department || education.branch
                              ? `• ${student.department || education.branch}`
                              : ''}
                            {education.cgpa ? ` • CGPA: ${education.cgpa}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleShortlist(student)}
                          className={`p-2 rounded-lg border text-xs transition-colors ${
                            isShortlisted
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title={isShortlisted ? 'Shortlisted' : 'Shortlist'}
                        >
                          {isShortlisted ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>

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
                          title="Download ATS Resume"
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
                <p className="font-semibold text-slate-300">Loading student candidate pool...</p>
              </div>
            )}
          </Card>

          {/* Section B: Recruitment Drives List */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Campus Recruitment Drives
                </h3>
                <p className="text-xs text-slate-400">
                  Scheduled drives and active placement opportunities
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('drives')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 group"
              >
                <span>Manage Drives</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {drives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {drives.slice(0, 4).map((dr) => (
                  <div
                    key={dr.id}
                    className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white truncate">
                          {dr.companyName}
                        </span>
                        <Badge
                          variant={
                            dr.status === 'Active'
                              ? 'emerald'
                              : dr.status === 'Upcoming'
                              ? 'indigo'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {dr.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-brand-300 font-semibold truncate">
                        {dr.jobRole}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center space-x-1.5 truncate">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{dr.packageCTC || 'Negotiable'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{dr.driveDate || 'TBD'}</span>
                      </div>
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
        </div>

        {/* Right Column: Shortlist Snapshot & Criteria (1 col) */}
        <div className="space-y-6">
          {/* Shortlisted Candidates Snapshot */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                  Shortlist Snapshot
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-400">
                {shortlist.length} Starred
              </span>
            </div>

            {shortlist.length > 0 ? (
              <div className="space-y-2">
                {shortlist.slice(0, 4).map((item) => {
                  const s = item.student || {};
                  const personal = s.personalInfo || {};
                  const education = s.education || {};
                  return (
                    <div
                      key={item.uid}
                      onClick={() => onSelectCandidate(s)}
                      className="p-2.5 rounded-xl bg-slate-850/80 hover:bg-slate-850 border border-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-xs text-white truncate">
                          {personal.fullName || 'Candidate'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {education.branch || s.department || 'Engineering'} • CGPA:{' '}
                          {education.cgpa || '—'}
                        </div>
                      </div>
                      <Badge variant="amber" size="sm">
                        {item.stage || 'Shortlisted'}
                      </Badge>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => onNavigate('shortlist')}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  View full shortlist pipeline &rarr;
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 space-y-1">
                <Bookmark className="w-5 h-5 mx-auto text-slate-500" />
                <p className="font-semibold text-slate-300">No candidates shortlisted yet</p>
                <p className="text-[11px] text-slate-500">
                  Bookmark candidates in Talent Discovery to track your pipeline.
                </p>
              </div>
            )}
          </Card>

          {/* Hiring Workflow Assistance Card */}
          <Card className="p-5 space-y-3 bg-gradient-to-br from-slate-900 to-indigo-950/30 border-slate-800">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Recruitment Workflow
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Placement Genie verifies student skill proficiencies through live technical code
              evaluations, timed aptitude assessments, and AI mock interview scores.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Verified Coding Tests</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Adaptive Aptitude Scoring</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Direct ATS Resume Export</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
