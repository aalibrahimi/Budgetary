import React, { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import CyberpunkAbout from './CyberpunkAbout'
import CyberpunkDashboard from './CyberpunkDashboard'
import CyberpunkEffects from './CyberpunkEffects'
import CyberpunkNavbar from './CyberpunkNavbar'
import CyberpunkSmartAssistant from './CyberpunkSmartAssistant'
import CyberpunkExpenses from './CypberpunkExpenses'

/**
 * Central router component for the Cyberpunk theme
 * This handles showing the appropriate page component based on the current route
 */
const CyberpunkRouter: React.FC = () => {
  const router = useRouter()
  
  // Get the current location from router state
  const location = router.state.location.pathname
  
  // Determine which component to render based on the route
  const renderPage = () => {
    console.log("Current cyberpunk route:", location) // Debug log
    
    switch (location) {
      case '/':
        return <CyberpunkDashboard />
      case '/expenses':
        return <CyberpunkExpenses />
      case '/smart-assistant':
        return <CyberpunkSmartAssistant />
      case '/about':
        return <CyberpunkAbout />
      default:
        return <CyberpunkDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Shared background effects */}
      <CyberpunkEffects />
      
      {/* Shared navbar */}
      <CyberpunkNavbar />
      
      {/* Render the appropriate page component */}
      {renderPage()}
    </div>
  )
}

export default CyberpunkRouter