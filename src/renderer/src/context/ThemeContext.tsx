// src/renderer/src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

import { useDarkModeStore } from '../routes/__root';
import { ThemeConfig, themes } from '@renderer/theme/theme';

// Define theme types
export type ThemeType = keyof typeof themes;

// Theme context interface with enhanced features
interface ThemeContextType {
  themeType: ThemeType;
  theme: ThemeConfig;
  setTheme: (theme: ThemeType) => void;
  isDashboardLayout: boolean;
  toggleDashboardLayout: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  themeType: 'default',
  theme: themes.default,
  setTheme: () => {},
  isDashboardLayout: true,
  toggleDashboardLayout: () => {},
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get theme from localStorage if available
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return (savedTheme as ThemeType) || 'default';
  });
  
  // Dashboard layout toggle for cyberpunk theme
  const [isDashboardLayout, setIsDashboardLayout] = useState<boolean>(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    return savedLayout !== null ? JSON.parse(savedLayout) : true;
  });
  
  const { isDarkMode } = useDarkModeStore();

  // Toggle dashboard layout
  const toggleDashboardLayout = () => {
    setIsDashboardLayout(prev => !prev);
  };

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appTheme', themeType);
    
    // Apply theme class to body
    document.body.classList.remove(...Object.keys(themes).map(t => `theme-${t}`));
    document.body.classList.add(`theme-${themeType}`);
    
    // Handle interaction with dark mode
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [themeType, isDarkMode]);

  // Save layout preference when it changes
  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(isDashboardLayout));
  }, [isDashboardLayout]);

  // Provide context value
  const contextValue: ThemeContextType = {
    themeType,
    theme: themes[themeType],
    setTheme: setThemeType,
    isDashboardLayout,
    toggleDashboardLayout,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);