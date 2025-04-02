import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from '@tanstack/react-router';
import EnhancedThemeSwitcher from './EnhancedThemeSwitcher';

interface NavItem {
  label: string;
  to: string;
  active: boolean;
}

const CyberpunkNavbar: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Only render when cyberpunk theme is active
  if (theme !== 'cyberpunk') return null;
  
  const navItems: NavItem[] = [
    { label: 'Overview', to: '/', active: activeTab === 'overview' },
    { label: 'Analytics', to: '/analytics', active: activeTab === 'analytics' },
    { label: 'Budgets', to: '/budgets', active: activeTab === 'budgets' },
    { label: 'Subscriptions', to: '/smart-assistant', active: activeTab === 'subscriptions' },
    { label: 'Settings', to: '/settings', active: activeTab === 'settings' },
  ];
  
  const handleTabClick = (label: string) => {
    setActiveTab(label.toLowerCase());
  };
  
  // Get current date for the header
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  
  return (
    <div className="cyberpunk-header">
      {/* Logo and date */}
      <div className="flex justify-between items-center px-5 py-3">
        <div>
          <h1 className="text-red-500 text-2xl font-bold uppercase">Budgetary</h1>
          <div className="text-gray-500 text-xs">— {formattedDate}</div>
        </div>
        
        {/* Action buttons - Now includes Theme Switcher */}
        <div className="flex gap-4 items-center">
          <EnhancedThemeSwitcher />
          <button className="text-red-500 px-2 py-1 text-xs border border-red-500/30 hover:bg-red-500/10">
            + ADD EXPENSE
          </button>
          <Link to="/expenses" className="text-white px-2 py-1 text-xs border border-white/10 hover:border-white/30">
            ALL EXPENSES
          </Link>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <nav className="cyber-navbar">
        <ul className="cyber-nav-tabs">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`cyber-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => handleTabClick(item.label)}
            >
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default CyberpunkNavbar;