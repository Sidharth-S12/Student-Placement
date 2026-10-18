import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Cpu,
  Brain,
  Mic,
  Camera,
  FileText,
  Search,
  Building2,
  ShieldCheck,
  CheckCircle2,
  X,
  Info,
  Menu,
  BookOpen,
  Briefcase,
  Users,
  Target,
  Award,
  Layers,
  TrendingUp,
  Code2
} from 'lucide-react';

export const MegaNavbar = ({ onGetStarted, onSignIn, onNavigateSection }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'products' | 'solutions' | 'resources' | null
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  
  const navRef = useRef(null);
  const dropdownCloseTimeout = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle section scrolling and close dropdown
  const handleItemClick = (sectionId, customAction) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (customAction) {
      customAction();
      return;
    }

    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigateSection) {
        onNavigateSection(sectionId);
      }
    }
  };

  const handleMouseEnter = (menuName) => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownCloseTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleDropdown = (menuName) => {
    setActiveDropdown((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div ref={navRef} className="sticky top-0 z-50 w-full font-sans">
      
      {/* =====================================================================
          TOP ANNOUNCEMENT BANNER (Squarespace style)
         ===================================================================== */}
      {isBannerVisible && (
        <div className="bg-black text-white text-xs py-2 px-4 border-b border-neutral-800/80 flex items-center justify-between transition-all">
          <div className="flex-1" />
          <div className="flex items-center space-x-2 text-center text-neutral-300 text-[11px] sm:text-xs">
            <span>For campus placement drives 2026: take advantage of AI assessments & ATS resume suite. Use code at checkout:</span>
            <span className="bg-neutral-850 px-2 py-0.5 rounded font-mono font-bold text-white border border-neutral-700 select-all tracking-wider">
              PLACEMENT2026
            </span>
            <button
              onClick={() => handleItemClick('features')}
              title="Learn more about 2026 placement season"
              className="text-neutral-400 hover:text-white transition-colors ml-1"
            >
              <Info className="w-3.5 h-3.5 inline" />
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsBannerVisible(false)}
              aria-label="Dismiss banner"
              className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MAIN HEADER NAVIGATION (Pitch black, bold branding, dropdown triggers)
         ===================================================================== */}
      <nav className="bg-black text-white border-b border-neutral-800/80 relative transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Left: Brand Logo & Wordmark */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveDropdown(null);
            }}
          >
            {/* Minimalist modern twin-line/crest emblem (Squarespace-inspired elegance) */}
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-display">
                  PLACEMENT GENIE
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
                  AI ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">
                Campus Recruitment Intelligence
              </p>
            </div>
          </div>

          {/* Center: Desktop Mega Dropdown Triggers */}
          <div className="hidden lg:flex items-center space-x-1 sm:space-x-2">
            
            {/* 1. PRODUCTS Dropdown Button */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('products')}
                className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                  activeDropdown === 'products'
                    ? 'text-white bg-neutral-900'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <span>PRODUCTS</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'products' ? 'rotate-180 text-white' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* 2. SOLUTIONS Dropdown Button */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('solutions')}
                className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                  activeDropdown === 'solutions'
                    ? 'text-white bg-neutral-900'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <span>SOLUTIONS</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'solutions' ? 'rotate-180 text-white' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* 3. RESOURCES Dropdown Button */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('resources')}
                className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                  activeDropdown === 'resources'
                    ? 'text-white bg-neutral-900'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <span>RESOURCES</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'resources' ? 'rotate-180 text-white' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Right: Actions (LOG IN + GET STARTED) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => onSignIn && onSignIn('student')}
              className="text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white px-3 py-2 transition-colors rounded-lg hover:bg-neutral-900"
            >
              LOG IN
            </button>
            
            <button
              onClick={() => onGetStarted && onGetStarted('student')}
              className="bg-white hover:bg-neutral-200 text-black text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1.5"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* ===================================================================
            FULL-WIDTH MEGA MENU DROPDOWN PANEL (Exact Squarespace architecture)
           =================================================================== */}
        {activeDropdown && (
          <div
            className="hidden lg:block absolute top-full left-0 w-full bg-black border-b border-neutral-800 shadow-2xl animate-slide-down z-50 text-white"
            onMouseEnter={() => {
              if (dropdownCloseTimeout.current) clearTimeout(dropdownCloseTimeout.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-10">
              
              {/* =============================================================
                  DROPDOWN 1: PRODUCTS
                 ============================================================= */}
              {activeDropdown === 'products' && (
                <div className="grid grid-cols-12 gap-8 items-start">
                  
                  {/* Column 1: ASSESSMENT SUITE (Like Squarespace 'WEBSITE') */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      ASSESSMENT SUITE
                    </h3>
                    <ul className="space-y-2.5 text-[13px]">
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Technical Coding Tests
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Aptitude & Logic Reasoning
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          AI Mock Interview Studio
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Webcam Posture & Eye Tracking
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Attire & Formality Classifier
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Instant Score Analytics
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Live Code Execution
                        </button>
                      </li>
                    </ul>
                    
                    <div className="pt-4 border-t border-neutral-900">
                      <button
                        onClick={() => handleItemClick('features')}
                        className="text-xs font-semibold text-white hover:text-brand-300 transition-colors flex items-center space-x-1 group"
                      >
                        <span>View All Features</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Column 2: RESUME & ROADMAP (Like Squarespace 'BUSINESS') */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      RESUME & ROADMAP
                    </h3>
                    <ul className="space-y-2.5 text-[13px]">
                      <li>
                        <button
                          onClick={() => handleItemClick('resume-studio')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          1-Click ATS Resume Generator
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('resume-studio')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          AI Resume Keyword Gap Scanner
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('resume-studio')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Harvard/Stanford PDF Template
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Placement Readiness Engine
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Personalized Weekly Roadmap
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('resume-studio')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Direct PDF Export
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Tier-1 Company Benchmarking
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: ENTERPRISE & TOOLS (Like Squarespace 'MARKETING' & 'BUSINESS TOOLS') */}
                  <div className="col-span-3 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        CAMPUS INTELLIGENCE
                      </h3>
                      <ul className="space-y-2.5 text-[13px]">
                        <li>
                          <button
                            onClick={() => handleItemClick('portals')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Pre-Assessed Talent Sourcing
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Recruiter Score Filters
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Campus Drive Management
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Institutional Placement Cell
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        AI PLATFORM TOOLS
                      </h4>
                      <ul className="space-y-2 text-[13px]">
                        <li>
                          <button
                            onClick={() => handleItemClick('features')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            K-Means Cohort Clustering
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('features')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Live Speech-to-Text Analysis
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('test-center')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Computer Vision Attire Check
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Column 4: FOR RECRUITERS & AGENCIES (Squarespace Card Style) */}
                  <div className="col-span-3 space-y-4 pl-4 border-l border-neutral-900">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      FOR RECRUITERS AND CAMPUSES
                    </h3>
                    
                    {/* Featured Card 1 */}
                    <div
                      onClick={() => {
                        setActiveDropdown(null);
                        if (onSignIn) onSignIn('company');
                      }}
                      className="bg-neutral-900/90 hover:bg-neutral-850 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition-all group hover:border-neutral-700"
                    >
                      <h4 className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                        Placement Genie for Recruiters
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                        Powerful talent sourcing with verified DSA, aptitude, and interview ratings for campus drives.
                      </p>
                    </div>

                    {/* Featured Card 2 */}
                    <div
                      onClick={() => {
                        setActiveDropdown(null);
                        if (onSignIn) onSignIn('admin');
                      }}
                      className="bg-neutral-900/90 hover:bg-neutral-850 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition-all group hover:border-neutral-700"
                    >
                      <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                        Institutional Placement Cell
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                        Campus-wide cohort performance analytics, department metrics, and drive scheduling for officers.
                      </p>
                    </div>

                    {/* Small Live Preview Pill */}
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-neutral-300 font-medium">Readiness Engine 2026</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                        88% AVG SCORE
                      </span>
                    </div>

                  </div>

                </div>
              )}

              {/* =============================================================
                  DROPDOWN 2: SOLUTIONS
                 ============================================================= */}
              {activeDropdown === 'solutions' && (
                <div className="grid grid-cols-12 gap-8 items-start">
                  
                  {/* Column 1: FOR STUDENTS */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      FOR STUDENTS
                    </h3>
                    <ul className="space-y-2.5 text-[13px]">
                      <li>
                        <button
                          onClick={() => handleItemClick(null, () => onGetStarted && onGetStarted('student'))}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Final-Year Placement Drives
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Pre-Final Year Internship Prep
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Off-Campus Tech Drives
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          FAANG & Tier-1 Interview Prep
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Data Structures & Algorithms Drills
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Behavioral STAR Interview Drills
                        </button>
                      </li>
                    </ul>

                    <div className="pt-4 border-t border-neutral-900">
                      <button
                        onClick={() => handleItemClick(null, () => onGetStarted && onGetStarted('student'))}
                        className="text-xs font-semibold text-white hover:text-brand-300 transition-colors flex items-center space-x-1 group"
                      >
                        <span>Launch Student Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Column 2: FOR RECRUITERS */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      FOR RECRUITERS
                    </h3>
                    <ul className="space-y-2.5 text-[13px]">
                      <li>
                        <button
                          onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Pre-Assessed Candidate Pipelines
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Coding & Aptitude Filter Hub
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Batch Campus Drive Scheduling
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('resume-studio')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          1-Click ATS Resume Verification
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Verified Project Portfolios
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Direct College Partnership Drives
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: FOR UNIVERSITIES */}
                  <div className="col-span-3 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        FOR UNIVERSITIES
                      </h3>
                      <ul className="space-y-2.5 text-[13px]">
                        <li>
                          <button
                            onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Central Placement Cell Office
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Department Readiness Analytics
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            K-Means Performance Clustering
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Company Drive Approval Desk
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        ACADEMIC GOVERNANCE
                      </h4>
                      <ul className="space-y-2 text-[13px]">
                        <li>
                          <button
                            onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Batch Report PDF & CSV Exports
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Departmental Heatmap Graphs
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Column 4: SPECIALIZED SOLUTIONS (Squarespace Card Style) */}
                  <div className="col-span-3 space-y-4 pl-4 border-l border-neutral-900">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      ENTERPRISE PROGRAMS
                    </h3>
                    
                    <div
                      onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))}
                      className="bg-neutral-900/90 hover:bg-neutral-850 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition-all group hover:border-neutral-700"
                    >
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        Corporate Talent Fast-Track
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                        Connect with Day-1 verified engineering talent pre-filtered for your stack.
                      </p>
                    </div>

                    <div
                      onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))}
                      className="bg-neutral-900/90 hover:bg-neutral-850 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition-all group hover:border-neutral-700"
                    >
                      <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                        Institutional Partnership
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                        Equip your entire college branch with AI-assisted interview & mock testing.
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Hiring Drives Hosted</span>
                      <span className="text-white font-bold font-mono">1,450+ Active</span>
                    </div>

                  </div>

                </div>
              )}

              {/* =============================================================
                  DROPDOWN 3: RESOURCES
                 ============================================================= */}
              {activeDropdown === 'resources' && (
                <div className="grid grid-cols-12 gap-8 items-start">
                  
                  {/* Column 1: PREPARATION GUIDES */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      PREPARATION GUIDES
                    </h3>
                    <ul className="space-y-2.5 text-[13px]">
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Campus Drive Syllabus & Patterns
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Top 100 Coding Problems for Placements
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Quantitative Aptitude Formula Sheet
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Logical Reasoning Deductions
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          STAR Behavioral Interview Framework
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('test-center')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          HR Round Frequently Asked Questions
                        </button>
                      </li>
                    </ul>

                    <div className="pt-4 border-t border-neutral-900">
                      <button
                        onClick={() => handleItemClick('test-center')}
                        className="text-xs font-semibold text-white hover:text-brand-300 transition-colors flex items-center space-x-1 group"
                      >
                        <span>Explore Test Center</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Column 2: RECRUITER CUTOFFS */}
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      COMPANY BENCHMARKS
                    </h3>
                    <ul className="space-y-2.5 text-[13px]">
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Tier-1 Tech Giants (Google, Amazon, MS)
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Fintech & High Frequency Trading Firms
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          IT Services & Global Consultancies
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Core Engineering Campus Recruiters
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleItemClick('features')}
                          className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                        >
                          Expected Compensation & CTC 2026
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: ATS RESUME STANDARDS */}
                  <div className="col-span-3 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        STANDARDS & DOCS
                      </h3>
                      <ul className="space-y-2.5 text-[13px]">
                        <li>
                          <button
                            onClick={() => handleItemClick('resume-studio')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Harvard ATS Resume Guidelines
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('resume-studio')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            ATS Parser Compliance Checklist
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('test-center')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Webcam Vision Privacy Guarantee
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('features')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Readiness Scoring Methodology
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        SUPPORT & COMMUNITY
                      </h4>
                      <ul className="space-y-2 text-[13px]">
                        <li>
                          <button
                            onClick={() => handleItemClick('portals')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Campus Placement Office FAQs
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleItemClick('features')}
                            className="text-neutral-300 hover:text-white transition-colors text-left block w-full hover:translate-x-1 duration-150"
                          >
                            Student Placement Support Team
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Column 4: FEATURED RESOURCES (Squarespace Card Style) */}
                  <div className="col-span-3 space-y-4 pl-4 border-l border-neutral-900">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      FEATURED PLAYBOOKS
                    </h3>
                    
                    <div
                      onClick={() => handleItemClick('test-center')}
                      className="bg-neutral-900/90 hover:bg-neutral-850 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition-all group hover:border-neutral-700"
                    >
                      <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        2026 Campus Placement Playbook
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                        The ultimate roadmap to master coding interviews, aptitude tests, and attire vision rounds.
                      </p>
                    </div>

                    <div
                      onClick={() => handleItemClick('resume-studio')}
                      className="bg-neutral-900/90 hover:bg-neutral-850 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition-all group hover:border-neutral-700"
                    >
                      <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                        10,000+ Curated Question Bank
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                        Exhaustive DSA, quantitative, verbal, and system design challenges with step-by-step solutions.
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">ATS Compliance</span>
                      <span className="text-emerald-400 font-bold">100% Guaranteed</span>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </nav>

      {/* =====================================================================
          DARK BACKDROP OVERLAY (Closes dropdown on outside click)
         ===================================================================== */}
      {activeDropdown && (
        <div
          onClick={() => setActiveDropdown(null)}
          className="hidden lg:block fixed inset-0 top-[calc(5rem+2rem)] bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        />
      )}

      {/* =====================================================================
          MOBILE SLIDE-DOWN DRAWER (Accordion Navigation)
         ===================================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-6 text-white max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Section 1: PRODUCTS */}
          <div className="border-b border-neutral-800/80 pb-4">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'products' ? null : 'products')}
              className="w-full flex items-center justify-between py-2 text-sm font-bold uppercase tracking-wider text-white"
            >
              <span>PRODUCTS</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'products' ? 'rotate-180' : ''}`} />
            </button>
            {mobileExpandedSection === 'products' && (
              <div className="pt-2 pl-3 space-y-2.5 text-xs text-neutral-300">
                <button onClick={() => handleItemClick('test-center')} className="block text-left w-full py-1 hover:text-white">
                  Technical Coding Tests
                </button>
                <button onClick={() => handleItemClick('test-center')} className="block text-left w-full py-1 hover:text-white">
                  Aptitude & Logic Reasoning
                </button>
                <button onClick={() => handleItemClick('test-center')} className="block text-left w-full py-1 hover:text-white">
                  AI Mock Interview Studio
                </button>
                <button onClick={() => handleItemClick('test-center')} className="block text-left w-full py-1 hover:text-white">
                  Webcam Posture & Eye Tracking
                </button>
                <button onClick={() => handleItemClick('resume-studio')} className="block text-left w-full py-1 hover:text-white">
                  1-Click ATS Resume Generator
                </button>
                <button onClick={() => handleItemClick('resume-studio')} className="block text-left w-full py-1 hover:text-white">
                  AI Resume Keyword Scanner
                </button>
                <button onClick={() => handleItemClick('features')} className="block text-left w-full py-1 hover:text-white">
                  Placement Readiness Engine
                </button>
              </div>
            )}
          </div>

          {/* Mobile Section 2: SOLUTIONS */}
          <div className="border-b border-neutral-800/80 pb-4">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'solutions' ? null : 'solutions')}
              className="w-full flex items-center justify-between py-2 text-sm font-bold uppercase tracking-wider text-white"
            >
              <span>SOLUTIONS</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'solutions' ? 'rotate-180' : ''}`} />
            </button>
            {mobileExpandedSection === 'solutions' && (
              <div className="pt-2 pl-3 space-y-2.5 text-xs text-neutral-300">
                <button onClick={() => handleItemClick(null, () => onGetStarted && onGetStarted('student'))} className="block text-left w-full py-1 hover:text-white">
                  For Students (Campus Placements)
                </button>
                <button onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('company'))} className="block text-left w-full py-1 hover:text-white">
                  For Recruiters (Talent Sourcing)
                </button>
                <button onClick={() => handleItemClick('portals', () => onSignIn && onSignIn('admin'))} className="block text-left w-full py-1 hover:text-white">
                  For Universities (Placement Cell)
                </button>
              </div>
            )}
          </div>

          {/* Mobile Section 3: RESOURCES */}
          <div className="border-b border-neutral-800/80 pb-4">
            <button
              onClick={() => setMobileExpandedSection(mobileExpandedSection === 'resources' ? null : 'resources')}
              className="w-full flex items-center justify-between py-2 text-sm font-bold uppercase tracking-wider text-white"
            >
              <span>RESOURCES</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            {mobileExpandedSection === 'resources' && (
              <div className="pt-2 pl-3 space-y-2.5 text-xs text-neutral-300">
                <button onClick={() => handleItemClick('test-center')} className="block text-left w-full py-1 hover:text-white">
                  Campus Drive Syllabus & Patterns
                </button>
                <button onClick={() => handleItemClick('resume-studio')} className="block text-left w-full py-1 hover:text-white">
                  Harvard ATS Resume Standards
                </button>
                <button onClick={() => handleItemClick('features')} className="block text-left w-full py-1 hover:text-white">
                  Tier-1 Company Benchmarks
                </button>
              </div>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSignIn) onSignIn('student');
              }}
              className="w-full py-3 rounded-xl border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-900 transition-colors"
            >
              LOG IN
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGetStarted) onGetStarted('student');
              }}
              className="w-full py-3 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-neutral-200 transition-colors"
            >
              GET STARTED
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
