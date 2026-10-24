
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";

import assessmentRoutes from "./routes/assessmentRoutes.js";
import aptitudeRoutes from "./routes/aptitudeRoutes.js";
import communicationRoutes from "./routes/communicationRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

// Use the configured port or default to 5000
const PORT = Number(
  process.env.TEST_PORT || process.env.PORT || 5000
);

// CORS: allow requests from the frontend
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Log requests in the terminal
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "Technical Assessment Backend API",
    port: PORT,
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Register existing application routes
app.use("/api/technical-assessment", assessmentRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/students", studentRoutes);

// Resume Analyzer route
app.use("/api/resume", resumeRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api", applicationRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Backend Error]", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log("=======================================================");
  console.log(`Resume Analyzer and Assessment Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Resume endpoint: http://localhost:${PORT}/api/resume/analyze`);
  console.log(
    `Groq API key configured: ${Boolean(process.env.GROQ_API_KEY)}`
  );
  console.log("=======================================================");
});

export default app;
