import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import DarkModeIcon from '../../../../resources/moon_icon.svg'
import LightModeIcon from '../../../../resources/sun_icon.svg'

export const Route = createRootRoute({
  component: () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      document.body.classList.toggle('dark-mode');
    };

    return (
      <div className={isDarkMode ? 'dark-mode' : ''}>
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-chart-line"></i>
            <span>Expensy Tracker</span>
          </Link>
          
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <SignedOut>
              <SignInButton>
                <div className="auth-button">Login/Register</div>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/expenses" className="nav-link" viewTransition={true}>Dashboard</Link>
              <UserButton showName={true} />
            </SignedIn>
            
            <div className="settings-dropdown">
              <button className="settings-button" onClick={() => toggleDarkMode()}>{isDarkMode ?
                <img src={DarkModeIcon} alt="dark mode" id='darkmode-icon' />
                :
                <img src={LightModeIcon} alt="light mode" id='lightmode-icon' />}
              </button>
            </div>
          </div>
        </nav>

        <div className="content-body">
          <Outlet />
        </div>
      </div>
    )
  },
})