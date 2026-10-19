import React, { useState, useEffect } from 'react';
import {
  X,
  Edit,
  Mail,
  User,
  Briefcase,
  Building2,
  Phone,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Layers,
  Power
} from 'lucide-react';
import { updateOfficer } from '../../services/adminService';

const COMMON_DESIGNATIONS = [
  'Head Placement Officer',
  'Director - Training & Placement',
  'Senior Placement Coordinator',
  'Assistant Placement Officer',
  'Corporate Relations Lead',
  'Department Placement Faculty Coordinator'
];

const DEPARTMENTS = [
  'Central Placement & Training Cell',
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Artificial Intelligence & Data Science',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'School of Management Studies'
];

export const AdminEditOfficerModal = ({ officer, isOpen, onClose, onOfficerUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: 'Placement Officer',
    department: 'Central Placement & Training Cell',
    accessScope: 'college',
    assignedDepartment: 'Computer Science & Engineering',
    status: 'active',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (officer) {
      setFormData({
        name: officer.displayName || '',
        email: officer.email || '',
        designation: officer.designation || 'Placement Officer',
        department: officer.department || 'Central Placement Cell',
        accessScope: officer.accessScope || (officer.department && !officer.department.toLowerCase().includes('central') ? 'department' : 'college'),
        assignedDepartment: officer.assignedDepartment || (officer.department && !officer.department.toLowerCase().includes('central') ? officer.department : 'Computer Science & Engineering'),
        status: officer.status || 'active',
        phone: officer.phone || ''
      });
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [officer, isOpen]);

  if (!isOpen || !officer) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!formData.name.trim()) {
      setErrorMessage('Officer full name cannot be empty.');
      return;
    }

    if (formData.accessScope === 'department' && !formData.assignedDepartment) {
      setErrorMessage('Please select the assigned department restriction.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const updated = await updateOfficer(officer.uid, {
        name: formData.name.trim(),
        displayName: formData.name.trim(),
        designation: formData.designation,
        department: formData.accessScope === 'college' ? formData.department : formData.assignedDepartment,
        accessScope: formData.accessScope,
        assignedDepartment: formData.accessScope === 'department' ? formData.assignedDepartment : null,
        status: formData.status,
        phone: formData.phone.trim()
      });

      setSuccessMessage(`Officer ${updated.displayName} successfully updated.`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onOfficerUpdated) onOfficerUpdated(updated);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to update officer:', err);
      setErrorMessage(err.message || 'Failed to update placement officer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-800 overflow-hidden flex flex-col text-slate-100">

        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 shadow-xs">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                Edit Placement Officer
              </h3>
              <p className="text-xs text-slate-400">
                Modify officer credentials, access scope, and account status
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-200">

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Full Name & Read-Only Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-300">
                Officer Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-300">
                Official Email (Read-Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 bg-slate-900 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Access Scope Selector */}
          <div className="space-y-2 pt-1">
            <label className="block font-bold text-slate-300">
              Access Scope Authorization
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                onClick={() => handleChange('accessScope', 'college')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.accessScope === 'college'
                    ? 'bg-indigo-500/10 border-indigo-500 text-white ring-1 ring-indigo-500'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Globe className={`w-4 h-4 ${formData.accessScope === 'college' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="font-extrabold text-xs text-white">College-Wide Access</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Permitted to view all students, clusters, and institution-wide placement analytics.
                </p>
              </div>

              <div
                onClick={() => handleChange('accessScope', 'department')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.accessScope === 'department'
                    ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Layers className={`w-4 h-4 ${formData.accessScope === 'department' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-extrabold text-xs text-white">Department-Specific</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Restricted strictly to candidate records and reports in the assigned department.
                </p>
              </div>
            </div>
          </div>

          {/* Department Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.accessScope === 'department' ? (
              <div className="space-y-1 sm:col-span-2 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <label className="block font-bold text-amber-300">
                  Assigned Department Restriction <span className="text-red-400">*</span>
                </label>
                <div className="relative mt-1">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                  <select
                    value={formData.assignedDepartment}
                    onChange={(e) => handleChange('assignedDepartment', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-500/40 text-xs text-white bg-slate-850 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {DEPARTMENTS.filter(d => !d.toLowerCase().includes('central')).map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Central Department Unit</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {DEPARTMENTS.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Designation</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {COMMON_DESIGNATIONS.map((des, idx) => (
                    <option key={idx} value={des}>{des}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Account Status & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Account Access Status</label>
              <div className="relative">
                <Power className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="active">Active (Full Access Granted)</option>
                  <option value="inactive">Inactive (Access Suspended)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Contact Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 font-bold text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-brand-600/20 transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Updating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Save Officer Changes</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
