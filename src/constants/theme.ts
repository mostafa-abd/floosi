export const sharedTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  }
};

export const lightTheme = {
  ...sharedTheme,
  colors: {
    primary: '#6366f1', // Indigo
    secondary: '#94a3b8', // Slate
    success: '#22c55e', // Green
    danger: '#ef4444', // Red
    background: '#f8fafc', // Light background
    card: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    tabBarBackground: 'rgba(255, 255, 255, 0.8)',
  },
};

export const darkTheme = {
  ...sharedTheme,
  colors: {
    primary: '#818cf8', // Lighter Indigo for Dark mode
    secondary: '#cbd5e1', 
    success: '#4ade80', 
    danger: '#f87171', 
    background: '#0f172a', // Dark background (Slate 900)
    card: '#1e293b', // Dark card (Slate 800)
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    tabBarBackground: 'rgba(30, 41, 59, 0.8)',
  },
};

// Fallback for types or places not yet refactored to use dynamic theme hook
export const theme = lightTheme;

export type Theme = typeof lightTheme;
