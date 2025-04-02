import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const EnhancedThemeSwitcher: React.FC = () => {
  const { theme, setTheme, isDashboardLayout, toggleDashboardLayout } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleThemeChange = (newTheme: 'default' | 'cyberpunk') => {
    setTheme(newTheme);
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Theme menu */}
      {isOpen && (
        <div className={`${theme === 'cyberpunk' ? 'bg-black/70 border border-red-500/30' : 'bg-white shadow-lg'} rounded-lg p-3 mb-2`}>
          <div className="mb-3">
            <h3 className={`text-sm font-bold mb-2 ${theme === 'cyberpunk' ? 'text-red-500' : 'text-gray-700'}`}>
              Theme
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleThemeChange('default')}
                className={`px-3 py-1.5 text-sm rounded ${
                  theme === 'default' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Default Theme
              </button>
              <button
                onClick={() => handleThemeChange('cyberpunk')}
                className={`px-3 py-1.5 text-sm rounded ${
                  theme === 'cyberpunk' 
                    ? 'bg-red-500 text-black' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cyberpunk Theme
              </button>
            </div>
          </div>
          
          {theme === 'cyberpunk' && (
            <div>
              <h3 className="text-sm font-bold mb-2 text-red-500">
                Layout Options
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={toggleDashboardLayout}
                  className={`px-3 py-1.5 text-sm rounded ${
                    isDashboardLayout 
                      ? 'bg-red-500 text-black' 
                      : 'bg-black text-red-500 border border-red-500/30'
                  }`}
                >
                  {isDashboardLayout ? 'Grid Layout' : 'Standard Layout'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Toggle button */}
      <button
        onClick={toggleMenu}
        className={`
          ${theme === 'cyberpunk' 
            ? 'bg-black border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black' 
            : 'bg-blue-500 text-white hover:bg-blue-600'}
          rounded-full p-3 shadow-lg transition duration-300 flex items-center justify-center
        `}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
      </button>
    </div>
  );
};

export default EnhancedThemeSwitcher;