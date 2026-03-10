import React, { createContext, useContext, useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../utils/colors.js';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-primary', theme.background);
    document.documentElement.style.setProperty('--bg-surface', theme.surface);
    document.documentElement.style.setProperty('--text-primary', theme.text);
    document.documentElement.style.setProperty('--text-secondary', theme.textSecondary);
    document.documentElement.style.setProperty('--border-color', theme.border);
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    
    // Update body class for Tailwind dark mode
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme, isDark]);

  const value = {
    isDark,
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};