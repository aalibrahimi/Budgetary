import { createFileRoute } from '@tanstack/react-router'

import { useDarkModeStore } from '@renderer/stores/themeStore'
import { RefreshCw, Calendar, DollarSign, AlertTriangle, Zap, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import SubscriptionManager from '@renderer/components/SubscriptionManager'
import { useExpenseStore } from '@renderer/stores/expenseStore'

export const CyberpunkSmartAssistant = () => {

  const { expenses, income } = useExpenseStore()
  const [animateHeader, setAnimateHeader] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: 0,
    frequency: 'monthly',
    category: 'Entertainment'
  })

  // Disable header animation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateHeader(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Get current month and year
  const currentDate = new Date()
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
  const currentMonth = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-red-600/20 mix-blend-screen blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-red-800/10 mix-blend-screen blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-br from-black via-red-950/10 to-black rounded-full mix-blend-screen filter blur-[80px]"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto p-4">
        {/* Header with glitch animation */}
        <header className={`mb-8 ${animateHeader ? 'animate-glitch' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <div className="relative">
              <h1 className="text-4xl font-black text-red-500 tracking-tighter glitch-text">
                SUBSCRIPTION MATRIX
                <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-2">SUBSCRIPTION MATRIX</span>
                <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-3">SUBSCRIPTION MATRIX</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-[1px] w-2 bg-red-500"></div>
                <div className="text-xs text-gray-500">{currentMonth} {currentDay}, {currentYear}</div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Stat Cards - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg group hover:border-red-500/60 transition-colors">
            <div className="p-4 border-b border-red-900/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">MONTHLY OVERHEAD</h2>
                <div className="text-xs text-green-500 animate-pulse-slow">ACTIVE</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">{formatCurrency(75.96)}</div>
              <div className="text-xs text-gray-500">RECURRING COST DETECTED</div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg group hover:border-red-500/60 transition-colors">
            <div className="p-4 border-b border-red-900/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">IMMINENT PAYMENTS</h2>
                <div className="text-xs text-red-500 animate-pulse-slow">PENDING</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">{formatCurrency(9.99)}</div>
              <div className="text-xs text-gray-500">DUE WITHIN 7 CYCLES</div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg group hover:border-red-500/60 transition-colors">
            <div className="p-4 border-b border-red-900/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">ANNUAL PROJECTION</h2>
                <div className="text-xs text-yellow-500 animate-pulse-slow">CALCULATING</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">{formatCurrency(911.52)}</div>
              <div className="text-xs text-gray-500">RESOURCE ALLOCATION</div>
            </div>
          </div>
        </div>
        
        {/* Main Subscription Manager Component */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg mb-6">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">DIGITAL SERVICES // ACTIVE MONITOR</h2>
              <div className="flex items-center">
                <span className="mr-2 text-xs text-gray-500">STATUS:</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {/* This is where we embed the regular SubscriptionManager component */}
            <SubscriptionManager 
              expenses={expenses} 
              isDarkMode={true} 
              income={income} 
            />
          </div>
        </div>
        
        {/* Security Advisories Panel */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg mb-6">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">SECURITY ADVISORIES</h2>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-white">Subscription Overlap Detected</h3>
                  <p className="text-sm text-gray-400">Multiple streaming services identified with similar content libraries. Potential for optimization.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-white">Free Trial Expiring</h3>
                  <p className="text-sm text-gray-400">Cloud Storage trial period ends in 48 hours. Cancel or prepare for automatic billing.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-white">Annual Renewal Window</h3>
                  <p className="text-sm text-gray-400">VPN service renewal in 14 days. Consider switching to annual billing for 20% reduction in resource expenditure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
          <div className="relative p-4 border-b border-red-900/20">
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-red-500/5 to-transparent"></div>
            <h2 className="text-xs text-red-500 tracking-widest">SYSTEM STATUS</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div className="text-gray-500">SUBSCRIPTION MONITOR</div>
                <div className="text-green-500">ONLINE</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">LAST UPDATE</div>
                <div className="text-white">3 MIN AGO</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">NEXT SCAN</div>
                <div className="text-white countdown" data-value="59">37</div>
              </div>
            </div>
          </div>
          
          {/* Animated scanner effect */}
          <div className="relative h-1 w-full bg-black overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-red-500/70 to-transparent animate-scanner"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom status bar */}
      <footer className="mt-8 border-t border-red-900/30 pt-3 flex justify-between items-center text-xs text-gray-600 px-4">
        <div>SUBSCRIPTION MATRIX v2.1.3</div>
        <div className="text-right">&copy; 2025 ALL RIGHTS RESERVED</div>
      </footer>
      
      {/* Custom CSS for animations and effects */}
      <style >{`
        /* Glitch animation */
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
        
        .animate-glitch {
          animation: glitch 1s cubic-bezier(.25, .46, .45, .94) both infinite;
        }
        
        @keyframes glitch-animation-1 {
          0% {
            opacity: 1;
            transform: translate(0);
          }
          10% {
            transform: translate(-2px, -2px);
          }
          20% {
            transform: translate(2px, 2px);
          }
          30% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          50% {
            transform: translate(-1px, 2px);
            opacity: 0.8;
          }
          60% {
            transform: translate(1px, 1px);
          }
          70% {
            transform: translate(-1px, -1px);
            opacity: 0.6;
          }
          80% {
            transform: translate(1px, -1px);
          }
          90% {
            transform: translate(-1px, 1px);
          }
          100% {
            opacity: 1;
            transform: translate(0);
          }
        }
        
        .animate-glitch-2 {
          animation: glitch-animation-1 3s infinite linear alternate-reverse;
        }
        
        .animate-glitch-3 {
          animation: glitch-animation-1 2.7s infinite linear alternate-reverse;
        }
        
        /* Scanner animation */
        @keyframes scanner {
          0% {
            left: -20%;
          }
          100% {
            left: 120%;
          }
        }
        
        .animate-scanner {
          animation: scanner 3s ease-in-out infinite;
        }
        
        /* Slow pulse animation */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
