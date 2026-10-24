import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  Send
} from 'lucide-react';
import { applyToDrive } from '../../services/applicationService';
import { Button, Badge, Card } from '../ui';

export const ApplyJobModal = ({
  isOpen,
  onClose,
  drive,
  studentData,
  onApplicationSubmitted
}) => {
  const [coverNote, setCoverNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !drive) return null;

  const {
    personalInfo = {},
    education = {},
    placementScores = {}
  } = studentData || {};

  const studentCgpa = parseFloat(education.cgpa || '0') || 0;
  const studentReadiness = placementScores.overallReadiness || 0;
  const studentDept = studentData?.department || education.branch || 'Engineering';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await applyToDrive({
        jobId: drive.id,
        coverNote: coverNote.trim()
      });

      if (onApplicationSubmitted) {
        onApplicationSubmitted(result.application);
      }
      onClose();
    } catch (err) {
      console.error('Failed to submit application:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please check your eligibility and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-950/40 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {drive.companyName}
              </span>
              <Badge variant="indigo" size="sm">Campus Drive</Badge>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Apply for {drive.jobRole}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Drive Snapshot */}
          <div className="p-3.5 bg-slate-850/80 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Role & Compensation Details
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Package CTC</span>
                <span className="font-extrabold text-emerald-400">{drive.packageCTC || 'Competitive'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Drive Date</span>
                <span className="font-semibold text-white">{drive.driveDate || 'TBA'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-semibold text-white">{drive.location || 'Campus'}</span>
              </div>
            </div>
          </div>

          {/* Student Profile Snapshot Reused */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-brand-400" />
                <span>Verified Candidate Credentials</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-attached
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">Full Name:</span>
                <div className="font-bold text-white truncate">{personalInfo.fullName || 'Student'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Degree & Branch:</span>
                <div className="font-semibold text-slate-200 truncate">{studentDept}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">CGPA:</span>
                <div className="font-bold text-white">{education.cgpa || 'N/A'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Placement Readiness:</span>
                <div className="font-extrabold text-emerald-400">{studentReadiness}%</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-400" />
                <span>Standard ATS Resume attached automatically</span>
              </span>
              <span className="text-brand-300 font-semibold">100% Ready</span>
            </div>
          </div>

          {/* Optional Candidate Cover Statement */}
          <div className="space-y-1.5">
            <label htmlFor="coverNote" className="block text-xs font-semibold text-slate-300">
              Candidate Statement / Cover Note <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              id="coverNote"
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight relevant projects, internships, or why you are a great match for this role..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-850 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
            />
            <p className="text-[10px] text-slate-500">
              The hiring team will review your verified coding percentile, placement readiness, and attached ATS resume.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              icon={isLoading ? Loader2 : Send}
              disabled={isLoading}
              className={isLoading ? 'animate-pulse' : ''}
            >
              {isLoading ? 'Submitting Application...' : 'Confirm & Apply'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
