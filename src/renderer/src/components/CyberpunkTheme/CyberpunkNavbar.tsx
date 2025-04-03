import React, { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useRouter } from '@tanstack/react-router'
import EnhancedThemeSwitcher from '../EnhancedThemeSwitcher'

interface NavItem {
  label: string
  to: string
  active: boolean
}

const CyberpunkNavbar: React.FC = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  // Only render when cyberpunk theme is active
  if (theme !== 'cyberpunk') return null
  
  // Update active tab based on current route
  useEffect(() => {
    if (theme !== 'cyberpunk') return;
    
    const currentPath = router.state.location.pathname;
    console.log("Current path in useEffect:", currentPath);
    
    // Set activeTab based on current path
    if (currentPath === '/') {
      setActiveTab('overview');
    } else if (currentPath === '/expenses') {
      setActiveTab('expenses');
    } else if (currentPath === '/about') {
      setActiveTab('challenges');
    } else if (currentPath === '/smart-assistant') {
      setActiveTab('subscriptions');
    } else if (currentPath === '/settings') {
      setActiveTab('settings');
    }
  }, [router.state.location.pathname, theme]);

  // Force navigation with direct DOM method
  const forcedNavigation = (path: string) => {
    console.log("Navigating to:", path);
    // Try both methods to ensure navigation works
    try {
      router.navigate({ to: path });
      setTimeout(() => {
        // If router navigation doesn't work, fall back to direct URL change
        if (window.location.pathname !== path) {
          window.location.href = path;
        }
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = path;
    }
  };

  const navItems: NavItem[] = [
    { label: 'Overview', to: '/', active: activeTab === 'overview' },
    { label: 'Expenses', to: '/expenses', active: activeTab === 'expenses' },
    { label: 'Challenges', to: '/about', active: activeTab === 'challenges' },
    { label: 'Subscriptions', to: '/smart-assistant', active: activeTab === 'subscriptions' },
    { label: 'Settings', to: '/settings', active: activeTab === 'settings' }
  ]

  // Get current date for the header
  const currentDate = new Date()
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

  return (
    <div className="relative z-50" style={{ pointerEvents: 'auto' }}>
      {/* Logo and date */}
      <div className="flex justify-between items-center px-5 py-3 z-50" style={{ position: 'relative', pointerEvents: 'auto' }}>
        <div style={{ position: 'relative', zIndex: 60 }}>
          <h1 className="text-red-500 text-2xl font-bold uppercase">Budgetary</h1>
          <div className="text-gray-500 text-xs">— {formattedDate}</div>
        </div>

        {/* Action buttons - Now includes Theme Switcher */}
        <div className="flex gap-4 items-center" style={{ position: 'relative', zIndex: 60 }}>
          <EnhancedThemeSwitcher />
          <button 
            onClick={() => forcedNavigation('/expenses')}
            className="text-red-500 px-2 py-1 text-xs border border-red-500/30 hover:bg-red-500/10 transition-colors"
            style={{ position: 'relative', zIndex: 60, cursor: 'pointer' }}
          >
            + ADD EXPENSE
          </button>
          <button
            onClick={() => forcedNavigation('/expenses')}
            className="text-white px-2 py-1 text-xs border border-white/10 hover:border-white/30 transition-colors"
            style={{ position: 'relative', zIndex: 60, cursor: 'pointer' }}
          >
            ALL EXPENSES
          </button>
        </div>
      </div>

     {/* Add explicit styling for navigation */}
     <nav className="border-t border-red-900/30 pt-4 relative z-50" style={{ pointerEvents: 'auto' }}>
        <ul className="flex flex-wrap gap-1 px-5">
          {navItems.map((item) => (
            <li 
              key={item.label} 
              className="px-4 py-1.5 relative"
              style={{ position: 'relative', zIndex: 60 }}
            >
              <button 
                onClick={() => forcedNavigation(item.to)}
                className={`text-sm transition-colors ${
                  item.active ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={{ 
                  position: 'relative', 
                  zIndex: 60, 
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {item.label}
              </button>
              {item.active && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default CyberpunkNavbar