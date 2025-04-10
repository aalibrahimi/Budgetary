import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

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
  BarChart3,
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle,
  CircleOff,
  Terminal,
  Lock,
  Shield,
  SkullIcon,
  AlertTriangle
} from 'lucide-react'
import { useExpenseStore } from '@renderer/stores/expenseStore'

// Mock data for demonstration
const mockChallenges = [
  {
    id: 1,
    title: 'NO-SPEND WEEKEND',
    description: 'Survive 48 hours without financial transactions',
    difficulty: 'medium',
    reward: 150,
    completed: false,
  },
  {
    id: 2,
    title: 'BROWN BAG PROTOCOL',
    description: 'Self-sustain with prepared meals for 7 consecutive cycles',
    difficulty: 'easy',
    reward: 100,
    completed: true,
  },
  {
    id: 3,
    title: 'NEGOTIATION EXPLOIT',
    description: 'Deploy social engineering to reduce service provider rates',
    difficulty: 'hard',
    reward: 200,
    completed: false,
  },
  {
    id: 4,
    title: 'ASSET LIQUIDATION',
    description: 'Convert 5 redundant possessions into liquid currency',
    difficulty: 'medium',
    reward: 150,
    completed: false,
  },
  {
    id: 5,
    title: 'SAVINGS ACCELERATION',
    description: 'Increase resource retention rate by 5% for a full cycle',
    difficulty: 'hard',
    reward: 300,
    completed: false,
  },
]

// Personality types for spending
const personalityCategories = [
  'SECURITY PROTOCOL',
  'STATUS OPERATOR',
  'EXPERIENCE COLLECTOR',
  'PRAGMATIC UNIT',
  'IMPULSE AGENT',
  'MINIMALIST INTERFACE',
]

