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
  ChevronLeft,
  Eye,
  EyeOff,
  Check,
  KeyRound,
  Shield
} from 'lucide-react';

const PORTAL_CONFIG = {
  student: {
    id: 'student',
    name: 'Student Portal',
    shortName: 'Student',
    roleTitle: 'Engineering Student',
    emoji: '🎓',
    badgeText: 'Candidate Access',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    buttonColor: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 shadow-emerald-600/30',
    tagline: 'Sign in to access your placement dashboard & skill tests',
    regTagline: 'Create your student placement profile to begin skill assessments',
    description: 'Take adaptive technical coding tests, practice AI mock interviews, verify posture, and build ATS resumes.',
    emailPlaceholder: 'student@placement.edu',
    emailLabel: 'Student Email Address',
    highlights: [
      'Adaptive Coding & Aptitude Tests',
      'AI Mock Interview Studio with Posture Vision',
      '1-Click ATS Single-Page Resume PDF'
    ]
  },
  company: {
    id: 'company',
    name: 'Recruiter Portal',
    shortName: 'Recruiter',
    roleTitle: 'Corporate Recruiter',
    emoji: '🏢',
    badgeText: 'Recruiter Access',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    buttonColor: 'bg-gradient-to-r from-indigo-600 via-brand-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30',
    tagline: 'Sign in to discover pre-evaluated engineering talent',
    regTagline: 'Register your company to recruit pre-assessed campus candidates',
    description: 'Search verified candidate profiles, review coding percentiles, and conduct campus recruitment drives.',
    emailPlaceholder: 'recruiter@company.com',
    emailLabel: 'Official Work Email',
    highlights: [
      'Search Pre-Evaluated Candidates',
      'Filter by CGPA, Coding & Aptitude Scores',
      'Instant ATS Resume Previews & Export'
    ]
  },
  admin: {
    id: 'admin',
    name: 'Admin Portal',
    shortName: 'Placement Admin',
    roleTitle: 'Placement Cell Officer',
    emoji: '🛡️',
    badgeText: 'Institutional Access',
    badgeClass: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    iconBg: 'bg-slate-800 text-slate-300 border border-slate-700',
    buttonColor: 'bg-gradient-to-r from-slate-800 via-slate-750 to-slate-900 hover:bg-slate-700 border border-slate-700 shadow-slate-900/40',
    tagline: 'Sign in to monitor college-wide placement readiness',
    regTagline: 'Institutional Administrator & Placement Cell Governance',
    description: 'Track department-wise placement metrics, approve recruiter drives, and inspect K-Means clusters.',
    emailPlaceholder: 'admin@placement.edu',
    emailLabel: 'Placement Cell Officer Email',
    highlights: [
      'College-Wide Placement Analytics',
      'Department Readiness Benchmarks',
      'K-Means Student Performance Clustering'
    ]
  }
};

