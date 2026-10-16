import React, { useRef, useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { generateATSResumePDF } from '../utils/generateATSResumePDF';
import { StudentSidebar } from './navigation/StudentSidebar';
import PersonalizedRoadmap from './PersonalizedRoadmap';
import ResumeAnalyzer from './ResumeAnalyzer';
import { AppearancePostureAnalyzer } from './appearance/AppearancePostureAnalyzer';
import {
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Trophy,
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
  CheckCircle,
  TrendingUp,
  BarChart2,
  Sparkles,
  Upload,
  Camera,
  Trash2,
  Star,
  Target,
  Cpu,
  Brain,
  MessageSquare,
  Mic,
  Video,
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
  Compass,
  ArrowRight,
  Check
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
    isAptitudeModalOpen,
    setIsAptitudeModalOpen,
    latestAptitudeAssessment,
    isCommunicationModalOpen,
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

  // Scroll to section when sub-filter changes
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
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-extrabold text-base text-slate-900">Placement Genie</h2>
            <p className="text-xs text-slate-500">Loading your student placement profile...</p>
          </div>
          <div className="pt-2">
            <Loader2 className="w-5 h-5 text-brand-600 animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUB-COMPONENTS & SECTIONS
  // =========================================================================

  // 1. Profile Header Hero Card
  const renderProfileHeader = (compact = false) => (
    <section id="profile-header" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-card relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-50/80 via-indigo-50/30 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Avatar & Photo Upload Controls */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 text-center sm:text-left">
          <div className="relative group">
            <img
              src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
              alt={personalInfo.fullName || 'Student'}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md border border-slate-200"
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
              title="Upload profile photo from device"
              className="absolute bottom-1 right-1 bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-xl shadow-md border-2 border-white transition-transform hover:scale-105"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {personalInfo.fullName || 'Student Profile'}
              </h1>
              {hasProfile && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  Eligible for Placement
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-brand-700">
              {education.degree || 'Degree'} {education.branch ? `in ${education.branch}` : ''} {education.graduationYear ? `• Class of ${education.graduationYear}` : ''}
            </p>

            <p className="text-xs text-slate-600 font-medium">
              {education.college || 'College Name'}
            </p>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl pt-1">
              {personalInfo.summary || 'Click "Edit Profile" to enter your summary, education details, skills, and projects.'}
            </p>

            {/* Photo Controls */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 border border-slate-200 transition-colors"
              >
                <Upload className="w-3 h-3 text-slate-500" />
                <span>Upload Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 border border-slate-200 transition-colors"
              >
                <Edit3 className="w-3 h-3 text-slate-500" />
                <span>Change Photo</span>
              </button>

              <button
                onClick={removeProfilePhoto}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 border border-slate-200 transition-colors"
              >
                <Trash2 className="w-3 h-3 text-slate-500" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto flex-shrink-0">
          <button
            onClick={handleQuickDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Download ATS PDF</span>
          </button>

          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4" />
            <span>ATS Resume Studio</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
        </div>

      </div>
    </section>
  );

  // 2. Placement Readiness Score Card
  const renderReadinessCard = () => (
    <section id="readiness-section" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-brand-600" />
          <h2 className="font-bold text-slate-900 text-base">Placement Information & Assessment Scores</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAssessmentModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Take Technical Test</span>
          </button>

          <button
            onClick={() => setIsAptitudeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-200" />
            <span>Start Aptitude Test</span>
          </button>

          <button
            onClick={() => setIsCommunicationModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-200" />
            <span>Start Communication Test</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overall Readiness */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50/50 border border-brand-200 text-center space-y-1">
          <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-brand-900">
            {currentReadiness}%
          </div>
          <div className="text-xs font-bold text-brand-700">Placement Readiness</div>
        </div>

        {/* Technical Score */}
        <div 
          onClick={() => setIsAssessmentModalOpen(true)}
          className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-center space-y-1.5 cursor-pointer transition-all hover:border-brand-300 group shadow-xs"
          title="Click to take Technical Skill Assessment"
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {latestAssessment?.technicalScore !== undefined
              ? `${latestAssessment.technicalScore}%`
              : (placementScores.technicalScore !== undefined ? `${placementScores.technicalScore}%` : '0%')}
          </div>
          <div className="text-xs font-semibold text-slate-700 group-hover:text-brand-600 flex items-center justify-center space-x-1">
            <span>Technical Score</span>
          </div>
          {latestAssessment ? (
            <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
              <div className="flex justify-center space-x-1.5 font-medium">
                <span className="text-emerald-700 font-bold">
                  Correct: {latestAssessment.correctAnswers !== undefined ? latestAssessment.correctAnswers : (latestAssessment.correctCount || 0)}
                </span>
                <span>•</span>
                <span className="text-red-600 font-bold">
                  Incorrect: {latestAssessment.incorrectAnswers !== undefined ? latestAssessment.incorrectAnswers : (latestAssessment.incorrectCount || 0)}
                </span>
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase tracking-wide">
                Completed
              </div>
            </div>
          ) : (
            <div className="pt-1 text-[10px] text-slate-400 font-medium">Click to start</div>
          )}
        </div>

        {/* Aptitude Score */}
        <div 
          onClick={() => setIsAptitudeModalOpen(true)}
          className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-center space-y-1.5 cursor-pointer transition-all hover:border-indigo-300 group shadow-xs"
          title="Click to take Placement Aptitude Test (20 mins, 20 questions)"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
            <Brain className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {latestAptitudeAssessment?.finalScore !== undefined
              ? `${latestAptitudeAssessment.finalScore}%`
              : (placementScores.aptitudeScore !== undefined ? `${placementScores.aptitudeScore}%` : '0%')}
          </div>
          <div className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 flex items-center justify-center space-x-1">
            <span>Aptitude Score</span>
          </div>
          {latestAptitudeAssessment ? (
            <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
              <div className="flex justify-center space-x-1.5 font-medium">
                <span className="text-emerald-700 font-bold">
                  Correct: {latestAptitudeAssessment.correctAnswers !== undefined ? latestAptitudeAssessment.correctAnswers : 0}/20
                </span>
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[9px] uppercase tracking-wide">
                Completed
              </div>
            </div>
          ) : (
            <div className="pt-1 text-[10px] text-indigo-500 font-medium">Click to start (20m)</div>
          )}
        </div>

        {/* Communication Score */}
        <div 
          onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
          className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-center space-y-1.5 cursor-pointer transition-all hover:border-purple-300 group shadow-xs"
          title="Click to take Placement Interview Assessment (10 mins, 7 core company questions)"
        >
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {latestCommunicationAssessment?.finalScore !== undefined
              ? `${latestCommunicationAssessment.finalScore}%`
              : (placementScores.communicationScore !== undefined && placementScores.communicationScore > 0 ? `${placementScores.communicationScore}%` : '—')}
          </div>
          <div className="text-xs font-semibold text-slate-700 group-hover:text-purple-600 flex items-center justify-center space-x-1">
            <span>Interview & Comm</span>
          </div>
          {latestCommunicationAssessment || (placementScores.communicationScore > 0) ? (
            <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
              <div className="flex justify-center space-x-1.5 font-medium">
                <span className="text-emerald-700 font-bold">
                  {latestCommunicationAssessment?.correctAnswers !== undefined
                    ? `Correct: ${latestCommunicationAssessment.correctAnswers}/7`
                    : `Score: ${placementScores.communicationScore}%`}
                </span>
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[9px] uppercase tracking-wide">
                Completed
              </div>
            </div>
          ) : (
            <div className="pt-1 text-[10px] text-purple-600 font-bold">7 Core Qs (10m)</div>
          )}
        </div>
      </div>
    </section>
  );

  // 3. AI Mock Interview Studio Banner
  const renderInterviewBanner = () => (
    <section id="interview-studio-banner" className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-purple-500/20 animate-fade-in">
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
            Practice Studio • AI Interviewer
          </span>
          <span className="text-xs text-purple-200/90 font-medium">
            7 Questions Companies Usually Ask
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white">
          Interactive Placement Interview Practice Studio
        </h2>
        <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
          Master corporate placement interviews: hear the interviewer speak questions, practice eye contact with webcam mirror, answer using voice speech-to-text or typing, and receive real-time STAR coaching.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <button
          onClick={() => openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true)}
          className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-900 active:scale-95 flex items-center justify-center space-x-2"
        >
          <Mic className="w-4 h-4" />
          <span>Practice in Studio</span>
        </button>
        <button
          onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
          className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 active:scale-95 flex items-center justify-center space-x-2"
        >
          <Award className="w-4 h-4 text-purple-300" />
          <span>Take 7-Q Graded Test</span>
        </button>
      </div>
    </section>
  );

  // 4. Technical Assessment Report Card
  const renderTechnicalReport = () => (
    <section id="technical-report" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-slate-900 text-base leading-none">
                Technical Assessment Report
              </h2>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                latestAssessment ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {latestAssessment ? 'Completed' : 'Not Attempted'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated via Dynamic Groq AI & ML Adaptive Engine
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAssessmentModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{latestAssessment ? 'Retake Technical Test' : 'Start Technical Test'}</span>
        </button>
      </div>

      {latestAssessment ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Technical Score</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{latestAssessment.technicalScore}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
            <div className="text-[11px] font-bold text-emerald-700 uppercase">Correct Answers</div>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">
              {latestAssessment.correctAnswers !== undefined ? latestAssessment.correctAnswers : (latestAssessment.correctCount || 0)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-center">
            <div className="text-[11px] font-bold text-red-600 uppercase">Incorrect Answers</div>
            <div className="text-2xl font-black text-red-700 mt-0.5">
              {latestAssessment.incorrectAnswers !== undefined ? latestAssessment.incorrectAnswers : (latestAssessment.incorrectCount || 0)}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <p className="text-xs text-slate-500">You haven't completed the Technical Skill Assessment yet.</p>
          <button
            onClick={() => setIsAssessmentModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs inline-flex items-center space-x-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Launch Technical Test Now</span>
          </button>
        </div>
      )}
    </section>
  );

  // 5. Aptitude Assessment Report Card
  const renderAptitudeReport = () => (
    <section id="aptitude-report" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-slate-900 text-base leading-none">
                Placement Aptitude & Reasoning Report
              </h2>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                latestAptitudeAssessment ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {latestAptitudeAssessment ? 'Completed' : 'Not Attempted'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Standard 20-Question Aptitude Battery (Quant, Logical, Verbal, DI)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAptitudeModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-200" />
          <span>{latestAptitudeAssessment ? 'Retake Aptitude Test' : 'Start Aptitude Test'}</span>
        </button>
      </div>

      {latestAptitudeAssessment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Aptitude Score</div>
              <div className="text-2xl font-black text-indigo-900 mt-0.5">
                {latestAptitudeAssessment.finalScore ?? latestAptitudeAssessment.score}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
              <div className="text-[11px] font-bold text-emerald-700 uppercase">Correct Answers</div>
              <div className="text-2xl font-black text-emerald-800 mt-0.5">
                {latestAptitudeAssessment.correctAnswers ?? 0}/20
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-center">
              <div className="text-[11px] font-bold text-purple-700 uppercase">Duration</div>
              <div className="text-2xl font-black text-purple-900 mt-0.5">20 Mins</div>
            </div>
          </div>

          {/* Domain Breakdown */}
          {latestAptitudeAssessment.domains && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">Domain Performance Breakdown</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {Object.entries(latestAptitudeAssessment.domains).map(([domain, data]) => (
                  <div key={domain} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-slate-600 truncate">{domain}</div>
                    <div className="text-base font-extrabold text-slate-900">
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
          <button
            onClick={() => setIsAptitudeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center space-x-1.5"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Launch Aptitude Test Now</span>
          </button>
        </div>
      )}
    </section>
  );

  // 6. Communication Assessment Report Card
  const renderCommunicationReport = () => (
    <section id="communication-report" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-slate-900 text-base leading-none">
                AI Interview & Communication Report
              </h2>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                latestCommunicationAssessment ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {latestCommunicationAssessment ? 'Completed' : 'Not Attempted'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated on Clarity, Vocabulary, Grammar, and STAR Response Delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-purple-600" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-200" />
            <span>{latestCommunicationAssessment ? 'Retake Test' : 'Start Test'}</span>
          </button>
        </div>
      </div>

      {latestCommunicationAssessment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
              <div className="text-[11px] font-bold text-purple-700 uppercase">Overall Score</div>
              <div className="text-2xl font-black text-purple-950 mt-0.5">{latestCommunicationAssessment.finalScore}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Grammar</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{latestCommunicationAssessment.grammarScore || 85}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Fluency</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{latestCommunicationAssessment.fluencyScore || 80}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Vocabulary</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{latestCommunicationAssessment.vocabularyScore || 88}%</div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {latestCommunicationAssessment.strengths && latestCommunicationAssessment.strengths.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <div className="font-bold text-emerald-800 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Demonstrated Strengths</span>
                </div>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {latestCommunicationAssessment.strengths.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {latestCommunicationAssessment.improvements && latestCommunicationAssessment.improvements.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                <div className="font-bold text-amber-800 flex items-center space-x-1.5">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Recommended Focus Areas</span>
                </div>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {latestCommunicationAssessment.improvements.slice(0, 3).map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <p className="text-xs text-slate-500">You haven't completed the Communication & Interview Assessment yet.</p>
          <div className="flex justify-center gap-2 pt-1">
            <button
              onClick={() => openCommunicationModal ? openCommunicationModal('practice') : setIsCommunicationModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs"
            >
              Practice in Studio
            </button>
            <button
              onClick={() => openCommunicationModal ? openCommunicationModal('assessment') : setIsCommunicationModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Take 7-Q Graded Test
            </button>
          </div>
        </div>
      )}
    </section>
  );

  // 7. Education & Skills Grid
  const renderEducationAndSkills = () => (
    <div id="education-skills-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      
      {/* Education Summary */}
      <section id="academics" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-base">Education & Academics</h2>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Degree */}
          <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{education.college || 'College Not Set'}</h3>
                <p className="text-xs font-semibold text-brand-800 mt-0.5">
                  {education.degree || 'Degree'} {education.branch ? `in ${education.branch}` : ''}
                </p>
              </div>
              {education.cgpa && (
                <span className="px-3 py-1 rounded-lg bg-brand-600 text-white font-bold text-xs shadow-xs">
                  CGPA: {education.cgpa}
                </span>
              )}
            </div>
            {education.graduationYear && (
              <div className="mt-2 text-slate-500">Graduation Year: {education.graduationYear}</div>
            )}
          </div>

          {/* 12th & 10th Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase">12th Senior Secondary</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">{education.twelfthPercentage || '—'}</div>
              <div className="text-[11px] text-slate-500">{education.twelfthBoard || 'Board'} {education.twelfthYear ? `(${education.twelfthYear})` : ''}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase">10th Secondary</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">{education.tenthPercentage || '—'}</div>
              <div className="text-[11px] text-slate-500">{education.tenthBoard || 'Board'} {education.tenthYear ? `(${education.tenthYear})` : ''}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section id="skills" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-base">Technical Skills</h2>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Programming Languages */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Programming Languages</h3>
            <div className="flex flex-wrap gap-1.5">
              {(technicalSkills.programmingLanguages || []).map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                  {typeof s === 'string' ? s : s.name}
                </span>
              ))}
              {(!technicalSkills.programmingLanguages || technicalSkills.programmingLanguages.length === 0) && (
                <span className="text-slate-400 italic">No languages added yet.</span>
              )}
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Frameworks & Libraries</h3>
            <div className="flex flex-wrap gap-1.5">
              {(technicalSkills.frameworks || []).map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
                  {typeof s === 'string' ? s : s.name}
                </span>
              ))}
              {(!technicalSkills.frameworks || technicalSkills.frameworks.length === 0) && (
                <span className="text-slate-400 italic">No frameworks added yet.</span>
              )}
            </div>
          </div>

          {/* Databases & Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Databases</h3>
              <div className="flex flex-wrap gap-1.5">
                {(technicalSkills.databases || []).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tools & Infra</h3>
              <div className="flex flex-wrap gap-1.5">
                {(technicalSkills.toolsTechnologies || []).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                    {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );

  // 8. Projects Section
  const renderProjects = () => (
    <section id="projects" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <FolderGit2 className="w-5 h-5 text-brand-600" />
          <h2 className="font-bold text-slate-900 text-base">Software Projects</h2>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500 font-medium">{projects.length} Repositories</span>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:border-brand-300 transition-colors flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                <div className="flex space-x-1">
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-slate-900" title="GitHub Repo">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.projectLink && (
                    <a href={proj.projectLink} target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-brand-600" title="Live Preview">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {proj.technologies?.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {proj.highlights && proj.highlights.length > 0 && (
              <ul className="mt-3 pt-2 border-t border-slate-200/60 list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                {proj.highlights.map((h, hIdx) => (
                  <li key={hIdx}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-2 text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No software projects added yet. Click "Edit Profile" to add projects.
          </div>
        )}
      </div>
    </section>
  );

  // 9. Experience / Internships Section
  const renderExperience = () => (
    <section id="experience" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-brand-600" />
          <h2 className="font-bold text-slate-900 text-base">Work Experience & Internships</h2>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
        >
          <Edit3 className="w-3 h-3" />
          <span>Manage</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                <div className="text-xs font-semibold text-brand-700">{exp.organization}</div>
              </div>
              <div className="text-xs text-slate-500 font-medium">{exp.duration}</div>
            </div>

            {exp.description && <p className="text-xs text-slate-600">{exp.description}</p>}

            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 pt-1">
                {exp.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx}>{resp}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No work experience added yet. Click "Edit Profile" to add internships.
          </div>
        )}
      </div>
    </section>
  );

  // 10. Certifications & Achievements Grid
  const renderCertificationsAndAchievements = () => (
    <div id="certifications-achievements-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      
      {/* Certifications */}
      <section id="certifications" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-base">Certifications & Licenses</h2>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Manage</span>
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-start">
              <div>
                <div className="font-bold text-slate-900">{cert.name}</div>
                <div className="text-slate-600">{cert.organization} {cert.date ? `(${cert.date})` : ''}</div>
              </div>
              {cert.certificateLink && (
                <a href={cert.certificateLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-semibold flex items-center space-x-1">
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}

          {certifications.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-xs italic">
              No certifications added yet.
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">Achievements & Honors</h2>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Manage</span>
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{ach.title}</span>
              </div>
              <div className="text-slate-600 text-[11px] mt-0.5">{ach.organization} {ach.date ? `(${ach.date})` : ''}</div>
              {ach.description && <p className="text-slate-600 mt-1">{ach.description}</p>}
            </div>
          ))}

          {achievements.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-xs italic">
              No achievements added yet.
            </div>
          )}
        </div>
      </section>

    </div>
  );

  // 11. Contact Credentials Section
  const renderContact = () => (
    <section id="contact" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="font-bold text-slate-900 text-sm">
          Contact Credentials & Online Profiles
        </h2>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <Mail className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-800 truncate">{personalInfo.email || 'Email Not Specified'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <Phone className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-800">{personalInfo.phone || 'Phone Not Specified'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-800 truncate">{personalInfo.location || 'Location Not Specified'}</span>
        </div>

        {professionalLinks.linkedin && (
          <a href={professionalLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between group">
            <span className="flex items-center font-semibold text-slate-800"><Linkedin className="w-4 h-4 text-blue-600 mr-2" /> LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
          </a>
        )}

        {professionalLinks.github && (
          <a href={professionalLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between group">
            <span className="flex items-center font-semibold text-slate-800"><Github className="w-4 h-4 text-slate-900 mr-2" /> GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
          </a>
        )}

        {professionalLinks.portfolio && (
          <a href={professionalLinks.portfolio} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between group">
            <span className="flex items-center font-semibold text-slate-800"><Globe className="w-4 h-4 text-purple-600 mr-2" /> Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
          </a>
        )}
      </div>
    </section>
  );

  // 12. ATS Resume Builder View
  const renderResumeBuilder = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Resume Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Automated ATS Resume Generator</h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Generate high-scoring, single-page ATS-formatted resumes designed for corporate campus recruitment. Customize layouts, accent colors, and download print-ready PDFs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleQuickDownloadPDF}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF (1-Click)</span>
          </button>

          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center justify-center space-x-2 transition-transform hover:scale-105"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Open Customizer Studio</span>
          </button>
        </div>
      </div>

      {/* ATS Checklist & Resume Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>ATS Compatibility</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard single-column structure, clean typography, system fonts, and machine-readable headers optimized for Taleo, Workday, and Greenhouse.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm">
            <Code2 className="w-4 h-4" />
            <span>Live Sync with Profile</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Any update to your education, projects, skills, or certifications automatically syncs to your live resume without manual copy-pasting.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Verified Readiness</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pair your ATS Resume with our AI Resume Analyzer to compare your profile against specific target company job descriptions.
          </p>
        </div>
      </div>

      {/* Profile Data Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm">Current Resume Sections Ready For Export</h3>
          <span className="text-xs text-emerald-600 font-bold">100% Synced</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Personal & Contact</div>
            <div className="font-bold text-slate-800 mt-0.5">{personalInfo.fullName || 'Not configured'}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Degree & College</div>
            <div className="font-bold text-slate-800 mt-0.5">{education.degree || 'Degree'} (CGPA: {education.cgpa || '—'})</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Projects & Experience</div>
            <div className="font-bold text-slate-800 mt-0.5">{projects.length} Projs • {experience.length} Exps</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Certifications & Awards</div>
            <div className="font-bold text-slate-800 mt-0.5">{certifications.length} Certs • {achievements.length} Awards</div>
          </div>
        </div>
      </div>
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
            {renderProfileHeader()}
            {renderReadinessCard()}
            {renderInterviewBanner()}
            
            {/* Quick Diagnostic Reports (if attempted) */}
            {latestAssessment && renderTechnicalReport()}
            {latestAptitudeAssessment && renderAptitudeReport()}
            {latestCommunicationAssessment && renderCommunicationReport()}

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* ATS Resume Quick Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">ATS Resume Builder</h3>
                  <p className="text-xs text-slate-500">
                    Export high-ranking ATS-compatible resume in single-page format.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('resume-builder')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Open Resume Builder</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AI Resume Analyzer Quick Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">AI Resume Analyzer</h3>
                  <p className="text-xs text-slate-500">
                    Upload your resume to discover missing keywords and skills against target jobs.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('resume-analyzer')}
                  className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Scan Resume with AI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Learning Roadmap Quick Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Personalized Roadmap</h3>
                  <p className="text-xs text-slate-500">
                    Structured weekly milestones and skill-based quizzes to level up for placements.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="w-full py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>View Career Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Professional Appearance Analyzer Quick Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-extrabold text-slate-900 text-sm">Professional Appearance Analyzer</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Verify interview attire appropriateness & inspect head and shoulder posture alignment with AI.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Open Appearance Analyzer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {renderEducationAndSkills()}
            {renderProjects()}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            {renderProfileHeader()}

            {/* Quick Subsection Anchors */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
              <span className="text-xs font-bold text-slate-500 px-2">Jump to:</span>
              {[
                { id: 'academics', label: 'Academics & CGPA', icon: GraduationCap },
                { id: 'skills', label: 'Technical Skills', icon: Code2 },
                { id: 'projects', label: 'Software Projects', icon: FolderGit2 },
                { id: 'experience', label: 'Work Experience', icon: Briefcase },
                { id: 'certifications', label: 'Certifications', icon: Award },
                { id: 'contact', label: 'Contact Credentials', icon: Phone },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSubSection(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    activeSection === item.id
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
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
            {renderInterviewBanner()}
            {renderReadinessCard()}
            {renderTechnicalReport()}
            {renderAptitudeReport()}
            {renderCommunicationReport()}
          </div>
        );

      case 'technical':
        return (
          <div className="space-y-6">
            {renderTechnicalReport()}
            {renderReadinessCard()}
          </div>
        );

      case 'aptitude':
        return (
          <div className="space-y-6">
            {renderAptitudeReport()}
            {renderReadinessCard()}
          </div>
        );

      case 'interview':
        return (
          <div className="space-y-6">
            {renderInterviewBanner()}
            {renderCommunicationReport()}
          </div>
        );

      case 'resume-builder':
        return renderResumeBuilder();

      case 'resume-analyzer':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <ResumeAnalyzer />
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <PersonalizedRoadmap />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-fade-in">
            <AppearancePostureAnalyzer onOpenEditProfile={() => setIsEditModalOpen(true)} />
          </div>
        );

      case 'all':
      default:
        return (
          <div className="space-y-8 animate-fade-in">
            {renderProfileHeader()}
            {renderReadinessCard()}
            {renderInterviewBanner()}
            {latestAssessment && renderTechnicalReport()}
            {latestAptitudeAssessment && renderAptitudeReport()}
            {latestCommunicationAssessment && renderCommunicationReport()}
            {renderEducationAndSkills()}
            {renderProjects()}
            {renderExperience()}
            {renderCertificationsAndAchievements()}
            {renderContact()}

            {/* Appearance & Posture Analyzer in Full View */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <AppearancePostureAnalyzer onOpenEditProfile={() => setIsEditModalOpen(true)} />
            </div>

            {/* Resume Analyzer in Full View */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <ResumeAnalyzer />
            </div>

            {/* Personalized Roadmap in Full View */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <PersonalizedRoadmap />
            </div>
          </div>
        );
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'profile': return 'Student Placement Profile';
      case 'assessments': return 'Assessments Hub';
      case 'technical': return 'Technical Skill Assessment';
      case 'aptitude': return 'Aptitude & Reasoning Assessment';
      case 'interview': return 'AI Mock Interview Studio';
      case 'resume-builder': return 'ATS Resume Builder';
      case 'resume-analyzer': return 'AI Resume Analyzer';
      case 'roadmap': return 'Personalized Career Roadmap';
      case 'appearance': return 'AI Professional Appearance & Posture Analyzer';
      case 'all': return 'Full Placement Profile View';
      default: return 'Student Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
      
      {/* 1. Left Navigation Bar */}
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

      {/* 2. Main Content Layout */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 shadow-xs flex items-center justify-between gap-4">
          
          {/* Mobile hamburger & Page Breadcrumbs */}
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
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                <span>Placement Portal</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-brand-600 font-bold capitalize">{activeTab}</span>
              </div>
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {getBreadcrumbTitle()}
              </h1>
            </div>
          </div>

          {/* Top Header Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              title="Edit Profile Information"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDownloadPDF}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              title="1-Click Download ATS Resume PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ATS PDF</span>
            </button>

            {/* User Pill / Sign Out */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <img
                src={personalInfo.profilePhoto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><circle cx='12' cy='7' r='4'/><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/></svg>"}
                alt={personalInfo.fullName || 'Student'}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-100"
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
                className="p-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Empty Profile Setup Banner if profile is missing */}
        {!hasProfile && (
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Placement Readiness System</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Create Your Placement Profile</h2>
                <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
                  Fill in your personal info, academic scores, technical skills, projects, and work experience to launch your placement dashboard and generate an ATS-friendly resume!
                </p>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-sm shadow-lg transition-transform hover:scale-105 flex items-center space-x-2 flex-shrink-0"
              >
                <PlusCircle className="w-5 h-5 text-brand-600" />
                <span>Create Placement Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTabContent()}
        </main>
      </div>

    </div>
  );
};
