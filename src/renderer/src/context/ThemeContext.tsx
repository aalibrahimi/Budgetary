import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDarkModeStore } from '../routes/__root';

// Define theme types
export type ThemeType = 'default' | 'cyberpunk';

// Create context interface
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get theme from localStorage if available
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return (savedTheme as ThemeType) || 'default';
  });
  
  const { isDarkMode } = useDarkModeStore();

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
  }, [theme, isDarkMode]);

  // Provide context value
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);