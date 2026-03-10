// backend/auth/loginController.js
// Handles user login.
// Steps: validate input → find user → compare password → issue JWT

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/User.js';

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // ── 1. Basic input presence check ───────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // ── 2. Look up user by email ────────────────────────────────────────────
    const user = findUserByEmail(email);

    // Use a generic error message to avoid leaking which field is wrong
    // (prevents user enumeration attacks)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── 3. Compare submitted password against stored hash ──────────────────
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── 4. Issue JWT ────────────────────────────────────────────────────────
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('[loginController] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
}
