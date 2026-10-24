import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  Clock,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { respondToNomination } from '../../services/applicationService';
import { Card, Button, Badge } from '../ui';

export const MyNominationsView = ({
  nominations = [],
  onNavigateToJobs,
  onNavigateToTests,
  onRefreshNominations,
  showToast
}) => {
  const [respondingId, setRespondingId] = useState(null);

  const handleRespond = async (appId, action, companyName) => {
    setRespondingId(appId);
    try {
      await respondToNomination({ appId, action });
      if (showToast) {
        showToast(
          action === 'accept'
            ? `Accepted nomination for ${companyName}. Your profile is active in the recruitment drive!`
            : `Declined nomination for ${companyName}.`
        );
      }
      if (onRefreshNominations) onRefreshNominations();
    } catch (err) {
      console.error('Failed to respond to nomination:', err);
      alert(err.message || 'Failed to update nomination response.');
    } finally {
      setRespondingId(null);
    }
  };

  const pendingCount = nominations.filter(n => n.nominationStatus === 'Pending Consent').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Placement Officer Nominations
            </h1>
            <Badge variant="purple">{nominations.length} Total</Badge>
            {pendingCount > 0 && (
              <Badge variant="amber" dot>{pendingCount} Consent Required</Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Priority drive recommendations created for you by authorized college placement officers based on your verified performance.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Briefcase}
          onClick={onNavigateToJobs}
        >
          Browse All Drives
        </Button>
      </div>

      {/* 2. Nominations List */}
      {nominations.length > 0 ? (
        <div className="space-y-4">
          {nominations.map((nom) => {
            const isPendingConsent = nom.nominationStatus === 'Pending Consent';
            const isAccepted = nom.nominationStatus === 'Consent Accepted';
            const isDeclined = nom.nominationStatus === 'Consent Declined';
            const isBusy = respondingId === nom.id;

            return (
              <Card
                key={nom.id}
                className={`p-5 sm:p-6 bg-slate-900 border space-y-5 shadow-lg transition-all ${
                  isPendingConsent ? 'border-amber-500/40 shadow-amber-950/20' : 'border-slate-800'
                }`}
              >
                {/* Top Row: Company, Role, Nomination Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {nom.companyName}
                      </span>
                      <Badge variant="purple" size="sm">
                        <Sparkles className="w-3 h-3 mr-1 text-purple-300" />
                        Officer Recommended
                      </Badge>
                      {nom.nominatedAt && (
                        <span className="text-[11px] text-slate-500">
                          Nominated {new Date(nom.nominatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {nom.jobRole}
                    </h3>
                  </div>

                  <Badge
                    variant={
                      isAccepted
                        ? 'emerald'
                        : isDeclined
                        ? 'neutral'
                        : isPendingConsent
                        ? 'amber'
                        : 'indigo'
                    }
                    size="sm"
                    dot={isPendingConsent}
                  >
                    {nom.nominationStatus || 'Nominated'}
                  </Badge>
                </div>

                {/* Compensation & Drive Metadata */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Package CTC</span>
                    <span className="font-bold text-emerald-400">{nom.packageCTC || 'Competitive'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Drive Date</span>
                    <span className="font-semibold text-white">{nom.driveDate || 'TBA'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                    <span className="font-semibold text-white">{nom.location || 'Campus'}</span>
                  </div>
                </div>

                {/* Placement Officer Recommendation Info */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-slate-300">
                        Nominated by {nom.nominatedByOfficerName || 'Central Placement Cell'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">Official Recommendation</span>
                  </div>

                  {nom.officerNotes ? (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 italic text-[11px]">
                      "{nom.officerNotes}"
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      The Placement Officer nominated you based on your verified coding benchmark and placement readiness scores.
                    </p>
                  )}
                </div>

                {/* Action Required: Consent Needed */}
                {isPendingConsent && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>Student Consent Required</span>
                      </div>
                      <p className="text-xs text-amber-100 max-w-xl">
                        Accepting this nomination will submit your candidate profile and resume directly to {nom.companyName}'s hiring pipeline.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => handleRespond(nom.id, 'decline', nom.companyName)}
                      >
                        <X className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Decline
                      </Button>
                      <Button
                        type="button"
                        variant="gradient"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => handleRespond(nom.id, 'accept', nom.companyName)}
                        className={isBusy ? 'animate-pulse' : ''}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5 mr-1" />
                        )}
                        Accept Nomination
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status Followup for Accepted */}
                {isAccepted && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Consent Accepted — Your profile is active in {nom.companyName}'s recruitment pipeline.
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold uppercase">Active</span>
                  </div>
                )}

                {isDeclined && (
                  <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-slate-500" />
                    <span>You declined this nomination. No application was submitted.</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 space-y-3">
          <Award className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200 text-sm">No placement nominations yet.</p>
            <p className="text-slate-400 max-w-md mx-auto">
              Placement officers actively review students with high technical, aptitude, and mock interview scores to nominate them for premier campus drives.
            </p>
          </div>
          <Button
            variant="gradient"
            size="sm"
            icon={Sparkles}
            onClick={onNavigateToTests}
          >
            Boost Your Readiness Score
          </Button>
        </Card>
      )}
    </div>
  );
};
