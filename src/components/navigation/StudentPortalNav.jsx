import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Target,
  Cpu,
  Brain,
  Mic,
  Camera,
  FileText,
  Search,
  Map,
  Layers,
  ChevronDown,
  Download,
  Edit3,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  Phone,
  CheckCircle2,
  Play
} from 'lucide-react';

export const StudentPortalNav = ({
  activeTab,
  activeSection,
  testCenterSubTab,
  resumeSubTab,
  onNavigate,
  studentData,
  hasProfile,
  readinessScore,
  latestAssessment,
  latestAptitudeAssessment,
  latestCommunicationAssessment,
  onOpenEditProfile,
  onOpenATSModal,
  onQuickDownloadATS,
  onStartTechnical,
  onStartAptitude,
  onStartCommunication
}) => {
  const [openDropdown, setOpenDropdown] = useState(null); // 'placement' | 'testing' | 'resume' | 'roadmap' | null
  const navRef = useRef(null);

  const {
    personalInfo = {},
    education = {},
    placementScores = {},
    technicalSkills = {},
    projects = [],
    experience = [],
    certifications = []
  } = studentData || {};

  const currentReadiness = placementScores.overallReadiness !== undefined && placementScores.overallReadiness > 0
    ? placementScores.overallReadiness
    : (readinessScore || 0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (tab, subOption = null) => {
    setOpenDropdown(null);
    if (onNavigate) {
      onNavigate(tab, subOption);
    }
  };

  const isPlacementActive = activeTab === 'profile';
  const isTestingActive = ['assessments', 'technical', 'aptitude', 'interview', 'appearance'].includes(activeTab);
  const isResumeActive = ['resume', 'resume-builder', 'resume-analyzer'].includes(activeTab);
  const isRoadmapActive = activeTab === 'roadmap' || activeTab === 'all';

  const navButtonClass = (isActive, isOpen) =>
    `flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
      isOpen
        ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/20'
        : isActive
        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <div ref={navRef} className="relative flex items-center space-x-1.5 sm:space-x-2 select-none">
      
      {/* 1. Dashboard Direct Link */}
      <button
        type="button"
        onClick={() => handleSelect('dashboard')}
        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
          activeTab === 'dashboard'
            ? 'bg-brand-600 text-white shadow-sm shadow-brand-950/40'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </button>

      {/* 2. PLACEMENT DROPDOWN (Crisp White Background) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'placement' ? null : 'placement')}
          onMouseEnter={() => {
            if (openDropdown && openDropdown !== 'placement') setOpenDropdown('placement');
          }}
          className={navButtonClass(isPlacementActive, openDropdown === 'placement')}
          aria-expanded={openDropdown === 'placement'}
        >
          <User className="w-3.5 h-3.5 text-brand-400" />
          <span>Placement</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              openDropdown === 'placement' ? 'rotate-180 text-slate-900' : 'text-slate-400'
            }`}
          />
        </button>

        {openDropdown === 'placement' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[540px] bg-white text-slate-900 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-200/90 p-5 z-50 animate-slide-down">
            
            <div className="grid grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Clean List of Profile Sections */}
              <div className="col-span-7 space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    PLACEMENT PROFILE
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">6 Sections</span>
                </div>

                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'academics')}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        Academics & CGPA
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {education.cgpa ? `${education.cgpa} CGPA` : 'Education'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'skills')}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        Technical Skills
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {technicalSkills.languages?.length ? `${technicalSkills.languages.length} stacks` : 'Skills'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'projects')}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        Projects Portfolio
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {projects.length} Showcased
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'experience')}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        Work Experience
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {experience.length} Internships
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'certifications')}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        Certifications
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {certifications.length} Badges
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'contact')}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                        Contact Info & Links
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      {personalInfo.email ? 'Connected' : 'Setup'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Featured Profile Glance Card */}
              <div className="col-span-5 pl-4 border-l border-slate-100 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      STATUS
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      hasProfile
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {hasProfile ? 'Drive Eligible' : 'Incomplete'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {personalInfo.fullName || 'Candidate Profile'}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {education.degree || 'Degree Candidate'} {education.branch ? `• ${education.branch}` : ''}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate pt-0.5">
                      {education.college || 'Campus Recruitment Drive'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onOpenEditProfile) onOpenEditProfile();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('profile', 'all')}
                    className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    View Complete Profile →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* 3. TESTING DROPDOWN (Crisp White Background) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'testing' ? null : 'testing')}
          onMouseEnter={() => {
            if (openDropdown && openDropdown !== 'testing') setOpenDropdown('testing');
          }}
          className={navButtonClass(isTestingActive, openDropdown === 'testing')}
          aria-expanded={openDropdown === 'testing'}
        >
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>Testing</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              openDropdown === 'testing' ? 'rotate-180 text-slate-900' : 'text-slate-400'
            }`}
          />
        </button>

        {openDropdown === 'testing' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[560px] bg-white text-slate-900 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-200/90 p-5 z-50 animate-slide-down">
            
            <div className="grid grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Clean List of Assessments */}
              <div className="col-span-7 space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    PLACEMENT ASSESSMENTS
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">4 Assessment Rounds</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleSelect('assessments', 'technical')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          Technical Coding Test
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Adaptive DSA & Code Execution
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {latestAssessment?.technicalScore !== undefined ? `${latestAssessment.technicalScore}%` : 'Take Test'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('assessments', 'aptitude')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          Aptitude & Reasoning
                        </div>
                        <div className="text-[10px] text-slate-500">
                          20-Min Timed Corporate Round
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      {latestAptitudeAssessment?.finalScore !== undefined ? `${latestAptitudeAssessment.finalScore}%` : 'Take Test'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('assessments', 'interview')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                          AI Mock Interview
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Spoken Questions & STAR Evaluation
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                      {latestCommunicationAssessment?.finalScore !== undefined ? `${latestCommunicationAssessment.finalScore}%` : 'Practice'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('assessments', 'appearance')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-pink-600 transition-colors">
                          Posture & Attire Vision
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Webcam Alignment & Dress Code AI
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full uppercase">
                      Live AI
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Readiness Score Summary & Action */}
              <div className="col-span-5 pl-4 border-l border-slate-100 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      BENCHMARK
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Tier-1 Target</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-semibold">Overall Readiness</span>
                      <span className="text-base font-black text-slate-900 font-display">{currentReadiness}%</span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, Math.max(5, currentReadiness))}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      {currentReadiness >= 75
                        ? 'Eligible for Day-1 tier-1 campus recruiter drives.'
                        : 'Complete remaining assessment modules to boost score.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onStartTechnical) onStartTechnical();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Coding Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('assessments', 'overview')}
                    className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    View All Test Results →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* 4. RESUME DROPDOWN (Crisp White Background) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'resume' ? null : 'resume')}
          onMouseEnter={() => {
            if (openDropdown && openDropdown !== 'resume') setOpenDropdown('resume');
          }}
          className={navButtonClass(isResumeActive, openDropdown === 'resume')}
          aria-expanded={openDropdown === 'resume'}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Resume</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              openDropdown === 'resume' ? 'rotate-180 text-slate-900' : 'text-slate-400'
            }`}
          />
        </button>

        {openDropdown === 'resume' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[480px] bg-white text-slate-900 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-200/90 p-5 z-50 animate-slide-down">
            
            <div className="grid grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Tools */}
              <div className="col-span-7 space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    RESUME TOOLS
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">100% ATS Ready</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleSelect('resume', 'builder')}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        ATS Resume PDF Builder
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Harvard standard 1-page layout
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect('resume', 'analyzer')}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                        AI Keyword Gap Scanner
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Match resume to job descriptions
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Column: Direct Export */}
              <div className="col-span-5 pl-4 border-l border-slate-100 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ATS 100/100 Format
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    Pre-formatted for automated campus recruiter screening systems.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onQuickDownloadATS) onQuickDownloadATS();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onOpenATSModal) onOpenATSModal();
                    }}
                    className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    Customize Template →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* 5. ROADMAP DROPDOWN (Crisp White Background) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'roadmap' ? null : 'roadmap')}
          onMouseEnter={() => {
            if (openDropdown && openDropdown !== 'roadmap') setOpenDropdown('roadmap');
          }}
          className={navButtonClass(isRoadmapActive, openDropdown === 'roadmap')}
          aria-expanded={openDropdown === 'roadmap'}
        >
          <Map className="w-3.5 h-3.5 text-purple-400" />
          <span>Roadmap</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              openDropdown === 'roadmap' ? 'rotate-180 text-slate-900' : 'text-slate-400'
            }`}
          />
        </button>

        {openDropdown === 'roadmap' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-80 bg-white text-slate-900 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-200/90 p-4 z-50 animate-slide-down">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-2 pb-1 block border-b border-slate-100">
                CAREER PREPARATION
              </span>

              <button
                type="button"
                onClick={() => handleSelect('roadmap')}
                className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                    Weekly Learning Roadmap
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Step-by-step 4-week study plan
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelect('all')}
                className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                    Full Page Consolidated View
                  </div>
                  <div className="text-[10px] text-slate-500">
                    All sections on one scrollable canvas
                  </div>
                </div>
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
