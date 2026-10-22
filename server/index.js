import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or workspace root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import assessmentRoutes from './routes/assessmentRoutes.js';
import aptitudeRoutes from './routes/aptitudeRoutes.js';
import communicationRoutes from './routes/communicationRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

const app = express();
const PORT = process.env.TEST_PORT || process.env.PORT || 5000;

// Enable CORS for React frontend (Vite default is 3000 or 5173)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Technical & Aptitude Assessment Backend API',
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/technical-assessment', assessmentRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', applicationRoutes);

// Global Error Handler - Clean response, never leaks credentials or raw stack
app.use((err, req, res, next) => {
  console.error('[Backend Global Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Technical Assessment Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Groq Key Configured: ${process.env.GROQ_API_KEY ? 'YES (Valid)' : 'NO (Add to server/.env)'}`);
  console.log(`=======================================================`);
});

export default app;
