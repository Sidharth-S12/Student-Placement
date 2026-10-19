import React, { useState } from 'react';
import {
  X,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { saveDrive } from '../../services/adminService';
import { Button } from '../ui';

const AVAILABLE_DEPTS = ['CSE', 'ECE', 'AI & DS', 'EEE', 'ME', 'CE', 'All'];

export const CompanyPostDriveModal = ({
  isOpen,
  onClose,
  companyNameDefault = '',
  onDriveSaved
}) => {
  const [formData, setFormData] = useState({
    companyName: companyNameDefault || '',
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleDeptToggle = (dept) => {
    if (dept === 'All') {
      setFormData((prev) => ({ ...prev, eligibleDepartments: ['All'] }));
      return;
    }
    setFormData((prev) => {
      let current = prev.eligibleDepartments.filter((d) => d !== 'All');
      if (current.includes(dept)) {
        current = current.filter((d) => d !== dept);
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
      setErrorMessage('Please specify job role or designation.');
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
        packageCTC: formData.packageCTC.trim() || 'Negotiable',
        driveDate: formData.driveDate,
        status: formData.status,
        location: formData.location.trim() || 'Campus',
        jobDescription: formData.jobDescription.trim()
      });

      if (onDriveSaved) onDriveSaved(saved);
      onClose();
    } catch (err) {
      console.error('Failed to post drive:', err);
      setErrorMessage(err.message || 'Failed to post recruitment drive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Post Campus Recruitment Drive
              </h2>
              <p className="text-xs text-slate-400">
                Announce hiring drives & open roles to eligible campus candidates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. Google Cloud, TechCorp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Role / Designation *
              </label>
              <input
                type="text"
                required
                value={formData.jobRole}
                onChange={(e) => handleChange('jobRole', e.target.value)}
                placeholder="e.g. Graduate Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Package CTC */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Package CTC
              </label>
              <input
                type="text"
                value={formData.packageCTC}
                onChange={(e) => handleChange('packageCTC', e.target.value)}
                placeholder="e.g. 14 LPA, 18-22 LPA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Drive Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Drive Date
              </label>
              <input
                type="date"
                required
                value={formData.driveDate}
                onChange={(e) => handleChange('driveDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Min CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Minimum CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => handleChange('minCgpa', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Min Placement Readiness */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Min. Placement Readiness %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.minReadiness}
                onChange={(e) => handleChange('minReadiness', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Drive Location / Mode
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Campus Auditorium / Virtual"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            {/* Drive Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Drive Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active / In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Eligible Departments */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Eligible Departments
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_DEPTS.map((dept) => {
                const isSelected = formData.eligibleDepartments.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDeptToggle(dept)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Role Details & Requirements
            </label>
            <textarea
              rows={3}
              value={formData.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              placeholder="Key technical skills, responsibilities, evaluation stages..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
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
              variant="primary"
              size="sm"
              loading={isLoading}
            >
              Post Drive
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
