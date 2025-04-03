import React, { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

const CyberpunkEffects: React.FC = () => {
  const { theme } = useTheme()
  const [countdown, setCountdown] = useState(60)

  // Countdown timer effect
  useEffect(() => {
    if (theme !== 'cyberpunk') return

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)

    return () => clearInterval(timer)
  }, [theme])

  if (theme !== 'cyberpunk') return null

  return (
    <div className="cyberpunk-effects">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-red-600/20 mix-blend-screen blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-red-800/10 mix-blend-screen blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-br from-black via-red-950/10 to-black rounded-full mix-blend-screen filter blur-[80px]"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 z-0"></div>

      {/* System Status element */}
      <div className="fixed bottom-4 left-4 z-50 font-mono text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-black/70 backdrop-blur-sm border border-red-500/50 rounded px-3 py-1">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-gray-400">SYSTEM ONLINE</span>
          </div>

          <div className="flex items-center bg-black/70 backdrop-blur-sm border border-red-500/50 rounded px-3 py-1">
            <span className="text-gray-400">NEXT SCAN: </span>
            <span className="ml-1 text-red-500">{countdown}</span>
          </div>
        </div>
      </div>

      {/* Animated scanner line at the bottom of the page */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-black overflow-hidden z-40">
        <div className="absolute h-full w-20 bg-gradient-to-r from-transparent via-red-500/70 to-transparent animate-scanner"></div>
      </div>
    </div>
  )
}

export default CyberpunkEffects
