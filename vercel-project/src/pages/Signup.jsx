// src/pages/Signup.jsx
// Registration page — email + password (with confirmation) form.
// Validates client-side then calls AuthContext.register()

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

// Password requirement rules displayed in real time
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Contains a letter', test: (p) => /[a-zA-Z]/.test(p) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup({ darkMode }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // ── Derived validation ─────────────────────────────────────────────────────
  const emailValid = EMAIL_REGEX.test(email);
  const passwordRulesPassed = PASSWORD_RULES.map((r) => r.test(password));
  const allPasswordRulesPass = passwordRulesPassed.every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // ── Submit handler ─────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (!emailValid) { setError('Please enter a valid email address.'); return; }
    if (!allPasswordRulesPass) { setError('Please meet all password requirements.'); return; }
    if (!passwordsMatch) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const result = await register(email.trim(), password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Shared classes ─────────────────────────────────────────────────────────
  const inputBase = `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none focus:ring-2 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-rose-500 focus:ring-rose-500/30'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-rose-400 focus:ring-rose-400/20'
  }`;

  const labelClass = `block text-xs font-semibold uppercase tracking-wide mb-1 ${
    darkMode ? 'text-gray-300' : 'text-gray-600'
  }`;

  return (
    <AuthForm
      title="Create your account"
      subtitle="Start organizing your tasks and notes today"
      darkMode={darkMode}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* ── Error banner ──────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Email ─────────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`${inputBase} ${touched.email && !emailValid && email ? 'border-red-400 focus:border-red-400 focus:ring-red-300/30' : ''}`}
            disabled={loading}
          />
          {touched.email && email && !emailValid && (
            <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
          )}
        </div>

        {/* ── Password ──────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={`${inputBase} pr-11`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password rules checklist */}
          {(touched.password || password) && (
            <ul className="mt-2 space-y-1">
              {PASSWORD_RULES.map((rule, i) => (
                <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${passwordRulesPassed[i] ? 'text-emerald-600' : darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  {passwordRulesPassed[i]
                    ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    : <XCircle className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />}
                  {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Confirm Password ──────────────────────────────────────────────── */}
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBase} pr-11 ${
                confirmPassword && !passwordsMatch ? 'border-red-400 focus:border-red-400 focus:ring-red-300/30' : ''
              } ${confirmPassword && passwordsMatch ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-300/30' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
          )}
          {confirmPassword && passwordsMatch && (
            <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Passwords match
            </p>
          )}
        </div>

        {/* ── Submit button ─────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white font-semibold text-sm shadow-lg hover:shadow-rose-300/50 hover:from-rose-700 hover:to-pink-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        {/* ── Login link ────────────────────────────────────────────────────── */}
        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthForm>
  );
}
