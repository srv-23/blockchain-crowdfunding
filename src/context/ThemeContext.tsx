import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
};

const themes: Theme[] = [
  {
    name: 'default',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      background: '#F3F4F6',
      card: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    }
  },
  {
    name: 'dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#818CF8',
      accent: '#A78BFA',
      background: '#111827',
      card: '#1F2937',
      text: '#F9FAFB',
      border: '#374151',
      success: '#34D399',
      error: '#F87171',
      warning: '#FBBF24',
      info: '#60A5FA'
    }
  },
  {
    name: 'nature',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#ECFDF5',
      card: '#FFFFFF',
      text: '#064E3B',
      border: '#D1FAE5',
      success: '#059669',
      error: '#DC2626',
      warning: '#D97706',
      info: '#0891B2'
    }
  },
  {
    name: 'sunset',
    colors: {
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#FDBA74',
      background: '#FFF7ED',
      card: '#FFFFFF',
      text: '#7C2D12',
      border: '#FFEDD5',
      success: '#16A34A',
      error: '#DC2626',
      warning: '#D97706',
      info: '#0284C7'
    }
  },
  {
    name: 'ocean',
    colors: {
      primary: '#0284C7',
      secondary: '#0EA5E9',
      accent: '#38BDF8',
      background: '#F0F9FF',
      card: '#FFFFFF',
      text: '#0C4A6E',
      border: '#E0F2FE',
      success: '#059669',
      error: '#DC2626',
      warning: '#D97706',
      info: '#0284C7'
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return themes.find(t => t.name === savedTheme) || themes[0];
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    document.documentElement.style.setProperty('--color-accent', currentTheme.colors.accent);
    document.documentElement.style.setProperty('--color-background', currentTheme.colors.background);
    document.documentElement.style.setProperty('--color-card', currentTheme.colors.card);
    document.documentElement.style.setProperty('--color-text', currentTheme.colors.text);
    document.documentElement.style.setProperty('--color-border', currentTheme.colors.border);
    document.documentElement.style.setProperty('--color-success', currentTheme.colors.success);
    document.documentElement.style.setProperty('--color-error', currentTheme.colors.error);
    document.documentElement.style.setProperty('--color-warning', currentTheme.colors.warning);
    document.documentElement.style.setProperty('--color-info', currentTheme.colors.info);
    
    localStorage.setItem('theme', currentTheme.name);
  }, [currentTheme]);

  const setTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 