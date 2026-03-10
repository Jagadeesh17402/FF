// src/contexts/AuthContext.jsx
// Provides authentication state and helpers to the entire React tree.
// Persists the JWT in localStorage and validates it on app load.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// On Vercel, API and frontend share the same domain so /api works directly.
// Locally set VITE_API_URL=http://localhost:5000/api in your .env file.
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true); // validating token on mount

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Persist auth data to localStorage and state */
  const saveAuth = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  /** Clear all auth data */
  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // ── Validate stored token on app mount ────────────────────────────────────
  useEffect(() => {
    async function validateToken() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid / expired
          clearAuth();
        }
      } catch {
        // Network error — keep stored user rather than logging them out
        // They'll get an error when they try to use the app
      } finally {
        setLoading(false);
      }
    }
    validateToken();
  }, [clearAuth]);

  // ── Auth actions ───────────────────────────────────────────────────────────

  /**
   * Register a new account.
   * @returns {{ success: boolean, message: string }}
   */
  const register = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      saveAuth(data.token, data.user);
    }
    return { success: data.success, message: data.message };
  }, [saveAuth]);

  /**
   * Log in with existing credentials.
   * @returns {{ success: boolean, message: string }}
   */
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      saveAuth(data.token, data.user);
    }
    return { success: data.success, message: data.message };
  }, [saveAuth]);

  /** Log out and clear all auth state */
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // ── Context value ──────────────────────────────────────────────────────────
  const value = {
    user,          // { id, email, createdAt } | null
    token,         // JWT string | null
    loading,       // true while validating token on mount
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook to consume auth context */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