export const AuthPage = ({ onBackToHome, initialRole, initialMode }) => {
  const {
    selectedRole,
    setSelectedRole,
    login,
    register,
    logout,
    sendPasswordReset
  } = useAuth();

  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    if (initialRole && PORTAL_CONFIG[initialRole]) {
      setSelectedRole(initialRole);
    } else if (!selectedRole) {
      // Default to student if no preference set yet
      setSelectedRole('student');
    }
  }, [initialRole, selectedRole, setSelectedRole]);

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

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

  const activeRoleKey = selectedRole || 'student';
  const currentPortal = PORTAL_CONFIG[activeRoleKey] || PORTAL_CONFIG.student;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
    setRoleMismatch(null);
  };

  const handleSwitchPortal = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage(null);
    setRoleMismatch(null);
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
        setErrorMessage('Admin accounts are created by the institutional system administrator.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm(activeRoleKey)) return;

    setIsLoading(true);
    setErrorMessage(null);
    setRoleMismatch(null);

    try {
      if (mode === 'login') {
        const { user, role: verifiedRole } = await login(formData.email.trim(), formData.password);

        if (!verifiedRole) {
          await logout();
          setErrorMessage("Unable to determine account role for this account. Please contact administrator support.");
          return;
        }

        // Security check: Verified role vs Selected Portal
        if (activeRoleKey === 'admin' && verifiedRole !== 'admin') {
          await logout();
          const targetName = verifiedRole === 'company' ? 'Recruiter Portal' : 'Student Portal';
          setRoleMismatch({
            message: 'This account does not have administrator access privileges.',
            targetRole: verifiedRole,
            targetName
          });
          return;
        }

        if (activeRoleKey === 'company' && verifiedRole === 'student') {
          await logout();
          setRoleMismatch({
            message: 'This account is registered as a Student account. Please switch to the Student Portal.',
            targetRole: 'student',
            targetName: 'Student Portal'
          });
          return;
        }

        if (activeRoleKey === 'student' && verifiedRole === 'company') {
          await logout();
          setRoleMismatch({
            message: 'This account is registered as a Recruiter account. Please switch to the Recruiter Portal.',
            targetRole: 'company',
            targetName: 'Recruiter Portal'
          });
          return;
        }

        if (activeRoleKey !== 'admin' && verifiedRole === 'admin') {
          await logout();
          setRoleMismatch({
            message: 'This account is registered as a Placement Administrator account. Please use the Admin Portal.',
            targetRole: 'admin',
            targetName: 'Admin Portal'
          });
          return;
        }
      } else {
        await register({
          role: activeRoleKey,
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6 relative z-10">
        {/* Back to Home Button */}
        {onBackToHome ? (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-brand-400" />
            <span>Back to Home</span>
          </button>
        ) : (
          <div />
        )}

        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onBackToHome || undefined}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-display hidden sm:inline">
            PLACEMENT GENIE
          </span>
        </div>
      </header>

      {/* Main Authentication Container */}
      <div className="max-w-4xl w-full mx-auto my-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Role Context & Highlights (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-6 pr-4">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Campus Placement Suite</span>
            </div>

            <h1 className="text-3xl font-black text-white font-display tracking-tight leading-tight">
              One Unified Hub for{' '}
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Every Placement Role
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              {currentPortal.description}
            </p>
          </div>

          {/* Active Role Feature Checklist */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-3 backdrop-blur-md">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{currentPortal.name} Capabilities</span>
              <span className="text-sm">{currentPortal.emoji}</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              {currentPortal.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secured by Firebase Authentication & Role RBAC</span>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-950/60 backdrop-blur-xl space-y-6">
            
            {/* 1. Primary Role Segmented Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Your Portal
                </span>
                <span className="text-[10px] text-brand-400 font-semibold">
                  Switch anytime
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                {Object.values(PORTAL_CONFIG).map((portal) => {
                  const isSelected = activeRoleKey === portal.id;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => handleSwitchPortal(portal.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 truncate ${
                        isSelected
                          ? 'bg-slate-800 text-white shadow-md border border-slate-700/80 ring-1 ring-white/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <span className="text-base">{portal.emoji}</span>
                      <span className="truncate">{portal.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Form Header (Portal Badge + Mode Switcher) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentPortal.badgeClass}`}>
                    {currentPortal.badgeText}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white font-display tracking-tight">
                  {mode === 'login' ? `Sign In to ${currentPortal.shortName}` : `Create ${currentPortal.shortName} Account`}
                </h2>
                <p className="text-xs text-slate-400">
                  {mode === 'login' ? currentPortal.tagline : currentPortal.regTagline}
                </p>
              </div>

              {/* Mode Switcher Tabs (Sign In vs Register) */}
              {activeRoleKey !== 'admin' && (
                <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setRoleMismatch(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      mode === 'login'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                      setRoleMismatch(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      mode === 'register'
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Inline Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Role Mismatch Warning & 1-Click Redirection */}
            {roleMismatch && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-200 space-y-3 animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-left">
                    <h4 className="font-bold text-xs text-amber-300">Access Role Notice</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
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
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>Switch to {roleMismatch.targetName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Admin Self-Registration Notice */}
            {mode === 'register' && activeRoleKey === 'admin' ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
                  🛡️
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-white">
                    Administrator Accounts are Pre-Provisioned
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Institutional placement cell officer accounts are established directly by the college administration.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-sm transition-colors"
                  >
                    Return to Placement Officer Sign In
                  </button>
                </div>
              </div>
            ) : (
              /* Authentication Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Student Full Name */}
                {mode === 'register' && activeRoleKey === 'student' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Student Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Company Name */}
                {mode === 'register' && activeRoleKey === 'company' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Company / Organization Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="e.g. TechCorp Solutions"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Placement Officer Fast-Fill Demo Button */}
                {activeRoleKey === 'admin' && mode === 'login' && (
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[11px] text-amber-400 flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Officer Demo Credentials</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">admin@placement.edu</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, email: 'admin@placement.edu', password: 'adminpassword123' }));
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold transition-colors"
                    >
                      Fast Autofill
                    </button>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    {currentPortal.emailLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={currentPortal.emailPlaceholder}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password with Eye Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
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
                        className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register Mode) */}
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center space-x-2 ${
                      isLoading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : `${currentPortal.buttonColor} text-white hover:scale-[1.01] active:scale-[0.99]`
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{mode === 'login' ? 'Authenticating...' : 'Creating Account...'}</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === 'login'
                            ? `Sign In to ${currentPortal.shortName}`
                            : `Register ${currentPortal.shortName} Account`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Mode Switcher Footer Text */}
                <div className="text-center pt-2">
                  {mode === 'login' ? (
                    activeRoleKey !== 'admin' && (
                      <p className="text-xs text-slate-400">
                        Don't have an account yet?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('register');
                            setErrorMessage(null);
                          }}
                          className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2 ml-1"
                        >
                          Create one now
                        </button>
                      </p>
                    )
                  ) : (
                    <p className="text-xs text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorMessage(null);
                        }}
                        className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2 ml-1"
                      >
                        Sign in instead
                      </button>
                    </p>
                  )}
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Footer Credits */}
      <footer className="text-center pt-6 text-[11px] text-slate-500 relative z-10">
        Placement Genie v2.0 • Secured by Google Firebase Auth & AES Encryption
      </footer>

      {/* Forgot Password Modal (Dark Theme Glassmorphism) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSentSuccess ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Password reset link has been dispatched to <span className="font-bold text-white">{forgotEmail}</span>. Please inspect your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered account email and we'll dispatch an official reset link directly to your inbox.
                </p>

                {resetError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {resetError}
                  </div>
                )}

                <div className="space-y-1">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-1/2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md transition-colors"
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
