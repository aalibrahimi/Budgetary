import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { useThemeStore } from '@renderer/stores/themeStore'
import ThemeSwitch from '@renderer/components/themeSwitch'

interface NavItem {
  label: string
  to: string
  active: boolean
}

// Root Route Component
export const CyberpunkNav = () => {
  // const { isDarkMode, setIsDarkMode } = useDarkModeStore()
  const { setActiveTheme } = useThemeStore()

  // // Toggle Dark Mode
  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode) // Update Zustand store

  //   // Apply or remove the class based on the new state
  //   if (isDarkMode) {
  //     document.body.classList.add('dark-mode')
  //     document.getElementById('darky')?.classList.add('dark-mode')
  //   } else {
  //     document.body.classList.remove('dark-mode')
  //     document.getElementById('darky')?.classList.remove('dark-mode')
  //   }
  // }

  const handleTheme = () => {
    setActiveTheme('default')
    // localstorage
  }

  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.body.classList.add('dark-mode')
  //     document.getElementById('darky')?.classList.add('dark-mode')
  //   } else {
  //     document.body.classList.remove('dark-mode')
  //     document.getElementById('darky')?.classList.remove('dark-mode')
  //   }
  // }, [isDarkMode])

  // --------------------------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState('overview')

  const navItems: NavItem[] = [
    { label: 'Overview', to: '/', active: activeTab === 'overview' },
    { label: 'Expenses', to: '/expenses', active: activeTab === 'expenses' },
    { label: 'Challenges', to: '/about', active: activeTab === 'challenges' },
    { label: 'Subscriptions', to: '/smart-assistant', active: activeTab === 'subscriptions' },
    { label: 'Settings', to: '/settings', active: activeTab === 'settings' },
  ]

  // Get current date for the header
  const currentDate = new Date()
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

  return (
    <div className="relative z-50" style={{ pointerEvents: 'auto' }}>
      {/* Logo and date */}
      <div
        className="flex justify-between items-center px-5 py-3 z-50"
        style={{ position: 'relative', pointerEvents: 'auto' }}
      >
        <div style={{ position: 'relative', zIndex: 60 }}>
          <h1 className="text-red-500 text-2xl font-bold uppercase">Budgetary</h1>
          <div className="text-gray-500 text-xs">— {formattedDate}</div>
        </div>

        {/* Action buttons - Now includes Theme Switcher */}
        <div className="flex gap-4 items-center" style={{ position: 'relative', zIndex: 60 }}>
          <ThemeSwitch switchTo="default" label="Default Theme" />

          <button
            // onClick={() => forcedNavigation('/expenses')}
            className="text-red-500 px-2 py-1 text-xs border border-red-500/30 hover:bg-red-500/10 transition-colors"
            style={{ position: 'relative', zIndex: 60, cursor: 'pointer' }}
          >
            + ADD EXPENSE
          </button>
          <button
            // onClick={() => forcedNavigation('/expenses')}
            className="text-white px-2 py-1 text-xs border border-white/10 hover:border-white/30 transition-colors"
            style={{ position: 'relative', zIndex: 60, cursor: 'pointer' }}
          >
            ALL EXPENSES
          </button>
        </div>
      </div>

      {/* Add explicit styling for navigation */}
      <nav
        className="border-t border-red-900/30 pt-4 relative z-50"
        style={{ pointerEvents: 'auto' }}
      >
        <ul className="flex flex-wrap gap-1 px-5">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="px-4 py-1.5 relative"
              style={{ position: 'relative', zIndex: 60 }}
            >
              <button
                // onClick={() => forcedNavigation(item.to)}
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

      <section className="content-body">
        <Outlet />
      </section>
    </div>
  )
}
