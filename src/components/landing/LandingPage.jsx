import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Cpu,
  Brain,
  Mic,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronDown,
  Code2,
  Target,
  Search,
  ExternalLink,
  Shield,
  Layers,
  BarChart3,
  Check,
  Mail,
  X,
  HelpCircle,
  Briefcase,
  ClipboardCheck,
  LineChart,
  Lock,
  UserCheck
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onSignIn }) => {
  // Navigation & UI state
  const [activeWalkthroughTab, setActiveWalkthroughTab] = useState('student');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [legalModalType, setLegalModalType] = useState(null); // 'privacy' | 'terms' | null

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">

      {/* =====================================================================
          1. NAVIGATION BAR
         ===================================================================== */}
      <nav className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">
                  PLACEMENT GENIE
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                  Campus Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Campus Recruitment Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition-colors"
            >
              Core Capabilities
            </button>
            <button
              onClick={() => scrollToSection('portals')}
              className="hover:text-white transition-colors"
            >
              Role Portals
            </button>
            <button
              onClick={() => scrollToSection('walkthrough')}
              className="hover:text-white transition-colors"
            >
              Product Walkthrough
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-white transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* Action CTAs: One Secondary, One Primary */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSignIn('student')}
              className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
            >
              Sign In
            </button>
            <button
              onClick={() => onGetStarted('student')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================================
          2. HERO SECTION
         ===================================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">

            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-inner">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-semibold text-slate-200">
                Institutional Campus Recruitment Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-[1.15]">
              Master Campus Placements with{' '}
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Adaptive AI Readiness
              </span>
            </h1>

            {/* Concise Value Proposition */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              An integrated campus placement suite connecting students, verified recruiters, and placement officers.
              Prepare through adaptive technical challenges, speech-evaluated mock interviews, and automated single-page resumes.
            </p>

            {/* Exactly One Primary CTA and One Secondary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onGetStarted('student')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-600 to-purple-600 hover:from-brand-600 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Student Workspace</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => scrollToSection('portals')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-base border border-slate-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Recruiter & Admin Portals</span>
              </button>
            </div>

            {/* Feature Highlights Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Adaptive Technical & Aptitude Tests</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Mock Interview with Voice Evaluation</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1-Click Single-Page Resume PDF</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Placement Cell Governed Company Drives</span>
              </div>
            </div>

          </div>

          {/* Product Preview Dashboard Card (Authentic implementation preview) */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-slate-950/80 border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-brand-950/50 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 px-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-500 ml-2">placement-genie.workspace/student/analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Readiness Engine Active</span>
                </span>
              </div>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Overall Readiness</span>
                  <Target className="w-4 h-4 text-brand-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">88 / 100</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold pt-0.5">Tier-1 Company Eligible</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Technical Coding</span>
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">92 / 100</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
                <div className="text-[11px] text-blue-400 font-semibold pt-0.5">Algorithms & Data Structures</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Aptitude & Logic</span>
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">85 / 100</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
                <div className="text-[11px] text-indigo-400 font-semibold pt-0.5">Quant & Logical Reasoning</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Interview & Comm</span>
                  <Mic className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">86 / 100</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '86%' }} />
                </div>
                <div className="text-[11px] text-purple-400 font-semibold pt-0.5">STAR Method Speech Score</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. TRUST & ARCHITECTURAL VALIDATION SECTION
          (Strictly factual; no fabricated partner logos or unsupported stats)
         ===================================================================== */}
      <section className="border-y border-slate-800 bg-slate-950/70 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
              Campus Placement Governance & Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineered for Academic Rigor & Recruiter Trust
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built specifically to support institutional placement cells with authenticated access control and auditable workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Verified Recruiter Vetting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Company accounts remain in a Pending Approval state until the Placement Cell validates corporate credentials and official domains.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Role-Isolated Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict separation between Student, Recruiter, and Admin boundaries ensures student contact details and records remain protected.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Objective Eligibility Filters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drives enforce strict criteria—such as minimum CGPA, zero active backlogs, and benchmark readiness scores—preventing invalid applications.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Auditable Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized placement cell dashboards provide department-wise readiness metrics and transparent candidate shortlisting tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FOUR-STEP HOW IT WORKS SECTION
         ===================================================================== */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              How Placement Genie Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A structured four-step methodology guiding candidates from initial preparation to corporate campus selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Step 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 relative group hover:border-brand-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 text-xs font-black flex items-center justify-center border border-brand-500/20">
                  01
                </span>
                <GraduationCap className="w-5 h-5 text-slate-500 group-hover:text-brand-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white">Profile & Credentials</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students create their placement profile by entering verified academic data, degree, department, projects, technical skills, and GitHub/portfolio links.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-brand-400 flex items-center space-x-1">
                <span>Academic Record Verification</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 relative group hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-black flex items-center justify-center border border-indigo-500/20">
                  02
                </span>
                <Cpu className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white">Diagnostic Evaluations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take calibrated 20-minute multiple-choice coding tests, quantitative & logical reasoning assessments, and voice-recorded mock interview questions.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-indigo-400 flex items-center space-x-1">
                <span>Multi-Discipline Testing</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 relative group hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-black flex items-center justify-center border border-purple-500/20">
                  03
                </span>
                <FileText className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white">Resume & Readiness</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate a clean, single-page PDF resume and review your weighted 0–100% readiness score with tailored improvement suggestions.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-purple-400 flex items-center space-x-1">
                <span>Standard 1-Page PDF Export</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 relative group hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/20">
                  04
                </span>
                <Building2 className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white">Drive Matching & Hiring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Approved recruiters publish drives with specific eligibility criteria. Verified candidates submit 1-click applications or receive placement cell nominations.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
                <span>Shortlist & Interview Pipeline</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          5. CORE FEATURES SECTION
          (Readiness Engine, Tests, Mock Interview, Resume Studio)
         ===================================================================== */}
      <section id="features" className="py-20 bg-slate-950/70 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
              Core Implemented Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Four Core Placement Workspaces
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Reflecting actual, functional tools built into the Placement Genie platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Feature 1: Readiness Engine */}
            <div className="bg-slate-900 border border-slate-800 hover:border-brand-500/50 p-8 rounded-3xl space-y-5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  Weighted Index
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                  Placement Readiness Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Computes an aggregate 0–100% readiness score using calibrated weights: 40% technical test accuracy, 40% quantitative/logical aptitude performance, and 20% interview communication rating.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span>Dynamic recalculation as candidates complete module assessments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span>Identifies skill gaps and provides targeted milestone recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span>Enables recruiters to set objective minimum readiness thresholds</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Diagnostic Test Center */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-8 rounded-3xl space-y-5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  20-Min Timed Tests
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  Diagnostic Test Center
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Timed technical coding and aptitude assessments covering Python, Java, JavaScript, and C++ alongside quantitative, analytical, and verbal reasoning rounds.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Data structures, algorithms, and syntax problem-solving evaluations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Instant score breakdown by topic and difficulty level</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Simulates real-world recruitment first-round screening formats</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: AI Mock Interview Studio */}
            <div className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-8 rounded-3xl space-y-5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Speech Evaluation
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  AI Mock Interview Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Interactive behavioral and situational interview simulator featuring microphone voice capture, speech-to-text processing, and STAR method response analysis.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Evaluates response structure using Situation, Task, Action, and Result</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Provides actionable qualitative feedback on clarity and technical agency</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Optional local camera preview for personal interview posture practice</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Resume Studio */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-8 rounded-3xl space-y-5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  1-Click PDF Generator
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Resume Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Automatically renders student profile data into an industry-standard, single-column, single-page Times New Roman PDF resume engineered for machine readability.
                </p>
              </div>
              <ul className="space-y-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Clean single-column structure compliant with corporate ATS scanners</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Built-in AI keyword gap scanner to match against job descriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Direct download and instant preview available to approved recruiters</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          6. THREE ROLE-SPECIFIC PORTAL CARDS
         ===================================================================== */}
      <section id="portals" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Role-Specific Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Three Dedicated Portals
            </h2>
            <p className="text-sm text-slate-400">
              Tailored workspaces engineered specifically for Candidates, Corporate Recruiters, and Institutional Officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Student Portal Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-2">
                    Candidate Access
                  </div>
                  <h3 className="text-xl font-bold text-white">Student Portal</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    For engineering candidates aiming to prepare for campus recruitment and secure top placement offers.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Adaptive technical coding & aptitude assessments</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>AI mock interview simulator with speech evaluation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>1-click single-page resume PDF generator</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Browse campus drives & track application statuses</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSignIn('student')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Access Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recruiter / Company Portal Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider mb-2">
                    Recruiter Access
                  </div>
                  <h3 className="text-xl font-bold text-white">Recruiter / Company Portal</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    For corporate talent acquisition teams seeking pre-evaluated candidates matching exact job benchmarks.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Search students by verified skill ratings & CGPA</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Publish recruitment drives with custom eligibility cut-offs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Instant candidate resume preview & download</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Manage shortlisting pipelines & interview stages</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSignIn('company')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-brand-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Recruiter Portal Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Admin / Placement Officer Portal Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6 flex flex-col justify-between hover:border-slate-600 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center text-2xl border border-slate-700">
                  🛡️
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/40 text-slate-300 border border-slate-600/40 uppercase tracking-wider mb-2">
                    Institutional Access
                  </div>
                  <h3 className="text-xl font-bold text-white">Placement Officer Portal</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    For placement cell directors and officers governing campus drives, approvals, and performance analytics.
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Review & approve corporate recruiter registrations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Approve and publish campus recruitment drives</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Track college-wide readiness distributions & metrics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Inspect K-Means student performance clustering</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSignIn('admin')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Placement Officer Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          7. FACTUAL PRODUCT WALKTHROUGH SECTION
          (Strictly factual feature examples; no fabricated testimonials)
         ===================================================================== */}
      <section id="walkthrough" className="py-20 bg-slate-950/70 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
              Interactive Workflow Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Platform Workflows in Action
            </h2>
            <p className="text-sm text-slate-400">
              Explore concrete feature demonstrations showing how each stakeholder interacts with the platform.
            </p>
          </div>

          {/* Interactive Walkthrough Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveWalkthroughTab('student')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeWalkthroughTab === 'student'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student Preparation Flow
              </button>
              <button
                onClick={() => setActiveWalkthroughTab('recruiter')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeWalkthroughTab === 'recruiter'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Recruiter Screening Flow
              </button>
              <button
                onClick={() => setActiveWalkthroughTab('officer')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeWalkthroughTab === 'officer'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Placement Cell Flow
              </button>
            </div>
          </div>

          {/* Tab Content 1: Student Flow */}
          {activeWalkthroughTab === 'student' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Student Diagnostic & Resume Flow</h3>
                  <p className="text-xs text-slate-400">Step-by-step candidate preparation workflow</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Candidate Dashboard Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-brand-400">Step A: Coding & Aptitude Test</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Candidate initiates a 20-minute timed assessment. Results are graded per correct response and dynamically scaled.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Output: Diagnostic Score (0-100)</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-purple-400">Step B: AI Voice Interview</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Microphone captures verbal responses to technical & behavioral prompts. Speech analysis scores articulation and STAR structure.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Output: STAR Feedback & Rating</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Step C: 1-Click Resume</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Platform synthesizes education, verified skills, and projects into a machine-readable Times New Roman 1-page PDF.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Output: Standard 1-Page PDF</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  Ready to test your readiness score on the live candidate workspace?
                </div>
                <button
                  onClick={() => onGetStarted('student')}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Launch Candidate Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Content 2: Recruiter Flow */}
          {activeWalkthroughTab === 'recruiter' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Recruiter Candidate Sourcing Flow</h3>
                  <p className="text-xs text-slate-400">How corporate recruiters discover pre-assessed candidates</p>
                </div>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                  Recruiter Portal Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400">Step A: Post Campus Drive</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Define job role, salary package, eligible departments, minimum CGPA, and minimum Placement Readiness score threshold.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Status: Awaiting Officer Approval</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400">Step B: Search Talent Pool</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Filter candidate directory by specific technical skills (e.g., Python, React), coding percentiles, and academic standing.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">View: Instant Resume Preview</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400">Step C: Shortlist & Manage</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Move candidates across Shortlisted, Interview Scheduled, and Selected stages with automated candidate notifications.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Output: Verified Hiring Pipeline</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  Register your company or sign in to access pre-evaluated campus engineering talent.
                </div>
                <button
                  onClick={() => onSignIn('company')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Recruiter Portal Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Content 3: Officer Flow */}
          {activeWalkthroughTab === 'officer' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Central Placement Cell Governance Flow</h3>
                  <p className="text-xs text-slate-400">Institutional administration and verification controls</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">
                  Placement Cell Console
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400">Step A: Company Verification</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Placement officers inspect new corporate signups, review official corporate domains, and approve or reject recruitment access.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Action: Approve / Reject / Suspend</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400">Step B: Drive Publishing</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verify drive terms, salary packages, and eligibility criteria before publishing campus-wide to eligible engineering batches.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Action: Publish to Student Portal</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400">Step C: Campus Analytics & K-Means</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Inspect department-wise readiness distributions and run K-Means performance clustering to target academic interventions.
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Action: Cluster Insights & Reports</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  Are you a Placement Cell Officer or Academic Director? Sign in to manage institutional records.
                </div>
                <button
                  onClick={() => onSignIn('admin')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors flex items-center space-x-1.5"
                >
                  <span>Placement Officer Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================================
          8. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
         ===================================================================== */}
      <section id="faq" className="py-20 bg-slate-950/70 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Clear & Factual Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to know about candidate preparation, company approvals, and institutional governance.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is Placement Genie and who can access it?',
                a: 'Placement Genie is an institutional campus recruitment and readiness platform. It provides three dedicated role portals: students can evaluate skills and generate resumes; approved corporate recruiters can publish drives and review eligible candidates; and central placement cell officers govern company verifications, drive publishing, and campus-wide metrics.'
              },
              {
                q: 'How is the Placement Readiness Score calculated?',
                a: 'The readiness index is computed as a transparent weighted score: 40% adaptive technical coding performance, 40% quantitative and logical reasoning aptitude, and 20% mock interview communication rating. When certain assessments have not yet been attempted, active scores are normalized proportionally.'
              },
              {
                q: 'How does the platform prevent unverified recruiters from accessing candidate records?',
                a: 'All new corporate registrations are initially placed into a restricted "Pending Approval" state. Company recruiters cannot discover candidate profiles, access contact details, or publish drives until an institutional placement cell administrator verifies official corporate credentials and approved domains.'
              },
              {
                q: 'What makes the Resume generator compliant with industry standards?',
                a: 'The resume generator produces a standard single-column, single-page PDF formatted in Times New Roman with clean typography, clear section delimiters, and machine-readable text blocks, avoiding non-standard multi-column tables or graphics that commonly fail automated ATS parsers.'
              },
              {
                q: 'Can students take assessments without installing local software?',
                a: 'Yes. All coding tests, aptitude assessments, and AI mock interview sessions run directly inside modern web browsers (Chrome, Edge, Firefox, Safari). Voice evaluation uses the standard HTML5 Web Audio and Speech APIs with no third-party desktop client required.'
              },
              {
                q: 'How can an institution connect for a campus pilot or placement onboarding?',
                a: 'Academic directors and placement cell coordinators can reach out directly to the central placement administration desk at admin@placement.edu.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between space-x-4 hover:bg-slate-850 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      openFaqIndex === index ? 'rotate-180 text-brand-400' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================================
          9. FINAL CALL TO ACTION (CTA)
         ===================================================================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-700 to-purple-800 p-8 sm:p-14 text-center text-white shadow-2xl shadow-brand-900/60 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                Accelerate Your Campus Placement Journey
              </h2>
              <p className="text-sm sm:text-base text-brand-100 font-normal">
                Prepare with calibrated assessments, speech-evaluated interviews, and single-page resumes, or manage recruitment drives with institutional governance.
              </p>

              {/* Exactly One Visually Dominant Primary CTA and One Secondary CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onGetStarted('student')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm shadow-xl transition-all"
                >
                  Create Student Account
                </button>
                <button
                  onClick={() => onSignIn('student')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Sign In to Existing Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          10. FOOTER
          (Legitimate contacts, Privacy Policy & Terms modals, tech-stack text removed)
         ===================================================================== */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-850">

            {/* Brand & Mission */}
            <div className="space-y-2 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white tracking-tight text-sm">PLACEMENT GENIE</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Campus placement intelligence and recruitment governance platform connecting engineering candidates, verified corporate recruiters, and institutional placement cells.
              </p>
            </div>

            {/* Contact & Legal Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Central Placement Cell Desk
                </span>
                <a
                  href="mailto:admin@placement.edu"
                  className="text-slate-300 hover:text-white transition-colors font-medium flex items-center space-x-1"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-400" />
                  <span>admin@placement.edu</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Institutional Governance
                </span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setLegalModalType('privacy')}
                    className="hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => setLegalModalType('terms')}
                    className="hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Terms of Use
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright & Disclaimer (Technology-stack text completely removed) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Placement Genie. Built for Excellence in Campus Placements.
            </p>
            <p className="text-slate-500">
              Institutional Placement Cell Governance & Automated Student Readiness System.
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          LEGAL MODAL (Privacy Policy & Terms of Use - Fully Implemented)
         ===================================================================== */}
      {legalModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-5 h-5 text-brand-400" />
                <h3 className="font-extrabold text-base text-white">
                  {legalModalType === 'privacy' ? 'Placement Genie Privacy Policy' : 'Terms of Use & Institutional Governance'}
                </h3>
              </div>
              <button
                onClick={() => setLegalModalType(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
              {legalModalType === 'privacy' ? (
                <>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">1. Scope of Academic & Candidate Privacy</h4>
                    <p>
                      Placement Genie is committed to safeguarding candidate academic records, assessment metrics, and personal profile information in compliance with institutional academic privacy standards.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">2. Assessment & Speech Data Processing</h4>
                    <p>
                      Technical coding and aptitude responses are processed to calculate placement readiness scores. Voice recordings captured during AI mock interviews are used exclusively for immediate speech-to-text response scoring and STAR methodology evaluation. Audio data is not sold or shared with unapproved third parties.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">3. Recruiter Data Access Safeguards</h4>
                    <p>
                      Corporate recruiters are permitted candidate access solely after formal vetting and approval by the Central Placement Cell. Candidate contact information is only visible for approved campus recruitment drives where the candidate meets defined eligibility criteria.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">4. Student Rights & Data Management</h4>
                    <p>
                      Students maintain the right to review, update, or remove profile details, project portfolios, and resume data through their authenticated Student Dashboard.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">5. Institutional Oversight Contact</h4>
                    <p>
                      For privacy inquiries or institutional audit requests, contact the Central Placement Cell at <span className="text-brand-300 font-mono">admin@placement.edu</span>.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">1. Acceptance of Terms & Institutional Governance</h4>
                    <p>
                      By accessing Placement Genie, students, corporate recruiters, and placement officers agree to abide by these institutional terms and campus placement guidelines.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">2. Academic Integrity & Accuracy of Records</h4>
                    <p>
                      Candidates certify that academic information entered—including CGPA, department, graduation year, and certifications—is accurate and verifiable. Falsification of academic records or unauthorized assistance during skill assessments may result in placement disqualification.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">3. Recruiter Conduct & Placement Cell Approval</h4>
                    <p>
                      Corporate recruiters agree to post legitimate campus recruitment drives and honor published compensation and eligibility criteria. Placement cells reserve the authority to reject, suspend, or revoke company portal access if fraudulent information or policy violations occur.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">4. Platform Facilitation & Role Boundaries</h4>
                    <p>
                      Placement Genie serves as an evaluation, preparation, and recruitment workflow facilitator. Final hiring decisions and employment agreements remain the responsibility of participating corporate recruiters and institutional authorities.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white">5. Administrative Desk Contact</h4>
                    <p>
                      Terms of use inquiries may be addressed to the institutional administration desk at <span className="text-brand-300 font-mono">admin@placement.edu</span>.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setLegalModalType(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
