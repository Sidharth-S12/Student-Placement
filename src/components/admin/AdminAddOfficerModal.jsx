import React, { useState } from 'react';
import {
  X,
  UserPlus,
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
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { addOfficer } from '../../services/adminService';

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

export const AdminAddOfficerModal = ({ isOpen, onClose, onOfficerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: 'Head Placement Officer',
    department: 'Central Placement & Training Cell',
    accessScope: 'college', // 'college' | 'department'
    assignedDepartment: 'Computer Science & Engineering',
    status: 'active', // 'active' | 'inactive'
    phone: '',
    initialPassword: '',
    notes: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!formData.name.trim()) {
      setErrorMessage('Please enter officer full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid official email address.');
      return;
    }

    if (formData.initialPassword && formData.initialPassword.length < 6) {
      setErrorMessage('Initial password must be at least 6 characters long.');
      return;
    }

    if (formData.accessScope === 'department' && !formData.assignedDepartment) {
      setErrorMessage('Please select the assigned department for department-specific access.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const created = await addOfficer({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        designation: formData.designation,
        department: formData.accessScope === 'college' ? formData.department : formData.assignedDepartment,
        accessScope: formData.accessScope,
        assignedDepartment: formData.accessScope === 'department' ? formData.assignedDepartment : null,
        status: formData.status,
        initialPassword: formData.initialPassword || 'Officer@123',
        phone: formData.phone.trim()
      });

      setSuccessMessage(`Officer ${created.displayName} successfully created with ${created.accessScope === 'college' ? 'College-Wide' : created.assignedDepartment} privileges.`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onOfficerAdded) onOfficerAdded(created);
        onClose();
        setFormData({
          name: '',
          email: '',
          designation: 'Head Placement Officer',
          department: 'Central Placement & Training Cell',
          accessScope: 'college',
          assignedDepartment: 'Computer Science & Engineering',
          status: 'active',
          phone: '',
          initialPassword: '',
          notes: ''
        });
      }, 1500);
    } catch (err) {
      console.error('Failed to add officer:', err);
      setErrorMessage(err.message || 'Failed to add placement officer. Please try again.');
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
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                Add Placement Officer
              </h3>
              <p className="text-xs text-slate-400">
                Create authenticated officer account with configurable access scope
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

        {/* Body */}
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

          {/* Full Name & Email */}
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
                  placeholder="e.g. Dr. K. S. Ramanathan"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-300">
                Official Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="officer@placement.edu"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
                />
              </div>
            </div>
          </div>

          {/* Access Scope Selector (College-wide vs Department-specific) */}
          <div className="space-y-2 pt-1">
            <label className="block font-bold text-slate-300">
              Access Scope Authorization <span className="text-red-400">*</span>
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
                  View students, clusters, and analytics across all departments. Post and track college drives.
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
                  Restricted to assigned branch records, student lists, clusters, and department reports.
                </p>
              </div>
            </div>
          </div>

          {/* Department Selection (Conditional on scope) */}
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
                <p className="text-[10px] text-amber-300/80 mt-1">
                  This officer will only be permitted to view and manage students belonging to this department.
                </p>
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

            {formData.accessScope === 'college' && (
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Official Designation</label>
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
            )}
          </div>

          {/* Contact Phone & Account Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Contact Number (Optional)</label>
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

            <div className="space-y-1">
              <label className="block font-bold text-slate-300">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-200 bg-slate-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="active">Active (Access Enabled)</option>
                <option value="inactive">Inactive (Access Suspended)</option>
              </select>
            </div>
          </div>

          {/* Initial Password */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-300">
              Initial Login Password (Optional)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.initialPassword}
                onChange={(e) => handleChange('initialPassword', e.target.value)}
                placeholder="Defaults to Officer@123 if omitted"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-850"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              The officer will use this password to sign in to the Placement Officer / Admin Portal.
            </p>
          </div>

          {/* Privilege Notice */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Security Note:</span> Officer accounts are created securely via server-side Admin SDK. The Admin's current session is protected and will not be overwritten.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2.5">
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
                  <span>Configuring Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Create Placement Officer</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

