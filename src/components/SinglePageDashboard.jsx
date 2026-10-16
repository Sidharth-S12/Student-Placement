import React, { useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { generateATSResumePDF } from '../utils/generateATSResumePDF';
import { StudentSidebar } from './navigation/StudentSidebar';
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

  const scrollToSubSection = (id) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (profileLoading && !studentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-extrabold text-base text-slate-900 font-display">Placement Genie</h2>
            <p className="text-xs text-slate-500">Loading student profile...</p>
          </div>
          <div className="pt-2">
            <Loader2 className="w-5 h-5 text-brand-600 animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 1. REFINED PROFILE HEADER (Hero Banner)
  // =========================================================================
  const renderProfileHeader = (compact = false) => (
    <Card className="p-6 relative overflow-hidden animate-fade-in border-slate-200/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        {/* Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative group flex-shrink-0">
            <img
              src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
              alt={personalInfo.fullName || 'Student'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-slate-100 border border-slate-200/80 shadow-subtle"
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
              className="absolute -bottom-1 -right-1 bg-slate-900 hover:bg-slate-800 text-white p-1.5 rounded-xl shadow-sm transition-transform hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
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

            <p className="text-xs sm:text-sm font-semibold text-brand-700">
              {education.degree || 'Degree'} {education.branch ? `in ${education.branch}` : ''} {education.graduationYear ? `• Class of ${education.graduationYear}` : ''}
            </p>

            <p className="text-xs text-slate-500 font-medium">
              {education.college || 'Campus Placement Candidate'}
            </p>

            {!compact && personalInfo.summary && (
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl pt-1">
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
          onClick={() => setActiveTab('assessments')}
        />

        {/* Metric 2: Technical Skill Score */}
        <StatCard
          title="Technical Competency"
          value={latestAssessment ? `${techScore}%` : (techScore > 0 ? `${techScore}%` : 'Not Tested')}
          subtext={latestAssessment ? "Adaptive AI coding assessment" : "Take technical test"}
          icon={Cpu}
          colorScheme="brand"
          onClick={() => setIsAssessmentModalOpen(true)}
        />

        {/* Metric 3: Aptitude & Logic */}
        <StatCard
          title="Aptitude & Logic"
          value={latestAptitudeAssessment ? `${aptScore}%` : (aptScore > 0 ? `${aptScore}%` : 'Not Tested')}
          subtext={latestAptitudeAssessment ? "Quant, logical & verbal" : "Take 20-min aptitude test"}
          icon={Brain}
          colorScheme="indigo"
          onClick={() => setIsAptitudeModalOpen(true)}
        />

        {/* Metric 4: Communication & Interview */}
        <StatCard
          title="Interview & Comm"
          value={latestCommunicationAssessment ? `${commScore}%` : (commScore > 0 ? `${commScore}%` : 'Not Tested')}
          subtext={latestCommunicationAssessment ? "STAR response & clarity" : "Practice mock interview"}
          icon={MessageSquare}
          colorScheme="purple"
          onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
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
        <Card className="p-5 bg-gradient-to-r from-brand-50 to-indigo-50 border-brand-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="primary" dot>Next Step</Badge>
              <h3 className="font-extrabold text-slate-900 text-sm">Complete Your Placement Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                Add your degree details, technical skills, and software projects to generate ATS resumes and match with recruiters.
              </p>
            </div>
            <Button variant="primary" icon={PlusCircle} onClick={() => setIsEditModalOpen(true)}>
              Fill Profile Info
            </Button>
          </div>
        </Card>
      );
    }

    if (!latestAssessment) {
      return (
        <Card className="p-5 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white border-slate-800">
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
              onClick={() => setIsAssessmentModalOpen(true)}
            >
              Start Technical Test
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-5 bg-gradient-to-r from-purple-900/90 via-indigo-950 to-slate-900 text-white border-purple-500/20">
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
              onClick={() => openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true)}
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
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Placement Preparation Tools</h3>
        <span className="text-xs text-slate-400">All tools integrated</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tool 1: ATS Resume Studio */}
        <Card hover className="p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">ATS Resume Studio</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format and preview your ATS-ready single-page resume with clean recruiter templates.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => setActiveTab('resume-builder')}
            className="w-full justify-between"
          >
            Open Resume Studio
          </Button>
        </Card>

        {/* Tool 2: AI Resume Analyzer */}
        <Card hover className="p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">AI Resume Analyzer</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload existing resume PDF/DOCX to uncover missing keywords against target job roles.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => setActiveTab('resume-analyzer')}
            className="w-full justify-between"
          >
            Scan Resume with AI
          </Button>
        </Card>

        {/* Tool 3: Career Roadmap */}
        <Card hover className="p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Career Roadmap</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized weekly learning milestones and topic quizzes tailored to your career goal.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => setActiveTab('roadmap')}
            className="w-full justify-between"
          >
            View Roadmap
          </Button>
        </Card>

        {/* Tool 4: Appearance & Posture */}
        <Card hover className="p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Appearance & Posture</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect video posture alignment, head leveling, and interview attire using AI vision.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => setActiveTab('appearance')}
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
    <Card id="technical-report" className="p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-600 flex items-center justify-center shadow-subtle">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Technical Assessment Report
              </h3>
              <Badge variant={latestAssessment ? "emerald" : "neutral"} dot={!!latestAssessment}>
                {latestAssessment ? 'Completed' : 'Not Attempted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{latestAssessment.technicalScore}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-center">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Correct</div>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              {latestAssessment.correctAnswers !== undefined ? latestAssessment.correctAnswers : (latestAssessment.correctCount || 0)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70 text-center">
            <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Incorrect</div>
            <div className="text-2xl font-black text-rose-800 mt-0.5">
              {latestAssessment.incorrectAnswers !== undefined ? latestAssessment.incorrectAnswers : (latestAssessment.incorrectCount || 0)}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <p className="text-xs text-slate-500">You haven't completed the Technical Skill Assessment yet.</p>
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
    <Card id="aptitude-report" className="p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-subtle">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Placement Aptitude & Reasoning Report
              </h3>
              <Badge variant={latestAptitudeAssessment ? "indigo" : "neutral"} dot={!!latestAptitudeAssessment}>
                {latestAptitudeAssessment ? 'Completed' : 'Not Attempted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aptitude Score</div>
              <div className="text-2xl font-black text-indigo-900 mt-0.5">
                {latestAptitudeAssessment.finalScore ?? latestAptitudeAssessment.score}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-center">
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Correct Answers</div>
              <div className="text-2xl font-black text-emerald-800 mt-0.5">
                {latestAptitudeAssessment.correctAnswers ?? 0}/20
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">20 Mins</div>
            </div>
          </div>

          {latestAptitudeAssessment.domains && (
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2.5">
              <div className="text-xs font-bold text-slate-700">Domain Performance Breakdown</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {Object.entries(latestAptitudeAssessment.domains).map(([domain, data]) => (
                  <div key={domain} className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-medium text-slate-500 truncate">{domain}</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {typeof data === 'object' ? `${data.score || 0}%` : `${data}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <p className="text-xs text-slate-500">You haven't completed the Placement Aptitude Test yet.</p>
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
    <Card id="communication-report" className="p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-subtle">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Interview & Communication Report
              </h3>
              <Badge variant={latestCommunicationAssessment ? "purple" : "neutral"} dot={!!latestCommunicationAssessment}>
                {latestCommunicationAssessment ? 'Completed' : 'Not Attempted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/70">
              <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Overall Score</div>
              <div className="text-2xl font-black text-purple-950 mt-0.5">{latestCommunicationAssessment.finalScore}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grammar</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{latestCommunicationAssessment.grammarScore || 85}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fluency</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{latestCommunicationAssessment.fluencyScore || 80}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vocabulary</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{latestCommunicationAssessment.vocabularyScore || 88}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <p className="text-xs text-slate-500">You haven't completed the Communication & Interview Assessment yet.</p>
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
      <Card id="academics" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Education & Academics</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Degree & Branch</div>
            <div className="font-extrabold text-slate-900 text-sm">
              {education.degree || 'Degree Not Specified'} {education.branch ? `— ${education.branch}` : ''}
            </div>
            <div className="text-slate-500">{education.college || 'College Not Specified'}</div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="text-[10px] font-bold text-slate-400 uppercase">CGPA</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{education.cgpa || '—'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="text-[10px] font-bold text-slate-400 uppercase">12th %</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{education.twelfthPercentage ? `${education.twelfthPercentage}%` : '—'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <div className="text-[10px] font-bold text-slate-400 uppercase">10th %</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{education.tenthPercentage ? `${education.tenthPercentage}%` : '—'}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Skills */}
      <Card id="skills" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Technical Skills</h3>
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
                <span className="text-slate-400 italic">None specified yet</span>
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
                <span className="text-slate-400 italic">None specified yet</span>
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
                <span className="text-slate-400 italic">None specified yet</span>
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
    <Card id="projects" className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <FolderGit2 className="w-5 h-5 text-brand-600" />
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Software Projects ({projects.length})</h3>
        </div>
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{proj.title}</h4>
                {proj.technologies && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {proj.liveLink && (
                  <a href={proj.liveLink} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-brand-600">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            {proj.description && (
              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs italic">
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
    <Card id="experience" className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Work Experience & Internships ({experience.length})</h3>
        </div>
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {experience.map((exp) => (
          <div key={exp.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900">{exp.role}</h4>
              <span className="text-[11px] text-slate-400 font-medium">{exp.duration}</span>
            </div>
            <div className="text-xs font-semibold text-brand-700">{exp.company}</div>
            {exp.description && (
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
            )}
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs italic">
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
      <Card id="certifications" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Certifications ({certifications.length})</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Manage
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{cert.name}</span>
                <span className="text-slate-500 text-[11px]">{cert.issuer} {cert.date ? `• ${cert.date}` : ''}</span>
              </div>
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-700">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}

          {certifications.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-xs italic">
              No certifications listed yet.
            </div>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card id="achievements" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Achievements & Honors ({achievements.length})</h3>
          </div>
          <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
            Manage
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-0.5">
              <div className="font-bold text-slate-900">{ach.title}</div>
              <div className="text-[11px] text-slate-600">{ach.organization} {ach.date ? `• ${ach.date}` : ''}</div>
              {ach.description && <p className="text-[11px] text-slate-600 pt-0.5">{ach.description}</p>}
            </div>
          ))}

          {achievements.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-xs italic">
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
    <Card id="contact" className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
          Contact Credentials & Online Profiles
        </h3>
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center space-x-2.5">
          <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="font-medium text-slate-800 truncate">{personalInfo.email || 'Email Not Specified'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center space-x-2.5">
          <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="font-medium text-slate-800">{personalInfo.phone || 'Phone Not Specified'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center space-x-2.5">
          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="font-medium text-slate-800 truncate">{personalInfo.location || 'Location Not Specified'}</span>
        </div>

        {professionalLinks.linkedin && (
          <a href={professionalLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200/70 hover:bg-slate-50 flex items-center justify-between">
            <span className="flex items-center font-medium text-slate-800"><Linkedin className="w-4 h-4 text-blue-600 mr-2" /> LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        )}

        {professionalLinks.github && (
          <a href={professionalLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200/70 hover:bg-slate-50 flex items-center justify-between">
            <span className="flex items-center font-medium text-slate-800"><Github className="w-4 h-4 text-slate-900 mr-2" /> GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        )}

        {professionalLinks.portfolio && (
          <a href={professionalLinks.portfolio} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200/70 hover:bg-slate-50 flex items-center justify-between">
            <span className="flex items-center font-medium text-slate-800"><Globe className="w-4 h-4 text-purple-600 mr-2" /> Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
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
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-xl border border-slate-200/80 shadow-subtle">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    activeSection === item.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
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

      case 'assessments':
        return (
          <div className="space-y-6">
            {renderReadinessMetrics()}
            {renderTechnicalReport()}
            {renderAptitudeReport()}
            {renderCommunicationReport()}
          </div>
        );

      case 'technical':
        return (
          <div className="space-y-6">
            {renderTechnicalReport()}
          </div>
        );

      case 'aptitude':
        return (
          <div className="space-y-6">
            {renderAptitudeReport()}
          </div>
        );

      case 'interview':
        return (
          <div className="space-y-6">
            {renderCommunicationReport()}
          </div>
        );

      case 'resume-builder':
        return renderResumeBuilder();

      case 'resume-analyzer':
        return (
          <Card className="p-6 animate-fade-in">
            <ResumeAnalyzer />
          </Card>
        );

      case 'roadmap':
        return (
          <Card className="p-6 animate-fade-in">
            <PersonalizedRoadmap />
          </Card>
        );

      case 'appearance':
        return (
          <div className="animate-fade-in">
            <AppearancePostureAnalyzer onOpenEditProfile={() => setIsEditModalOpen(true)} />
          </div>
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
      case 'dashboard': return 'Dashboard Overview';
      case 'profile': return 'Placement Profile';
      case 'assessments': return 'Assessments Hub';
      case 'technical': return 'Technical Skill Test';
      case 'aptitude': return 'Aptitude & Reasoning';
      case 'interview': return 'AI Mock Interview';
      case 'resume-builder': return 'ATS Resume Studio';
      case 'resume-analyzer': return 'AI Resume Analyzer';
      case 'roadmap': return 'Career Roadmap';
      case 'appearance': return 'Appearance & Posture Analyzer';
      case 'all': return 'Full Placement Profile';
      default: return 'Student Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
      
      {/* 1. Left Navigation Sidebar */}
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
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
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-subtle flex items-center justify-between gap-4">
          
          {/* Mobile hamburger & Breadcrumb */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="truncate">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <span>Student Portal</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-brand-600 font-semibold capitalize">{activeTab}</span>
              </div>
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate font-display">
                {getBreadcrumbTitle()}
              </h1>
            </div>
          </div>

          {/* Top Header Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
              className="hidden sm:inline-flex"
            >
              Edit Profile
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={handleQuickDownloadPDF}
              className="hidden sm:inline-flex"
            >
              ATS PDF
            </Button>

            {/* User Profile Pill & Sign Out */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <img
                src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
                alt={personalInfo.fullName || 'Student'}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

        {/* Main View Layout */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTabContent()}
        </main>
      </div>

    </div>
  );
};
