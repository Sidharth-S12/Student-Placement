import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Users,
  Trash2,
  ChevronRight,
  Award
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { deleteCompanyDrive } from '../../services/companyService';

export const CompanyDrivesView = ({
  drives = [],
  companyName,
  onOpenPostDrive,
  onSelectDriveCandidates,
  onDriveDeleted,
  showToast
}) => {
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Upcoming' | 'Completed'
  const [deletingId, setDeletingId] = useState(null);

  const filteredDrives = drives.filter((dr) => {
    if (statusFilter === 'All') return true;
    return dr.status === statusFilter;
  });

  const handleDelete = async (id, role) => {
    if (!window.confirm(`Are you sure you want to remove the recruitment drive "${role}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteCompanyDrive(id);
      if (showToast) {
        showToast(`Recruitment drive "${role}" deleted.`);
      }
      if (onDriveDeleted) {
        onDriveDeleted(id);
      }
    } catch (err) {
      console.error('Failed to delete drive:', err);
      if (showToast) {
        showToast(err.message || 'Failed to delete recruitment drive.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Recruitment Drives & Job Postings
            </h1>
            <Badge variant="indigo">{drives.length} Total Postings</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your company's campus recruitment drives, review approval status from the placement
            cell, and inspect eligible candidates and direct applicants.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={onOpenPostDrive}
        >
          Post Recruitment Drive
        </Button>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start inline-flex shadow-subtle">
        {['All', 'Active', 'Upcoming', 'Completed'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === tab
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Drives Cards Grid */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDrives.map((dr) => {
            const isApproved = dr.approvalStatus === 'approved';
            const isRejected = dr.approvalStatus === 'rejected';
            const isPending = !isApproved && !isRejected;

            return (
              <Card
                key={dr.id}
                hover
                className="p-5 sm:p-6 space-y-4 bg-slate-900/90 border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Role & Approval Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                          {dr.companyName || companyName}
                        </span>

                        {/* Approval Status Badge */}
                        {isApproved ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Published to Students
                          </span>
                        ) : isRejected ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-400" /> Rejected by Placement Cell
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> Pending Officer Approval
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-white truncate">
                        {dr.jobRole}
                      </h3>
                    </div>

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

                  {/* Rejection Review Notes */}
                  {isRejected && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-rose-400">
                        <span>Placement Officer Review Notes:</span>
                      </div>
                      <p className="text-slate-300">
                        {dr.reviewNotes || dr.rejectionReason || 'Please revise your role criteria, eligibility, or package to meet university placement guidelines.'}
                      </p>
                    </div>
                  )}

                  {isPending && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Submitted for placement cell approval. Hidden from students until verified.</span>
                    </div>
                  )}

                  {/* Candidate Pipeline Counts Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                        <GraduationCap className="w-3 h-3 text-brand-400" /> Eligible
                      </div>
                      <div className="font-extrabold text-brand-400 mt-0.5 text-sm">
                        {dr.eligibleCount || 0}
                      </div>
                      <div className="text-[9px] text-slate-500">Matching criteria</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-indigo-400" /> Applicants
                      </div>
                      <div className="font-extrabold text-indigo-400 mt-0.5 text-sm">
                        {dr.applicantsCount || 0}
                      </div>
                      <div className="text-[9px] text-slate-500">Directly applied</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" /> Nominated
                      </div>
                      <div className="font-extrabold text-amber-400 mt-0.5 text-sm">
                        {dr.nominationsCount || 0}
                      </div>
                      <div className="text-[9px] text-slate-500">Officer suggested</div>
                    </div>
                  </div>

                  {/* Compensation, Date, Location */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-850/60 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Package
                      </div>
                      <div className="font-extrabold text-emerald-400 mt-0.5 truncate">
                        {dr.packageCTC || 'Negotiable'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" /> Drive Date
                      </div>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {dr.driveDate || 'TBD'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" /> Location
                      </div>
                      <div className="font-bold text-white mt-0.5 truncate">
                        {dr.location || 'Campus / Virtual'}
                      </div>
                    </div>
                  </div>

                  {/* Cut-off Requirements */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Cut-off CGPA: <strong className="text-white">{dr.minCgpa || 0}+</strong></span>
                      <span>Min Readiness: <strong className="text-emerald-400">{dr.minReadiness || 0}%</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 self-center mr-1">
                        Departments:
                      </span>
                      {(dr.eligibleDepartments || ['All']).map((dept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/80"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectDriveCandidates && onSelectDriveCandidates(dr.id)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <span>View Candidates ({dr.eligibleCount || 0} Eligible, {dr.applicantsCount || 0} Applicants)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === dr.id}
                    onClick={() => handleDelete(dr.id, dr.jobRole)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 transition-colors"
                    title="Delete recruitment drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-xs text-slate-400 border border-dashed border-slate-800 space-y-3">
          <Briefcase className="w-8 h-8 mx-auto text-slate-500" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              No recruitment drives found in "{statusFilter}".
            </p>
            <p className="text-slate-400">
              Post an upcoming recruitment drive to start receiving verified student applications.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={onOpenPostDrive}
          >
            Post Recruitment Drive
          </Button>
        </Card>
      )}
    </div>
  );
};
