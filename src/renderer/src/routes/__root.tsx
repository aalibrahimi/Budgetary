import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

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
    </>
  ),
})