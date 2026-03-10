// src/components/auth/AuthForm.jsx
// Shared form shell used by both Login and Signup pages.
// Renders the card wrapper, logo, title, and any children (fields + buttons).

import React from 'react';

/**
 * AuthForm
 * @param {object}  props
 * @param {string}  props.title        – Heading text (e.g. "Welcome back")
 * @param {string}  props.subtitle     – Sub-heading text
 * @param {boolean} props.darkMode     – Inherit dark mode from app state
 * @param {React.ReactNode} props.children
 */
export default function AuthForm({ title, subtitle, darkMode, children }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-300 ${
        darkMode
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50'
      }`}
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* ── Card ─────────────────────────────────────────────────────────── */}
        <div
          className={`rounded-3xl shadow-2xl p-8 transition-all duration-300 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white/90 backdrop-blur-xl border border-white/60'
          }`}
        >
          {/* ── Logo / Brand ──────────────────────────────────────────────── */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center shadow-lg mb-4">
              {/* Checkmark icon representing tasks */}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-700 via-rose-500 to-pink-400 bg-clip-text text-transparent text-center">
              Tasks &amp; Notes
            </h1>

            <p
              className={`mt-2 text-sm text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {subtitle}
            </p>
          </div>

          {/* ── Form heading ──────────────────────────────────────────────── */}
          <h2
            className={`text-xl font-semibold mb-6 text-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            {title}
          </h2>

          {/* ── Slot for fields and actions ───────────────────────────────── */}
          {children}
        </div>
      </div>
    </div>
  );
}
