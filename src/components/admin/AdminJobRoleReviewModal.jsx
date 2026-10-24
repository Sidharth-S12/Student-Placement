import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  X,
  Loader2,
  ShieldCheck,
  FileText,
  UserCheck
} from 'lucide-react';
import { Button, Badge, Card } from '../ui';

export const AdminJobRoleReviewModal = ({
  isOpen,
  onClose,
  job,
  onReviewSubmit
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Confirmation / Rejection dialog state
  // 'none' | 'confirm_approve' | 'input_reject'
  const [actionStage, setActionStage] = useState('none');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !job) return null;

  const currentStatus = job.approvalStatus || 'pending';

  const handleApprove = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onReviewSubmit(job.id, {
        status: 'approved',
        reason: ''
      });
      setActionStage('none');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to approve job role.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a specific rejection reason explaining what needs revision.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onReviewSubmit(job.id, {
        status: 'rejected',
        reason: rejectionReason.trim()
      });
      setActionStage('none');
      setRejectionReason('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject job role.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  {job.companyName || 'Corporate Recruiter'}
                </span>
                <Badge
                  variant={
                    currentStatus === 'approved'
                      ? 'emerald'
                      : currentStatus === 'rejected'
                      ? 'rose'
                      : 'amber'
                  }
                  size="sm"
                >
                  {currentStatus === 'approved'
                    ? 'Approved for Students'
                    : currentStatus === 'rejected'
                    ? 'Rejected / Revision Needed'
                    : 'Pending Placement Approval'}
                </Badge>
              </div>
              <h2 className="text-lg font-black text-white">{job.jobRole}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Package / CTC</span>
              </div>
              <p className="text-sm font-extrabold text-emerald-400 mt-1 truncate">
                {job.packageCTC || 'Negotiable'}
              </p>
            </div>

            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Location</span>
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {job.location || 'Not Specified'}
              </p>
            </div>

            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                <span>Drive Date</span>
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {job.driveDate || 'TBD'}
              </p>
            </div>

            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Deadline</span>
              </div>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {job.applicationDeadline || 'Open until drive'}
              </p>
            </div>
          </div>

          {/* 1. Job Description & Responsibilities */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-400" />
                <span>Job Description</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {job.jobDescription || 'No detailed job description provided.'}
              </p>
            </div>

            {job.responsibilities && (
              <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Key Responsibilities</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}
          </div>

          {/* 2. Skills & Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required & Optional Skills */}
            <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Required Skills</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(job.skills && job.skills.length > 0 ? job.skills : ['Standard Technical Skills']).map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-semibold"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {job.optionalSkills && job.optionalSkills.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Optional / Nice-to-Have Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.optionalSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic & Department Eligibility */}
            <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eligibility & Qualifications</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Cut-off CGPA:</span>
                  <span className="font-bold text-white">{job.minCgpa || 'No minimum'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Min Placement Readiness:</span>
                  <span className="font-bold text-emerald-400">{job.minReadiness ? `${job.minReadiness}%` : 'Open'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Eligible Batch / Year:</span>
                  <span className="font-bold text-white">{job.batchEligibility || 'Graduating Batch'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Experience / Level:</span>
                  <span className="font-bold text-white">{job.experienceRequirements || 'Fresher (0 years)'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Employment Type:</span>
                  <span className="font-bold text-white">{job.employmentType || 'Full-time'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Eligible Branches / Departments:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(job.eligibleDepartments || ['All Departments']).map((dept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Selection Process & Interview Rounds */}
          {job.selectionProcess && (
            <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interview Rounds & Selection Process</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {job.selectionProcess}
              </p>
            </div>
          )}

          {/* Previous Review Log */}
          {job.reviewedAt && (
            <div className="p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span>Last Reviewed by Officer: {job.reviewedBy || 'Officer'}</span>
                <span>{new Date(job.reviewedAt).toLocaleDateString()}</span>
              </div>
              {job.reviewNotes && (
                <p className="text-slate-400">
                  Notes: <span className="text-slate-200">{job.reviewNotes}</span>
                </p>
              )}
            </div>
          )}

          {/* Stage 1: Confirmation for Approval */}
          {actionStage === 'confirm_approve' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Confirm Job Role Publication</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Approving this job role will publish it to all eligible students matching the CGPA cut-off,
                departments, and batch criteria. Are you sure you want to approve <strong>{job.jobRole}</strong>?
              </p>
              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Yes, Approve & Publish Role
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => setActionStage('none')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Stage 2: Rejection Reason Input */}
          {actionStage === 'input_reject' && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Reject Job Role with Feedback</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Please specify why this role cannot be approved. This message will be shown directly to the company recruiter so they can update and resubmit.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Salary package below university campus cutoff, or eligibility criteria needs to include ECE/EEE departments..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <div className="flex items-center space-x-2 pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  loading={submitting}
                  onClick={handleReject}
                >
                  Confirm Rejection
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => {
                    setActionStage('none');
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Review Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Close
          </Button>

          {actionStage === 'none' && (
            <div className="flex items-center space-x-2">
              <Button
                variant="danger"
                size="sm"
                icon={XCircle}
                onClick={() => setActionStage('input_reject')}
              >
                Reject Job Role
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={() => setActionStage('confirm_approve')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Approve Job Role
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
