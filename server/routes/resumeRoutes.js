
import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import path from "path";

const router = express.Router();

// Configure resume upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },
  fileFilter: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf" || ext === ".docx") {
      return callback(null, true);
    }

    callback(new Error("Upload a PDF or DOCX resume."));
  },
});

// Required skills for each job role
const ROLE_SKILLS = {
  "Data Analyst": {
    Python: ["python"],
    SQL: ["sql", "mysql", "postgresql", "sqlite"],
    Excel: ["excel", "spreadsheets", "vlookup", "pivot table"],
    Statistics: [
      "statistics",
      "statistical analysis",
      "hypothesis testing",
    ],
    "Data Cleaning": [
      "data cleaning",
      "data cleansing",
      "data preprocessing",
    ],
    "Data Visualization": [
      "data visualization",
      "visualization",
      "matplotlib",
      "seaborn",
    ],
    "Power BI": ["power bi", "powerbi"],
    Tableau: ["tableau"],
    Pandas: ["pandas"],
    "Machine Learning": [
      "machine learning",
      "scikit-learn",
      "sklearn",
    ],
  },

  "Software Engineer": {
    Python: ["python"],
    Java: ["java"],
    JavaScript: ["javascript", "js"],
    "Data Structures": ["data structures", "dsa"],
    Algorithms: ["algorithms", "algorithm design"],
    Git: ["git", "github", "gitlab"],
    SQL: ["sql", "mysql", "postgresql"],
    OOP: ["object-oriented programming", "oop"],
    Testing: ["unit testing", "software testing", "jest", "pytest"],
    APIs: ["api", "apis", "rest api", "restful"],
  },

  "Machine Learning Engineer": {
    Python: ["python"],
    "Machine Learning": [
      "machine learning",
      "scikit-learn",
      "sklearn",
    ],
    Statistics: ["statistics", "statistical modeling"],
    "Linear Algebra": ["linear algebra"],
    Pandas: ["pandas"],
    NumPy: ["numpy"],
    TensorFlow: ["tensorflow"],
    PyTorch: ["pytorch"],
    "Model Evaluation": [
      "model evaluation",
      "precision",
      "recall",
      "f1 score",
    ],
    SQL: ["sql", "mysql", "postgresql"],
  },

  "Full Stack Developer": {
    HTML: ["html", "html5"],
    CSS: ["css", "css3"],
    JavaScript: ["javascript", "js"],
    React: ["react", "react.js", "reactjs"],
    "Node.js": ["node.js", "nodejs"],
    Express: ["express", "express.js"],
    SQL: ["sql", "mysql", "postgresql"],
    MongoDB: ["mongodb", "mongo db"],
    Git: ["git", "github", "gitlab"],
    APIs: ["api", "apis", "rest api", "restful"],
  },

  "Cloud Engineer": {
    "Cloud Computing": ["cloud computing", "cloud"],
    AWS: ["aws", "amazon web services"],
    Azure: ["azure", "microsoft azure"],
    "Google Cloud": ["google cloud", "gcp"],
    Linux: ["linux", "ubuntu"],
    Docker: ["docker", "containerization"],
    Kubernetes: ["kubernetes", "k8s"],
    Networking: ["networking", "tcp/ip", "dns"],
    Git: ["git", "github"],
    "CI/CD": [
      "ci/cd",
      "continuous integration",
      "continuous deployment",
    ],
  },

  "Cybersecurity Analyst": {
    Networking: ["networking", "tcp/ip", "dns"],
    Linux: ["linux", "ubuntu", "kali linux"],
    "Network Security": ["network security", "firewall", "firewalls"],
    SIEM: [
      "siem",
      "splunk",
      "security information and event management",
    ],
    "Incident Response": ["incident response", "incident handling"],
    "Vulnerability Assessment": [
      "vulnerability assessment",
      "vulnerability scanning",
    ],
    "Penetration Testing": [
      "penetration testing",
      "pentesting",
      "ethical hacking",
    ],
    Cryptography: ["cryptography", "encryption"],
    Python: ["python"],
    "Security Monitoring": [
      "security monitoring",
      "threat monitoring",
    ],
  },

  "UI/UX Designer": {
    Figma: ["figma"],
    Wireframing: ["wireframing", "wireframes"],
    Prototyping: ["prototyping", "prototypes"],
    "User Research": ["user research", "user interviews"],
    "Usability Testing": ["usability testing", "user testing"],
    "Visual Design": ["visual design", "visual hierarchy"],
    "Interaction Design": ["interaction design"],
    Accessibility: ["accessibility", "wcag"],
    "Information Architecture": ["information architecture"],
    "Design Systems": ["design system", "design systems"],
  },
};

