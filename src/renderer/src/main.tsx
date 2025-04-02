import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/main.css'
import './assets/cyberpunk-theme.css' // Import the cyberpunk theme
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
// import TitleBar from './components/Titlebar'
import { ClerkProvider } from '@clerk/clerk-react'

// Need this in order for app to see routes during production mode
// Read more: https://tanstack.com/router/latest/docs/framework/react/guide/history-types
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>    
        {/* <TitleBar /> */}
        <RouterProvider router={router} />
      </ClerkProvider>
  </React.StrictMode>
)