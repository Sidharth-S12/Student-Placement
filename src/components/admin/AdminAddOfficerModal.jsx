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
  CheckCircle2
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
  'School of Management Studies'
];

export const AdminAddOfficerModal = ({ isOpen, onClose, onOfficerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: 'Head Placement Officer',
    department: 'Central Placement & Training Cell',
    phone: '',
    notes: ''
  });

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
      setErrorMessage('Please enter officer name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid official email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const created = await addOfficer({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        designation: formData.designation,
        department: formData.department,
        phone: formData.phone.trim()
      });

      setSuccessMessage(`Officer ${created.displayName} successfully added with Administrator privileges.`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onOfficerAdded) onOfficerAdded(created);
        onClose();
        setFormData({
          name: '',
          email: '',
          designation: 'Head Placement Officer',
          department: 'Central Placement & Training Cell',
          phone: '',
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Add Placement Officer
              </h3>
              <p className="text-xs text-slate-500">
                Grant central administrator & placement cell privileges
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
          
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Officer Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Dr. K. S. Ramanathan"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>
          </div>

          {/* Official Email */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">
              Official Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. officer@placement.edu"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              The officer will use this email to log in through the Admin Portal.
            </p>
          </div>

          {/* Designation & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Designation</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                >
                  {COMMON_DESIGNATIONS.map((des, idx) => (
                    <option key={idx} value={des}>{des}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Department</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                >
                  {DEPARTMENTS.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Contact Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>
          </div>

          {/* Privilege Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Privilege Scope:</span> This account receives verified role <code className="bg-amber-100 px-1 rounded font-mono font-bold text-amber-800">admin</code> with full access to campus metrics, student placement portfolios, and recruitment drive management.
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md shadow-slate-900/20 transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Configuring Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Add Placement Officer</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
