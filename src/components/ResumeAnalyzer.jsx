
import { useState } from "react";
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
  Sparkles,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";
import "./ResumeAnalyzer.css";


const JOB_ROLES = [
  "Data Analyst",
  "Software Engineer",
  "Machine Learning Engineer",
  "Full Stack Developer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
];

const ROLE_GUIDANCE = {
  "Data Analyst": {
    technical: ["SQL", "Excel", "Python", "Power BI", "Statistics", "Data Visualization"],
    soft: ["Analytical Thinking", "Communication", "Attention to Detail", "Problem Solving", "Presentation"],
    courses: [
      {
        name: "Google Data Analytics Professional Certificate",
        provider: "Google / Coursera",
        url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      },
      {
        name: "SQL for Data Science",
        provider: "University of California, Davis / Coursera",
        url: "https://www.coursera.org/learn/sql-for-data-science",
      },
      {
        name: "Power BI Learning Resources",
        provider: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/",
      },
    ],
    certifications: [
      {
        name: "Microsoft Certified: Power BI Data Analyst Associate",
        provider: "Microsoft",
        url: "https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/",
      },
      {
        name: "Google Data Analytics Professional Certificate",
        provider: "Google",
        url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      },
    ],
  },

  "Software Engineer": {
    technical: ["Python", "Java", "Data Structures & Algorithms", "Git", "SQL", "Testing"],
    soft: ["Problem Solving", "Teamwork", "Communication", "Adaptability", "Time Management"],
    courses: [
      {
        name: "Programming Foundations",
        provider: "Coursera",
        url: "https://www.coursera.org/courses?query=programming",
      },
      {
        name: "Data Structures and Algorithms",
        provider: "Coursera",
        url: "https://www.coursera.org/courses?query=data%20structures%20algorithms",
      },
      {
        name: "Git and GitHub Learning Resources",
        provider: "GitHub Skills",
        url: "https://skills.github.com/",
      },
    ],
    certifications: [
      {
        name: "GitHub Foundations",
        provider: "GitHub",
        url: "https://resources.github.com/learn/certifications/",
      },
      {
        name: "Role-relevant cloud developer certification",
        provider: "AWS",
        url: "https://aws.amazon.com/certification/",
      },
    ],
  },

  "Machine Learning Engineer": {
    technical: ["Python", "Machine Learning", "Statistics", "NumPy", "Pandas", "Model Deployment"],
    soft: ["Analytical Thinking", "Experimentation", "Problem Solving", "Communication", "Collaboration"],
    courses: [
      {
        name: "Machine Learning Specialization",
        provider: "DeepLearning.AI and Stanford Online / Coursera",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
      },
      {
        name: "Google Machine Learning Crash Course",
        provider: "Google",
        url: "https://developers.google.com/machine-learning/crash-course",
      },
      {
        name: "Practical Deep Learning",
        provider: "fast.ai",
        url: "https://course.fast.ai/",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Machine Learning Engineer – Associate",
        provider: "AWS",
        url: "https://aws.amazon.com/certification/",
      },
      {
        name: "Machine learning and cloud AI learning pathways",
        provider: "Google Cloud",
        url: "https://cloud.google.com/learn/certification",
      },
    ],
  },

  "Full Stack Developer": {
    technical: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "REST APIs"],
    soft: ["Teamwork", "Communication", "Debugging", "Adaptability", "Time Management"],
    courses: [
      {
        name: "Full Stack Open",
        provider: "University of Helsinki",
        url: "https://fullstackopen.com/en/",
      },
      {
        name: "Web Development Learning Path",
        provider: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
      },
      {
        name: "GitHub Skills",
        provider: "GitHub",
        url: "https://skills.github.com/",
      },
    ],
    certifications: [
      {
        name: "GitHub Foundations",
        provider: "GitHub",
        url: "https://resources.github.com/learn/certifications/",
      },
      {
        name: "AWS Certified Developer – Associate",
        provider: "AWS",
        url: "https://aws.amazon.com/certification/",
      },
    ],
  },

  "Cloud Engineer": {
    technical: ["Linux", "Networking", "AWS", "Azure", "Docker", "IAM", "CI/CD"],
    soft: ["Problem Solving", "Communication", "Teamwork", "Attention to Detail", "Incident Management"],
    courses: [
      {
        name: "AWS Skill Builder",
        provider: "Amazon Web Services",
        url: "https://skillbuilder.aws/",
      },
      {
        name: "Azure Training",
        provider: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/training/azure/",
      },
      {
        name: "Docker Getting Started",
        provider: "Docker",
        url: "https://docs.docker.com/get-started/",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect – Associate",
        provider: "AWS",
        url: "https://aws.amazon.com/certification/",
      },
      {
        name: "Microsoft Azure certification pathways",
        provider: "Microsoft",
        url: "https://learn.microsoft.com/en-us/credentials/",
      },
    ],
  },

  "Cybersecurity Analyst": {
    technical: ["Networking", "Linux", "Security Fundamentals", "SIEM", "Incident Response", "Python"],
    soft: ["Attention to Detail", "Critical Thinking", "Communication", "Ethical Judgment", "Problem Solving"],
    courses: [
      {
        name: "Introduction to Cybersecurity",
        provider: "Cisco Networking Academy",
        url: "https://www.netacad.com/",
      },
      {
        name: "Cybersecurity Learning",
        provider: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/training/",
      },
      {
        name: "Cybersecurity Courses",
        provider: "Coursera",
        url: "https://www.coursera.org/courses?query=cybersecurity",
      },
    ],
    certifications: [
      {
        name: "CompTIA Security+",
        provider: "CompTIA",
        url: "https://www.comptia.org/certifications/security",
      },
      {
        name: "Cisco Cybersecurity certification pathways",
        provider: "Cisco",
        url: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/security/index.html",
      },
    ],
  },

  "UI/UX Designer": {
    technical: ["Figma", "Wireframing", "Prototyping", "User Research", "Accessibility", "Design Systems"],
    soft: ["Empathy", "Creativity", "Communication", "Collaboration", "Presentation", "Critical Thinking"],
    courses: [
      {
        name: "Google UX Design Professional Certificate",
        provider: "Google / Coursera",
        url: "https://www.coursera.org/professional-certificates/google-ux-design",
      },
      {
        name: "Figma Learn",
        provider: "Figma",
        url: "https://help.figma.com/hc/en-us/categories/360002042553-Learn-design",
      },
      {
        name: "Accessibility Fundamentals",
        provider: "W3C",
        url: "https://www.w3.org/WAI/fundamentals/",
      },
    ],
    certifications: [
      {
        name: "Google UX Design Professional Certificate",
        provider: "Google",
        url: "https://www.coursera.org/professional-certificates/google-ux-design",
      },
      {
        name: "Relevant UX design courses and portfolio pathways",
        provider: "Interaction Design Foundation",
        url: "https://www.interaction-design.org/",
      },
    ],
  },
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, "");

