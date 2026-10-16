import React, { useState } from 'react';
import {
  X,
  Building2,
  Briefcase,
  Award,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { saveDrive } from '../../services/adminService';

const AVAILABLE_DEPTS = ['CSE', 'ECE', 'AI & DS', 'EEE', 'ME', 'CE', 'All'];

export const AdminAddDriveModal = ({ isOpen, onClose, onDriveSaved }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    eligibleDepartments: ['CSE', 'ECE', 'AI & DS'],
    minCgpa: '7.0',
    minReadiness: '65',
    packageCTC: '12 LPA',
    driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Upcoming',
    location: 'Campus / Virtual',
    jobDescription: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleDeptToggle = (dept) => {
    if (dept === 'All') {
      setFormData(prev => ({ ...prev, eligibleDepartments: ['All'] }));
      return;
    }
    setFormData(prev => {
      let current = prev.eligibleDepartments.filter(d => d !== 'All');
      if (current.includes(dept)) {
        current = current.filter(d => d !== dept);
      } else {
        current = [...current, dept];
      }
      if (current.length === 0) current = ['All'];
      return { ...prev, eligibleDepartments: current };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setErrorMessage('Please enter company name.');
      return;
    }
    if (!formData.jobRole.trim()) {
      setErrorMessage('Please enter job role or designation.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const saved = await saveDrive({
        companyName: formData.companyName.trim(),
        jobRole: formData.jobRole.trim(),
        eligibleDepartments: formData.eligibleDepartments,
        minCgpa: parseFloat(formData.minCgpa) || 0,
        minReadiness: parseInt(formData.minReadiness, 10) || 0,
        packageCTC: formData.packageCTC.trim(),
        driveDate: formData.driveDate,
        status: formData.status,
        location: formData.location.trim(),
        jobDescription: formData.jobDescription.trim()
      });

      if (onDriveSaved) onDriveSaved(saved);
      onClose();
    } catch (err) {
      console.error('Failed to save drive:', err);
      setErrorMessage(err.message || 'Failed to schedule recruitment drive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Schedule Campus Recruitment Drive
              </h3>
              <p className="text-xs text-slate-500">
                Configure eligibility criteria and automatic student matching
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Company Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Company Name *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="e.g. Google Cloud"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Job Role / Designation *</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => handleChange('jobRole', e.target.value)}
                  placeholder="e.g. SDE - Campus 2026"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Package CTC & Drive Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Package / CTC</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.packageCTC}
                  onChange={(e) => handleChange('packageCTC', e.target.value)}
                  placeholder="e.g. 14 LPA"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Drive Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={formData.driveDate}
                  onChange={(e) => handleChange('driveDate', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Criteria (Min CGPA & Min Readiness) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Minimum CGPA Cutoff</label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.minCgpa}
                  onChange={(e) => handleChange('minCgpa', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Minimum Placement Readiness %</label>
              <div className="relative">
                <TrendingUp className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minReadiness}
                  onChange={(e) => handleChange('minReadiness', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Eligible Departments */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Eligible Departments</label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_DEPTS.map((dept) => {
                const isSelected = formData.eligibleDepartments.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDeptToggle(dept)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drive Status & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Drive Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active / In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Venue / Mode</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Placement Auditorium"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Drive Description & Requirements</label>
            <textarea
              rows={2}
              value={formData.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              placeholder="Key skills, coding rounds, interview process overview..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Drive...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Campus Drive</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
