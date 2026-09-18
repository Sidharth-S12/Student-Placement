import React, { useRef } from 'react';
import { useStudent } from '../context/StudentContext';
import { generateATSResumePDF } from '../utils/generateATSResumePDF';
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
  Download,
  PlusCircle,
  RefreshCw,
  UserPlus
} from 'lucide-react';

export const SinglePageDashboard = () => {
  const {
    studentData,
    hasProfile,
    setIsEditModalOpen,
    setIsResumeModalOpen,
    setIsAssessmentModalOpen,
    createBlankProfile,
    resetDemoData,
    handlePhotoFileUpload,
    removeProfilePhoto,
    latestAssessment,
    isAptitudeModalOpen,
    setIsAptitudeModalOpen,
    latestAptitudeAssessment,
    showToast
  } = useStudent();

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-none">Student Placement Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">Readiness & Placement Assessment System</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAssessmentModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Technical Assessment</span>
          </button>

          <button
            onClick={() => setIsAptitudeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Start Aptitude Test</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-600" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={createBlankProfile}
            title="Start fresh and build a new placement profile"
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>New Profile</span>
          </button>

          <button
            onClick={resetDemoData}
            title="Load sample student profile"
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Load Demo</span>
          </button>

          <button
            onClick={handleQuickDownloadPDF}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm shadow-brand-600/30 flex items-center space-x-1.5 transition-all ml-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Resume</span>
          </button>
        </div>
      </header>

      {/* Empty Profile Setup Banner if profile is missing */}
      {!hasProfile && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Placement Readiness System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create Your Placement Profile</h2>
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

      {/* Main Single Page Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* ========================================================= */}
        {/* 1. PROFILE HEADER SECTION */}
        {/* ========================================================= */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card relative overflow-hidden">
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

                {/* Local device file upload input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileInputChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Upload Photo Overlay Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload profile photo from device"
                  className="absolute bottom-1 right-1 bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-xl shadow-md border-2 border-white transition-transform hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
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

                {/* Device Photo Control Buttons */}
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
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center space-x-1 border border-slate-200 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 pt-4 lg:pt-0 border-t border-slate-100 lg:border-none">
              <button
                onClick={handleQuickDownloadPDF}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
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

        {/* ========================================================= */}
        {/* 2. MIDDLE SECTION: EDUCATION | TECHNICAL SKILLS | PLACEMENT SCORES */}
        {/* ========================================================= */}

        {/* PLACEMENT READINESS SCORES */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
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
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Overall Readiness */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50/50 border border-brand-200 text-center space-y-1">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-brand-900">{placementScores.overallReadiness || 85}%</div>
              <div className="text-xs font-bold text-brand-700">Placement Readiness</div>
            </div>

            {/* Technical Score with Assessment launch trigger */}
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
                    Assessment: Completed
                  </div>
                </div>
              ) : (
                <div className="pt-1 text-[10px] text-slate-400 font-medium">
                  Click to start
                </div>
              )}
            </div>

            {/* Aptitude Score with Assessment launch trigger */}
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
                    <span>•</span>
                    <span className="text-indigo-600 font-bold">
                      Score: {latestAptitudeAssessment.finalScore ?? latestAptitudeAssessment.score}%
                    </span>
                  </div>
                  <div className="inline-block px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[9px] uppercase tracking-wide">
                    Assessment: Completed
                  </div>
                </div>
              ) : (
                <div className="pt-1 text-[10px] text-indigo-500 font-medium">
                  Click to start (20m)
                </div>
              )}
            </div>

            {/* Communication Score */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{placementScores.communicationScore || 90}%</div>
              <div className="text-xs font-semibold text-slate-600">Communication Score</div>
            </div>
          </div>
        </section>

        {/* LATEST TECHNICAL ASSESSMENT REPORT (Visible once completed) */}
        {latestAssessment && (
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-5 animate-fade-in">
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Evaluated via Dynamic Groq AI & ML Adaptive Engine
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAssessmentModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center space-x-2 self-start sm:self-auto shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
                <span>Retake Assessment (New Questions)</span>
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-200 text-center">
                <div className="text-2xl font-black text-brand-900">
                  {latestAssessment.technicalScore}%
                </div>
                <div className="text-[11px] font-bold text-brand-700 uppercase mt-0.5">
                  Technical Score
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
                <div className="text-2xl font-black text-emerald-800">
                  {latestAssessment.correctAnswers !== undefined ? latestAssessment.correctAnswers : (latestAssessment.correctCount || 0)}
                </div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase mt-0.5">
                  Correct Answers
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 text-center">
                <div className="text-2xl font-black text-red-800">
                  {latestAssessment.incorrectAnswers !== undefined ? latestAssessment.incorrectAnswers : (latestAssessment.incorrectCount || 0)}
                </div>
                <div className="text-[11px] font-bold text-red-700 uppercase mt-0.5">
                  Incorrect Answers
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-2xl font-black text-indigo-900 uppercase">
                  {latestAssessment.highestDifficulty || 'EASY'}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5 flex items-center justify-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Peak Level</span>
                </div>
              </div>
            </div>

            {/* Skill-wise Performance Breakdown */}
            {latestAssessment.skillPerformance && Object.keys(latestAssessment.skillPerformance).length > 0 && (
              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Skill-Wise Breakdown
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(latestAssessment.skillPerformance).map(skill => {
                    const data = latestAssessment.skillPerformance[skill];
                    const score = data.score !== undefined ? data.score : 0;
                    return (
                      <div key={skill} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-extrabold text-slate-900">{skill}</span>
                          <span className="text-[11px] text-slate-500 block">
                            {data.correctAnswers || 0}/{data.questionsAttempted || 0} correct • Level: {data.currentDifficulty || 'EASY'}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-brand-700 text-sm">
                          {score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strengths and Areas for Improvement */}
            {((latestAssessment.strengths && latestAssessment.strengths.length > 0) || (latestAssessment.areasForImprovement && latestAssessment.areasForImprovement.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {latestAssessment.strengths && latestAssessment.strengths.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Strengths</span>
                    </div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {latestAssessment.strengths.slice(0, 3).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {latestAssessment.areasForImprovement && latestAssessment.areasForImprovement.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-amber-800 flex items-center space-x-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Areas for Improvement</span>
                    </div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {latestAssessment.areasForImprovement.slice(0, 3).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* LATEST APTITUDE ASSESSMENT REPORT (Visible once completed) */}
        {latestAptitudeAssessment && (
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center shadow-sm">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-extrabold text-slate-900 text-base leading-none">
                      Aptitude Assessment Report
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] uppercase">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    20 Questions • 4 Mixed Domains • Evaluated via Dynamic Groq AI
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAptitudeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center space-x-2 self-start sm:self-auto shadow-sm shadow-indigo-200"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-200" />
                <span>Retake Aptitude Test (New Questions)</span>
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-center">
                <div className="text-2xl font-black text-indigo-950">
                  {latestAptitudeAssessment.finalScore ?? latestAptitudeAssessment.score}%
                </div>
                <div className="text-[11px] font-bold text-indigo-700 uppercase mt-0.5">
                  Aptitude Score
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
                <div className="text-2xl font-black text-emerald-900">
                  {latestAptitudeAssessment.correctAnswers ?? 0}/20
                </div>
                <div className="text-[11px] font-bold text-emerald-700 uppercase mt-0.5">
                  Correct ({((latestAptitudeAssessment.correctAnswers ?? 0) * 5)} marks)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-2xl font-black text-slate-800 font-mono">
                  {latestAptitudeAssessment.timeTakenFormatted || '< 20m'}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">
                  Time Taken
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-center">
                <div className="text-2xl font-black text-purple-900">
                  30%
                </div>
                <div className="text-[11px] font-bold text-purple-700 uppercase mt-0.5">
                  Readiness Weight
                </div>
              </div>
            </div>

            {/* Section Breakdown (4 Core Domains) */}
            {latestAptitudeAssessment.categoryBreakdown && Object.keys(latestAptitudeAssessment.categoryBreakdown).length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Domain Performance Breakdown (5 Questions / Section)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(latestAptitudeAssessment.categoryBreakdown).map(([cat, perf]) => {
                    const correct = perf.correct || 0;
                    const total = perf.total || 5;
                    const accuracy = perf.accuracy !== undefined ? perf.accuracy : Math.round((correct / total) * 100);

                    return (
                      <div key={cat} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="font-bold text-slate-800 truncate" title={cat}>
                          {cat}
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">{correct}/{total} correct</span>
                          <span className="font-bold font-mono text-indigo-700">{accuracy}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 60 ? 'bg-indigo-500' : accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strengths and Areas for Improvement */}
            {((latestAptitudeAssessment.strengths && latestAptitudeAssessment.strengths.length > 0) || (latestAptitudeAssessment.improvements && latestAptitudeAssessment.improvements.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {latestAptitudeAssessment.strengths && latestAptitudeAssessment.strengths.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Identified Strengths</span>
                    </div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {latestAptitudeAssessment.strengths.slice(0, 3).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {latestAptitudeAssessment.improvements && latestAptitudeAssessment.improvements.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-amber-800 flex items-center space-x-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Recommended Focus Areas</span>
                    </div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {latestAptitudeAssessment.improvements.slice(0, 3).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* EDUCATION & SKILLS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Education Summary */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-base">Education</h2>
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
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Code2 className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-base">Technical Skills</h2>
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

        {/* ========================================================= */}
        {/* 3. BELOW SECTION: PROJECTS | EXPERIENCE | CERTIFICATIONS | ACHIEVEMENTS */}
        {/* ========================================================= */}

        {/* PROJECTS */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-base">Software Projects</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">{projects.length} Repositories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:border-brand-300 transition-colors flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                    <div className="flex space-x-1">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-slate-900">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.projectLink && (
                        <a href={proj.projectLink} target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-brand-600">
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

        {/* EXPERIENCE / INTERNSHIPS */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-base">Experience / Internships</h2>
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

        {/* CERTIFICATIONS & ACHIEVEMENTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Certifications */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-base">Certifications</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="text-slate-600">{cert.organization} {cert.date ? `(${cert.date})` : ''}</div>
                  </div>
                  {cert.certificateLink && (
                    <a href={cert.certificateLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-semibold">
                      Verify
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
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-base">Achievements</h2>
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

        {/* ========================================================= */}
        {/* 4. BOTTOM SECTION: CONTACT & PROFESSIONAL LINKS */}
        {/* ========================================================= */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Contact Credentials & Online Profiles
          </h2>

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

      </main>
    </div>
  );
};
