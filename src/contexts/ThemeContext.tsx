import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeType } from '../types';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

const defaultThemeColors = {
  calm: {
    primary: 'bg-blue-500',
    secondary: 'bg-teal-400',
    accent: 'bg-purple-500',
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-800',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
  },
  vibrant: {
    primary: 'bg-indigo-600',
    secondary: 'bg-pink-500',
    accent: 'bg-amber-500',
    background: 'bg-indigo-50',
    card: 'bg-white',
    text: 'text-indigo-900',
    textSecondary: 'text-indigo-600',
    border: 'border-indigo-100',
  },
  minimal: {
    primary: 'bg-gray-800',
    secondary: 'bg-gray-600',
    accent: 'bg-gray-400',
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-800',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
  },
  dark: {
    primary: 'bg-indigo-500',
    secondary: 'bg-teal-500',
    accent: 'bg-pink-500',
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'calm',
  setTheme: () => {},
  themeColors: {
    primary: 'bg-blue-500',
    secondary: 'bg-teal-400',
    accent: 'bg-purple-500',
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-800',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
  },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('mood-tracker-theme');
    return (savedTheme as ThemeType) || 'calm';
  });

  const themeColors = defaultThemeColors[theme];

  useEffect(() => {
    localStorage.setItem('mood-tracker-theme', theme);
    
    // Apply theme classes to body
    // Note: This approach works in most modern browsers but may have issues in older versions
    document.body.className = `theme-change ${defaultThemeColors[theme].background}`;
    
    // Alternative implementation for browser compatibility
    // document.documentElement.setAttribute('data-theme', theme);
    // document.body.style.backgroundColor = defaultThemeColors[theme].background.split('bg-')[1];
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};