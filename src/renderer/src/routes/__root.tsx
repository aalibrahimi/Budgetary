import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react';
// Types
interface User {
  isAuthenticated: boolean;
}
// Need to work on making this into Zustand for state management
// If Zustand doesnt work, need to make it into component in order to use it here
// const [user, setUser] = useState<User>({ isAuthenticated: false });


const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  setIsDarkMode(!isDarkMode);
  document.body.classList.toggle('dark-mode');
}

export const Route = createRootRoute({
  component: () => (
    <>
      <div id='nav'>
        <span className='logo'>Expensy Tracker</span>
        <Link to="/" className='link'>Home</Link>
        <Link to="/about" className='link'>About</Link>
        <Link to="/expenses" className='link'>Expense</Link>
        <div className='auth-buttons'>
          <Link to="/login" className='link'>Login/Register</Link>

          <div className="settings-dropdown">
            <button className="settings-button">⚙️</button>
            <div className="dropdown-content">
              <button onClick={() => DarkMode()}>Dark Mode</button>
              <a href="">Profile</a>
              <a href="">Account Settings</a>
              {/* {user.isAuthenticated && (
                <a href="">Logout</a>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div  className='content-body'>
      <Outlet />
      </div>
    </>
  ),
})