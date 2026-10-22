import React, { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  X,
  Loader2,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  User,
  FileText,
  DollarSign,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Button, Badge, Card } from '../ui';
import { fetchAdminCompanyDetails } from '../../services/adminService';

export const AdminCompanyReviewModal = ({
  isOpen,
  onClose,
  company,
  onReviewSubmit,
  onOpenJobRoleReview
}) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [drives, setDrives] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Review action confirmation stage
  // 'none' | 'confirm_approve' | 'input_reject'
  const [actionStage, setActionStage] = useState('none');
  const [rejectionReason, setRejectionReason] = useState('');

  const companyId = company?.id || company?.uid;

  useEffect(() => {
    if (!isOpen || !companyId) return;

    let isMounted = true;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminCompanyDetails(companyId);
        if (isMounted) {
          setDetails(data.company || company);
          setDrives(data.drives || []);
        }
      } catch (err) {
        console.error('Failed to load company details:', err);
        if (isMounted) {
          setDetails(company);
          setDrives([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDetails();
    setActionStage('none');
    setRejectionReason('');

    return () => {
      isMounted = false;
    };
  }, [isOpen, companyId]);

  if (!isOpen || !company) return null;

  const currentStatus = details?.approvalStatus || company.approvalStatus || 'pending';

  const handleApprove = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onReviewSubmit(companyId, {
        status: 'approved',
        reason: ''
      });
      setActionStage('none');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to approve company registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason explaining why this company registration was rejected.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onReviewSubmit(companyId, {
        status: 'rejected',
        reason: rejectionReason.trim()
      });
      setActionStage('none');
      setRejectionReason('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject company registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const compData = details || company;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-lg">
              {compData.companyName ? compData.companyName.charAt(0).toUpperCase() : <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white">
                  {compData.companyName || 'Corporate Recruiter'}
                </h2>
                <Badge
                  variant={
                    currentStatus === 'approved'
                      ? 'emerald'
                      : currentStatus === 'rejected'
                      ? 'rose'
                      : currentStatus === 'suspended'
                      ? 'rose'
                      : 'amber'
                  }
                  size="sm"
                >
                  {currentStatus === 'approved'
                    ? 'Verified & Approved'
                    : currentStatus === 'rejected'
                    ? 'Registration Rejected'
                    : currentStatus === 'suspended'
                    ? 'Account Suspended'
                    : 'Pending Approval'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {compData.industry || 'Industry unspecified'} • Registered on {compData.createdAt ? new Date(compData.createdAt).toLocaleDateString() : 'Recent'}
              </p>
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

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
              <span>Loading complete company profile and submitted roles...</span>
            </div>
          ) : (
            <>
              {/* Profile Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Official Email</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {compData.officialEmail || compData.email || 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Company Website</span>
                  </div>
                  {compData.website ? (
                    <a
                      href={compData.website.startsWith('http') ? compData.website : `https://${compData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center space-x-1 truncate"
                    >
                      <span className="truncate">{compData.website}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400">Not provided</p>
                  )}
                </div>

                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    <span>Contact Person</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {compData.contactPerson || compData.displayName || 'Placement Coordinator'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Official Phone</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {compData.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Company Description */}
              <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  <span>Company Overview & Description</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {compData.companyDescription || compData.description || 'No detailed company description submitted yet.'}
                </p>
              </div>

              {/* Submitted Job Roles Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-bold text-white">Submitted Job Roles</h3>
                    <Badge variant="indigo" size="sm">{drives.length}</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Roles are approved separately from company account
                  </span>
                </div>

                {drives.length > 0 ? (
                  <div className="space-y-2">
                    {drives.map((drv) => (
                      <div
                        key={drv.id}
                        className="p-3.5 bg-slate-850/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-xs text-white truncate">
                              {drv.jobRole}
                            </span>
                            <Badge
                              variant={
                                drv.approvalStatus === 'approved'
                                  ? 'emerald'
                                  : drv.approvalStatus === 'rejected'
                                  ? 'rose'
                                  : 'amber'
                              }
                              size="sm"
                            >
                              {drv.approvalStatus === 'approved'
                                ? 'Approved'
                                : drv.approvalStatus === 'rejected'
                                ? 'Rejected'
                                : 'Pending Role Review'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                            <span>Package: <strong className="text-emerald-400">{drv.packageCTC || 'Competitive'}</strong></span>
                            <span>•</span>
                            <span>Date: <strong className="text-slate-300">{drv.driveDate || 'TBD'}</strong></span>
                            <span>•</span>
                            <span>Cutoff: <strong className="text-slate-300">{drv.minCgpa || 0} CGPA</strong></span>
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          icon={ChevronRight}
                          onClick={() => {
                            if (onOpenJobRoleReview) {
                              onOpenJobRoleReview(drv);
                            }
                          }}
                        >
                          View Role Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50 text-xs text-slate-400">
                    This company has not submitted any job roles yet. You can review and verify the company account independently.
                  </div>
                )}
              </div>

              {/* Review Audit Information */}
              {compData.reviewedAt && (
                <div className="p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-300">
                    <span>Reviewed by Officer: {compData.reviewedBy || 'Placement Cell'}</span>
                    <span>{new Date(compData.reviewedAt).toLocaleDateString()}</span>
                  </div>
                  {compData.reviewNotes && (
                    <p className="text-slate-400">
                      Reason / Notes: <span className="text-slate-200">{compData.reviewNotes}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Confirmation Stage: Approval */}
              {actionStage === 'confirm_approve' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Confirm Company Account Approval</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Approving <strong>{compData.companyName}</strong> will grant them access to the Recruiter Portal to manage recruitment drives and review applicant rosters. (Any submitted job roles must still be approved independently).
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      loading={submitting}
                      onClick={handleApprove}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Yes, Approve Company
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

              {/* Rejection Stage: Input Reason */}
              {actionStage === 'input_reject' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3 animate-fade-in">
                  <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Reject Company Registration</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Please provide the reason for rejection. This explanation will be displayed to the company representative upon login.
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Unverified corporate domain, missing company contact numbers, or incomplete corporate registration details..."
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
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Close
          </Button>

          {actionStage === 'none' && !loading && (
            <div className="flex items-center space-x-2">
              <Button
                variant="danger"
                size="sm"
                icon={XCircle}
                onClick={() => setActionStage('input_reject')}
              >
                Reject Company
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={() => setActionStage('confirm_approve')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Accept Company
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
