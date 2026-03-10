// api/server.js
// Express app — exported for Vercel serverless.
// Vercel handles the HTTP server; we just export the configured Express app.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// On Vercel, frontend + API share the same domain so CORS is handled automatically.
// CORS_ORIGIN env var lets you lock this down to your specific Vercel domain.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Export for Vercel (no app.listen needed) ──────────────────────────────────
export default app;
