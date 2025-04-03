import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import DarkModeIcon from '../../../../resources/moon_icon.svg'
import LightModeIcon from '../../../../resources/sun_icon.svg'
import { create } from 'zustand'
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import EnhancedThemeSwitcher from '../components/EnhancedThemeSwitcher'
import CyberpunkDashboard from '../components/CyberpunkTheme/CyberpunkDashboard'
import CyberpunkExpenses from '@renderer/components/CyberpunkTheme/CypberpunkExpenses'
import CyberpunkSmartAssistant from '@renderer/components/CyberpunkTheme/CyberpunkSmartAssistant'
import CyberpunkAbout from '@renderer/components/CyberpunkTheme/CyberpunkAbout'

// Dark Mode Store
interface darkModeState {
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
}

export const useDarkModeStore = create<darkModeState>()((set) => ({
  isDarkMode: JSON.parse(localStorage.getItem('isDarkMode') || 'false'), // Initialize from localStorage
  setIsDarkMode: (isDarkMode: boolean) => {
    set({ isDarkMode })
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode)) // Save to localStorage
  }
}))


// Root Route Component
const RootComponent = () => {
  const { isDarkMode, setIsDarkMode } = useDarkModeStore()
  const { theme } = useTheme()
  const location = useRouter().state.location.pathname
  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode) // Update Zustand store
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
      document.getElementById('darky')?.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.getElementById('darky')?.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  // If cyberpunk theme is active and we're on the dashboard route,
  // render the cyberpunk dashboard instead
  const isCyberpunkDashboard = theme === 'cyberpunk' && window.location.pathname === '/'

  if (isCyberpunkDashboard) {

    switch ( location ) {
      case '/':
        return <CyberpunkDashboard />
      case '/expenses':
        return <CyberpunkExpenses />
      case '/smart-assitant':
        return <CyberpunkSmartAssistant />
      case '/about' :
        return <CyberpunkAbout />
      default : 
        return <CyberpunkDashboard />
    }

    
  }

  return (
    <div className={`${isDarkMode ? 'dark-mode' : ''} theme-${theme}`}>
      {theme !== 'cyberpunk' && (
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-chart-line"></i>
            <span>Budgetary</span>
          </Link>

          <div className="navbar-links">
            <Link to="/" className="nav-link" draggable={false}>
              Home
            </Link>
            <Link to="/about" className="nav-link" draggable={false}>
              Challenges
            </Link>
            <Link to="/smart-assistant" className="nav-link" draggable={false}>
              Subscriptions
            </Link>
            <SignedOut>
              <SignInButton>
                <div className="auth-button">Login/Register</div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/expenses" className="nav-link" viewTransition={true} draggable={false}>
                Dashboard
              </Link>
              <UserButton showName={true} />
            </SignedIn>

            {/* Add Theme Switcher here */}
            <EnhancedThemeSwitcher />

            <div className="settings-dropdown">
              <button className="settings-button" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <img src={DarkModeIcon} alt="dark mode" id="darkmode-icon" />
                ) : (
                  <img src={LightModeIcon} alt="light mode" id="lightmode-icon" />
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      <section className="content-body">
        <Outlet />
      </section>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <RootComponent />
    </ThemeProvider>
  )
})
