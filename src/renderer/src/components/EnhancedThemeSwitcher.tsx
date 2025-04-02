import React from 'react';
import { useTheme } from '../context/ThemeContext';

const EnhancedThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  // Toggle theme between default and cyberpunk
  const toggleTheme = () => {
    setTheme(theme === 'default' ? 'cyberpunk' : 'default');
  };
  
  // Only render cyberpunk button when in default theme and vice versa
  if (theme === 'default') {
    return (
      <button
        onClick={toggleTheme}
        className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium mr-2"
      >
        Cyberpunk Mode
      </button>
    );
  }
  
  // Cyberpunk-styled button for switching back to default
  return (
    <button
      onClick={toggleTheme}
      className="bg-black border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black transition-colors duration-200 px-3 py-1.5 text-sm font-medium mr-2"
    >
      Default Mode
    </button>
  );
};

export default EnhancedThemeSwitcher;