import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Cpu,
  Brain,
  Mic,
  FileText,
  Map,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Code2,
  Target,
  Search,
  ExternalLink,
  Shield,
  Layers,
  BarChart3,
  Check
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onSignIn }) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState('assessment');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">

      {/* =====================================================================
          1. NAVIGATION BAR
         ===================================================================== */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">
                  PLACEMENT GENIE
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                  AI Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Campus Recruitment Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition-colors"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('test-center')}
              className="hover:text-white transition-colors"
            >
              Test Center
            </button>
            <button
              onClick={() => scrollToSection('resume-studio')}
              className="hover:text-white transition-colors"
            >
              Resume Studio
            </button>
            <button
              onClick={() => scrollToSection('portals')}
              className="hover:text-white transition-colors"
            >
              For Recruiters & Admins
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800/80"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
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
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
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
                Next-Gen Campus Placement Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-[1.15]">
              Master Placements with{' '}
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Adaptive AI Readiness
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
              An all-in-one placement preparation and hiring suite. Take adaptive technical coding tests,
              hone interview communication with speech evaluation, generate ATS-formatted resumes, and
              connect directly with campus recruiters.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-600 to-purple-600 hover:from-brand-600 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Student Workspace</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onSignIn}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-base border border-slate-700/80 transition-all flex items-center justify-center space-x-2"
              >
                <span>Sign In to Existing Portal</span>
              </button>
            </div>

            {/* Feature Highlights Pills */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Adaptive Coding Tests</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Mock Interview Studio</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1-Click ATS PDF Resume</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Role-Based Recruiter Access</span>
              </div>
            </div>

          </div>

          {/* Interactive Preview Dashboard Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-slate-950/80 border border-slate-800 p-3 sm:p-5 shadow-2xl shadow-brand-950/50 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 px-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-500 ml-2">placement-genie.workspace/student/analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Live Engine Active
                </span>
              </div>
            </div>

            <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Overall Readiness</span>
                  <Target className="w-4 h-4 text-brand-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">88%</div>
                <div className="text-[11px] text-emerald-400 font-semibold">Ready for Tier-1 Drives</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Technical Coding</span>
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">92%</div>
                <div className="text-[11px] text-blue-400 font-semibold">Algorithms & Data Structures</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Aptitude & Logic</span>
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">85%</div>
                <div className="text-[11px] text-indigo-400 font-semibold">Quant & Analytical Reasoning</div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                  <span>Interview & Comm</span>
                  <Mic className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white font-display">86%</div>
                <div className="text-[11px] text-purple-400 font-semibold">STAR Method & Voice Evaluation</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. METRICS / STATS STRIP
         ===================================================================== */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-display">94%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Placement Success Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-brand-400 font-display">10,000+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Curated Technical Questions</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400 font-display">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">ATS Resume Parsing Compliance</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 font-display">3-in-1</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Student, Recruiter & Admin Hub</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. CORE CAPABILITIES (FEATURES SECTION)
         ===================================================================== */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
              Complete Preparation Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Designed for High-Impact Campus Placements
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Every tool a student needs to become company-ready, organized into five focused workspaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div className="bg-slate-800/40 border border-slate-800 hover:border-brand-500/40 p-8 rounded-3xl space-y-4 transition-all group hover:bg-slate-800/70">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Placement Readiness Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Aggregates your CGPA, adaptive technical scores, aptitude percentiles, and interview ratings into a unified 0-100% readiness score with actionable next-step recommendations.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>Real-time score calculation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>Tailored milestone suggestions</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/40 border border-slate-800 hover:border-indigo-500/40 p-8 rounded-3xl space-y-4 transition-all group hover:bg-slate-800/70">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Adaptive Skill Assessments
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Timed 20-minute aptitude and AI coding challenges with live code execution, real-time score analytics, and detailed topic breakdown.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>Data Structures & Algorithms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>Quantitative & Verbal Reasoning</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/40 border border-slate-800 hover:border-purple-500/40 p-8 rounded-3xl space-y-4 transition-all group hover:bg-slate-800/70">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                AI Mock Interview Studio
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Spoken corporate questions, microphone speech evaluation using STAR structure, and structured communication feedback.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Real-time voice speech-to-text</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>STAR methodology feedback</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          5. TEST CENTER SHOWCASE
         ===================================================================== */}
      <section id="test-center" className="py-20 bg-slate-950/70 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Dedicated Assessment Suite
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
                Placement Test Center
              </h2>
              <p className="text-sm text-slate-400">
                Rigorous testing modules modeled after standard campus drive assessment rounds by top tech recruiters.
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center space-x-2"
            >
              <span>Explore All Test Modules</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Technical Coding</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adaptive multiple-choice and algorithmic logic questions covering Python, Java, JavaScript, and C++.
              </p>
              <div className="text-[11px] font-semibold text-blue-400 pt-2 border-t border-slate-800/80">
                Instant Score Breakdown
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Aptitude & Logic</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Timed 20-minute reasoning test evaluating speed, logical deductions, quantitative accuracy, and verbal ability.
              </p>
              <div className="text-[11px] font-semibold text-indigo-400 pt-2 border-t border-slate-800/80">
                Corporate Cut-off Benchmarks
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">AI Mock Interview</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive interview simulator asking real behavioral and situational engineering interview questions.
              </p>
              <div className="text-[11px] font-semibold text-purple-400 pt-2 border-t border-slate-800/80">
                Voice Recording & Evaluation
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          6. RESUME STUDIO SHOWCASE
         ===================================================================== */}
      <section id="resume-studio" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
                  Dual-Action Resume Tools
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
                  ATS Resume Studio & AI Keyword Scanner
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Avoid getting filtered out by corporate Applicant Tracking Systems. Placement Genie gives you an automated one-click PDF resume engine and an AI-powered gap analyzer.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">1-Click Single Page ATS Resume Generator</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Converts your placement profile, education, technical stack, and software projects into a beautifully formatted, machine-readable PDF.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Keyword Gap Scanner</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload any existing resume and compare it against target job descriptions to identify missing skills and keywords.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center space-x-2"
              >
                <span>Build ATS Resume Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Decorative Resume Card Graphic */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <div className="text-sm font-bold text-white">ATS Standard Resume Format</div>
                    <div className="text-xs text-slate-400">Harvard & Stanford Recruiter Template</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ATS 100/100
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="h-3 w-1/3 bg-slate-800 rounded" />
                  <div className="h-2 w-full bg-slate-850 rounded" />
                  <div className="h-2 w-4/5 bg-slate-850 rounded" />

                  <div className="pt-3 border-t border-slate-850 space-y-2">
                    <div className="h-2.5 w-1/4 bg-brand-500/30 rounded" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-2 bg-slate-800 rounded" />
                      <div className="h-2 bg-slate-800 rounded" />
                      <div className="h-2 bg-slate-800 rounded" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850 space-y-2">
                    <div className="h-2.5 w-1/4 bg-brand-500/30 rounded" />
                    <div className="h-2 w-5/6 bg-slate-800 rounded" />
                    <div className="h-2 w-2/3 bg-slate-800 rounded" />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Standard 1-Page PDF Export</span>
                  <span className="text-brand-400 font-semibold">Instant Download Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          7. ROLE PORTALS (STUDENTS, RECRUITERS, ADMINS)
         ===================================================================== */}
      <section id="portals" className="py-20 bg-slate-950/70 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Multi-Stakeholder Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              A Unified Hub for Campus Hiring
            </h2>
            <p className="text-sm text-slate-400">
              Dedicated interfaces tailored for students, company recruiters, and institutional placement officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Student Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Student Portal</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    For engineering & college students seeking top placements.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Skill assessments & readiness analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI mock interview studio & camera vision</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ATS resume generation & keyword scanner</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Weekly personalized learning roadmap</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSignIn ? onSignIn('student') : onGetStarted()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors"
              >
                Access Student Portal
              </button>
            </div>

            {/* Recruiter Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Company Recruiter Portal</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    For tech companies sourcing pre-assessed talent.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Search students by verified skill scores</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Filter by CGPA, aptitude & coding rating</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>1-click ATS resume preview & download</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Manage campus hiring drives & schedules</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSignIn('company')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-colors"
              >
                Recruiter Portal Sign In
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-700/50 text-slate-300 flex items-center justify-center text-2xl">
                  🛡️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Institutional Admin Portal</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    For placement cell officers & academic directors.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Campus-wide placement analytics & metrics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Department & batch-wise readiness reports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>K-Means student performance clustering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Approve company recruitment drives</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSignIn('admin')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors"
              >
                Placement Officer Sign In
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          8. CALL TO ACTION BANNER
         ===================================================================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-700 to-purple-800 p-8 sm:p-14 text-center text-white shadow-2xl shadow-brand-900/60 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                Ready to Accelerate Your Campus Placements?
              </h2>
              <p className="text-sm sm:text-base text-brand-100 font-normal">
                Join thousands of engineering students preparing smarter with adaptive assessments, speech evaluation, and ATS-optimized profiles.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm shadow-xl transition-all"
                >
                  Create Student Account
                </button>
                <button
                  onClick={onSignIn}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Sign In to Your Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. FOOTER
         ===================================================================== */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight">PLACEMENT GENIE</span>
              <p className="text-[11px] text-slate-500">Autonomous Campus Placement Engine</p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p className="text-slate-400">
              © {new Date().getFullYear()} Placement Genie. Built for Excellence in Campus Placements.
            </p>
            <p className="text-slate-600 text-[11px]">
              Engineered with React 18, Vite, Express, and Machine Intelligence.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
