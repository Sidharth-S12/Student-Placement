import React, { useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { generateATSResumePDF } from '../utils/generateATSResumePDF';
import { StudentSidebar } from './navigation/StudentSidebar';
import { StudentPortalNav } from './navigation/StudentPortalNav';
import PersonalizedRoadmap from './PersonalizedRoadmap';
import ResumeAnalyzer from './ResumeAnalyzer';
import { AppearancePostureAnalyzer } from './appearance/AppearancePostureAnalyzer';
import { Card, Button, Badge, StatCard, PageHeader } from './ui';
import {
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Star,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  FileText,
  Edit3,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Camera,
  Target,
  Cpu,
  Brain,
  MessageSquare,
  Mic,
  Download,
  PlusCircle,
  RefreshCw,
  LogOut,
  Loader2,
  Menu,
  ChevronRight,
  Layers,
  Search,
  Map,
  ArrowRight
} from 'lucide-react';

export const SinglePageDashboard = () => {
  const { logout } = useAuth();

  const {
    studentData,
    profileLoading,
    hasProfile,
    setIsEditModalOpen,
    setIsResumeModalOpen,
    setIsAssessmentModalOpen,
    handlePhotoFileUpload,
    removeProfilePhoto,
    latestAssessment,
    setIsAptitudeModalOpen,
    latestAptitudeAssessment,
    setIsCommunicationModalOpen,
    latestCommunicationAssessment,
    openCommunicationModal,
    readinessScore,
    showToast
  } = useStudent();

  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeSubTab, setResumeSubTab] = useState('builder'); // 'builder' | 'analyzer'
  const [testCenterSubTab, setTestCenterSubTab] = useState('overview'); // 'overview' | 'technical' | 'aptitude' | 'interview' | 'appearance'

  const fileInputRef = useRef(null);

  const {
    personalInfo = {},
    placementScores = {},
    education = {},
    professionalLinks = {},
    technicalSkills = {},
    projects = [],
    experience = [],
    certifications = [],
    achievements = []
  } = studentData || {};

  const currentReadiness = placementScores.overallReadiness !== undefined && placementScores.overallReadiness > 0
    ? placementScores.overallReadiness
    : (readinessScore || 0);

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoFileUpload(file);
    }
  };

  const handleQuickDownloadPDF = () => {
    try {
      showToast("Generating ATS PDF Resume...");
      generateATSResumePDF(studentData);
      showToast("ATS PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF download error", err);
      setIsResumeModalOpen(true);
    }
  };

  const navigateTo = (tab, subOption = null) => {
    if (tab === 'resume') {
      setActiveTab('resume');
      if (subOption) setResumeSubTab(subOption);
    } else if (tab === 'tests' || tab === 'assessments') {
      setActiveTab('assessments');
      if (subOption) setTestCenterSubTab(subOption);
    } else if (tab === 'technical' || tab === 'aptitude' || tab === 'interview' || tab === 'appearance') {
      setActiveTab('assessments');
      setTestCenterSubTab(tab);
    } else if (tab === 'resume-builder') {
      setActiveTab('resume');
      setResumeSubTab('builder');
    } else if (tab === 'resume-analyzer') {
      setActiveTab('resume');
      setResumeSubTab('analyzer');
    } else {
      setActiveTab(tab);
    }

    if (tab === 'profile' && subOption) {
      setActiveSection(subOption);
      setTimeout(() => {
        const elem = document.getElementById(subOption);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          elem.classList.add('section-highlight');
          setTimeout(() => {
            elem.classList.remove('section-highlight');
          }, 2000);
        }
      }, 150);
    }

    const isProfileSection = ['academics', 'skills', 'projects', 'experience', 'certifications', 'contact'].includes(subOption);
    if (!isProfileSection) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSubSection = (id) => {
    navigateTo('profile', id);
  };

  if (profileLoading && !studentData) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-extrabold text-base text-white font-display">Placement Genie</h2>
            <p className="text-xs text-slate-400">Loading student profile...</p>
          </div>
          <div className="pt-2">
            <Loader2 className="w-5 h-5 text-brand-400 animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 1. REFINED PROFILE HEADER (Hero Banner)
  // =========================================================================
  const renderProfileHeader = (compact = false) => (
    <Card className="p-6 relative overflow-hidden animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative group flex-shrink-0">
            <img
              src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
              alt={personalInfo.fullName || 'Student'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-slate-700/80 border border-slate-800 shadow-md"
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Change profile photo"
              className="absolute -bottom-1 -right-1 bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-xl border border-slate-700 shadow-sm transition-transform hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                {personalInfo.fullName || 'Welcome, Student'}
              </h1>
              {hasProfile ? (
                <Badge variant="emerald" dot>
                  Placement Eligible
                </Badge>
              ) : (
                <Badge variant="amber">
                  Profile Incomplete
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-brand-400">
              {education.degree || 'Degree'} {education.branch ? `in ${education.branch}` : ''} {education.graduationYear ? `• Class of ${education.graduationYear}` : ''}
            </p>

            <p className="text-xs text-slate-400 font-medium">
              {education.college || 'Campus Placement Candidate'}
            </p>

            {!compact && personalInfo.summary && (
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-1">
                {personalInfo.summary}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
          <Button
            variant="secondary"
            icon={Edit3}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>

          <Button
            variant="primary"
            icon={Download}
            onClick={handleQuickDownloadPDF}
          >
            Download ATS Resume
          </Button>
        </div>

      </div>
    </Card>
  );

  // =========================================================================
  // 2. KEY READINESS METRICS ROW (4 Cards)
  // =========================================================================
  const renderReadinessMetrics = () => {
    const techScore = latestAssessment?.technicalScore ?? placementScores.technicalScore ?? 0;
    const aptScore = latestAptitudeAssessment?.finalScore ?? placementScores.aptitudeScore ?? 0;
    const commScore = latestCommunicationAssessment?.finalScore ?? (placementScores.communicationScore > 0 ? placementScores.communicationScore : 0);

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {/* Metric 1: Readiness Score */}
        <StatCard
          title="Placement Readiness"
          value={`${currentReadiness}%`}
          subtext={currentReadiness >= 75 ? "Target met for Day-1 companies" : "Complete tests to boost score"}
          icon={Target}
          colorScheme={currentReadiness >= 75 ? "emerald" : currentReadiness >= 50 ? "brand" : "amber"}
          onClick={() => navigateTo('tests', 'overview')}
        />

        {/* Metric 2: Technical Skill Score */}
        <StatCard
          title="Technical Competency"
          value={latestAssessment ? `${techScore}%` : (techScore > 0 ? `${techScore}%` : 'Not Tested')}
          subtext={latestAssessment ? "Adaptive AI coding assessment" : "Take technical test"}
          icon={Cpu}
          colorScheme="brand"
          onClick={() => navigateTo('tests', 'technical')}
        />

        {/* Metric 3: Aptitude & Logic */}
        <StatCard
          title="Aptitude & Logic"
          value={latestAptitudeAssessment ? `${aptScore}%` : (aptScore > 0 ? `${aptScore}%` : 'Not Tested')}
          subtext={latestAptitudeAssessment ? "Quant, logical & verbal" : "Take 20-min aptitude test"}
          icon={Brain}
          colorScheme="indigo"
          onClick={() => navigateTo('tests', 'aptitude')}
        />

        {/* Metric 4: Communication & Interview */}
        <StatCard
          title="Interview & Comm"
          value={latestCommunicationAssessment ? `${commScore}%` : (commScore > 0 ? `${commScore}%` : 'Not Tested')}
          subtext={latestCommunicationAssessment ? "STAR response & clarity" : "Practice mock interview"}
          icon={MessageSquare}
          colorScheme="purple"
          onClick={() => navigateTo('tests', 'interview')}
        />
      </div>
    );
  };

  // =========================================================================
  // 3. RECOMMENDED NEXT ACTION CARD
  // =========================================================================
  const renderRecommendedAction = () => {
    if (!hasProfile) {
      return (
        <Card className="p-5 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 border-slate-800 text-white card-hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="primary" dot>Next Step</Badge>
              <h3 className="font-extrabold text-white text-sm">Complete Your Placement Profile</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Add your degree details, technical skills, and software projects to generate ATS resumes and match with recruiters.
              </p>
            </div>
            <Button variant="primary" icon={PlusCircle} onClick={() => navigateTo('profile')}>
              Fill Profile Info
            </Button>
          </div>
        </Card>
      );
    }

    if (!latestAssessment) {
      return (
        <Card className="p-5 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border-slate-800 card-hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Recommended Milestone</span>
              <h3 className="font-extrabold text-white text-sm">Evaluate Your Technical Skills</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Take the adaptive AI technical assessment to evaluate your programming language proficiency and boost your readiness score.
              </p>
            </div>
            <Button
              variant="gradient"
              icon={Cpu}
              onClick={() => navigateTo('tests', 'technical')}
            >
              Start Technical Test
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-5 bg-gradient-to-r from-purple-900/90 via-indigo-950 to-slate-900 text-white border-purple-500/20 card-hover-lift">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">Interview Readiness</span>
            <h3 className="font-extrabold text-white text-sm">Practice in AI Mock Interview Studio</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Hear 7 real corporate questions spoken aloud, practice with webcam posture analysis, and get instant feedback.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="gradient"
              icon={Mic}
              onClick={() => navigateTo('tests', 'interview')}
            >
              Practice in Studio
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // =========================================================================
  // 4. QUICK TOOLS HUB (4 Clean Compact Cards)
  // =========================================================================
  const renderQuickToolsGrid = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white tracking-tight font-display">Placement Preparation Tools</h3>
        <span className="text-xs text-slate-400">All tools integrated</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tool 1: ATS Resume Studio */}
        <Card
          hover
          className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-emerald-500/50"
          onClick={() => navigateTo('resume', 'builder')}
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">ATS Resume Studio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Format and preview your ATS-ready single-page resume with clean recruiter templates.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('resume', 'builder');
            }}
            className="w-full justify-between"
          >
            Open Resume Studio
          </Button>
        </Card>

        {/* Tool 2: AI Resume Analyzer */}
        <Card
          hover
          className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-brand-500/50"
          onClick={() => navigateTo('resume', 'analyzer')}
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-brand-400 transition-colors">AI Resume Analyzer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload existing resume PDF/DOCX to uncover missing keywords against target job roles.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('resume', 'analyzer');
            }}
            className="w-full justify-between"
          >
            Scan Resume with AI
          </Button>
        </Card>

        {/* Tool 3: Career Roadmap */}
        <Card
          hover
          className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-indigo-500/50"
          onClick={() => navigateTo('roadmap')}
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Map className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Career Roadmap</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized weekly learning milestones and topic quizzes tailored to your career goal.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('roadmap');
            }}
            className="w-full justify-between"
          >
            View Roadmap
          </Button>
        </Card>

        {/* Tool 4: Appearance & Posture */}
        <Card
          hover
          className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-purple-500/50"
          onClick={() => navigateTo('tests', 'appearance')}
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">Appearance & Posture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect video posture alignment, head leveling, and interview attire using AI vision.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('tests', 'appearance');
            }}
            className="w-full justify-between"
          >
            Launch Vision AI
          </Button>
        </Card>
      </div>
    </div>
  );

  // =========================================================================
  // 5. TECHNICAL ASSESSMENT REPORT
  // =========================================================================
  const renderTechnicalReport = () => (
    <Card id="technical-report" className="p-6 space-y-5 animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-subtle">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Technical Assessment Report
              </h3>
              <Badge variant={latestAssessment ? "emerald" : "neutral"} dot={!!latestAssessment}>
                {latestAssessment ? 'Completed' : 'Not Attempted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated via Adaptive AI question generation and automated test cases
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={() => setIsAssessmentModalOpen(true)}
        >
          {latestAssessment ? 'Retake Technical Test' : 'Start Technical Test'}
        </Button>
      </div>

      {latestAssessment ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score</div>
            <div className="text-2xl font-black text-white mt-0.5">{latestAssessment.technicalScore}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-center">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Correct</div>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">
              {latestAssessment.correctAnswers !== undefined ? latestAssessment.correctAnswers : (latestAssessment.correctCount || 0)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-center">
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Incorrect</div>
            <div className="text-2xl font-black text-rose-300 mt-0.5">
              {latestAssessment.incorrectAnswers !== undefined ? latestAssessment.incorrectAnswers : (latestAssessment.incorrectCount || 0)}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-850/50 rounded-xl border border-dashed border-slate-800 space-y-2">
          <p className="text-xs text-slate-400">You haven't completed the Technical Skill Assessment yet.</p>
          <Button variant="primary" size="sm" icon={Cpu} onClick={() => setIsAssessmentModalOpen(true)}>
            Launch Technical Test Now
          </Button>
        </div>
      )}
    </Card>
  );

  // =========================================================================
  // 6. APTITUDE ASSESSMENT REPORT
  // =========================================================================
  const renderAptitudeReport = () => (
    <Card id="aptitude-report" className="p-6 space-y-5 animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-subtle">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Placement Aptitude & Reasoning Report
              </h3>
              <Badge variant={latestAptitudeAssessment ? "indigo" : "neutral"} dot={!!latestAptitudeAssessment}>
                {latestAptitudeAssessment ? 'Completed' : 'Not Attempted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              20-Question Aptitude Battery (Quant, Logical, Verbal Reasoning)
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={() => setIsAptitudeModalOpen(true)}
        >
          {latestAptitudeAssessment ? 'Retake Aptitude Test' : 'Start Aptitude Test'}
        </Button>
      </div>

      {latestAptitudeAssessment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aptitude Score</div>
              <div className="text-2xl font-black text-indigo-400 mt-0.5">
                {latestAptitudeAssessment.finalScore ?? latestAptitudeAssessment.score}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-center">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Correct Answers</div>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">
                {latestAptitudeAssessment.correctAnswers ?? 0}/20
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</div>
              <div className="text-2xl font-black text-white mt-0.5">20 Mins</div>
            </div>
          </div>

          {latestAptitudeAssessment.domains && (
            <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2.5">
              <div className="text-xs font-bold text-slate-300">Domain Performance Breakdown</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {Object.entries(latestAptitudeAssessment.domains).map(([domain, data]) => (
                  <div key={domain} className="bg-slate-800 p-3 rounded-xl border border-slate-700/80 space-y-1">
                    <div className="text-[11px] font-medium text-slate-400 truncate">{domain}</div>
                    <div className="text-sm font-extrabold text-white">
                      {typeof data === 'object' ? `${data.score || 0}%` : `${data}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-850/50 rounded-xl border border-dashed border-slate-800 space-y-2">
          <p className="text-xs text-slate-400">You haven't completed the Placement Aptitude Test yet.</p>
          <Button variant="primary" size="sm" icon={Brain} onClick={() => setIsAptitudeModalOpen(true)}>
            Launch Aptitude Test Now
          </Button>
        </div>
      )}
    </Card>
  );

  // =========================================================================
  // 7. COMMUNICATION ASSESSMENT REPORT
  // =========================================================================
  const renderCommunicationReport = () => (
    <Card id="communication-report" className="p-6 space-y-5 animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-subtle">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Interview & Communication Report
              </h3>
              <Badge variant={latestCommunicationAssessment ? "purple" : "neutral"} dot={!!latestCommunicationAssessment}>
                {latestCommunicationAssessment ? 'Completed' : 'Not Attempted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated on Clarity, Fluency, Grammar, and STAR Response Delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Mic}
            onClick={() => openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true)}
          >
            Studio
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
          >
            {latestCommunicationAssessment ? 'Retake Test' : 'Start Test'}
          </Button>
        </div>
      </div>

      {latestCommunicationAssessment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Overall Score</div>
              <div className="text-2xl font-black text-purple-300 mt-0.5">{latestCommunicationAssessment.finalScore}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grammar</div>
              <div className="text-2xl font-black text-white mt-0.5">{latestCommunicationAssessment.grammarScore || 85}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fluency</div>
              <div className="text-2xl font-black text-white mt-0.5">{latestCommunicationAssessment.fluencyScore || 80}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vocabulary</div>
              <div className="text-2xl font-black text-white mt-0.5">{latestCommunicationAssessment.vocabularyScore || 88}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-850/50 rounded-xl border border-dashed border-slate-800 space-y-2">
          <p className="text-xs text-slate-400">You haven't completed the Communication & Interview Assessment yet.</p>
          <div className="flex justify-center gap-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              icon={Mic}
              onClick={() => openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true)}
            >
              Practice in Studio
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Award}
              onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
            >
              Take 7-Q Graded Test
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

  // =========================================================================
  // 8. EDUCATION & SKILLS SECTION
  // =========================================================================
  const renderEducationAndSkills = () => (
    <div id="education-skills-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">

      {/* Education Summary */}
      <Card id="academics" className="p-6 space-y-4 border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-brand-400" />
            <h3 className="font-extrabold text-white text-sm sm:text-base">Education & Academics</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Degree & Branch</div>
            <div className="font-extrabold text-white text-sm">
              {education.degree || 'Degree Not Specified'} {education.branch ? `— ${education.branch}` : ''}
            </div>
            <div className="text-slate-400">{education.college || 'College Not Specified'}</div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">CGPA</div>
              <div className="text-base font-extrabold text-white mt-0.5">{education.cgpa || '—'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">12th %</div>
              <div className="text-base font-extrabold text-white mt-0.5">{education.twelfthPercentage ? `${education.twelfthPercentage}%` : '—'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">10th %</div>
              <div className="text-base font-extrabold text-white mt-0.5">{education.tenthPercentage ? `${education.tenthPercentage}%` : '—'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Skills */}
      <Card id="skills" className="p-6 space-y-4 border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-sm sm:text-base">Technical Skills</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Languages */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Programming Languages</span>
            <div className="flex flex-wrap gap-1.5">
              {(technicalSkills.programmingLanguages || []).length > 0 ? (
                technicalSkills.programmingLanguages.map((skill, idx) => (
                  <Badge key={idx} variant="primary">
                    {typeof skill === 'string' ? skill : skill.name}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500 italic">None specified yet</span>
              )}
            </div>
          </div>

          {/* Frameworks */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Frameworks & Libraries</span>
            <div className="flex flex-wrap gap-1.5">
              {(technicalSkills.frameworks || []).length > 0 ? (
                technicalSkills.frameworks.map((skill, idx) => (
                  <Badge key={idx} variant="indigo">
                    {typeof skill === 'string' ? skill : skill.name}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500 italic">None specified yet</span>
              )}
            </div>
          </div>

          {/* Databases & Tools */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Databases & Tools</span>
            <div className="flex flex-wrap gap-1.5">
              {[...(technicalSkills.databases || []), ...(technicalSkills.toolsTechnologies || [])].length > 0 ? (
                [...(technicalSkills.databases || []), ...(technicalSkills.toolsTechnologies || [])].map((tool, idx) => (
                  <Badge key={idx} variant="neutral">
                    {typeof tool === 'string' ? tool : tool.name}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500 italic">None specified yet</span>
              )}
            </div>
          </div>
        </div>
      </Card>

    </div>
  );

  // =========================================================================
  // 9. SOFTWARE PROJECTS SECTION
  // =========================================================================
  const renderProjects = () => (
    <Card id="projects" className="p-6 space-y-4 animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <FolderGit2 className="w-5 h-5 text-brand-400" />
          <h3 className="font-extrabold text-white text-sm sm:text-base">Software Projects ({projects.length})</h3>
        </div>
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-white">{proj.title}</h4>
                {proj.technologies && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {proj.liveLink && (
                  <a href={proj.liveLink} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-brand-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            {proj.description && (
              <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs italic">
            No projects added yet. Click Manage to add your software projects.
          </div>
        )}
      </div>
    </Card>
  );

  // =========================================================================
  // 10. WORK EXPERIENCE & INTERNSHIPS
  // =========================================================================
  const renderExperience = () => (
    <Card id="experience" className="p-6 space-y-4 animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-white text-sm sm:text-base">Work Experience & Internships ({experience.length})</h3>
        </div>
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {experience.map((exp) => (
          <div key={exp.id} className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white">{exp.role}</h4>
              <span className="text-[11px] text-slate-400 font-medium">{exp.duration}</span>
            </div>
            <div className="text-xs font-semibold text-brand-400">{exp.company}</div>
            {exp.description && (
              <p className="text-xs text-slate-300 leading-relaxed pt-1">{exp.description}</p>
            )}
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs italic">
            No work experience recorded yet.
          </div>
        )}
      </div>
    </Card>
  );

  // =========================================================================
  // 11. CERTIFICATIONS & HONORS
  // =========================================================================
  const renderCertificationsAndAchievements = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">

      {/* Certifications */}
      <Card id="certifications" className="p-6 space-y-4 border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-sm sm:text-base">Certifications ({certifications.length})</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Manage
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">{cert.name}</span>
                <span className="text-slate-400 text-[11px]">{cert.issuer} {cert.date ? `• ${cert.date}` : ''}</span>
              </div>
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}

          {certifications.length === 0 && (
            <div className="text-center py-4 text-slate-500 text-xs italic">
              No certifications listed yet.
            </div>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card id="achievements" className="p-6 space-y-4 border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-sm sm:text-base">Achievements & Honors ({achievements.length})</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Manage
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-0.5">
              <div className="font-bold text-amber-200">{ach.title}</div>
              <div className="text-[11px] text-amber-300/80">{ach.organization} {ach.date ? `• ${ach.date}` : ''}</div>
              {ach.description && <p className="text-[11px] text-amber-200/90 pt-0.5">{ach.description}</p>}
            </div>
          ))}

          {achievements.length === 0 && (
            <div className="text-center py-4 text-slate-500 text-xs italic">
              No achievements listed yet.
            </div>
          )}
        </div>
      </Card>

    </div>
  );

  // =========================================================================
  // 12. CONTACT CREDENTIALS
  // =========================================================================
  const renderContact = () => (
    <Card id="contact" className="p-6 space-y-4 animate-fade-in border-slate-800 bg-slate-900/90 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-extrabold text-white text-sm sm:text-base">
          Contact Credentials & Online Profiles
        </h3>
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center space-x-2.5">
          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-200 truncate">{personalInfo.email || 'Email Not Specified'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center space-x-2.5">
          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-200">{personalInfo.phone || 'Phone Not Specified'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center space-x-2.5">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-200 truncate">{personalInfo.location || 'Location Not Specified'}</span>
        </div>

        {professionalLinks.linkedin && (
          <a href={professionalLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-800 bg-slate-850/80 hover:bg-slate-800 flex items-center justify-between transition-colors">
            <span className="flex items-center font-medium text-slate-200"><Linkedin className="w-4 h-4 text-blue-400 mr-2" /> LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        )}

        {professionalLinks.github && (
          <a href={professionalLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-800 bg-slate-850/80 hover:bg-slate-800 flex items-center justify-between transition-colors">
            <span className="flex items-center font-medium text-slate-200"><Github className="w-4 h-4 text-slate-300 mr-2" /> GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        )}

        {professionalLinks.portfolio && (
          <a href={professionalLinks.portfolio} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-800 bg-slate-850/80 hover:bg-slate-800 flex items-center justify-between transition-colors">
            <span className="flex items-center font-medium text-slate-200"><Globe className="w-4 h-4 text-purple-400 mr-2" /> Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        )}
      </div>
    </Card>
  );

  // =========================================================================
  // 13. ATS RESUME BUILDER VIEW
  // =========================================================================
  const renderResumeBuilder = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge variant="emerald" dot>ATS Resume Studio</Badge>
          <h2 className="text-2xl font-black tracking-tight font-display">Automated ATS Resume Generator</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Generate high-scoring single-page ATS resumes formatted specifically for campus recruitment drives.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <Button
            variant="success"
            icon={Download}
            onClick={handleQuickDownloadPDF}
          >
            Download ATS PDF
          </Button>
          <Button
            variant="secondary"
            icon={Edit3}
            onClick={() => setIsResumeModalOpen(true)}
          >
            Customize Layout
          </Button>
        </div>
      </Card>
    </div>
  );

  // =========================================================================
  // 14. DUAL-TAB RESUME STUDIO
  // =========================================================================
  const renderResumeStudio = (overrideSubTab = null) => {
    const currentSubTab = overrideSubTab || resumeSubTab;
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border border-slate-800 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <Badge variant="emerald" dot>Resume Studio</Badge>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-display">ATS Resume & Keyword Studio</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Generate standardized 1-page ATS resumes formatted specifically for campus recruitment, or scan your existing document for missing job keywords.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              icon={Download}
              onClick={handleQuickDownloadPDF}
            >
              Download ATS PDF
            </Button>
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl max-w-md backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setResumeSubTab('builder')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              currentSubTab === 'builder'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Resume Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setResumeSubTab('analyzer')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              currentSubTab === 'analyzer'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>AI Keyword Scanner</span>
          </button>
        </div>

        {/* View Selection */}
        {currentSubTab === 'builder' ? (
          renderResumeBuilder()
        ) : (
          <Card className="p-6">
            <ResumeAnalyzer />
          </Card>
        )}
      </div>
    );
  };

  // =========================================================================
  // 15. DEDICATED PLACEMENT TEST CENTER
  // =========================================================================
  const renderTestCenter = (overrideSubTab = null) => {
    const currentSubTab = overrideSubTab || testCenterSubTab;
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Test Center Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border border-slate-800 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <Badge variant="emerald" dot>AI Testing Center</Badge>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-display">Placement Test Center</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Practice and benchmark your technical, aptitude, mock interview, and video posture readiness for tier-1 campus hiring drives.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="gradient"
              icon={Target}
              onClick={() => setIsAssessmentModalOpen(true)}
            >
              Start Technical Test
            </Button>
          </div>
        </div>

        {/* Test Center Sub-Tab Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
          {[
            { id: 'overview', label: 'All Modules & Analytics', icon: Target },
            { id: 'technical', label: 'Technical Coding Test', icon: Cpu },
            { id: 'aptitude', label: 'Aptitude & Reasoning', icon: Brain },
            { id: 'interview', label: 'AI Mock Interview', icon: Mic },
            { id: 'appearance', label: 'Posture & Attire AI', icon: Camera },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTestCenterSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                currentSubTab === tab.id
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on sub-tab */}
        {currentSubTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Interactive Test Launchers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Launcher 1: Technical Coding */}
              <Card
                hover
                className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-blue-500/50 bg-slate-900/90 border-slate-800"
                onClick={() => setTestCenterSubTab('technical')}
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">Technical Coding</h4>
                    {latestAssessment?.technicalScore !== undefined && (
                      <Badge variant="primary">{latestAssessment.technicalScore}%</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Adaptive multiple-choice and coding challenges testing DSA and language fundamentals.
                  </p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAssessmentModalOpen(true);
                    }}
                  >
                    {latestAssessment ? "Retake Test" : "Start Test"}
                  </Button>
                </div>
              </Card>

              {/* Launcher 2: Aptitude */}
              <Card
                hover
                className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-indigo-500/50 bg-slate-900/90 border-slate-800"
                onClick={() => setTestCenterSubTab('aptitude')}
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Aptitude & Logic</h4>
                    {latestAptitudeAssessment?.finalScore !== undefined && (
                      <Badge variant="primary">{latestAptitudeAssessment.finalScore}%</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    20-minute timed assessment covering Quantitative, Logical Reasoning, and Verbal ability.
                  </p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAptitudeModalOpen(true);
                    }}
                  >
                    {latestAptitudeAssessment ? "Retake Test" : "Start Test"}
                  </Button>
                </div>
              </Card>

              {/* Launcher 3: Mock Interview */}
              <Card
                hover
                className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-purple-500/50 bg-slate-900/90 border-slate-800"
                onClick={() => setTestCenterSubTab('interview')}
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">Mock Interview</h4>
                    {latestCommunicationAssessment?.finalScore !== undefined && (
                      <Badge variant="primary">{latestCommunicationAssessment.finalScore}%</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Speech & voice interview simulator asking 7 corporate questions with STAR analysis.
                  </p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true);
                    }}
                  >
                    Enter Studio
                  </Button>
                </div>
              </Card>

              {/* Launcher 4: Posture & Attire */}
              <Card
                hover
                className="p-5 flex flex-col justify-between space-y-3 cursor-pointer card-hover-lift group hover:border-pink-500/50 bg-slate-900/90 border-slate-800"
                onClick={() => setTestCenterSubTab('appearance')}
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm group-hover:text-pink-400 transition-colors">Posture & Attire</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30 font-bold uppercase">Vision</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Webcam computer vision measuring head level, shoulder tilt, slouching, and dress code.
                  </p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTestCenterSubTab('appearance');
                    }}
                  >
                    Open Vision AI
                  </Button>
                </div>
              </Card>
            </div>

            {/* Overall Score Metrics Strip */}
            {renderReadinessMetrics()}

            {/* Reports */}
            {renderTechnicalReport()}
            {renderAptitudeReport()}
            {renderCommunicationReport()}
          </div>
        )}

        {currentSubTab === 'technical' && renderTechnicalReport()}
        {currentSubTab === 'aptitude' && renderAptitudeReport()}
        {currentSubTab === 'interview' && renderCommunicationReport()}
        {currentSubTab === 'appearance' && (
          <AppearancePostureAnalyzer onOpenEditProfile={() => setIsEditModalOpen(true)} />
        )}
      </div>
    );
  };

  // =========================================================================
  // VIEW RENDERER DISPATCHER
  // =========================================================================
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {renderProfileHeader(true)}
            {renderReadinessMetrics()}
            {renderRecommendedAction()}
            {renderQuickToolsGrid()}
            {renderEducationAndSkills()}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            {renderProfileHeader(false)}

            {/* Sub-section Navigation */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-slate-400 px-2">Jump to:</span>
              {[
                { id: 'academics', label: 'Academics', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'certifications', label: 'Certifications', icon: Award },
                { id: 'contact', label: 'Contact', icon: Phone },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSubSection(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {renderEducationAndSkills()}
            {renderProjects()}
            {renderExperience()}
            {renderCertificationsAndAchievements()}
            {renderContact()}
          </div>
        );

      case 'tests':
      case 'assessments':
        return renderTestCenter();

      case 'technical':
        return renderTestCenter('technical');

      case 'aptitude':
        return renderTestCenter('aptitude');

      case 'interview':
        return renderTestCenter('interview');

      case 'appearance':
        return renderTestCenter('appearance');

      case 'resume':
        return renderResumeStudio();

      case 'resume-builder':
        return renderResumeStudio('builder');

      case 'resume-analyzer':
        return renderResumeStudio('analyzer');

      case 'roadmap':
        return (
          <Card className="p-6 animate-fade-in">
            <PersonalizedRoadmap />
          </Card>
        );

      case 'all':
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {renderProfileHeader(false)}
            {renderReadinessMetrics()}
            {renderTechnicalReport()}
            {renderAptitudeReport()}
            {renderCommunicationReport()}
            {renderEducationAndSkills()}
            {renderProjects()}
            {renderExperience()}
            {renderCertificationsAndAchievements()}
            {renderContact()}
          </div>
        );
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Overview & Analytics';
      case 'profile': return 'Placement Profile';
      case 'tests':
      case 'assessments': return 'Placement Test Center';
      case 'technical': return 'Technical Coding Test';
      case 'aptitude': return 'Aptitude & Reasoning Test';
      case 'interview': return 'AI Mock Interview Studio';
      case 'appearance': return 'Posture & Attire Vision AI';
      case 'resume':
      case 'resume-builder': return 'ATS Resume Studio';
      case 'resume-analyzer': return 'AI Resume Keyword Gap Scanner';
      case 'roadmap': return 'Career Learning Roadmap';
      case 'all': return 'Full Placement Profile';
      default: return 'Student Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex relative selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Ambient background glow to match landing page */}
      <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* 1. Left Navigation Sidebar */}
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onNavigate={navigateTo}
        testCenterSubTab={testCenterSubTab}
        resumeSubTab={resumeSubTab}
        studentData={studentData}
        hasProfile={hasProfile}
        readinessScore={readinessScore}
        latestAssessment={latestAssessment}
        latestAptitudeAssessment={latestAptitudeAssessment}
        latestCommunicationAssessment={latestCommunicationAssessment}
        onOpenEditProfile={() => setIsEditModalOpen(true)}
        onOpenATSModal={() => setIsResumeModalOpen(true)}
        onQuickDownloadATS={handleQuickDownloadPDF}
        onStartTechnical={() => setIsAssessmentModalOpen(true)}
        onStartAptitude={() => setIsAptitudeModalOpen(true)}
        onStartCommunication={() => setIsCommunicationModalOpen(true)}
        onSignOut={() => {
          if (logout) {
            logout();
          } else {
            localStorage.clear();
            window.location.reload();
          }
        }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">

        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-xl flex items-center justify-between gap-4">

          {/* Left: Mobile hamburger & Clean Compact Brand / Context */}
          <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="truncate hidden sm:flex items-center space-x-2 text-xs">
              <span className="font-extrabold text-white text-sm tracking-tight font-display">Placement Genie</span>
              <span className="text-slate-600">/</span>
              <span className="text-brand-400 font-semibold capitalize">{activeTab}</span>
            </div>
          </div>

          {/* Center: Dropdown Navigation Menu (Placement, Testing, Resume, Roadmap) */}
          <div className="flex items-center justify-center min-w-0">
            <StudentPortalNav
              activeTab={activeTab}
              activeSection={activeSection}
              testCenterSubTab={testCenterSubTab}
              resumeSubTab={resumeSubTab}
              onNavigate={navigateTo}
              studentData={studentData}
              hasProfile={hasProfile}
              readinessScore={readinessScore}
              latestAssessment={latestAssessment}
              latestAptitudeAssessment={latestAptitudeAssessment}
              latestCommunicationAssessment={latestCommunicationAssessment}
              onOpenEditProfile={() => setIsEditModalOpen(true)}
              onOpenATSModal={() => setIsResumeModalOpen(true)}
              onQuickDownloadATS={handleQuickDownloadPDF}
              onStartTechnical={() => setIsAssessmentModalOpen(true)}
              onStartAptitude={() => setIsAptitudeModalOpen(true)}
              onStartCommunication={() => setIsCommunicationModalOpen(true)}
            />
          </div>

          {/* Right: Clean Status Pill, Avatar & Sign Out */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Live Readiness Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-850 border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 font-medium text-[11px]">Readiness</span>
              <span className="text-emerald-400 font-bold font-mono text-xs">{currentReadiness}%</span>
            </div>

            {/* User Profile Pill & Sign Out */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <img
                src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
                alt={personalInfo.fullName || 'Student'}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
                title={personalInfo.fullName || 'Student'}
              />
              <button
                type="button"
                onClick={() => {
                  if (logout) {
                    logout();
                  } else {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Empty Profile Setup Banner (if no profile exists) */}
        {!hasProfile && (
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Card className="p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <Badge variant="emerald" dot>Setup Placement Profile</Badge>
                <h2 className="text-xl font-bold tracking-tight font-display">Create Your Placement Profile</h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Add your academics, skills, and projects to start taking assessments, unlock recruiter searches, and export your ATS resume.
                </p>
              </div>

              <Button
                variant="gradient"
                icon={PlusCircle}
                onClick={() => setIsEditModalOpen(true)}
              >
                Create Profile Now
              </Button>
            </Card>
          </div>
        )}

        {/* Main View Layout with Animated View Transition */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <div
            key={`${activeTab}-${activeTab === 'resume' ? resumeSubTab : ['tests', 'assessments'].includes(activeTab) ? testCenterSubTab : activeSection}`}
            className="animate-tab-enter"
          >
            {renderActiveTabContent()}
          </div>
        </main>
      </div>

    </div>
  );
};
