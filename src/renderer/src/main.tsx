import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/main.css'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import TitleBar from './components/Titlebar'

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <TitleBar />
      <RouterProvider router={router} />
  </React.StrictMode>
)