function uniqueSkills(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function SkillCard({ title, skills = [], type, emptyText }) {
  return (
    <section className={`resume-skill-card ${type}`}>
      <h3>{title}</h3>

      {skills.length > 0 ? (
        <div className="resume-skill-list">
          {skills.map((skill) => (
            <span className="resume-skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="resume-empty">{emptyText}</p>
      )}

      <p className="resume-skill-count">
        {skills.length} skill{skills.length === 1 ? "" : "s"}
      </p>
    </section>
  );
}

function ResourceCard({ item, type }) {
  return (
    <article className="resume-resource-card">
      <div className="resume-resource-icon">
        {type === "course" ? (
          <BookOpen size={19} />
        ) : (
          <Award size={19} />
        )}
      </div>

      <div className="resume-resource-content">
        <h4>{item.name}</h4>
        <p>{item.provider}</p>
        <a href={item.url} target="_blank" rel="noreferrer">
          View official resource <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}

export default function ResumeAnalyzer() {
  const [role, setRole] = useState("Data Analyst");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const guidance = ROLE_GUIDANCE[role];

  // These are role-relevant skills, not proof that a candidate possesses them.
  // The backend's matched and additional skills are used to identify detected skills.
  const matchedSkills = uniqueSkills(result?.matchedSkills);
  const missingSkills = uniqueSkills(result?.missingSkills);
  const additionalSkills = uniqueSkills(result?.additionalSkills);

  const allDetected = uniqueSkills([...matchedSkills, ...additionalSkills]);

  const detectedTechnicalSkills = guidance.technical.filter((skill) =>
    allDetected.some(
      (detected) =>
        normalize(detected) === normalize(skill) ||
        normalize(detected).includes(normalize(skill)) ||
        normalize(skill).includes(normalize(detected))
    )
  );

  // Soft skills are displayed as role-relevant skills unless the backend
  // explicitly returns a softSkills array.
  const detectedSoftSkills = Array.isArray(result?.softSkills)
    ? uniqueSkills(result.softSkills)
    : [];

  const softSkillsToDevelop = guidance.soft.filter(
    (skill) =>
      !detectedSoftSkills.some(
        (detected) => normalize(detected) === normalize(skill)
      )
  );

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please choose your resume first.");
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["pdf", "docx"].includes(extension)) {
      setError("Only PDF and DOCX resumes are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your resume must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/resume/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the backend. Check that your server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!result) return;

    const report = [
      "RESUME ANALYSIS REPORT",
      `Resume: ${result.fileName || file?.name || "Uploaded resume"}`,
      `Selected job role: ${role}`,
      `Skill match: ${result.matchPercentage ?? 0}%`,
      "",
      "MATCHED SKILLS",
      ...matchedSkills.map((skill) => `- ${skill}`),
      "",
      "MISSING REQUIRED SKILLS",
      ...missingSkills.map((skill) => `- ${skill}`),
      "",
      "ADDITIONAL SKILLS",
      ...additionalSkills.map((skill) => `- ${skill}`),
      "",
      "TECHNICAL SKILLS RELEVANT TO THIS ROLE",
      ...guidance.technical.map((skill) => {
        const found = detectedTechnicalSkills.includes(skill);
        return `- ${skill}: ${found ? "Detected in backend skill results" : "Not confirmed by backend results"}`;
      }),
      "",
      "SOFT SKILLS",
      ...(detectedSoftSkills.length
        ? detectedSoftSkills.map((skill) => `- Detected: ${skill}`)
        : ["- No soft-skill extraction was returned by the backend."]),
      "ROLE-RELEVANT SOFT SKILLS TO CONSIDER",
      ...guidance.soft.map((skill) => `- ${skill}`),
      "",
      "RECOMMENDED COURSES",
      ...guidance.courses.map(
        (course) => `- ${course.name} (${course.provider}): ${course.url}`
      ),
      "",
      "RECOMMENDED CERTIFICATIONS",
      ...guidance.certifications.map(
        (cert) => `- ${cert.name} (${cert.provider}): ${cert.url}`
      ),
      "",
      `Analysis note: ${result.note || "Recommendations are based on the selected role."}`,
      "",
      "Disclaimer: Recommendations do not guarantee employment or certification.",
    ].join("\n");

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-analysis-report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="resume-analyzer">
      <header className="resume-header">
        <div className="resume-header-icon">
          <FileSearch size={27} />
        </div>

        <div>
          <span className="resume-eyebrow">
            <Sparkles size={13} /> STUDENT PLACEMENT READINESS
          </span>
          <h1>AI Resume Analyzer</h1>
          <p>
            Analyze your resume against your target job, review your skills,
            and explore relevant learning pathways and certifications.
          </p>
        </div>
      </header>

      <form className="resume-upload-card" onSubmit={handleAnalyze}>
        <div className="resume-section-heading">
          <BriefcaseBusiness size={20} />
          <div>
            <h2>Resume Assessment</h2>
            <p>Choose a job role and upload your latest resume.</p>
          </div>
        </div>

        <label htmlFor="resume-role">Target job role</label>
        <select
          id="resume-role"
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setResult(null);
            setError("");
          }}
        >
          {JOB_ROLES.map((job) => (
            <option key={job} value={job}>
              {job}
            </option>
          ))}
        </select>

        <label htmlFor="resume-file">Upload your resume</label>
        <div className="resume-upload-area">
          <Upload size={28} />
          <strong>Choose a resume file</strong>
          <span>PDF or DOCX · Maximum 5 MB</span>
          <input
            id="resume-file"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setResult(null);
              setError("");
            }}
          />
        </div>

        {file && (
          <p className="resume-selected-file">
            <CheckCircle2 size={15} />
            Selected: {file.name}
          </p>
        )}

        {error && (
          <p className="resume-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="resume-analyze-button"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            "Analyzing resume..."
          ) : (
            <>
              <Sparkles size={16} /> Analyze My Resume
            </>
          )}
        </button>
      </form>

      {result && (
        <section className="resume-results">
          <div className="resume-report-heading">
            <div>
              <span className="resume-eyebrow">YOUR ANALYSIS</span>
              <h2>Resume Analysis Report</h2>
              <p>
                {result.fileName || file?.name} · {role}
              </p>
            </div>

            <button
              type="button"
              className="resume-download-button"
              onClick={downloadReport}
            >
              <Download size={15} /> Download Report
            </button>
          </div>

          <section className="resume-match-card">
            <div className="resume-match-top">
              <div>
                <span className="resume-match-label">
                  Resume skill match
                </span>
                <div className="resume-match-number">
                  {Number(result.matchPercentage) || 0}%
                </div>
                <p>
                  {matchedSkills.length} matched skills out of{" "}
                  {result.totalRequired ?? matchedSkills.length + missingSkills.length}{" "}
                  required skills
                </p>
              </div>

              <div className="resume-match-icon">
                <CheckCircle2 size={30} />
              </div>
            </div>

            <div
              className="resume-match-track"
              role="progressbar"
              aria-label="Resume skill match"
              aria-valuenow={Math.min(
                100,
                Math.max(0, Number(result.matchPercentage) || 0)
              )}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="resume-match-fill"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, Number(result.matchPercentage) || 0)
                  )}%`,
                }}
              />
            </div>
          </section>

          <div className="resume-result-grid">
            <SkillCard
              title="✓ Skills Found"
              skills={matchedSkills}
              type="matched"
              emptyText="No required skills were detected by the analyzer."
            />

            <SkillCard
              title="! Missing Required Skills"
              skills={missingSkills}
              type="missing"
              emptyText="All listed required skills were detected."
            />

            <SkillCard
              title="+ Additional Skills"
              skills={additionalSkills}
              type="additional"
              emptyText="No additional recognized skills were detected."
            />
          </div>

          <section className="resume-feature-section">
            <div className="resume-section-heading">
              <Code2 size={21} />
              <div>
                <h2>Technical Skills</h2>
                <p>
                  Technical skills relevant to the selected {role} role.
                </p>
              </div>
            </div>

            <div className="resume-role-skills">
              {guidance.technical.map((skill) => {
                const isDetected = detectedTechnicalSkills.includes(skill);

                return (
                  <div
                    className={`resume-role-skill ${
                      isDetected ? "skill-detected" : "skill-not-confirmed"
                    }`}
                    key={skill}
                  >
                    {isDetected ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <BookOpen size={16} />
                    )}
                    <span>{skill}</span>
                    <small>
                      {isDetected ? "Detected" : "Review"}
                    </small>
                  </div>
                );
              })}
            </div>

            <p className="resume-section-note">
              Detection uses the skills returned by your backend. “Review”
              means the skill was not confirmed by those results; it does not
              prove you lack that skill.
            </p>
          </section>

          <section className="resume-feature-section">
            <div className="resume-section-heading">
              <Users size={21} />
              <div>
                <h2>Soft Skills</h2>
                <p>
                  Professional skills relevant to your selected job role.
                </p>
              </div>
            </div>

            {detectedSoftSkills.length > 0 ? (
              <>
                <h3 className="resume-subsection-title">
                  Soft skills identified by the analyzer
                </h3>
                <div className="resume-role-skills">
                  {detectedSoftSkills.map((skill) => (
                    <div
                      className="resume-role-skill skill-detected"
                      key={skill}
                    >
                      <CheckCircle2 size={16} />
                      <span>{skill}</span>
                      <small>Detected</small>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="resume-section-note">
                Your backend has not returned extracted soft skills. The
                following are relevant to this role, not verified claims about
                your personal abilities.
              </p>
            )}

            <h3 className="resume-subsection-title">
              Role-relevant soft skills
            </h3>
            <div className="resume-role-skills">
              {guidance.soft.map((skill) => (
                <div className="resume-role-skill" key={skill}>
                  <Users size={16} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-feature-section">
            <div className="resume-section-heading">
              <BookOpen size={21} />
              <div>
                <h2>Recommended Courses</h2>
                <p>
                  Learning resources selected for the {role} career path.
                </p>
              </div>
            </div>

            <div className="resume-resource-grid">
              {guidance.courses.map((course) => (
                <ResourceCard
                  key={course.name}
                  item={course}
                  type="course"
                />
              ))}
            </div>
          </section>

          <section className="resume-feature-section">
            <div className="resume-section-heading">
              <GraduationCap size={22} />
              <div>
                <h2>Recommended Certifications</h2>
                <p>
                  Credentials and learning pathways that may support this
                  career goal.
                </p>
              </div>
            </div>

            <div className="resume-resource-grid">
              {guidance.certifications.map((certification) => (
                <ResourceCard
                  key={certification.name}
                  item={certification}
                  type="certification"
                />
              ))}
            </div>

            <p className="resume-section-note">
              Recommendations are not guarantees of employment. Some items
              are courses or learning pathways rather than formal
              certifications. Check providers for current eligibility, fees,
              exam requirements, and availability.
            </p>
          </section>

          {result.note && (
            <p className="resume-disclaimer">{result.note}</p>
          )}
        </section>
      )}
    </main>
  );
}
