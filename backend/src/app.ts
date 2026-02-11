import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import uploadRoutes from './routes/uploadRoutes';
import pdfRoutes from './routes/pdfRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading images from different origins (or same origin with helmet)
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for HTML payload

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pdf', pdfRoutes);

export default app;
