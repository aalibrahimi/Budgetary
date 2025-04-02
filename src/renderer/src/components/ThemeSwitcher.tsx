import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'default' ? 'cyberpunk' : 'default');
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-switcher-btn"
      aria-label="Switch Theme"
    >
      {theme === 'default' ? '🌐 Switch to Cyberpunk' : '🏠 Switch to Default'}
    </button>
  );
};

export default ThemeSwitcher;