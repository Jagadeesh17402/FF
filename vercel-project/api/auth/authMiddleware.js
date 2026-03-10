// backend/auth/authMiddleware.js
// Express middleware that validates JWT tokens on protected routes.
// Attach the decoded user payload to req.user so downstream handlers can use it.

import jwt from 'jsonwebtoken';

/**
 * Middleware: requireAuth
 * Expects an Authorization header of the form:  Bearer <token>
 * Responds 401 if the token is missing or invalid.
 */
export function requireAuth(req, res, next) {
  try {
    // ── 1. Extract token from Authorization header ──────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // ── 2. Verify & decode ──────────────────────────────────────────────────
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[authMiddleware] JWT_SECRET is not defined in environment');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
      });
    }

    const decoded = jwt.verify(token, secret);

    // ── 3. Attach user info to request ──────────────────────────────────────
    // decoded contains: { userId, email, iat, exp }
    req.user = decoded;

    next();
  } catch (error) {
    // Handle specific JWT errors for clearer client feedback
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
        code: 'INVALID_TOKEN',
      });
    }

    // Generic error fallback
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
}
