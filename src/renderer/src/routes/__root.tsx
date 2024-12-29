import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'

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
            <Link to="/expenses" className="nav-link">Expense</Link>
            <Link to="/login" className="auth-button">Login/Register</Link>
            
            <div className="settings-dropdown">
              <button className="settings-button">⚙️</button>
              <div className="dropdown-content">
                <button onClick={toggleDarkMode}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                {/* <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link> */}
              </div>
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
//     <>
      
//       <div id='navybar'>
        
//         <Link to="/" className='link'>Home</Link>
//         <Link to="/about" className='link'>About</Link>
//         <Link to="/expenses" className='link'>Expense</Link>
//         <div className="auth-buttons">
//          <Link to="/login" className='link' id="btn-login">login</Link>
//         </div>
//       </div>
//       <div  className='content-body'>
//       <Outlet />
//       </div>
//     </>
//   ),
// })