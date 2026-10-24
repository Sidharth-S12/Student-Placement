import React, { useState } from 'react';
import {
  Clock,
  Building2,
  Mail,
  Globe,
  Briefcase,
  Phone,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { updateCompanyProfile } from '../../services/companyService';

export const CompanyPendingApprovalView = ({
  companyProfile,
  currentUser,
  onRefreshStatus,
  onSignOut
}) => {
  const [profile, setProfile] = useState(companyProfile || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleEditChange = (field, val) => {
    setEditForm(prev => ({ ...prev, [field]: val }));
    setSaveError(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.companyName.trim()) {
      setSaveError('Company name is required.');
      return;
    }
    setIsSaving(true);
    setSaveError(null);

    try {
      const updated = await updateCompanyProfile(editForm);
      setProfile(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setSaveError(err.message || 'Failed to update company information.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefreshStatus) await onRefreshStatus();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const companyName = profile.companyName || currentUser?.displayName || 'Registered Company';
  const email = profile.officialEmail || currentUser?.email || 'N/A';
  const registrationDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 relative z-10 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white font-display block">
              PLACEMENT GENIE
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Recruiter & Campus Hiring Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={isRefreshing}
            onClick={handleRefresh}
          >
            Check Status
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={LogOut}
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl w-full mx-auto my-auto relative z-10 py-8 space-y-6">
        {/* Status Card Banner */}
        <div className="bg-gradient-to-br from-amber-500/15 via-slate-850 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-2xl shadow-inner">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Registration Received
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-slate-400">Awaiting Placement Cell Review</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Account Verification in Progress
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Thank you for registering <strong className="text-white">{companyName}</strong> on Placement Genie.
                Your company profile has been submitted and is currently under review by our institutional Placement Officers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-left">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Status</span>
              <span className="font-extrabold text-amber-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> Pending Review
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Official Email</span>
              <span className="font-bold text-slate-200 mt-0.5 block truncate" title={email}>
                {email}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Registered On</span>
              <span className="font-bold text-slate-200 mt-0.5 block">
                {registrationDate}
              </span>
            </div>
          </div>
        </div>

        {/* Informational Policy Notice */}
        <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-white font-bold">
            <ShieldAlert className="w-4 h-4 text-brand-400" />
            <span>Why is placement verification required?</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            To protect student data privacy and maintain accredited campus recruitment standards, all corporate accounts
            must be authenticated by authorized placement officers. While your registration is pending review:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
            <li className="flex items-center space-x-2">
              <span className="text-amber-400">🔒</span>
              <span>Candidate talent discovery is protected</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-amber-400">🔒</span>
              <span>Student resumes and contact details are masked</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-amber-400">🔒</span>
              <span>Live job role publishing requires approval</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-400">✓</span>
              <span>You can review & update your company details below</span>
            </li>
          </ul>
        </div>

        {/* Toast alerts */}
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Company profile details updated successfully. Reviewers will see your latest information.</span>
          </div>
        )}
        {saveError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Company Details Card */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Submitted Company Credentials</h3>
                <p className="text-[11px] text-slate-400">Information provided for Placement Cell evaluation</p>
              </div>
            </div>

            {!isEditing ? (
              <Button
                variant="secondary"
                size="sm"
                icon={Edit3}
                onClick={() => {
                  setEditForm({
                    companyName: profile.companyName || currentUser?.displayName || '',
                    website: profile.website || '',
                    industry: profile.industry || '',
                    description: profile.description || '',
                    phone: profile.phone || '',
                    contactPerson: profile.contactPerson || currentUser?.displayName || ''
                  });
                  setIsEditing(true);
                }}
              >
                Edit Details
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                icon={X}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Company Name</span>
                <span className="font-bold text-white text-sm">{companyName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Official Email</span>
                <span className="font-medium text-slate-300">{email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Industry / Domain</span>
                <span className="font-medium text-slate-300">{profile.industry || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Careers Website</span>
                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{profile.website}</span>
                  </a>
                ) : (
                  <span className="font-medium text-slate-500">Not provided</span>
                )}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Contact Person</span>
                <span className="font-medium text-slate-300">{profile.contactPerson || 'Recruitment Lead'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Contact Phone</span>
                <span className="font-medium text-slate-300">{profile.phone || 'Not provided'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Company Description</span>
                <p className="font-medium text-slate-300 leading-relaxed mt-0.5">
                  {profile.description || 'No description provided yet.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.companyName}
                    onChange={(e) => handleEditChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Industry / Domain</label>
                  <input
                    type="text"
                    value={editForm.industry}
                    onChange={(e) => handleEditChange('industry', e.target.value)}
                    placeholder="e.g. Cloud, FinTech, AI/ML"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Careers Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => handleEditChange('website', e.target.value)}
                    placeholder="https://company.com/careers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Company Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => handleEditChange('description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={Save}
                  loading={isSaving}
                >
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-slate-800 text-slate-500 text-xs">
        Placement Genie Campus Recruitment System • Need assistance? Contact the Central Placement Cell at <span className="text-slate-300 font-medium">admin@placement.edu</span>
      </footer>
    </div>
  );
};
