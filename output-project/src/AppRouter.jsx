// src/AppRouter.jsx
// Top-level router that gates the existing App behind authentication.
// This file is the ONLY new addition that wraps the existing App component.
// App.jsx itself is NOT modified.

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

// ── Loading spinner shown while auth token is being validated ────────────────
function SplashLoader({ darkMode }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
          <svg
            className="w-7 h-7 text-white"
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
        <p
          className={`text-sm font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Loading…
        </p>
      </div>
    </div>
  );
}

// ── Protected route: redirect to /login if not authenticated ─────────────────
function ProtectedRoute({ children, darkMode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <SplashLoader darkMode={darkMode} />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// ── Public route: redirect to / if already authenticated ─────────────────────
function PublicOnlyRoute({ children, darkMode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <SplashLoader darkMode={darkMode} />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

// ── Root router ───────────────────────────────────────────────────────────────
export default function AppRouter() {
  // Read darkMode from localStorage to match App.jsx's own useLocalStorage call
  const [darkMode] = useLocalStorage('darkMode', false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Auth pages (only accessible when logged OUT) ────────────── */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute darkMode={darkMode}>
                <Login darkMode={darkMode} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute darkMode={darkMode}>
                <Signup darkMode={darkMode} />
              </PublicOnlyRoute>
            }
          />

          {/* ── Main app (only accessible when logged IN) ───────────────── */}
          <Route
            path="/*"
            element={
              <ProtectedRoute darkMode={darkMode}>
                <AppWithLogout darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// ── Thin wrapper that injects a Logout button into the existing App navbar ───
// We do this by rendering the App as-is plus a portal-style overlay button.
// This avoids touching App.jsx at all.
function AppWithLogout({ darkMode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="relative">
      {/* ── Logout / user badge ── injected as a fixed overlay ───────────── */}
      <div
        className="fixed top-4 right-4 z-50 flex items-center gap-2"
        style={{ pointerEvents: 'none' }}
      >
        {/* User email badge */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            darkMode
              ? 'bg-gray-800/90 border-gray-700 text-gray-300'
              : 'bg-white/90 border-gray-200 text-gray-600'
          } backdrop-blur-sm shadow-sm`}
          style={{ pointerEvents: 'auto' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          {user?.email}
        </span>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{ pointerEvents: 'auto' }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 shadow-sm ${
            darkMode
              ? 'bg-gray-800/90 border-gray-700 text-rose-400 hover:bg-rose-900/40 hover:border-rose-700'
              : 'bg-white/90 border-gray-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
          } backdrop-blur-sm`}
          title="Sign out"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Sign out
        </button>
      </div>

      {/* ── The original, unmodified App ──────────────────────────────────── */}
      <App />
    </div>
  );
}