export const FinancialHackingSystem = () => {
  const { expenses, income } = useExpenseStore()

  // State for different features
  const [activeTab, setActiveTab] = useState('insights')
  const [wellnessScore, setWellnessScore] = useState(78)
  const [userStrengths, setUserStrengths] = useState([
    'Consistent resource allocation',
    'Low debt ratio',
    'Regular income stream',
  ])
  const [userWeaknesses, setUserWeaknesses] = useState([
    'Weekend resource drain',
    'Subscription overload',
  ])
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false)
  const [personalityType, setPersonalityType] = useState('SECURITY PROTOCOL')
  const [dailyStreak, setDailyStreak] = useState(12)
  const [wellnessPoints, setWellnessPoints] = useState(450)
  const [simulationActive, setSimulationActive] = useState(false)
  const [simulationSavings, setSimulationSavings] = useState(0)
  const [simulationChanges, setSimulationChanges] = useState<
    { category: string; action: string; amount: number }[]
  >([])
  const [animateHeader, setAnimateHeader] = useState(true)

  // Disable header animation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateHeader(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

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
    // In a real app, this would create budget rules or goals
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

      {/* Main content container - constrained width */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* Header with glitch animation */}
          <header className="mb-8 mt-8">
            <div className="flex flex-col justify-between items-start space-y-2">
              <div className="relative">
                <h1 className="text-4xl font-black text-red-500 tracking-tighter glitch-text">
                  FINANCIAL HACKING SYSTEM
                  <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-2">FINANCIAL HACKING SYSTEM</span>
                  <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-3">FINANCIAL HACKING SYSTEM</span>
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="h-[1px] w-2 bg-red-500"></div>
                  <div className="text-xs text-gray-500">APRIL 10, 2025</div>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <div className="bg-black border border-red-500/30 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">SYSTEM INTEGRITY</h2>
                  <div className="text-xs text-green-500">ONLINE</div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold mb-1 text-white">{wellnessScore}/100</div>
                <div className="w-full bg-gray-800 h-1.5 mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                    style={{ width: `${wellnessScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-black border border-red-500/30 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">UPTIME STREAK</h2>
                  <div className="text-xs text-blue-500">TRACKING</div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold mb-1 text-white">{dailyStreak} DAYS</div>
                <div className="text-xs text-gray-500">CONSECUTIVE ACCESS</div>
              </div>
            </div>
            <div className="bg-black border border-red-500/30 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">SYSTEM CREDITS</h2>
                  <div className="text-xs text-yellow-500">ACCUMULATING</div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold mb-1 text-white">{wellnessPoints} PTS</div>
                <div className="text-xs text-gray-500">EXCHANGE FOR UPGRADES</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto mb-6 border-b border-red-500/30">
            <button
              className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                activeTab === 'insights'
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              <div className="flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                NEURAL INSIGHTS
              </div>
              {activeTab === 'insights' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
            <button
              className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                activeTab === 'challenges'
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('challenges')}
            >
              <div className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                SYSTEM CHALLENGES
              </div>
              {activeTab === 'challenges' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
            <button
              className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                activeTab === 'simulator'
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('simulator')}
            >
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                FINANCIAL SIMULATOR
              </div>
              {activeTab === 'simulator' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
            <button
              className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center">
                <Terminal className="mr-2 h-4 w-4" />
                USER PROFILER
              </div>
              {activeTab === 'profile' && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Flame className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">PEAK SPENDING PATTERN</p>
                        <p className="text-lg font-bold">WEEKENDS</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ALLOCATION VECTORS</p>
                        <p className="text-lg font-bold">7 CATEGORIES</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <Zap className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">TRANSACTION AVERAGE</p>
                        <p className="text-lg font-bold">{formatCurrency(37.42)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-red-900/20">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs text-red-500 tracking-widest">BEHAVIORAL ANALYSIS</h2>
                  </div>
                </div>

                <div className="divide-y divide-red-900/10">
                  <div className="p-5">
                    <div className="flex items-start">
                      <Brain className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-white text-sm">WEEKEND SPENDING SPIKE DETECTED</h3>
                        <p className="text-sm text-gray-400 mt-1">43% resource allocation increase on weekends, primarily in entertainment and food sectors.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-white text-sm">COFFEE RESOURCE DRAIN ALERT</h3>
                        <p className="text-sm text-gray-400 mt-1">Caffeine expenditure increased 27% this cycle. Recommend home brewing twice weekly to save $22.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start">
                      <Brain className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-white text-sm">NIGHT IMPULSE TRANSACTION PATTERN</h3>
                        <p className="text-sm text-gray-400 mt-1">Most clothing purchases occur during night cycle (after 22:00). Temporal correlation suggests impaired decision-making.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-white text-sm">SUBSCRIPTION REDUNDANCY DETECTED</h3>
                        <p className="text-sm text-gray-400 mt-1">3 content streaming services with 87% content overlap. Consolidation would preserve $14/month.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg p-6 border border-red-500/30">
                <h2 className="text-lg font-bold mb-2 text-red-500">FINANCIAL OPTIMIZATION PROGRAM</h2>
                <p className="mb-4 text-gray-400 text-sm">Execute challenges to reinforce positive financial protocols and earn system credits.</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-black/50 rounded-lg px-4 py-2">
                    <p className="text-xs text-gray-500">CURRENT ACCESS LEVEL</p>
                    <p className="text-lg font-bold text-red-400">RED TIER</p>
                  </div>
                  <div className="bg-black/50 rounded-lg px-4 py-2">
                    <p className="text-xs text-gray-500">NEXT REWARD</p>
                    <p className="text-sm font-medium text-white">200 PTS → PREMIUM FEATURES</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-red-500 text-sm mb-2">{challenge.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            challenge.difficulty === 'easy'
                              ? 'bg-green-900/20 text-green-500 border border-green-500/20'
                              : challenge.difficulty === 'medium'
                                ? 'bg-yellow-900/20 text-yellow-500 border border-yellow-500/20'
                                : 'bg-red-900/20 text-red-500 border border-red-500/20'
                          }`}
                        >
                          {challenge.difficulty === 'easy' ? 'TIER 1' : challenge.difficulty === 'medium' ? 'TIER 2' : 'TIER 3'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold text-yellow-500">
                            {challenge.reward} CREDITS
                          </span>
                        </div>
                        {challenge.completed ? (
                          <span
                            className="bg-green-900/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium flex items-center border border-green-500/20"
                          >
                            <BadgeCheck className="h-3 w-3 mr-1" />
                            COMPLETED
                          </span>
                        ) : (
                          <button
                            onClick={() => completeChallenge(challenge.id)}
                            className="bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-500 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                          >
                            EXECUTE
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
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
                <div className="p-5">
                  <h2 className="text-lg font-bold mb-4 text-red-500">RESOURCE ALLOCATION SIMULATOR</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Model financial variable adjustments and predict long-term outcome probabilities.
                  </p>

                  {!simulationActive ? (
                    <div className="text-center py-4">
                      <button
                        onClick={startSimulation}
                        className="bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        INITIATE SMART SIMULATION
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-2 text-red-400 text-sm">POTENTIAL MONTHLY SAVINGS</h3>
                        <div className="text-3xl font-bold text-red-500">
                          {formatCurrency(simulationSavings)}
                        </div>
                        <div className="text-xs text-red-400 mt-1">
                          {formatCurrency(simulationSavings * 12)} ANNUAL OPTIMIZATION
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-semibold mb-3 text-sm text-white">SUGGESTED PROTOCOL ADJUSTMENTS</h3>
                        <div className="space-y-3">
                          {simulationChanges.map((change, idx) => (
                            <div
                              key={idx}
                              className="flex items-start p-3 border border-red-500/20 rounded-lg bg-black/30"
                            >
                              {change.action === 'reduce' ? (
                                <ArrowDownCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                              ) : change.action === 'consolidate' ? (
                                <CircleOff className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                              ) : (
                                <ArrowUpCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-medium text-white text-sm">
                                  {change.action === 'reduce'
                                    ? `Reduce ${change.category} spending`
                                    : change.action === 'consolidate'
                                      ? `Consolidate ${change.category}`
                                      : `Optimize ${change.category} purchases`}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Est. savings: {formatCurrency(change.amount)}/month
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setSimulationActive(false)}
                          className="border border-red-500/20 text-gray-400 px-3 py-1.5 rounded-lg text-xs"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={applySimulationChanges}
                          className="bg-red-500 hover:bg-red-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          DEPLOY CHANGES
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-4 text-red-500">TEMPORAL PROJECTION</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-black/50 p-4 rounded-lg border border-red-500/20">
                      <div className="text-xs text-gray-500 mb-1">CURRENT MONTHLY BACKUP</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(income * 0.1)}</div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-lg border border-red-500/20">
                      <div className="text-xs text-gray-500 mb-1">12-MONTH PROJECTION</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(income * 0.1 * 12)}</div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-lg border border-red-500/20">
                      <div className="text-xs text-gray-500 mb-1">60-MONTH PROJECTION</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(income * 0.1 * 12 * 5 * 1.15)}</div>
                    </div>
                  </div>

                  <div className="border-t border-red-900/20 pt-4">
                    <h4 className="font-medium mb-3 text-sm text-white">WITH PROTOCOL ADJUSTMENTS</h4>

                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full">
                        <div className="h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-xs font-medium text-white">+65%</span>
                    </div>

                    <div className="text-xs text-gray-400">
                      With suggested optimizations, your 60-month projection increases to{' '}
                      {formatCurrency(income * 0.1 * 12 * 5 * 1.15 * 1.65)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-red-500">AGENT PROFILE CONFIGURATION</h2>
                      <p className="text-sm text-gray-400">
                        Financial behavior pattern analysis and classification
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPersonalityQuiz(true)}
                      className="text-red-500 hover:text-red-400 text-xs font-medium"
                    >
                      RUN DIAGNOSTICS
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-red-900/20 to-black rounded-lg p-5 mb-6 border border-red-500/20">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center text-black mr-4">
                        <Lock className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="text-xs text-red-400 mb-1">PRIMARY PROTOCOL TYPE</div>
                        <h3 className="text-2xl font-bold text-red-500">{personalityType}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300">
                      You prioritize financial security and implement cautious spending protocols. 
                      Your methods are systematic regarding resource preservation and you prefer 
                      predictable expenditures to spontaneous transactions.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-sm text-white">SYSTEM STRENGTHS</h3>
                    <div className="space-y-2">
                      {userStrengths.map((strength, idx) => (
                        <div key={idx} className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-300">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-sm text-white">SYSTEM VULNERABILITIES</h3>
                    <div className="space-y-2">
                      {userWeaknesses.map((weakness, idx) => (
                        <div key={idx} className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-gray-300">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-4 text-red-500">PROTOCOL RECOMMENDATIONS</h3>

                  <div className="space-y-4">
                    <div className="p-4 border border-red-500/20 rounded-lg bg-black/30">
                      <h4 className="font-medium mb-2 text-sm text-white">IMPLEMENT 24-HOUR TRANSACTION DELAY</h4>
                      <p className="text-xs text-gray-400">
                        For non-critical acquisitions exceeding $50, deploy 24-hour waiting protocol before transaction approval. 
                        This reduces impulsive resource allocation while preserving planned expenditures.
                      </p>
                    </div>

                    <div className="p-4 border border-red-500/20 rounded-lg bg-black/30">
                      <h4 className="font-medium mb-2 text-sm text-white">DEPLOY AUTOMATED TRANSFERS</h4>
                      <p className="text-xs text-gray-400">
                        Program automatic resource allocation to savings upon income receipt. 
                        This bypasses decision matrix vulnerabilities, ensuring consistent wealth accumulation.
                      </p>
                    </div>

                    <div className="p-4 border border-red-500/20 rounded-lg bg-black/30">
                      <h4 className="font-medium mb-2 text-sm text-white">ESTABLISH "RECREATIONAL ALLOCATION" PROTOCOL</h4>
                      <p className="text-xs text-gray-400">
                        Designate predetermined resource allowance specifically for unplanned expenditures.
                        This maintains security-seeking baseline while permitting occasional reward-based activities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom status bar */}
        <footer className="w-full mt-8 border-t border-red-900/30 pt-3 pb-6 flex justify-between items-center text-xs text-gray-600 px-8">
          <div>FINANCIAL PROTOCOL MATRIX v3.4.7</div>
          <div className="text-right">&copy; 2025 ALL RIGHTS RESERVED</div>
        </footer>
      </div>

      {/* Personality Quiz Modal */}
      {showPersonalityQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-black border border-red-500/30 rounded-lg w-full max-w-lg mx-4">
            <div className="p-5">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-red-500">FINANCIAL PROFILING SCAN</h3>
                <button
                  onClick={() => setShowPersonalityQuiz(false)}
                  className="text-gray-500 hover:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="mb-4 text-sm text-gray-300">
                  Answer these diagnostic queries to identify your financial operating parameters.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2 text-sm text-white">
                      PRIMARY DECISION VARIABLE WHEN ALLOCATING RESOURCES:
                    </label>
                    <select
                      className="w-full p-2 border border-red-500/20 rounded bg-black/50 text-gray-300 text-sm"
                    >
                      <option>LONGEVITY AND VALUE COEFFICIENT</option>
                      <option>EXPERIENCE OR ENJOYMENT METRICS</option>
                      <option>SOCIAL PERCEPTION VARIABLES</option>
                      <option>PRICE AND UTILITY QUOTIENT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-sm text-white">
                      RISK TOLERANCE CONFIGURATION:
                    </label>
                    <select
                      className="w-full p-2 border border-red-500/20 rounded bg-black/50 text-gray-300 text-sm"
                    >
                      <option>MINIMAL - AVOID RISK VECTORS</option>
                      <option>LOW - ACCEPT CALCULATED RISKS</option>
                      <option>MODERATE - WILLING TO ENGAGE CHANCE</option>
                      <option>HIGH - SEEK VARIABLE OUTCOMES</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-sm text-white">
                      ACQUISITION PROTOCOL SIGNATURE:
                    </label>
                    <select
                      className="w-full p-2 border border-red-500/20 rounded bg-black/50 text-gray-300 text-sm"
                    >
                      <option>EXTENSIVE PRE-ACQUISITION RESEARCH</option>
                      <option>ATTENTION-BASED SELECTION</option>
                      <option>QUALITY-OPTIMIZED PROCUREMENT</option>
                      <option>DISCOUNT-SEEKING ALGORITHM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    // In a real app, this would analyze answers and set the personality type
                    const randomType =
                      personalityCategories[
                        Math.floor(Math.random() * personalityCategories.length)
                      ]
                    setPersonalityType(randomType)
                    setShowPersonalityQuiz(false)
                  }}
                  className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg text-sm font-bold"
                >
                  PROCESS RESULTS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for animations and effects */}
      <style jsx>{`
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

