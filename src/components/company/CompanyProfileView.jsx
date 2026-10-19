import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { Card, Button, Badge } from '../ui';

const DEPARTMENTS = ['CSE', 'ECE', 'AI & DS', 'EEE', 'ME', 'CE', 'All'];

export const CompanyProfileView = ({
  profile = {},
  onSaveProfile,
  showToast
}) => {
  const [formData, setFormData] = useState(profile);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeptToggle = (dept) => {
    if (dept === 'All') {
      setFormData((prev) => ({ ...prev, targetDepartments: ['All'] }));
      return;
    }
    setFormData((prev) => {
      let current = (prev.targetDepartments || []).filter((d) => d !== 'All');
      if (current.includes(dept)) {
        current = current.filter((d) => d !== dept);
      } else {
        current = [...current, dept];
      }
      if (current.length === 0) current = ['All'];
      return { ...prev, targetDepartments: current };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (onSaveProfile) {
        onSaveProfile(formData);
      }
      setSaving(false);
      if (showToast) {
        showToast('Company profile & hiring criteria updated.');
      }
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Company Profile & Hiring Preferences
            </h1>
            <Badge variant="emerald">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified Partner
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure your organization details and set campus hiring cut-offs and preferred
            departments.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={Save}
          loading={saving}
          onClick={handleSubmit}
        >
          Save Preferences
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Organization Details */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Organization Details</h3>
              <p className="text-[11px] text-slate-400">
                Official company credentials shown on placement drive announcements
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. Google Cloud, TechCorp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Recruiter Email
              </label>
              <input
                type="email"
                disabled
                value={formData.recruiterEmail || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs sm:text-sm text-slate-400 cursor-not-allowed"
                title="Account email is managed via authentication"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Industry / Domain
              </label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g. Cloud Infrastructure, FinTech, AI/ML"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Careers Website
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://careers.company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </Card>

        {/* Card 2: Recruiter Contact Person */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Recruiter Contact Lead</h3>
              <p className="text-[11px] text-slate-400">
                Primary point of contact for campus placement cell officers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Person Name
              </label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                placeholder="e.g. John Doe (Lead Campus Recruiter)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </Card>

        {/* Card 3: Hiring Preferences & Cut-Offs */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Campus Hiring Criteria</h3>
              <p className="text-[11px] text-slate-400">
                Placement Genie matches candidates who meet your criteria
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Minimum CGPA (0 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.targetMinCgpa || 7.0}
                onChange={(e) => handleChange('targetMinCgpa', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Minimum Placement Readiness %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.targetMinReadiness || 65}
                onChange={(e) =>
                  handleChange('targetMinReadiness', parseInt(e.target.value, 10) || 0)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Target Departments */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Preferred Eligible Departments
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {DEPARTMENTS.map((dept) => {
                const isSelected = (formData.targetDepartments || []).includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDeptToggle(dept)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
