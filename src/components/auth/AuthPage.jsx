import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatAuthError } from '../../services/authService';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';

const PORTAL_CONFIG = {
  student: {
    id: 'student',
    name: 'Student Portal',
    shortName: 'Student',
    emoji: '🎓',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
    tagline: 'Sign in to your student account',
    regTagline: 'Create your student placement profile to begin skill assessments',
    description: 'Take AI-powered technical & aptitude assessments, generate ATS resumes, and build your placement readiness profile.',
    emailPlaceholder: 'student@placement.edu',
    emailLabel: 'Student Email Address'
  },
  company: {
    id: 'company',
    name: 'Company Portal',
    shortName: 'Company',
    emoji: '🏢',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
    tagline: 'Sign in to your company account',
    regTagline: 'Register your company to recruit pre-assessed campus talent',
    description: 'Discover verified student talent, review AI-assessed skill scores, and manage campus recruitment drives.',
    emailPlaceholder: 'recruiter@company.com',
    emailLabel: 'Official Work Email'
  },
  admin: {
    id: 'admin',
    name: 'Admin Portal',
    shortName: 'Admin',
    emoji: '🛡️',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    iconBg: 'bg-slate-100 text-slate-800 border-slate-200',
    buttonColor: 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20',
    tagline: 'Sign in to your placement officer account',
    regTagline: 'Institutional Administrator & Placement Cell Portal',
    description: 'Monitor college placement metrics, approve recruiter drives, and analyze department-wise hiring readiness.',
    emailPlaceholder: 'admin@placement.edu',
    emailLabel: 'Placement Cell Officer Email'
  }
};

