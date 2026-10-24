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
  Sparkles,
  GraduationCap,
  Award,
  Layers,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { postCompanyDrive } from '../../services/companyService';
import { saveDrive } from '../../services/adminService';
import { Button, Badge } from '../ui';

const AVAILABLE_DEPTS = ['CSE', 'ECE', 'AI & DS', 'EEE', 'ME', 'CE', 'All'];
const EMPLOYMENT_TYPES = ['Full-time', 'Internship', 'Internship + PPO', 'Contract'];

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
    qualifications: 'B.Tech / B.E. / M.Tech in Engineering',
    batch: '2026',
    experience: 'Freshers (0 - 1 years)',
    employmentType: 'Full-time',
    minCgpa: '7.0',
    minReadiness: '65',
    packageCTC: '12 - 16 LPA',
    driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Upcoming',
    location: 'Campus Auditorium / Hybrid',
    jobDescription: '',
    responsibilities: '',
    requiredSkillsStr: 'Python, React, Data Structures, SQL',
    optionalSkillsStr: 'Docker, AWS, Git',
    selectionProcess: 'Online MCQ & Coding Round -> Technical Architecture Interview -> HR Discussion'
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

    const requiredSkills = formData.requiredSkillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const optionalSkills = formData.optionalSkillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      companyName: formData.companyName.trim(),
      jobRole: formData.jobRole.trim(),
      eligibleDepartments: formData.eligibleDepartments,
      qualifications: formData.qualifications.trim(),
      batch: formData.batch.trim(),
      experience: formData.experience.trim(),
      employmentType: formData.employmentType,
      minCgpa: parseFloat(formData.minCgpa) || 0,
      minReadiness: parseInt(formData.minReadiness, 10) || 0,
      packageCTC: formData.packageCTC.trim() || 'Negotiable',
      driveDate: formData.driveDate,
      applicationDeadline: formData.applicationDeadline,
      status: formData.status,
      location: formData.location.trim() || 'Campus',
      jobDescription: formData.jobDescription.trim(),
      responsibilities: formData.responsibilities.trim(),
      requiredSkills,
      optionalSkills,
      selectionProcess: formData.selectionProcess.trim(),
      approvalStatus: 'pending' // Enforces pending review by default
    };

    try {
      let saved;
      try {
        saved = await postCompanyDrive(payload);
      } catch (companyApiErr) {
        // Fallback to general drive save
        saved = await saveDrive(payload);
      }

      if (onDriveSaved) onDriveSaved(saved);
      onClose();
    } catch (err) {
      console.error('Failed to post drive:', err);
      setErrorMessage(err.message || 'Failed to submit recruitment drive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Submit Job Role for Placement Review
              </h2>
              <p className="text-xs text-slate-400">
                Placement Cell verifies all campus job roles before publishing to student candidates
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

        {/* Approval Alert Notice */}
        <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[11px] text-amber-300 flex items-start space-x-2.5">
          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Job Role Review Workflow:</strong> This job role will be submitted with status <strong className="text-white">Pending Approval</strong>. It will be reviewed by authorized placement officers. Once approved, it will automatically be published to eligible students.
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Row 1: Company & Job Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. Google Cloud, TechCorp Solutions"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Job Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.jobRole}
                onChange={(e) => handleChange('jobRole', e.target.value)}
                placeholder="e.g. Graduate Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Compensation, Employment Type, Batch, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Package / CTC
              </label>
              <input
                type="text"
                value={formData.packageCTC}
                onChange={(e) => handleChange('packageCTC', e.target.value)}
                placeholder="e.g. 14 LPA"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleChange('employmentType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              >
                {EMPLOYMENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Eligible Batch / Year
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => handleChange('batch', e.target.value)}
                placeholder="e.g. 2026 Batch"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Experience Requirement
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g. Freshers / 0-1 yr"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Educational Qualifications */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Educational Qualifications
            </label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => handleChange('qualifications', e.target.value)}
              placeholder="e.g. B.Tech / B.E. in CSE, ECE, AI & DS or M.C.A."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>

          {/* Row 4: Eligible Departments */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Eligible Departments
            </label>
            <div className="flex flex-wrap gap-2 pt-0.5">
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

          {/* Row 5: Cutoffs (CGPA & Readiness) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Min. CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => handleChange('minCgpa', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Min. Placement Readiness %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.minReadiness}
                onChange={(e) => handleChange('minReadiness', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                required
                value={formData.applicationDeadline}
                onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Scheduled Drive Date
              </label>
              <input
                type="date"
                required
                value={formData.driveDate}
                onChange={(e) => handleChange('driveDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Row 6: Location */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Work Location & Mode
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bangalore / Campus On-Site / Hybrid"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>

          {/* Row 7: Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Required Technical Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.requiredSkillsStr}
                onChange={(e) => handleChange('requiredSkillsStr', e.target.value)}
                placeholder="e.g. Python, React, Data Structures, SQL"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Optional / Nice-to-Have Skills
              </label>
              <input
                type="text"
                value={formData.optionalSkillsStr}
                onChange={(e) => handleChange('optionalSkillsStr', e.target.value)}
                placeholder="e.g. Docker, AWS, Kubernetes, Git"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Row 8: Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Job Description & Role Overview
            </label>
            <textarea
              rows={2}
              value={formData.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              placeholder="Overview of the position, team mission, and project scope..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* Row 9: Responsibilities */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Key Responsibilities & Day-to-Day Tasks
            </label>
            <textarea
              rows={2}
              value={formData.responsibilities}
              onChange={(e) => handleChange('responsibilities', e.target.value)}
              placeholder="Key responsibilities expected from the engineering candidate..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* Row 10: Interview Rounds & Selection Process */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Interview Rounds & Selection Process
            </label>
            <textarea
              rows={2}
              value={formData.selectionProcess}
              onChange={(e) => handleChange('selectionProcess', e.target.value)}
              placeholder="e.g. Round 1: Online Coding Test -> Round 2: Technical DSA Interview -> Round 3: HR Discussion"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all resize-none"
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
              Submit Job Role for Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
