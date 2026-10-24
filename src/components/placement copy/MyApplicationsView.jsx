import React, { useState } from 'react';
import {
  Send,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trash2,
  Sparkles,
  ExternalLink,
  Loader2,
  Briefcase,
  ChevronRight,
  Video,
  Award
} from 'lucide-react';
import { withdrawApplication } from '../../services/applicationService';
import { Card, Button, Badge } from '../ui';

const PIPELINE_STAGES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected'
];

export const MyApplicationsView = ({
  applications = [],
  onNavigateToJobs,
  onRefreshApplications,
  showToast
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [withdrawingId, setWithdrawingId] = useState(null);

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const handleWithdraw = async (appId, companyName) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for ${companyName}? This action cannot be undone.`)) {
      return;
    }

    setWithdrawingId(appId);
    try {
      await withdrawApplication(appId);
      if (showToast) showToast(`Application for ${companyName} withdrawn.`);
      if (onRefreshApplications) onRefreshApplications();
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      alert(err.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStageIndex = (status) => {
    if (status === 'Selected') return 4;
    if (status === 'Interview Scheduled') return 3;
    if (status === 'Shortlisted') return 2;
    if (status === 'Under Review') return 1;
    if (status === 'Applied') return 0;
    return -1;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              My Job Applications
            </h1>
            <Badge variant="emerald">{applications.length} Submitted</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your recruitment stages, view scheduled interviews, and monitor status updates in real-time.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Briefcase}
          onClick={onNavigateToJobs}
        >
          Browse Open Jobs
        </Button>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === st
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 3. Applications List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'Rejected';
            const canWithdraw = ['Applied', 'Under Review'].includes(app.status);

            return (
              <Card
                key={app.id}
                className="p-5 sm:p-6 bg-slate-900 border-slate-800 space-y-5 shadow-lg"
              >
                {/* Top Row: Company, Role, Source, Status */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {app.companyName}
                      </span>
                      <Badge
                        variant={app.source === 'both' ? 'purple' : 'indigo'}
                        size="sm"
                      >
                        {app.source === 'both' ? 'Direct + Nominated' : 'Direct Application'}
                      </Badge>
                      {app.appliedAt && (
                        <span className="text-[11px] text-slate-500">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {app.jobRole}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <Badge
                      variant={
                        app.status === 'Selected'
                          ? 'emerald'
                          : app.status === 'Interview Scheduled'
                          ? 'purple'
                          : app.status === 'Shortlisted'
                          ? 'amber'
                          : app.status === 'Rejected'
                          ? 'rose'
                          : 'indigo'
                      }
                      size="sm"
                      dot
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>

                {/* Compensation & Drive Metadata */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Package CTC</span>
                    <span className="font-bold text-emerald-400">{app.packageCTC || 'Competitive'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Drive Date</span>
                    <span className="font-semibold text-white">{app.driveDate || 'TBA'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                    <span className="font-semibold text-white">{app.location || 'Campus'}</span>
                  </div>
                </div>

                {/* Progression Pipeline Bar */}
                {!isRejected && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Hiring Pipeline Progression
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {PIPELINE_STAGES.map((stage, idx) => {
                        const isDone = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;

                        return (
                          <div key={stage} className="space-y-1 text-center">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isDone
                                  ? 'bg-gradient-to-r from-brand-500 to-indigo-500 shadow-xs'
                                  : 'bg-slate-800'
                              }`}
                            />
                            <span
                              className={`text-[9px] block truncate font-medium ${
                                isCurrent
                                  ? 'text-brand-300 font-bold'
                                  : isDone
                                  ? 'text-slate-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Interview Scheduled Card (if applicable) */}
                {app.status === 'Interview Scheduled' && app.interviewDetails && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                      <Video className="w-4 h-4 text-purple-400" />
                      <span>Interview Round Scheduled</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-purple-400 text-[10px] block">Date & Time:</span>
                        <strong className="text-white">{app.interviewDetails.scheduledDate || 'Upcoming'}</strong>
                      </div>
                      <div>
                        <span className="text-purple-400 text-[10px] block">Mode / Venue:</span>
                        <strong className="text-white">{app.interviewDetails.mode || 'Virtual Online'}</strong>
                      </div>
                    </div>

                    {app.interviewDetails.locationOrLink && (
                      <div className="text-xs pt-1">
                        <span className="text-purple-400 text-[10px] block">Meeting Link / Instructions:</span>
                        <span className="text-purple-100 font-mono text-[11px] break-all">
                          {app.interviewDetails.locationOrLink}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Celebration Card */}
                {app.status === 'Selected' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>Congratulations! You Have Received an Offer</span>
                    </div>
                    <p className="text-xs text-emerald-100">
                      You have been selected for the {app.jobRole} role at {app.companyName}. The Central Placement Cell has verified your selection status.
                    </p>
                  </div>
                )}

                {/* Cover Note Snippet */}
                {app.coverNote && (
                  <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-300 block mb-0.5">Your Statement:</span>
                    <p className="line-clamp-2 italic">"{app.coverNote}"</p>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Last updated: {new Date(app.updatedAt || app.appliedAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  {canWithdraw && (
                    <button
                      type="button"
                      onClick={() => handleWithdraw(app.id, app.companyName)}
                      disabled={withdrawingId === app.id}
                      className="text-rose-400 hover:text-rose-300 text-xs font-medium flex items-center space-x-1 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw Application'}</span>
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 space-y-3">
          <Send className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200 text-sm">No applications found in "{statusFilter}".</p>
            <p className="text-slate-400">
              Apply to active campus drives to see your application progress and scheduled interviews here.
            </p>
          </div>
          <Button
            variant="gradient"
            size="sm"
            icon={Briefcase}
            onClick={onNavigateToJobs}
          >
            Browse Active Drives
          </Button>
        </Card>
      )}
    </div>
  );
};