export const AuthPage = () => {
  const {
    selectedRole,
    setSelectedRole,
    login,
    register,
    logout,
    sendPasswordReset
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [roleMismatch, setRoleMismatch] = useState(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSentSuccess, setResetSentSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
    setRoleMismatch(null);
  };

  const handleSwitchPortal = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage(null);
    setRoleMismatch(null);
    // Keep mode as login when switching portals if admin was chosen
    if (roleKey === 'admin' && mode === 'register') {
      setMode('login');
    }
  };

  const validateForm = (activeRole) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password.');
      return false;
    }

    if (mode === 'register') {
      if (activeRole === 'admin') {
        setErrorMessage('Admin accounts are created by the system administrator.');
        return false;
      }
      if (activeRole === 'student' && !formData.name.trim()) {
        setErrorMessage('Please enter your full name.');
        return false;
      }
      if (activeRole === 'company' && !formData.companyName.trim()) {
        setErrorMessage('Please enter your company or recruiter name.');
        return false;
      }
      if (formData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-check.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e, activeRole) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm(activeRole)) return;

    setIsLoading(true);
    setErrorMessage(null);
    setRoleMismatch(null);

    try {
      if (mode === 'login') {
        const { user, role: verifiedRole } = await login(formData.email.trim(), formData.password);

        // Security check: Verified role vs Selected Portal
        if (activeRole === 'admin' && verifiedRole !== 'admin') {
          // Immediately terminate session: student or company cannot access admin dashboard
          await logout();
          const targetName = verifiedRole === 'company' ? 'Company Portal' : 'Student Portal';
          setRoleMismatch({
            message: 'This account does not have administrator access.',
            targetRole: verifiedRole,
            targetName
          });
          return;
        }

        if (activeRole === 'company' && verifiedRole !== 'company') {
          await logout();
          const targetName = verifiedRole === 'admin' ? 'Admin Portal' : 'Student Portal';
          setRoleMismatch({
            message: `This account is registered as a ${verifiedRole === 'admin' ? 'Placement Administrator' : 'Student'}, not a Recruiter account.`,
            targetRole: verifiedRole,
            targetName
          });
          return;
        }

        if (activeRole === 'student' && verifiedRole === 'company') {
          await logout();
          setRoleMismatch({
            message: 'This account is registered as a Company / Recruiter account.',
            targetRole: 'company',
            targetName: 'Company Portal'
          });
          return;
        }

        // If an admin user logged in with student portal selected, verified role still determines authorization
        if (activeRole === 'student' && verifiedRole === 'admin') {
          setSelectedRole('admin');
        }
      } else {
        await register({
          role: activeRole,
          name: formData.name.trim(),
          companyName: formData.companyName.trim(),
          email: formData.email.trim(),
          password: formData.password
        });
      }
    } catch (err) {
      console.error('[AuthPage] Auth error:', err);
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setIsSendingReset(true);
    setResetError(null);

    try {
      await sendPasswordReset(forgotEmail.trim());
      setResetSentSuccess(true);
    } catch (err) {
      setResetError(formatAuthError(err));
    } finally {
      setIsSendingReset(false);
    }
  };

  // =========================================================================
  // 1. FIRST TIME USER VIEW (When no preferredLoginRole is saved yet)
  // =========================================================================
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <div className="inline-flex items-center justify-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">
              PLACEMENT GENIE
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight pt-2">
            Select Your Primary Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Choose your account type to proceed. We'll remember this preference for faster access on your next visit.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-3.5">
          {Object.values(PORTAL_CONFIG).map((portal) => (
            <button
              key={portal.id}
              type="button"
              onClick={() => handleSwitchPortal(portal.id)}
              className="w-full text-left bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/5 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-brand-50 flex items-center justify-center text-2xl transition-colors">
                  {portal.emoji}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                    {portal.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {portal.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-600 transition-colors flex-shrink-0 ml-3" />
            </button>
          ))}

          <div className="text-center pt-4 text-[11px] text-slate-400">
            Placement Genie v2.0 • Secured by Google Firebase Auth
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. RETURNING USER VIEW (Remembered Primary Portal with Compact Alternates)
  // =========================================================================
  const currentPortal = PORTAL_CONFIG[selectedRole] || PORTAL_CONFIG.student;
  const alternateRoles = Object.keys(PORTAL_CONFIG).filter(roleKey => roleKey !== selectedRole);

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      
      {/* Top Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">
            PLACEMENT GENIE
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Campus Placement Readiness & Skill Assessment Platform
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 space-y-6 relative overflow-hidden">
          
          {/* Top Bar: Alternate Portal Small Icons */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Portal
            </span>

            {/* Compact Switcher for the other two portals */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400 mr-1 hidden xs:inline">Switch:</span>
              {alternateRoles.map((altRoleKey) => {
                const alt = PORTAL_CONFIG[altRoleKey];
                return (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => handleSwitchPortal(alt.id)}
                    title={`Switch to ${alt.name}`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all group"
                  >
                    <span className="text-sm">{alt.emoji}</span>
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">
                      {alt.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Primary Portal Hero Header */}
          <div className="text-center space-y-2 pt-1">
            <div className="inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-center text-3xl shadow-xs animate-fade-in">
                {currentPortal.emoji}
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-block">
                <span className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${currentPortal.badgeClass}`}>
                  {currentPortal.name}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {mode === 'login' ? 'Welcome Back' : `Register ${currentPortal.shortName} Account`}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login' ? currentPortal.tagline : currentPortal.regTagline}
              </p>
            </div>
          </div>

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Role Mismatch Warning & Quick Switch */}
          {roleMismatch && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 space-y-3 animate-fade-in">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-left">
                  <h4 className="font-bold text-xs text-amber-900">Access Restricted</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {roleMismatch.message}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleSwitchPortal(roleMismatch.targetRole);
                    setRoleMismatch(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Switch to {roleMismatch.targetName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Admin Self-Registration Notice */}
          {mode === 'register' && selectedRole === 'admin' ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3 animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Admin accounts are created by the system administrator.
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Institutional access is provisioned directly by the college placement cell or system administrator. If you require administrator access, please contact your placement officer.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Return to Admin Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Login & Registration Form */
            <form onSubmit={(e) => handleSubmit(e, selectedRole)} className="space-y-4">
              
              {/* Student Name */}
              {mode === 'register' && selectedRole === 'student' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Company Name */}
              {mode === 'register' && selectedRole === 'company' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="e.g. TechCorp Solutions"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {currentPortal.emailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={currentPortal.emailPlaceholder}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(formData.email);
                        setResetSentSuccess(false);
                        setResetError(null);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                    isLoading
                      ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                      : `${currentPortal.buttonColor} text-white active:scale-98`
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{mode === 'login' ? 'Signing in...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? `Sign In to ${currentPortal.shortName}` : `Create ${currentPortal.shortName} Account`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Mode Toggle (Login <-> Register) */}
              <div className="text-center pt-2">
                {mode === 'login' ? (
                  selectedRole !== 'admin' ? (
                    <p className="text-xs text-slate-500">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMessage(null);
                        }}
                        className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                      >
                        Register
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMessage(null);
                          setRoleMismatch(null);
                        }}
                        className="font-bold text-slate-700 hover:text-slate-900 underline underline-offset-2"
                      >
                        Register
                      </button>
                    </p>
                  )
                ) : (
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMessage(null);
                      }}
                      className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

        </div>

        {/* Bottom Helper Info */}
        <div className="text-center mt-5 text-[11px] text-slate-400 space-y-1">
          <p>Placement Genie v2.0 • Secured by Google Firebase Auth</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSentSuccess ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-600">
                  Password reset link has been dispatched to <span className="font-bold text-slate-900">{forgotEmail}</span>. Please check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>

                {resetError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    {resetError}
                  </div>
                )}

                <div className="space-y-1">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-1"
                  >
                    {isSendingReset ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
