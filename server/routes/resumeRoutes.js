import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import path from "path";
import { JOB_ROLES_DATA, JOB_ROLES_LIST, JOB_CATEGORIES } from "../data/jobRolesData.js";

const router = express.Router();

// Configure resume upload (Max 10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf" || ext === ".docx" || ext === ".txt") {
      return callback(null, true);
    }
    callback(new Error("Please upload a PDF, DOCX, or TXT resume file."));
  },
});

// Common high-impact resume action verbs
const ACTION_VERBS = [
  "architected", "developed", "built", "designed", "engineered", "implemented", "deployed",
  "optimized", "spearheaded", "accelerated", "created", "refactored", "orchestrated",
  "automated", "integrated", "managed", "led", "reduced", "increased", "maximized",
  "collaborated", "resolved", "maintained", "analyzed", "published", "formulated"
];

// Common soft skills patterns
const SOFT_SKILLS_DICTIONARY = {
  "Problem Solving": ["problem solving", "troubleshooting", "analytical skills", "critical thinking", "debugging"],
  "Team Collaboration": ["collaboration", "teamwork", "cross-functional", "team player", "partnered"],
  "Communication": ["communication", "presentation", "public speaking", "written communication", "verbal communication"],
  "Leadership & Mentorship": ["leadership", "mentored", "lead", "spearheaded", "guided", "supervised"],
  "Agile & Scrum": ["agile", "scrum", "sprints", "standups", "jira", "kanban"],
  "Time Management & Ownership": ["time management", "ownership", "multitasking", "deadline", "self-starter"],
  "Adaptability & Continuous Learning": ["adaptability", "fast learner", "growth mindset", "curiosity", "self-taught"]
};

// Escape special regular-expression characters
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Check for a whole skill term rather than a partial word
function containsTerm(text, term) {
  const escaped = escapeRegex(term.toLowerCase());
  const pattern = new RegExp(`(^|[^a-z0-9+#.])${escaped}(?=$|[^a-z0-9+#.])`, "i");
  return pattern.test(text);
}

// Return skills whose keywords appear in the resume
function findSkillMatches(text, skillMap) {
  return Object.entries(skillMap)
    .filter(([, aliases]) => aliases.some((alias) => containsTerm(text, alias)))
    .map(([skill]) => skill);
}

// Analyze contact info, sections, numbers, action verbs
function auditResumeStructure(rawText) {
  const text = rawText.toLowerCase();

  // 1. Contact Information
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(rawText);
  const hasLinkedIn = /linkedin\.com\/in\/|linkedin/i.test(rawText);
  const hasGitHub = /github\.com\/|github/i.test(rawText);
  const hasPortfolio = /portfolio|behance|dribbble|vercel\.app|netlify\.app/i.test(rawText);

  // 2. Core Sections
  const hasEducation = /education|academic|b\.?tech|b\.?e|bachelor|master|university|college|cgpa|gpa/i.test(rawText);
  const hasExperienceOrProjects = /experience|employment|work history|projects|internship|academic projects/i.test(rawText);
  const hasSkillsSection = /skills|technical skills|technologies|proficiencies|competencies/i.test(rawText);
  const hasCertifications = /certifications|certificates|licenses|achievements/i.test(rawText);

  // 3. Measurable achievements & quantifiable metrics (%, $, numbers with k/m, X to Y)
  const metricMatches = rawText.match(/\b\d+(\.\d+)?%|\$\d+(,\d{3})*|\b\d{1,3}\+?\s*(users|clients|students|requests|stars|downloads|latency|ms|sec)\b/gi) || [];
  const metricsCount = metricMatches.length;

  // 4. Action verbs count
  const detectedActionVerbs = ACTION_VERBS.filter(verb => {
    const reg = new RegExp(`\\b${verb}\\b`, "i");
    return reg.test(text);
  });

  // 5. Word count & readability
  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Compute Structure Score out of 100
  let structureScore = 40;
  if (hasEmail) structureScore += 10;
  if (hasPhone) structureScore += 10;
  if (hasLinkedIn || hasGitHub) structureScore += 10;
  if (hasEducation) structureScore += 10;
  if (hasExperienceOrProjects) structureScore += 10;
  if (hasSkillsSection) structureScore += 10;
  structureScore = Math.min(100, structureScore);

  // Compute Content/Impact Score out of 100
  let impactScore = 50;
  if (metricsCount >= 3) impactScore += 20;
  else if (metricsCount >= 1) impactScore += 10;

  if (detectedActionVerbs.length >= 6) impactScore += 20;
  else if (detectedActionVerbs.length >= 3) impactScore += 10;

  if (wordCount >= 250 && wordCount <= 1200) impactScore += 10;
  impactScore = Math.min(100, impactScore);

  return {
    contactAudit: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      hasGitHub,
      hasPortfolio,
    },
    sectionsAudit: {
      hasEducation,
      hasExperienceOrProjects,
      hasSkillsSection,
      hasCertifications,
    },
    metricsCount,
    actionVerbsDetected: detectedActionVerbs,
    wordCount,
    structureScore,
    impactScore,
  };
}

