import React, { useState } from 'react';
import {
  XCircle,
  Building2,
  Mail,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Edit3,
  Save,
  ShieldAlert
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { updateCompanyProfile } from '../../services/companyService';

export const CompanyRejectedView = ({
  companyProfile,
  currentUser,
  onRefreshStatus,
  onSignOut
}) => {
  const [profile, setProfile] = useState(companyProfile || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [editForm, setEditForm] = useState({
    companyName: profile.companyName || currentUser?.displayName || '',
    website: profile.website || '',
    industry: profile.industry || '',
    description: profile.description || '',
    phone: profile.phone || '',
    contactPerson: profile.contactPerson || currentUser?.displayName || ''
  });

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateCompanyProfile(editForm);
      setProfile(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setSaveError(err.message || 'Failed to update company credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  const rejectionReason = profile.rejectionReason || 'Company credentials or verification details could not be validated by the Placement Cell.';
  const reviewedAt = profile.reviewedAt
    ? new Date(profile.reviewedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 relative z-10 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">
              PLACEMENT GENIE
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Corporate Recruitment Status
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRefreshStatus}>
            Re-check Status
          </Button>
          <Button variant="secondary" size="sm" icon={LogOut} onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto my-auto relative z-10 py-8 space-y-6">
        <div className="bg-gradient-to-br from-rose-500/15 via-slate-850 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0 text-2xl shadow-inner">
              <XCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Registration Review Decision
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="text-xs text-slate-400">Application Rejected</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Company Registration Not Approved
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The institutional Placement Cell has reviewed your company registration for{' '}
                <strong className="text-white">{profile.companyName || 'your organization'}</strong> and decided not to grant active recruitment privileges at this time.
              </p>
            </div>
          </div>

          {/* Stated Rejection Reason */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-xs space-y-1.5">
            <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Official Reason Provided by Reviewing Placement Officer ({reviewedAt}):</span>
            </div>
            <p className="text-rose-200 text-sm font-medium pl-5 leading-relaxed">
              "{rejectionReason}"
            </p>
          </div>
        </div>

        {/* Action Guidance */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-3">
          <h4 className="font-bold text-white text-sm">Next Steps & Appeals</h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            If you believe this decision was made in error or if you have revised documentation (such as corporate domain email verification, official website updates, or updated contact leads), you can update your details below and re-submit for review. You may also contact the Central Placement Office directly at <strong className="text-slate-200">admin@placement.edu</strong>.
          </p>

          {!isEditing ? (
            <Button
              variant="primary"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditing(true)}
            >
              Update Details & Request Re-review
            </Button>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.companyName}
                    onChange={(e) => setEditForm(p => ({ ...p, companyName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={editForm.industry}
                    onChange={(e) => setEditForm(p => ({ ...p, industry: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Careers Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm(p => ({ ...p, website: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Company Description & Notes for Reviewer</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Provide additional details addressing the feedback..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button type="submit" variant="primary" size="sm" icon={Save} loading={isSaving}>
                  Save Updated Credentials
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              Updated company information saved. Please notify the placement office for re-evaluation.
            </div>
          )}
          {saveError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {saveError}
            </div>
          )}
        </div>
      </div>

      <footer className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-slate-800 text-slate-500 text-xs">
        Placement Genie Campus Recruitment System • Central Placement Office: admin@placement.edu
      </footer>
    </div>
  );
};
