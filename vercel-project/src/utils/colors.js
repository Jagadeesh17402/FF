// Color palette based on the provided image
export const colors = {
  // Primary burgundy/wine colors
  wine: {
    900: '#76113b', // Darkest wine
    800: '#a33353', // Medium wine  
    700: '#c96378', // Light wine
    600: '#e49aaf', // Lightest wine
    500: '#edbec8', // Very light pink
  },
  
  // Neutral colors for light mode
  neutral: {
    50: '#fefefe',
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  
  // Dark mode colors
  dark: {
    50: '#f8f9fa',
    100: '#343a40',
    200: '#495057',
    300: '#6c757d',
    400: '#adb5bd',
    500: '#ced4da',
    600: '#dee2e6',
    700: '#e9ecef',
    800: '#f8f9fa',
    900: '#ffffff',
  },
  
  // Status colors that complement the wine theme
  status: {
    success: '#2d5016', // Dark green
    warning: '#8b4513', // Brown
    error: '#8b1538', // Dark red-wine
    info: '#76113b', // Main wine color
  },
  
  // Priority colors
  priority: {
    high: '#8b1538',
    medium: '#c96378', 
    low: '#2d5016',
  }
};

// Utility functions for color management
export const getStatusColor = (status) => colors.status[status] || colors.wine[700];
export const getPriorityColor = (priority) => colors.priority[priority] || colors.wine[700];

// Theme variants
export const lightTheme = {
  background: colors.neutral[50],
  surface: colors.neutral[100],
  surfaceHover: colors.neutral[200],
  text: colors.neutral[900],
  textSecondary: colors.neutral[600],
  border: colors.neutral[300],
  primary: colors.wine[800],
  primaryHover: colors.wine[900],
  accent: colors.wine[700],
};

export const darkTheme = {
  background: colors.neutral[900],
  surface: colors.neutral[800],
  surfaceHover: colors.neutral[700],
  text: colors.neutral[50],
  textSecondary: colors.neutral[400],
  border: colors.neutral[700],
  primary: colors.wine[700],
  primaryHover: colors.wine[600],
  accent: colors.wine[800],
};