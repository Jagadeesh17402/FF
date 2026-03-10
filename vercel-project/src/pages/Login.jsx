// src/pages/Login.jsx
// Login page — email + password form that calls AuthContext.login()
// On success, navigation is handled by the router in main.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

export default function Login({ darkMode }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Submit handler ─────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Basic client-side presence check
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Shared input classes ───────────────────────────────────────────────────
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
      title="Welcome back"
      subtitle="Sign in to access your tasks and notes"
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
            className={inputBase}
            disabled={loading}
          />
        </div>

        {/* ── Password ──────────────────────────────────────────────────────── */}
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <LogIn className="w-4 h-4" />
          )}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className={`relative my-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className={`px-3 ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`}>
              or
            </span>
          </div>
        </div>

        {/* ── Sign up link ──────────────────────────────────────────────────── */}
        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2 transition-colors"
          >
            Create one free
          </Link>
        </p>
      </form>
    </AuthForm>
  );
}
