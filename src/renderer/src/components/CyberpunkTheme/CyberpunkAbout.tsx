import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

import { useNotificationSystem, NotificationType } from '@renderer/components/NotificationSystem'
import { 
  Brain, 
  Award, 
  TrendingUp, 
  CalendarClock, 
  Flame, 
  Target, 
  Zap, 
  Coins,
  BadgeCheck, 
  Lightbulb, 
  DollarSign, 
  CircleOff, 
  ArrowUpCircle,
  PiggyBank,
  ArrowDownCircle
} from 'lucide-react'
import { useExpenseStore } from '@renderer/stores/expenseStore'

// Cyberpunk version of the Financial Wellness page (About)
const CyberpunkAbout: React.FC = () => {
  const { expenses, income } = useExpenseStore()
  const { showNotification } = useNotificationSystem()
  
  // State for different features
  const [activeTab, setActiveTab] = useState('insights')
  const [wellnessScore, setWellnessScore] = useState(78)
  const [userStrengths, setUserStrengths] = useState([
    'Consistent saving',
    'Low debt ratio',
    'Regular income',
  ])
  const [userWeaknesses, setUserWeaknesses] = useState([
    'Weekend splurging',
    'Subscription overload',
  ])
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false)
  const [personalityType, setPersonalityType] = useState('Security Seeker')
  const [dailyStreak, setDailyStreak] = useState(12)
  const [wellnessPoints, setWellnessPoints] = useState(450)
  const [simulationActive, setSimulationActive] = useState(false)
  const [simulationSavings, setSimulationSavings] = useState(0)
  const [simulationChanges, setSimulationChanges] = useState<
    { category: string; action: string; amount: number }[]
  >([])

  // Categories for spending personality quiz
  const personalityCategories = [
    'Security Seeker',
    'Status Spender',
    'Experience Collector',
    'Practical Purchaser',
    'Spontaneous Shopper',
    'Mindful Minimalist',
  ]

  // Effect to calculate wellness score from real data
  useEffect(() => {
    if (expenses.length > 0 && income > 0) {
      // This would be a complex calculation based on many factors
      // For demo purposes, we'll use a simplified version
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
      const savingsRate = Math.max(0, (income - totalSpent) / income)
      const expenseConsistency = calculateConsistency(expenses)

      // Score calculation (simplistic version)
      const newScore = Math.min(
        100,
        Math.round(savingsRate * 50 + expenseConsistency * 30 + 20),
      )

      setWellnessScore(newScore)
    }
  }, [expenses, income])

  // Helper function to calculate spending consistency
  const calculateConsistency = (expenses: any[]) => {
    // In a real app, this would analyze spending patterns
    // For demo, return a random value between 0.6 and 1
    return 0.6 + Math.random() * 0.4
  }

  // Function to complete a challenge
  const completeChallenge = (id: number) => {
    // In a real app, this would update the database
    setWellnessPoints(
      (prev) => prev + mockChallenges.find((c) => c.id === id)?.reward || 0,
    )
    
    showNotification('SUCCESS', 'Challenge completed! Points awarded.', NotificationType.SUCCESS)
  }

  // Function to start simulation
  const startSimulation = () => {
    setSimulationActive(true)
    setSimulationChanges([
      { category: 'Coffee', action: 'reduce', amount: 25 },
      { category: 'Subscriptions', action: 'consolidate', amount: 35 },
      { category: 'Groceries', action: 'optimize', amount: 50 },
    ])
    setSimulationSavings(110)
  }

  // Function to apply simulation changes
  const applySimulationChanges = () => {
    setWellnessScore((prev) => Math.min(100, prev + 5))
    setWellnessPoints((prev) => prev + 100)
    setSimulationActive(false)
    
    showNotification('SUCCESS', 'Simulation changes applied to your account.', NotificationType.SUCCESS)
  }

  // Calculate some stats based on real data
  const getSpendingInsights = () => {
    if (expenses.length === 0) return null

    // Get spending by day of week
    const daySpending = expenses.reduce(
      (acc, exp) => {
        const day = new Date(exp.date).getDay()
        acc[day] = (acc[day] || 0) + exp.amount
        return acc
      },
      {} as Record<number, number>,
    )

    // Find highest spending day
    let highestDay = 0
    let highestAmount = 0

    Object.entries(daySpending).forEach(([day, amount]) => {
      if (amount > highestAmount) {
        highestDay = parseInt(day)
        highestAmount = amount
      }
    })

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    return {
      highestSpendingDay: days[highestDay],
      totalCategories: new Set(expenses.map((e) => e.category)).size,
      averageTransaction:
        expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length,
    }
  }

  const insights = getSpendingInsights()

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Mock data for demonstration
  const mockInsights = [
    {
      id: 1,
      type: 'pattern',
      title: 'Weekend Spending Spike',
      description:
        'You spend 43% more on weekends, primarily on dining and entertainment',
    },
    {
      id: 2,
      type: 'suggestion',
      title: 'Coffee Budget Alert',
      description:
        'Your coffee spending increased 27% this month. Consider brewing at home twice a week to save $22',
    },
    {
      id: 4,
      type: 'pattern',
      title: 'Impulsive Shopping',
      description: 'Most clothing purchases happen late at night (after 10pm)',
    },
    {
      id: 5,
      type: 'suggestion',
      title: 'Recurring Subscription Overlap',
      description:
        'You have 3 streaming services with overlapping content. Consider consolidating to save $14/month',
    },
  ]

  const mockChallenges = [
    {
      id: 1,
      title: 'No-Spend Weekend',
      description: 'Go an entire weekend without spending any money',
      difficulty: 'medium',
      reward: 150,
      completed: false,
    },
    {
      id: 2,
      title: 'Brown Bag Champion',
      description: 'Bring lunch from home every day for a week',
      difficulty: 'easy',
      reward: 100,
      completed: true,
    },
    {
      id: 3,
      title: 'Bill Negotiator',
      description: 'Call a service provider and negotiate a lower rate',
      difficulty: 'hard',
      reward: 200,
      completed: false,
    },
    {
      id: 4,
      title: 'Declutter for Cash',
      description: 'Sell 5 unused items from your home',
      difficulty: 'medium',
      reward: 150,
      completed: false,
    },
    {
      id: 5,
      title: '30-Day Savings Sprint',
      description: 'Increase your savings rate by 5% for a month',
      difficulty: 'hard',
      reward: 300,
      completed: false,
    },
  ]

  // Get current month and year for header
  const currentDate = new Date()
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]
  const currentMonth = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-red-600/20 mix-blend-screen blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-red-800/10 mix-blend-screen blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-br from-black via-red-950/10 to-black rounded-full mix-blend-screen filter blur-[80px]"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>
      
      {/* Personality Quiz Modal */}
      {showPersonalityQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-black/70 backdrop-blur-md border border-red-500/80 rounded-lg w-full max-w-md overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
              <div className="relative p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-widest">// SPENDING ANALYSIS</h2>
                <button
                  onClick={() => setShowPersonalityQuiz(false)}
                  className="text-red-500 hover:text-red-400 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-gray-300 mb-4">
                Complete analysis protocol to determine your spending pattern classification.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-red-500 mb-1">
                    PURCHASE DECISION PRIORITY
                  </label>
                  <select
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  >
                    <option>Value and longevity</option>
                    <option>Experience or enjoyment</option>
                    <option>Status signaling</option>
                    <option>Price and practicality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-red-500 mb-1">
                    RISK ASSESSMENT PROFILE
                  </label>
                  <select
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  >
                    <option>Very cautious - Risk averse</option>
                    <option>Somewhat cautious - Calculated risks</option>
                    <option>Somewhat open - Willing to gamble</option>
                    <option>Very open - High risk, high reward</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-red-500 mb-1">
                    TRANSACTION METHODOLOGY
                  </label>
                  <select
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  >
                    <option>Extensive research before acquisition</option>
                    <option>Impulse-driven acquisitions</option>
                    <option>Quality-focused procurement</option>
                    <option>Discount-optimized purchasing</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    // In a real app, this would analyze answers and set the personality type
                    const randomType =
                      personalityCategories[
                        Math.floor(Math.random() * personalityCategories.length)
                      ]
                    setPersonalityType(randomType)
                    setShowPersonalityQuiz(false)
                    showNotification('INFO', 'Analysis complete. New spending pattern identified.', NotificationType.INFO)
                  }}
                  className="w-full bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-sm relative overflow-hidden group"
                >
                  <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></span>
                  RUN ANALYSIS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header with top navbar */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <div className="relative">
              <h1 className="text-4xl font-black text-red-500 tracking-tighter relative">
                FINANCIAL WELLNESS
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-[1px] w-2 bg-red-500"></div>
                <div className="text-xs text-gray-500">
                  — {currentMonth} {currentDay}, {currentYear}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                to="/"
                className="bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:border-white/30 px-3 py-1 text-sm transition-colors"
              >
                DASHBOARD
              </Link>
            </div>
          </div>

          {/* Stats Cards - Cyberpunk style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg group hover:border-red-500/60 transition-colors p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">WELLNESS SCORE</h2>
                <div className="text-xs text-gray-500 animate-[pulse-slow_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                  MONITORING
                </div>
              </div>
              <div className="text-2xl font-bold mt-2 group-hover:text-red-500 transition-colors">
                {wellnessScore}/100
              </div>
              <div className="w-full bg-gray-800 h-1 mt-2">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-500 h-1" 
                  style={{ width: `${wellnessScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg group hover:border-red-500/60 transition-colors p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">DAILY STREAK</h2>
                <div className="text-xs text-green-500 flex items-center">
                  <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  ACTIVE
                </div>
              </div>
              <div className="text-2xl font-bold mt-2 group-hover:text-red-500 transition-colors">
                {dailyStreak} days
              </div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg group hover:border-red-500/60 transition-colors p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">WELLNESS POINTS</h2>
                <div className="text-xs text-red-500">{wellnessPoints} PTS</div>
              </div>
              <div className="text-2xl font-bold mt-2 group-hover:text-red-500 transition-colors">
                {wellnessPoints} pts
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-red-900/30 pb-4">
          <nav className="flex flex-wrap">
            <button
              className={`px-4 py-2 text-sm transition-colors relative ${
                activeTab === 'insights' 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              <Brain className="inline-block mr-2 h-4 w-4" />
              BEHAVIOR INSIGHTS
              {activeTab === 'insights' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
            
            <button
              className={`px-4 py-2 text-sm transition-colors relative ${
                activeTab === 'challenges' 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('challenges')}
            >
              <Award className="inline-block mr-2 h-4 w-4" />
              FINANCIAL CHALLENGES
              {activeTab === 'challenges' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
            
            <button
              className={`px-4 py-2 text-sm transition-colors relative ${
                activeTab === 'simulator' 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('simulator')}
            >
              <TrendingUp className="inline-block mr-2 h-4 w-4" />
              BUDGET SIMULATOR
              {activeTab === 'simulator' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
            
            <button
              className={`px-4 py-2 text-sm transition-colors relative ${
                activeTab === 'profile' 
                  ? 'text-red-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <CalendarClock className="inline-block mr-2 h-4 w-4" />
              SPENDING PERSONALITY
              {activeTab === 'profile' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-10">
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {insights ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Flame className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Highest Spending Day
                        </h3>
                        <p className="text-2xl font-bold text-red-500">
                          {insights.highestSpendingDay}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Target className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Spending Categories
                        </h3>
                        <p className="text-2xl font-bold text-red-500">
                          {insights.totalCategories}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <Zap className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Average Transaction
                        </h3>
                        <p className="text-2xl font-bold text-red-500">
                          {formatCurrency(insights.averageTransaction)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 mb-8">
                  <p className="text-gray-400">No expense data available. Add expenses to generate insights.</p>
                </div>
              )}

              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-red-900/20">
                  <h2 className="text-xl font-semibold text-red-500">
                    FINANCIAL BEHAVIOR ANALYSIS
                  </h2>
                </div>

                <div className="divide-y divide-red-900/20">
                  {mockInsights.map((insight) => (
                    <div key={insight.id} className="p-5 hover:bg-red-900/5">
                      <div className="flex items-start">
                        {insight.type === 'pattern' ? (
                          <Brain className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                        ) : insight.type === 'suggestion' ? (
                          <Lightbulb className="h-6 w-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        ) : (
                          <BadgeCheck className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-white">
                            {insight.title}
                          </h3>
                          <p className="text-gray-400">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-black via-red-950/30 to-black rounded-lg p-6 text-white border border-red-500/30">
                <h2 className="text-xl font-bold mb-2 text-red-500">FINANCIAL FITNESS PROGRAM</h2>
                <p className="mb-4 text-gray-300">
                  Complete challenges to build healthy financial habits and earn wellness points.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-black/50 border border-red-500/30 rounded-lg px-4 py-2">
                    <span className="block text-sm text-gray-400">Current Level</span>
                    <span className="text-xl font-bold text-red-500">GOLD SAVER</span>
                  </div>
                  <div className="bg-black/50 border border-red-500/30 rounded-lg px-4 py-2">
                    <span className="block text-sm text-gray-400">Next Reward</span>
                    <span className="text-xl font-bold text-red-500">
                      200 pts → Premium Features
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-white mb-2">
                          {challenge.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.difficulty === 'easy'
                              ? 'bg-green-900/30 text-green-500'
                              : challenge.difficulty === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-500'
                                : 'bg-red-900/30 text-red-500'
                          }`}
                        >
                          {challenge.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        {challenge.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Coins className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="font-semibold text-yellow-500">
                            {challenge.reward} points
                          </span>
                        </div>
                        {challenge.completed ? (
                          <span className="bg-green-900/30 text-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            <BadgeCheck className="h-4 w-4 mr-1" />
                            COMPLETED
                          </span>
                        ) : (
                          <button
                            onClick={() => completeChallenge(challenge.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                          >
                            COMPLETE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulator Tab */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-red-900/20">
                  <h2 className="text-xl font-semibold text-red-500">
                    BUDGET IMPACT SIMULATOR
                  </h2>
                  <p className="text-gray-400 mt-2">
                    Simulate small changes to your spending habits and see the impact over time.
                  </p>
                </div>

                <div className="p-6">
                  {!simulationActive ? (
                    <div className="text-center">
                      <button
                        onClick={startSimulation}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 px-4 py-2 rounded-sm font-medium transition-colors"
                      >
                        RUN SMART SIMULATION
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <h3 className="text-blue-400 font-semibold mb-2">
                          POTENTIAL MONTHLY SAVINGS
                        </h3>
                        <div className="text-3xl font-bold text-blue-400">
                          {formatCurrency(simulationSavings)}
                        </div>
                        <div className="text-sm text-blue-300 mt-1">
                          That's {formatCurrency(simulationSavings * 12)} per year!
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-semibold mb-3">
                          SUGGESTED CHANGES
                        </h3>
                        <div className="space-y-3">
                          {simulationChanges.map((change, idx) => (
                            <div
                              key={idx}
                              className="flex items-start p-3 border border-red-500/30 rounded-lg bg-black/50"
                            >
                              {change.action === 'reduce' ? (
                                <ArrowDownCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                              ) : change.action === 'consolidate' ? (
                                <CircleOff className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                              ) : (
                                <ArrowUpCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-medium text-white">
                                  {change.action === 'reduce'
                                    ? `Reduce ${change.category} spending`
                                    : change.action === 'consolidate'
                                      ? `Consolidate ${change.category}`
                                      : `Optimize ${change.category} purchases`}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Estimated savings:{' '}
                                  {formatCurrency(change.amount)}/month
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setSimulationActive(false)}
                          className="px-4 py-2 border border-red-500/30 text-white rounded-sm transition-colors hover:bg-red-900/10"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={applySimulationChanges}
                          className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-500/30 rounded-sm hover:bg-green-900/50 transition-colors"
                        >
                          APPLY CHANGES
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-red-900/20">
                  <h3 className="text-xl font-semibold text-red-500">
                    LONG-TERM PROJECTION
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/50 border border-red-500/20 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        CURRENT MONTHLY SAVINGS
                      </div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(income * 0.1)}
                      </div>
                    </div>

                    <div className="bg-black/50 border border-red-500/20 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        1-YEAR PROJECTION
                      </div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(income * 0.1 * 12)}
                      </div>
                    </div>

                    <div className="bg-black/50 border border-red-500/20 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        5-YEAR PROJECTION
                      </div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(income * 0.1 * 12 * 5 * 1.15)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-red-900/20 pt-4">
                    <h4 className="font-medium mb-3 text-white">
                      IF YOU APPLY THE SUGGESTED CHANGES
                    </h4>

                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full">
                        <div
                          className="h-1 bg-green-500 rounded-full"
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-white">
                        +65%
                      </span>
                    </div>

                    <div className="text-sm text-gray-400">
                      With the suggested changes, your 5-year projection
                      increases to{' '}
                      {formatCurrency(income * 0.1 * 12 * 5 * 1.15 * 1.65)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spending Personality Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-red-900/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-red-500">
                        YOUR SPENDING PERSONALITY
                      </h2>
                      <p className="text-gray-400">
                        Based on your spending patterns and financial behavior
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPersonalityQuiz(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      TAKE QUIZ
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 mb-6 border border-purple-500/20">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-purple-500/30 flex items-center justify-center text-white mr-4 border border-purple-500/50">
                        <DollarSign className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="text-sm text-purple-400 mb-1">
                          YOUR PRIMARY TYPE
                        </div>
                        <h3 className="text-2xl font-bold text-purple-300">
                          {personalityType}
                        </h3>
                      </div>
                    </div>

                    <p className="text-purple-200">
                      You prioritize financial security and tend to be cautious
                      with spending. You're methodical about saving and prefer
                      predictable expenses to spontaneous purchases.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-white">
                      YOUR FINANCIAL STRENGTHS
                    </h3>
                    <div className="space-y-2">
                      {userStrengths.map((strength, idx) => (
                        <div key={idx} className="flex items-center">
                          <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-white">
                            {strength}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-white">
                      AREAS FOR IMPROVEMENT
                    </h3>
                    <div className="space-y-2">
                      {userWeaknesses.map((weakness, idx) => (
                        <div key={idx} className="flex items-center">
                          <ArrowUpCircle className="h-5 w-5 text-orange-500 mr-2" />
                          <span className="text-white">
                            {weakness}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-red-900/20">
                  <h3 className="text-xl font-semibold text-red-500">
                    PERSONALIZED RECOMMENDATIONS
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="p-4 border border-red-500/20 bg-black/50 rounded-lg">
                    <h4 className="font-medium mb-2 text-white">
                      24-HOUR PURCHASE DELAY PROTOCOL
                    </h4>
                    <p className="text-gray-400 text-sm">
                      For non-essential purchases over $50, wait 24 hours
                      before buying. This reduces impulse spending while still
                      allowing planned purchases.
                    </p>
                  </div>

                  <div className="p-4 border border-red-500/20 bg-black/50 rounded-lg">
                    <h4 className="font-medium mb-2 text-white">
                      AUTOMATED TRANSFER SYSTEM
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Schedule automatic transfers to savings on days you
                      receive income. This helps build your savings without
                      requiring active decisions.
                    </p>
                  </div>

                  <div className="p-4 border border-red-500/20 bg-black/50 rounded-lg">
                    <h4 className="font-medium mb-2 text-white">
                      CONTROLLED RESOURCE ALLOCATION
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Create a "Fun Money" fund specifically for spontaneous
                      spending without guilt. This balances your
                      security-seeking nature with occasional enjoyment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom status bar */}
        <footer className="mt-8 border-t border-red-900/30 pt-3 flex justify-between items-center text-xs text-gray-600">
          <div>BUDGETARY SYSTEM v1.0.4</div>
          <div className="text-right">&copy; 2025 ALL RIGHTS RESERVED</div>
        </footer>
      </div>

      {/* Custom keyframes styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export default CyberpunkAbout