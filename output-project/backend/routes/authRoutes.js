// backend/routes/authRoutes.js
// Mounts all authentication-related endpoints under /api/auth

import express from 'express';
import { loginController } from '../auth/loginController.js';
import { registerController } from '../auth/registerController.js';
import { requireAuth } from '../auth/authMiddleware.js';

const router = express.Router();

// ── Public routes (no token required) ───────────────────────────────────────

/**
 * POST /api/auth/register
 * Register a new user account.
 * Body: { email: string, password: string }
 */
router.post('/register', registerController);

/**
 * POST /api/auth/login
 * Authenticate an existing user and receive a JWT.
 * Body: { email: string, password: string }
 */
router.post('/login', loginController);

// ── Protected routes (valid JWT required) ───────────────────────────────────

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Useful for the frontend to verify a stored token is still valid.
 */
router.get('/me', requireAuth, (req, res) => {
  // req.user is set by requireAuth middleware: { userId, email, iat, exp }
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
    },
  });
});

export default router;
