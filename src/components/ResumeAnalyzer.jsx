import { useState, useMemo, useRef } from "react";
import {
  FileSearch,
  Upload,
  Download,
  Code2,
  Users,
  BookOpen,
  Award,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  Banknote,
  Search,
  FileText,
  Check,
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  JOB_CATEGORIES,
  JOB_ROLES_DATA,
  JOB_ROLES_LIST,
  analyzeResumeLocally,
} from "../data/jobRolesResumeData.js";
import "./ResumeAnalyzer.css";

export default function ResumeAnalyzer() {
  const [role, setRole] = useState("Software Engineer (SDE)");
  const [selectedCategory, setSelectedCategory] = useState("All Roles");
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [inputMode, setInputMode] = useState("file"); // "file" | "text"
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Filter roles based on selected category and search input
  const filteredRoles = useMemo(() => {
    return JOB_ROLES_LIST.filter((r) => {
      const data = JOB_ROLES_DATA[r];
      const matchesCategory =
        selectedCategory === "All Roles" || data.category === selectedCategory;
      const matchesSearch =
        r.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        data.description.toLowerCase().includes(roleSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, roleSearchQuery]);

  const currentRoleData = JOB_ROLES_DATA[role] || JOB_ROLES_DATA["Software Engineer (SDE)"];

  // Handle file selection
  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    if (selected) {
      const ext = selected.name.split(".").pop().toLowerCase();
      if (!["pdf", "docx", "txt"].includes(ext)) {
        setError("Please choose a valid PDF, DOCX, or TXT resume document.");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError("Resume must be smaller than 10 MB.");
        return;
      }
      setFile(selected);
      setError("");
      setResult(null);

      // If text file, read content directly
      if (ext === "txt") {
        const reader = new FileReader();
        reader.onload = (e) => setResumeText(e.target?.result || "");
        reader.readAsText(selected);
      }
    }
  }

  // Core resume analysis submit handler
  async function handleAnalyze(event) {
    if (event) event.preventDefault();
    setError("");
    setResult(null);

    if (inputMode === "file" && !file) {
      setError("Please select a resume file (PDF or DOCX) to analyze.");
      return;
    }

    if (inputMode === "text" && !resumeText.trim()) {
      setError("Please paste your resume text into the text box.");
      return;
    }

    setLoading(true);
    setLoadingStep("Extracting document contents and keywords...");

    try {
      let data = null;

      // If text was pasted, run immediate instant local analysis
      if (inputMode === "text" && resumeText.trim()) {
        await new Promise((r) => setTimeout(r, 600));
        setLoadingStep("Evaluating ATS compatibility and role keywords...");
        await new Promise((r) => setTimeout(r, 400));
        data = analyzeResumeLocally(resumeText, role, "Pasted Resume Text");
      } else if (file) {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("role", role);

        // Try primary backend endpoint with fallback
        try {
          setLoadingStep("Submitting to ATS analysis engine...");
          let response = await fetch("/api/resume/analyze", {
            method: "POST",
            body: formData,
          });

          if (!response.ok && response.status === 404) {
            response = await fetch("http://localhost:5000/api/resume/analyze", {
              method: "POST",
              body: formData,
            });
          }

          if (response.ok) {
            data = await response.json();
          } else {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Server analysis error");
          }
        } catch (networkErr) {
          console.warn("Backend unavailable, executing client-side fallback:", networkErr);
          setLoadingStep("Processing locally with resilient client-side ATS parser...");

          // If file is TXT, read text; otherwise if browser can read text:
          let extracted = resumeText;
          if (!extracted && file.type === "text/plain") {
            extracted = await file.text();
          }

          if (!extracted) {
            // For binary files when backend is offline, extract plain strings from buffer
            try {
              const buffer = await file.arrayBuffer();
              const uint8 = new Uint8Array(buffer);
              let rawStr = "";
              for (let i = 0; i < uint8.length && rawStr.length < 50000; i++) {
                const charCode = uint8[i];
                if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
                  rawStr += String.fromCharCode(charCode);
                }
              }
              extracted = rawStr;
            } catch {
              extracted = "";
            }
          }

          if (extracted && extracted.length > 50) {
            data = analyzeResumeLocally(extracted, role, file.name);
          } else {
            throw new Error(
              "Could not connect to the backend server. Please ensure the server is active or paste your resume text in the 'Paste Resume Text' tab for instant analysis."
            );
          }
        }
      }

      if (!data) {
        throw new Error("Unable to analyze resume. Please try again.");
      }

      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during resume analysis.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  // Download comprehensive analysis report
  function downloadReport() {
    if (!result) return;

    const reportLines = [
      "===========================================================",
      "               CAMPUS PLACEMENT ATS AUDIT REPORT           ",
      "===========================================================",
      `Generated On: ${new Date().toLocaleString()}`,
      `Candidate Document: ${result.fileName || file?.name || "Uploaded Resume"}`,
      `Target Placement Role: ${result.role}`,
      `Industry Category: ${result.category || currentRoleData.category}`,
      `Expected Placement CTC: ${result.salaryRange || currentRoleData.salaryRange}`,
      "",
      "-----------------------------------------------------------",
      "1. EXECUTIVE ATS SUMMARY",
      "-----------------------------------------------------------",
      `Overall ATS Compatibility Score: ${result.overallAtsScore}% (${result.atsRating})`,
      `Skills Fit Index: ${result.skillMatchPercentage}%`,
      `Structure & Formatting Score: ${result.structureScore}%`,
      `Content & Impact Score: ${result.impactScore}%`,
      "",
      "-----------------------------------------------------------",
      "2. TECHNICAL SKILLS ASSESSMENT",
      "-----------------------------------------------------------",
      `Matched Core Skills (${result.matchedSkills?.length || 0} / ${result.totalRequired || 0}):`,
      ...(result.matchedSkills?.length
        ? result.matchedSkills.map((s) => `  [✓] ${s}`)
        : ["  (None detected from required list)"]),
      "",
      `Missing Priority Skills (${result.missingSkills?.length || 0}):`,
      ...(result.missingSkills?.length
        ? result.missingSkills.map((s) => `  [!] ${s}`)
        : ["  (None - All required skills detected!)"]),
      "",
      `Additional / Transferable Skills Found (${result.additionalSkills?.length || 0}):`,
      ...(result.additionalSkills?.length
        ? result.additionalSkills.map((s) => `  [+] ${s}`)
        : ["  (None detected)"]),
      "",
      "-----------------------------------------------------------",
      "3. SOFT SKILLS & PROFESSIONAL TRAITS",
      "-----------------------------------------------------------",
      `Detected Attributes: ${(result.detectedSoftSkills || []).join(", ") || "None directly mentioned"}`,
      `Role Expected Competencies: ${(result.expectedSoftSkills || currentRoleData.soft).join(", ")}`,
      "",
      "-----------------------------------------------------------",
      "4. ATS FORMATTING & STRUCTURE AUDIT",
      "-----------------------------------------------------------",
      `Word Count: ${result.auditDetails?.wordCount || "N/A"} words`,
      `Quantifiable Metrics Found: ${result.auditDetails?.metricsCount || 0} occurrences`,
      `High-Impact Action Verbs Found: ${result.auditDetails?.actionVerbsCount || 0} (${(result.auditDetails?.actionVerbsFound || []).slice(0, 8).join(", ")})`,
      `Contact Info Detected: Email (${result.auditDetails?.contactAudit?.hasEmail ? "YES" : "NO"}), Phone (${result.auditDetails?.contactAudit?.hasPhone ? "YES" : "NO"}), LinkedIn (${result.auditDetails?.contactAudit?.hasLinkedIn ? "YES" : "NO"}), GitHub (${result.auditDetails?.contactAudit?.hasGitHub ? "YES" : "NO"})`,
      "",
      "-----------------------------------------------------------",
      "5. ACTIONABLE IMPROVEMENT RECOMMENDATIONS",
      "-----------------------------------------------------------",
      ...(result.recommendations || []).map((r, i) => `${i + 1}. ${r}`),
      "",
      "-----------------------------------------------------------",
      "6. RECOMMENDED CERTIFICATIONS FOR THIS ROLE",
      "-----------------------------------------------------------",
      ...(result.certifications || currentRoleData.certifications || []).map(
        (c) => `• ${c.name} (${c.provider}) - ${c.url}`
      ),
      "",
      "-----------------------------------------------------------",
      "7. TOP HIRING RECRUITERS",
      "-----------------------------------------------------------",
      (result.topCompanies || currentRoleData.topCompanies || []).join(", "),
      "",
      "===========================================================",
      "Report generated by Placement Genie AI Resume Analyzer",
      "==========================================================="
    ];

    const blob = new Blob([reportLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ATS_Audit_${role.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="resume-analyzer">
      {/* 1. Header Banner */}
      <header className="resume-header">
        <div className="resume-header-icon">
          <FileSearch size={30} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="resume-eyebrow">
            <Sparkles size={14} /> ENTERPRISE ATS PLACEMENT READINESS
          </div>
          <h1>AI Resume Analyzer & Job Fit Engine</h1>
          <p>
            Evaluate your resume against <strong>40+ campus job roles</strong>. Uncover critical skill gaps,
            test ATS parseability, inspect industry metrics, and access curated certification tracks.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Role Catalog</span>
            <span className="text-lg font-black text-brand-400">{JOB_ROLES_LIST.length} Supported Jobs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <BriefcaseBusiness size={20} />
          </div>
        </div>
      </header>

      {/* 2. Interactive Job Role Selector & Filters */}
      <section className="resume-upload-card">
        <div className="resume-section-heading">
          <BriefcaseBusiness size={22} />
          <div className="flex-1">
            <h2>Select Target Job Role (40+ Roles)</h2>
            <p>Select your intended placement profile to benchmark your resume against specific employer filters.</p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800/80">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title (e.g., Python, Cloud, SDE, Analyst)..."
              value={roleSearchQuery}
              onChange={(e) => setRoleSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <select
              id="resume-role-select"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setResult(null);
                setError("");
              }}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {filteredRoles.length > 0 ? (
                filteredRoles.map((r) => (
                  <option key={r} value={r}>
                    {r} ({JOB_ROLES_DATA[r].category})
                  </option>
                ))
              ) : (
                <option value={role}>{role}</option>
              )}
            </select>
          </div>
        </div>

        {/* Selected Role Executive Preview */}
        <div className="mt-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 text-[11px] font-bold uppercase tracking-wider">
                {currentRoleData.category}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{role}</h3>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">{currentRoleData.description}</p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4">
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Banknote size={14} className="text-emerald-400" /> Est. Campus Package
              </div>
              <div className="text-sm font-bold text-emerald-400">{currentRoleData.salaryRange}</div>
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Building2 size={14} className="text-indigo-400" /> Top Recruiters
              </div>
              <div className="text-xs font-semibold text-slate-300 max-w-[200px] truncate">
                {currentRoleData.topCompanies.slice(0, 3).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Resume Upload Card */}
      <section className="resume-upload-card">
        <div className="flex items-center justify-between mb-3">
          <div className="resume-section-heading mb-0">
            <Upload size={22} />
            <div>
              <h2>Upload or Paste Resume</h2>
              <p>Supports official PDF, DOCX, or direct resume text.</p>
            </div>
          </div>

          {/* Input Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setInputMode("file")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                inputMode === "file" ? "bg-brand-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Upload size={13} /> File Upload
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                inputMode === "text" ? "bg-brand-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={13} /> Paste Text
            </button>
          </div>
        </div>

        {inputMode === "file" ? (
          <div
            className="resume-upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="text-brand-400" />
            <strong>Click to Browse or Drag & Drop Resume File</strong>
            <span>Supported formats: PDF, DOCX, TXT · Maximum 10 MB</span>

            <input
              ref={fileInputRef}
              id="resume-file"
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div>
            <textarea
              rows={7}
              placeholder="Paste your full resume text here (Summary, Skills, Education, Projects, Experience)..."
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setResult(null);
                setError("");
              }}
              className="w-full p-4 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        )}

        {/* Selected file confirmation pill */}
        {inputMode === "file" && file && (
          <div className="flex items-center justify-between p-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-xs text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="font-semibold text-slate-200">{file.name}</span>
              <span className="text-slate-500 font-mono">({Math.round(file.size / 1024)} KB)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-slate-400 hover:text-rose-400 transition-colors text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action button */}
        <button
          className="resume-analyze-button mt-2"
          type="button"
          disabled={loading}
          onClick={handleAnalyze}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RefreshCw size={17} className="animate-spin" /> {loadingStep || "Analyzing Resume..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={17} /> Analyze My Resume For {role}
            </span>
          )}
        </button>
      </section>

      {/* 4. Comprehensive Analysis Results View */}
      {result && (
        <section ref={resultsRef} className="resume-results animate-fade-in space-y-6">
          {/* Top Bar with Title and Download */}
          <div className="resume-report-heading">
            <div>
              <span className="resume-eyebrow">
                <ShieldCheck size={13} /> PLACEMENT AUDIT RESULTS
              </span>
              <h2>Comprehensive Resume Analysis Report</h2>
              <p>
                Candidate: <strong className="text-white">{result.fileName || file?.name || "Student Resume"}</strong> ·
                Target Role: <strong className="text-brand-400">{result.role}</strong>
              </p>
            </div>

            <button
              type="button"
              className="resume-download-button"
              onClick={downloadReport}
            >
              <Download size={16} /> Download Full Report
            </button>
          </div>

          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main Composite ATS Gauge */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/40 border border-slate-800 shadow-xl flex items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Overall ATS Compatibility
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                  {result.overallAtsScore}%
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    result.overallAtsScore >= 80
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : result.overallAtsScore >= 65
                      ? "bg-brand-500/20 text-brand-300 border-brand-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}>
                    {result.atsRating}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Calculated using enterprise ATS parser simulation (Skills weight: 50%, Impact: 25%, Format: 25%).
                </p>
              </div>

              <div className="w-20 h-20 rounded-full bg-brand-500/10 border-4 border-brand-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
                <span className="text-2xl font-black text-brand-300">{result.overallAtsScore}</span>
              </div>
            </div>

            {/* Sub-Metric 1: Skills Fit */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Technical Skill Fit
                </span>
                <div className="text-2xl font-black text-white">
                  {result.skillMatchPercentage}%
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {result.matchedSkills?.length || 0} of {result.totalRequired || 10} core skills matched
                </p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.skillMatchPercentage}%` }}
                />
              </div>
            </div>

            {/* Sub-Metric 2: Formatting & Metrics */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Content Impact & Metrics
                </span>
                <div className="text-2xl font-black text-emerald-400">
                  {result.impactScore}%
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {result.auditDetails?.metricsCount || 0} quantifiable results & {result.auditDetails?.actionVerbsCount || 0} action verbs
                </p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.impactScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 5. Skills Audit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Matched Required Skills */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Skills Found in Resume ({result.matchedSkills?.length || 0})
                </h3>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  Confirmed
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Core technical requirements for {role} present in your document:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.matchedSkills?.length > 0 ? (
                  result.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                    >
                      <Check size={12} /> {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No exact required skills identified.</p>
                )}
              </div>
            </div>

            {/* Missing Priority Skills */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-400" />
                  Missing Critical Skills ({result.missingSkills?.length || 0})
                </h3>
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enterprise recruiters and ATS screeners look for these key keywords:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.missingSkills?.length > 0 ? (
                  result.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                    >
                      <XCircle size={12} className="text-amber-400" /> {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-400 font-semibold">
                    Outstanding! All core technical competencies are present.
                  </p>
                )}
              </div>
            </div>

            {/* Bonus / Additional Skills */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-brand-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-400" />
                  Bonus Skills Detected ({result.additionalSkills?.length || 0})
                </h3>
                <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/15 px-2 py-0.5 rounded-full">
                  Advantage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Valuable complementary skills from adjacent engineering domains:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.additionalSkills?.length > 0 ? (
                  result.additionalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold"
                    >
                      + {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No secondary skills recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* 6. ATS Structure & Section Checklist */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers size={18} className="text-brand-400" />
              <h3 className="text-base font-bold text-white">ATS Structure & Formatting Verification</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              {/* Contact Information */}
              <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Contact Details
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Email Address</span>
                    {result.auditDetails?.contactAudit?.hasEmail ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Phone Number</span>
                    {result.auditDetails?.contactAudit?.hasPhone ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">LinkedIn Profile</span>
                    {result.auditDetails?.contactAudit?.hasLinkedIn ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">GitHub / Portfolio</span>
                    {result.auditDetails?.contactAudit?.hasGitHub || result.auditDetails?.contactAudit?.hasPortfolio ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Standard Headers */}
              <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Standard Headers
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Education Section</span>
                    {result.auditDetails?.sectionsAudit?.hasEducation ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Skills Section</span>
                    {result.auditDetails?.sectionsAudit?.hasSkillsSection ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Projects / Experience</span>
                    {result.auditDetails?.sectionsAudit?.hasExperienceOrProjects ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Certifications</span>
                    {result.auditDetails?.sectionsAudit?.hasCertifications ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-500">Optional</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Verbs */}
              <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Action Verbs
                </span>
                <div className="text-2xl font-black text-white">
                  {result.auditDetails?.actionVerbsCount || 0}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {(result.auditDetails?.actionVerbsFound || []).slice(0, 5).join(", ") || "None detected"}
                </p>
              </div>

              {/* Quantified Metrics */}
              <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Quantified Metrics
                </span>
                <div className="text-2xl font-black text-emerald-400">
                  {result.auditDetails?.metricsCount || 0}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {result.auditDetails?.metricsCount >= 3
                    ? "Strong numerical impact"
                    : "Add % or numbers to bullets"}
                </p>
              </div>
            </div>
          </div>

          {/* 7. Actionable Improvement Recommendations */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 border border-brand-500/30 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles size={18} className="text-brand-400" />
              <h3 className="text-base font-bold text-white">Actionable Steps to Reach 90%+ ATS Score</h3>
            </div>

            <div className="space-y-2.5">
              {(result.recommendations || []).map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Curated Learning Tracks & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <GraduationCap size={18} className="text-brand-400" />
                <h3 className="text-base font-bold text-white">Recommended Certifications for {role}</h3>
              </div>

              <div className="space-y-3">
                {(result.certifications || currentRoleData.certifications || []).map((cert, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-850/70 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{cert.name}</h4>
                      <p className="text-[11px] text-slate-400">{cert.provider}</p>
                    </div>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 text-brand-300 text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-colors"
                    >
                      Official Path <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen size={18} className="text-brand-400" />
                <h3 className="text-base font-bold text-white">Top Courses & Prep Material</h3>
              </div>

              <div className="space-y-3">
                {(result.courses || currentRoleData.courses || []).map((course, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-850/70 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{course.name}</h4>
                      <p className="text-[11px] text-slate-400">{course.provider}</p>
                    </div>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-colors"
                    >
                      Start Course <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
