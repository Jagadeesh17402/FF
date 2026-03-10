// backend/server.js
// Express server entry point.
// Loads environment variables, configures middleware, and mounts routes.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ────────────────────────────────────────────────────────

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded form bodies
app.use(express.urlencoded({ extended: true }));

// CORS — allow requests from the Vite dev server and configured origins
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Routes ───────────────────────────────────────────────────────────────────

// Health check — useful for deployment probes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Auth server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   Login:    POST http://localhost:${PORT}/api/auth/login`);
});

export default app;