// Collect all unique skills across the supported job roles
const ALL_SKILLS = [
  ...new Set(
    Object.values(ROLE_SKILLS).flatMap((skills) =>
      Object.keys(skills)
    )
  ),
];

// Escape special regular-expression characters
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Check for a whole skill term rather than a partial word
function containsTerm(text, term) {
  const escaped = escapeRegex(term.toLowerCase());

  const pattern = new RegExp(
    `(^|[^a-z0-9+#.])${escaped}(?=$|[^a-z0-9+#.])`,
    "i"
  );

  return pattern.test(text);
}

// Return skills whose keywords appear in the resume
function findSkillMatches(text, skillMap) {
  return Object.entries(skillMap)
    .filter(([, aliases]) =>
      aliases.some((alias) => containsTerm(text, alias))
    )
    .map(([skill]) => skill);
}

// Analyze an uploaded resume
router.post(
  "/analyze",
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error) {
        const status = error instanceof multer.MulterError ? 400 : 400;

        return res.status(status).json({
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Resume must be smaller than 5 MB."
              : error.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a PDF or DOCX resume.",
        });
      }

      const role = req.body.role;

      if (!ROLE_SKILLS[role]) {
        return res.status(400).json({
          message: "Please select a supported job role.",
        });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      let extractedText = "";

      // Extract text from PDF
      if (ext === ".pdf") {
        const pdf = await pdfParse(req.file.buffer);
        extractedText = pdf.text || "";
      }

      // Extract text from DOCX
      if (ext === ".docx") {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });

        extractedText = result.value || "";
      }

      if (!extractedText.trim()) {
        return res.status(422).json({
          message:
            "No readable text was found. Try a text-based PDF or DOCX resume.",
        });
      }

      const text = extractedText.toLowerCase();
      const requiredSkillMap = ROLE_SKILLS[role];
      const requiredSkills = Object.keys(requiredSkillMap);

      // Skills required by the selected role and found in the resume
      const matchedSkills = findSkillMatches(
        text,
        requiredSkillMap
      );

      // Required skills that were not detected
      const missingSkills = requiredSkills.filter(
        (skill) => !matchedSkills.includes(skill)
      );

      // Skills detected from other supported job-role dictionaries
      const additionalSkillMap = Object.fromEntries(
        ALL_SKILLS
          .filter((skill) => !requiredSkills.includes(skill))
          .map((skill) => [
            skill,
            Object.values(ROLE_SKILLS).flatMap(
              (skills) => skills[skill] || []
            ),
          ])
      );

      const additionalSkills = findSkillMatches(
        text,
        additionalSkillMap
      );

      const matchPercentage = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
      );

      return res.json({
        fileName: req.file.originalname,
        role,
        matchPercentage,
        requiredSkills,
        matchedSkills,
        missingSkills,
        additionalSkills,
        totalRequired: requiredSkills.length,
        resumeTextLength: extractedText.length,
        note:
          "Skills are detected from resume text using keywords. A skill may be present but not detected if different wording is used.",
      });
    } catch (error) {
      console.error("Resume analysis error:", error);

      return res.status(500).json({
        message:
          "Could not analyze the resume. Check that the file is a valid PDF or DOCX.",
      });
    }
  }
);

export default router;
