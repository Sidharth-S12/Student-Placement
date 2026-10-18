
import React, { useState } from "react";
import "./ResumeAnalyzer.css";

export default function ResumeAnalyzer() {
  const [jobRole, setJobRole] = useState("Data Analyst");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeResume(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!resume) {
      setError("Please select your resume first.");
      return;
    }

    const allowed = /\.(pdf|docx)$/i.test(resume.name);
    if (!allowed) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError("Please choose a resume smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobRole", jobRole);

    setLoading(true);

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Resume analysis failed.");
      }

      setResult(data.analysis);
    } catch (err) {
      setError(
        err.message ||
          "Unable to analyze the resume. Check the backend server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="resume-analyzer">
      <header className="resume-header">
        <span className="resume-eyebrow">PLACEMENT PREPARATION</span>
        <h1>Resume Analyzer</h1>
        <p>
          Discover skill gaps and improve your resume for your target job role.
        </p>
      </header>

      <form className="resume-card" onSubmit={analyzeResume}>
        <h2>1. Select your target job role</h2>

        <label htmlFor="target-role">Target job role</label>
        <select
          id="target-role"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        >
          <option>Python Developer</option>
          <option>Java Developer</option>
          <option>Software Developer</option>
          <option>Data Analyst</option>
          <option>Data Scientist</option>
          <option>Machine Learning Engineer</option>
          <option>Frontend Developer</option>
          <option>Full Stack Developer</option>
          <option>SQL Developer</option>
        </select>

        <h2 className="resume-upload-heading">2. Upload your resume</h2>

        <label className="resume-dropzone" htmlFor="resume-file">
          <span className="resume-upload-icon">↑</span>
          <strong>
            {resume ? resume.name : "Choose your resume"}
          </strong>
          <span>PDF or DOCX · Maximum 5 MB</span>
          <input
            id="resume-file"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              setResume(e.target.files?.[0] || null);
              setResult(null);
              setError("");
            }}
          />
        </label>

        {error && <p className="resume-error">{error}</p>}

        <button
          className="resume-analyze-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Analyzing Resume..." : "Analyze My Resume"}
        </button>
      </form>

      {result && (
        <section className="resume-card resume-results">
          <h2>Resume Analysis Results</h2>

          {result.summary && (
            <p className="resume-summary">{result.summary}</p>
          )}

          {[
            ["Missing Skills", result.missingSkills],
            ["Missing Keywords", result.missingKeywords],
            ["Weak Sections", result.weakSections],
            ["Improvement Suggestions", result.suggestions],
            ["Recommended Courses", result.courses],
          ].map(([heading, items]) => (
            <div className="resume-result-section" key={heading}>
              <h3>{heading}</h3>
              {Array.isArray(items) && items.length > 0 ? (
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      {typeof item === "string"
                        ? item
                        : item.title || item.name || item.suggestion ||
                          JSON.stringify(item)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No specific recommendations provided.</p>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
