import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDarkModeStore } from '../routes/__root';

// Define theme types
export type ThemeType = 'default' | 'cyberpunk';

// Theme context interface with enhanced features
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDashboardLayout: boolean;
  toggleDashboardLayout: () => void;
  glitchIntensity: 'low' | 'medium' | 'high';
  setGlitchIntensity: (intensity: 'low' | 'medium' | 'high') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
  isDashboardLayout: true,
  toggleDashboardLayout: () => {},
  glitchIntensity: 'medium',
  setGlitchIntensity: () => {},
  accentColor: '#ff3b3b', // Default cyberpunk red
  setAccentColor: () => {},
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get theme from localStorage if available
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return (savedTheme as ThemeType) || 'default';
  });
  
  // Dashboard layout toggle for cyberpunk theme
  const [isDashboardLayout, setIsDashboardLayout] = useState<boolean>(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    return savedLayout !== null ? JSON.parse(savedLayout) : true;
  });
  
  // Glitch effect intensity
  const [glitchIntensity, setGlitchIntensity] = useState<'low' | 'medium' | 'high'>(() => {
    const savedIntensity = localStorage.getItem('glitchIntensity');
    return (savedIntensity as 'low' | 'medium' | 'high') || 'medium';
  });
  
  // Accent color for cyberpunk theme
  const [accentColor, setAccentColor] = useState<string>(() => {
    const savedColor = localStorage.getItem('accentColor');
    return savedColor || '#ff3b3b';
  });
  
  const { isDarkMode } = useDarkModeStore();

  // Toggle dashboard layout
  const toggleDashboardLayout = () => {
    setIsDashboardLayout(prev => !prev);
  };

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    
    // Apply theme class to body
    document.body.classList.remove('theme-default', 'theme-cyberpunk');
    document.body.classList.add(`theme-${theme}`);
    
    // Handle interaction with dark mode
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Apply CSS variable for accent color
    document.documentElement.style.setProperty('--cyberpunk-accent', accentColor);
    
    // Apply glitch intensity as a data attribute
    document.documentElement.setAttribute('data-glitch', glitchIntensity);
  }, [theme, isDarkMode, accentColor, glitchIntensity]);

  // Save layout preference when it changes
  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(isDashboardLayout));
  }, [isDashboardLayout]);
  
  // Save glitch intensity when it changes
  useEffect(() => {
    localStorage.setItem('glitchIntensity', glitchIntensity);
  }, [glitchIntensity]);
  
  // Save accent color when it changes
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  // Provide context value
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    isDashboardLayout,
    toggleDashboardLayout,
    glitchIntensity,
    setGlitchIntensity,
    accentColor,
    setAccentColor,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);