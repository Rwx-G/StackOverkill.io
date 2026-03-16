import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { scoreRouter } from './routes/score.js';
import { leaderboardRouter } from './routes/leaderboard.js';
import { ogRouter } from './routes/og.js';
import { healthRouter } from './routes/health.js';
import { badgeRouter } from './routes/badge.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing (5MB limit for OG image uploads)
app.use(express.json({ limit: '5mb' }));

// Request logging
app.use(logger);

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/score', scoreRouter);
app.use('/api/v1/leaderboard', leaderboardRouter);
app.use('/api/v1/og', ogRouter);
app.use('/api/v1/badge', badgeRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/v1`);
});

export default app;
// Force reload