// -------------------------------------------------------------
// GET /api/resume/roles - Returns all supported 40+ job roles
// -------------------------------------------------------------
router.get("/roles", (_req, res) => {
  return res.json({
    categories: JOB_CATEGORIES,
    roles: JOB_ROLES_LIST,
    rolesData: JOB_ROLES_DATA,
    totalRoles: JOB_ROLES_LIST.length,
  });
});

// -------------------------------------------------------------
// POST /api/resume/analyze - Core Resume Analysis Engine
// -------------------------------------------------------------
router.post(
  "/analyze",
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message: error.code === "LIMIT_FILE_SIZE"
            ? "Resume file size must be smaller than 10 MB."
            : error.message,
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      let extractedText = "";
      let fileName = "Uploaded Resume";

      // 1. Text extraction from uploaded file (PDF / DOCX / TXT)
      if (req.file) {
        fileName = req.file.originalname;
        const ext = path.extname(fileName).toLowerCase();

        if (ext === ".pdf") {
          const pdf = await pdfParse(req.file.buffer);
          extractedText = pdf.text || "";
        } else if (ext === ".docx") {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          extractedText = result.value || "";
        } else if (ext === ".txt") {
          extractedText = req.file.buffer.toString("utf-8");
        }
      } else if (req.body.resumeText && req.body.resumeText.trim()) {
        // Direct text submission fallback
        extractedText = req.body.resumeText;
        fileName = req.body.fileName || "Pasted Resume Text";
      }

      if (!extractedText || !extractedText.trim()) {
        return res.status(400).json({
          message: "Please upload a valid PDF or DOCX resume, or provide resume text.",
        });
      }

      // 2. Validate selected role
      const role = req.body.role || "Software Engineer (SDE)";
      const roleConfig = JOB_ROLES_DATA[role] || JOB_ROLES_DATA["Software Engineer (SDE)"];

      const text = extractedText.toLowerCase();
      const requiredSkillMap = roleConfig.technical;
      const requiredSkills = Object.keys(requiredSkillMap);

      // 3. Technical skill match analysis
      const matchedSkills = findSkillMatches(text, requiredSkillMap);
      const missingSkills = requiredSkills.filter((s) => !matchedSkills.includes(s));

      // 4. Additional bonus skills from other roles
      const allOtherSkillsMap = {};
      Object.entries(JOB_ROLES_DATA).forEach(([otherRole, data]) => {
        if (otherRole !== role) {
          Object.entries(data.technical).forEach(([skill, aliases]) => {
            if (!requiredSkills.includes(skill)) {
              allOtherSkillsMap[skill] = aliases;
            }
          });
        }
      });
      const additionalSkills = findSkillMatches(text, allOtherSkillsMap).slice(0, 8);

      // 5. Soft skills evaluation
      const detectedSoftSkills = findSkillMatches(text, SOFT_SKILLS_DICTIONARY);

      // 6. Resume formatting & structure audit
      const audit = auditResumeStructure(extractedText);

      // 7. Calculate overall scores
      const skillMatchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

      // Weighted ATS Score: 50% Skills Match, 25% Content/Impact, 25% Structure
      const overallAtsScore = Math.round(
        (skillMatchPercentage * 0.5) + (audit.impactScore * 0.25) + (audit.structureScore * 0.25)
      );

      // ATS Verdict Grade
      let atsRating = "Needs Revision";
      let ratingColor = "rose";
      if (overallAtsScore >= 80) {
        atsRating = "Excellent Match (High Interview Probability)";
        ratingColor = "emerald";
      } else if (overallAtsScore >= 68) {
        atsRating = "Strong Candidate (Competitive Profile)";
        ratingColor = "brand";
      } else if (overallAtsScore >= 50) {
        atsRating = "Moderate Fit (Recommended Skill Updates)";
        ratingColor = "amber";
      }

      // 8. Targeted Actionable Recommendations
      const recommendations = [];

      if (missingSkills.length > 0) {
        recommendations.push(
          `Prioritize learning and incorporating top missing role skills: ${missingSkills.slice(0, 4).join(", ")}.`
        );
      }

      if (audit.metricsCount < 3) {
        recommendations.push(
          "Quantify your project and work accomplishments using measurable metrics (e.g. 'Improved query performance by 35%', 'Served 2,000+ daily active users')."
        );
      }

      if (!audit.contactAudit.hasLinkedIn && !audit.contactAudit.hasGitHub) {
        recommendations.push(
          "Add clean, clickable links to your professional LinkedIn profile and active GitHub repositories."
        );
      }

      if (audit.actionVerbsDetected.length < 5) {
        recommendations.push(
          "Begin your project bullet points with strong technical action verbs (e.g. 'Architected', 'Implemented', 'Optimized', 'Automated')."
        );
      }

      if (!audit.sectionsAudit.hasEducation || !audit.sectionsAudit.hasSkillsSection) {
        recommendations.push(
          "Ensure standard ATS section headers ('Education', 'Technical Skills', 'Projects', 'Experience') are clearly labeled."
        );
      }

      recommendations.push(
        `Target the top certifications for ${role} like "${roleConfig.certifications[0]?.name || 'relevant industry certificates'}" to stand out to campus recruiters.`
      );

      return res.json({
        success: true,
        fileName,
        role,
        category: roleConfig.category,
        description: roleConfig.description,
        salaryRange: roleConfig.salaryRange,
        topCompanies: roleConfig.topCompanies,

        // Scoring metrics
        overallAtsScore,
        atsRating,
        ratingColor,
        skillMatchPercentage,
        structureScore: audit.structureScore,
        impactScore: audit.impactScore,

        // Skills breakdown
        totalRequired: requiredSkills.length,
        matchedSkillsCount: matchedSkills.length,
        missingSkillsCount: missingSkills.length,
        requiredSkills,
        matchedSkills,
        missingSkills,
        additionalSkills,
        detectedSoftSkills,
        expectedSoftSkills: roleConfig.soft,

        // Structural audit details
        auditDetails: {
          wordCount: audit.wordCount,
          actionVerbsFound: audit.actionVerbsDetected,
          actionVerbsCount: audit.actionVerbsDetected.length,
          metricsCount: audit.metricsCount,
          contactAudit: audit.contactAudit,
          sectionsAudit: audit.sectionsAudit,
        },

        // Career roadmap & learning resources
        recommendations,
        courses: roleConfig.courses || [],
        certifications: roleConfig.certifications || [],

        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Resume Analysis Error]", error);
      return res.status(500).json({
        message: "Failed to analyze resume. Please verify the document is a readable text PDF or DOCX file.",
        error: error.message,
      });
    }
  }
);

export default router;
