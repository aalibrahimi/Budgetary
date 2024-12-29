import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div id='nav'>
        <Link to="/" className='link'>Home</Link>
        <Link to="/about" className='link'>About</Link>
        <Link to="/expenses" className='link'>Expense</Link>
      </div>
      <div  className='content-body'>
      <Outlet />
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