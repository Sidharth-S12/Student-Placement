export const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";

export const initialStudentData = {
  personalInfo: {
    fullName: "Aarav Sharma",
    headline: "Computer Science & Engineering Student | Aspiring Full-Stack Software Engineer",
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    email: "aarav.sharma2025@college.edu",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka, India",
    summary: "Motivated Final Year B.Tech Computer Science student with strong fundamentals in Data Structures, Algorithms, Full-Stack Web Development, and Cloud Technologies. Proven track record in building scalable React/Node.js web applications, winning national hackathons, and completing software engineering internships. Seeking a Software Development Engineer (SDE) position in a high-growth technology team."
  },

  placementScores: {
    overallReadiness: 92,
    technicalScore: 88,
    aptitudeScore: 85,
    communicationScore: 94
  },

  education: {
    tenthPercentage: "95.4%",
    tenthBoard: "CBSE (Delhi Public School)",
    tenthYear: "2019",
    twelfthPercentage: "93.8%",
    twelfthBoard: "CBSE (PCMB)",
    twelfthYear: "2021",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering",
    college: "National Institute of Technology, Karnataka",
    cgpa: "8.92 / 10.0",
    graduationYear: "2025"
  },

  professionalLinks: {
    linkedin: "https://linkedin.com/in/aarav-sharma-dev",
    github: "https://github.com/aaravsharma-code",
    portfolio: "https://aaravsharma.dev"
  },

  technicalSkills: {
    programmingLanguages: [
      { name: "Java", level: "Advanced" },
      { name: "JavaScript (ES6+)", level: "Advanced" },
      { name: "TypeScript", level: "Intermediate" },
      { name: "Python", level: "Intermediate" },
      { name: "C++", level: "Proficient" },
      { name: "SQL", level: "Advanced" }
    ],
    frameworks: [
      { name: "React.js", level: "Advanced" },
      { name: "Next.js", level: "Intermediate" },
      { name: "Node.js & Express.js", level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "Spring Boot", level: "Basic" }
    ],
    databases: [
      { name: "PostgreSQL", level: "Advanced" },
      { name: "MongoDB", level: "Advanced" },
      { name: "Redis", level: "Intermediate" },
      { name: "MySQL", level: "Proficient" }
    ],
    toolsTechnologies: [
      { name: "Git & GitHub", level: "Advanced" },
      { name: "Docker", level: "Intermediate" },
      { name: "AWS (S3, EC2)", level: "Intermediate" },
      { name: "Postman API", level: "Advanced" },
      { name: "RESTful APIs", level: "Advanced" },
      { name: "Vite & Webpack", level: "Proficient" }
    ]
  },

  projects: [
    {
      id: "proj-1",
      name: "SkillGraph - Student Skill Assessment & Readiness System",
      description: "A comprehensive platform enabling students to assess code efficiency, take mock technical interviews, and track placement metrics in real-time.",
      technologies: ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Recharts"],
      projectLink: "https://skillgraph-demo.vercel.app",
      githubLink: "https://github.com/aaravsharma-code/skillgraph-system",
      highlights: [
        "Architected JWT-backed role authentication supporting 1,500+ student profiles.",
        "Implemented real-time progress metrics with chart visualizations rendering in <100ms.",
        "Integrated automated test runner executing code snippets in sandboxed Docker containers."
      ]
    },
    {
      id: "proj-2",
      name: "MediPulse - Smart Hospital Resource & Bed Tracking System",
      description: "IoT-integrated dashboard monitoring ICU bed availability, oxygen levels, and queue wait-times across municipal hospital networks.",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "Socket.io", "Tailwind CSS"],
      projectLink: "https://medipulse-health.vercel.app",
      githubLink: "https://github.com/aaravsharma-code/medipulse-tracker",
      highlights: [
        "Built WebSockets server handling 2,000+ live state sync events per minute.",
        "Optimized database indexing in PostgreSQL, reducing query execution time by 45%.",
        "Winner of National Smart Health Hackathon 2024 out of 180 participating teams."
      ]
    },
    {
      id: "proj-3",
      name: "DevDocs AI - Contextual API Documentation Search",
      description: "Blazing fast semantic search engine for developer API documentation using vector embeddings and hybrid fuzzy matching.",
      technologies: ["Python", "FastAPI", "React", "Pinecone Vector DB", "Tailwind CSS"],
      projectLink: "https://devdocs-ai.vercel.app",
      githubLink: "https://github.com/aaravsharma-code/devdocs-ai",
      highlights: [
        "Ingested over 50,000 documentation pages with sub-second retrieval times.",
        "Designed clean, keyboard-navigable command palette UI matching Raycast style."
      ]
    }
  ],

  experience: [
    {
      id: "exp-1",
      role: "Software Engineering Intern",
      organization: "Acme Tech Solutions (Cloud Infra Team)",
      duration: "May 2024 - July 2024 (3 Months)",
      location: "Bengaluru, India (On-site)",
      description: "Contributed to core microservices architecture and client dashboard performance.",
      responsibilities: [
        "Refactored legacy React frontend modules to TypeScript, boosting overall code coverage from 62% to 88%.",
        "Developed automated REST API integration test suite using Jest and Supertest, catching 14 edge-case bugs prior to production release.",
        "Collaborated with 6 senior engineers in Agile sprints, reviewing 30+ pull requests and authoring technical documentation."
      ]
    },
    {
      id: "exp-2",
      role: "Full-Stack Developer Intern",
      organization: "Nexus Digital Labs",
      duration: "Dec 2023 - Feb 2024 (3 Months)",
      location: "Remote",
      description: "Built client portal user interfaces and automated reporting features.",
      responsibilities: [
        "Implemented responsive UI components using Tailwind CSS and React, improving lighthouse performance score to 96.",
        "Constructed Node.js background worker routines to export monthly CSV/PDF analytics reports."
      ]
    }
  ],

  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer – Associate",
      organization: "Amazon Web Services",
      date: "August 2024",
      credentialId: "AWS-DEV-9843102",
      certificateLink: "https://aws.amazon.com/verification/AWS-DEV-9843102"
    },
    {
      id: "cert-2",
      name: "Meta Front-End Developer Professional Certificate",
      organization: "Meta (Coursera)",
      date: "January 2024",
      credentialId: "META-FE-450198",
      certificateLink: "https://coursera.org/verify/META-FE-450198"
    },
    {
      id: "cert-3",
      name: "Data Structures & Algorithms in Java Specialization",
      organization: "University of California, San Diego",
      date: "September 2023",
      credentialId: "UCSD-DSA-77812",
      certificateLink: "https://coursera.org/verify/UCSD-DSA-77812"
    }
  ],

  achievements: [
    {
      id: "ach-1",
      title: "1st Rank & Winner - National Smart Health Hackathon 2024",
      category: "Hackathon",
      organization: "Ministry of Electronics & IT",
      date: "March 2024",
      description: "Secured 1st place among 180+ teams nationwide for developing MediPulse IoT tracking platform. Awarded ₹1,00,000 cash prize."
    },
    {
      id: "ach-2",
      title: "Institute Merit Scholarship Recipient",
      category: "Academic",
      organization: "NIT Karnataka",
      date: "Academic Year 2023-2024",
      description: "Awarded top 5% academic performance scholarship for maintaining CGPA > 8.8 across consecutive semesters."
    },
    {
      id: "ach-3",
      title: "Knight Rank on LeetCode (Rating 1940+)",
      category: "Competition",
      organization: "LeetCode",
      date: "Ongoing",
      description: "Solved 600+ algorithmic problems across Data Structures, Dynamic Programming, and Graph Algorithms."
    },
    {
      id: "ach-4",
      title: "Finalist - Google Developer Student Clubs Solution Challenge",
      category: "Competition",
      organization: "Google Developers",
      date: "May 2023",
      description: "Recognized among top 100 global submissions for building open-source educational accessibility tool."
    }
  ]
};
