import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/main.css'
import './assets/cyberpunk-theme.css' // Import the cyberpunk theme
import '@fortawesome/fontawesome-free/css/all.css' // Import Font Awesome icons
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ClerkProvider } from '@clerk/clerk-react'
import { useTheme, ThemeProvider } from 'styled-components'

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
// Create a wrapper that provides both context and styled-components theme
const ThemedApp = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  );
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Add Rajdhani font for cyberpunk theme
const loadFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

// Load fonts
loadFonts();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedApp>
        <RouterProvider router={router} />
      </ThemedApp>
    </ThemeProvider>
  </React.StrictMode>
);