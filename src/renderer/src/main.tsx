import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/main.css'
import './assets/cyberpunk-theme.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ClerkProvider } from '@clerk/clerk-react'

// Create memory history for routing
const memoryHistory = createMemoryHistory({
  initialEntries: ['/']
})

// Create a new router instance
const router = createRouter({ routeTree, history: memoryHistory })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Load fonts locally instead of from Google
const loadLocalFonts = () => {
  // Create a style element for local fonts instead of loading from Google
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Rajdhani';
      font-style: normal;
      font-weight: 400;
      src: local('Rajdhani Regular'), local('Rajdhani-Regular');
    }
    @font-face {
      font-family: 'Rajdhani';
      font-style: normal;
      font-weight: 500;
      src: local('Rajdhani Medium'), local('Rajdhani-Medium');
    }
    @font-face {
      font-family: 'Rajdhani';
      font-style: normal;
      font-weight: 600;
      src: local('Rajdhani SemiBold'), local('Rajdhani-SemiBold');
    }
    @font-face {
      font-family: 'Rajdhani';
      font-style: normal;
      font-weight: 700;
      src: local('Rajdhani Bold'), local('Rajdhani-Bold');
    }
  `;
  document.head.appendChild(style);
};

// Load fonts
loadLocalFonts();

// Create root only once
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// Render with proper nesting order
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);