// api/auth/registerController.js
// Handles new user registration.
// Steps: validate input → check duplicate email → hash password → save user → return JWT

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/User.js';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
export async function registerController(req, res) {
  try {
    const { email, password } = req.body;

    // ── 1. Input validation ──────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      });
    }

    // ── 2. Duplicate email check ─────────────────────────────────────────────
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // ── 3. Hash password ─────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // ── 4. Create user ───────────────────────────────────────────────────────
    const newUser = await createUser(email, passwordHash);

    // ── 5. Issue JWT ─────────────────────────────────────────────────────────
    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: newUser.user_id, email: newUser.email, createdAt: newUser.created_at },
    });
  } catch (error) {
    console.error('[registerController] Error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}
