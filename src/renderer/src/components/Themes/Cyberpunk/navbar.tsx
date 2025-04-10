import { Link, Outlet } from '@tanstack/react-router'
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
    { label: 'Settings', to: '/settings', active: activeTab === 'settings' }
  ]

  // Get current date for the header
  const currentDate = new Date()
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

  return (
    <div className="relative z-50 bg-black" style={{ pointerEvents: 'auto' }}>
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
              <Link
                // onClick={() => forcedNavigation(item.to)}
                // className={`text-sm transition-colors ${
                //   item.active ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'
                // }`}
                to={item.to}
                className='text-sm transition-colors
                  text-gray-500 hover:text-gray-300 peer [&.active]:text-red-500
                '
                style={{
                  position: 'relative',
                  zIndex: 60,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {item.label}
              </Link>
              {/* {item.active && ( */}
                {/* Chat told me about 'peer' and holy shit it does work! */}
                {/* 'group' is for parent-child, 'peer' is for when they're not parent-child related */}
                <span className="hidden peer-[.active]:block absolute bottom-0 left-0 w-full h-[1px] bg-red-500 "></span>
              {/* )} */}
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

//

{
  /* Header with glitch animation */
}
//  <header className={`mb-8 ${animateHeader ? 'animate-glitch' : ''}`}>
//  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
//    <div className="relative">
//      <h1 className="text-4xl font-black text-red-500 tracking-tighter glitch-text">
//        BUDGETARY
//        <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-2">BUDGETARY</span>
//        <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-3">BUDGETARY</span>
//      </h1>
//      <div className="flex items-center space-x-2 mt-1">
//        <div className="h-[1px] w-2 bg-red-500"></div>
//        <div className="text-xs text-gray-500">{currentMonth} {currentDay}, {currentYear}</div>
//      </div>
//    </div>

//    <div className="flex space-x-2">
//      <button
//        onClick={() => setShowExpenseModal(true)}
//        className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black px-3 py-1 text-sm transition-colors flex items-center space-x-1 group"
//      >
//        <span className="group-hover:animate-pulse">+</span>
//        <span>ADD EXPENSE</span>
//      </button>

//      <Link to="/expenses" className="bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:border-white/30 px-3 py-1 text-sm transition-colors">
//        ALL EXPENSES
//      </Link>
//    </div>
//  </div>

//  {/* Navigation links */}
//  <div className="mt-6 border-t border-red-900/30 pt-4">
//    <nav className="flex flex-wrap gap-1">
//      {['overview', 'analytics', 'budgets', 'subscriptions', 'settings'].map((section) => (
//        <button
//          key={section}
//          onClick={() => setHighlightedSection(section)}
//          className={`px-4 py-1.5 text-sm transition-colors relative ${
//            highlightedSection === section
//              ? 'text-red-500'
//              : 'text-gray-500 hover:text-gray-300'
//          }`}
//        >
//          {section.toUpperCase()}
//          {highlightedSection === section && (
//            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
//          )}
//        </button>
//      ))}
//    </nav>
//  </div>
// </header>
