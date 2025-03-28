import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useDarkModeStore } from './__root'
import { useExpenseStore } from '../stores/expenseStore'
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
} from 'lucide-react'

// Mock data for demonstration - would be calculated from real user data
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

// Categories for spending personality quiz
const personalityCategories = [
  'Security Seeker',
  'Status Spender',
  'Experience Collector',
  'Practical Purchaser',
  'Spontaneous Shopper',
  'Mindful Minimalist',
]

const FinancialWellness = () => {
  const { isDarkMode } = useDarkModeStore()
  const { expenses, income } = useExpenseStore()

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

  return (
    <div
      className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}
      id="darky"
    >
      <header className="header">
        <div className="header-top">
          <h1>Financial Wellness Center</h1>
        </div>

        {/* Stats Cards Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Financial Wellness Score</div>
            <div className="stat-value">{wellnessScore}/100</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Daily Streak</div>
            <div className="stat-value">{dailyStreak} days</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Wellness Points</div>
            <div className="stat-value">{wellnessPoints} pts</div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Tab Navigation */}
        <section className="surrounding-tabs">
          <nav className="tabs">
            <button
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <Brain className="h-4 w-4 mr-2" />
              Behavior Insights
            </button>
            <button
              className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <Award className="h-4 w-4 mr-2" />
              Financial Challenges
            </button>
            <button
              className={`tab-button ${activeTab === 'simulator' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulator')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Budget Simulator
            </button>
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <CalendarClock className="h-4 w-4 mr-2" />
              Spending Personality
            </button>
          </nav>
        </section>

        <main>
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="p-6">
              {insights ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div
                    className="bg-white rounded-lg shadow-lg p-6"
                    style={{
                      backgroundColor: isDarkMode
                        ? 'var(--card-background)'
                        : 'white',
                    }}
                  >
                    <div className="flex items-center">
                      <Flame className="h-8 w-8 text-orange-500 mr-3" />
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: isDarkMode
                              ? 'var(--text-primary)'
                              : 'inherit',
                          }}
                        >
                          Highest Spending Day
                        </h3>
                        <p
                          className="text-2xl font-bold"
                          style={{
                            color: isDarkMode ? 'var(--primary)' : 'inherit',
                          }}
                        >
                          {insights.highestSpendingDay}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-lg shadow-lg p-6"
                    style={{
                      backgroundColor: isDarkMode
                        ? 'var(--card-background)'
                        : 'white',
                    }}
                  >
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-purple-500 mr-3" />
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: isDarkMode
                              ? 'var(--text-primary)'
                              : 'inherit',
                          }}
                        >
                          Spending Categories
                        </h3>
                        <p
                          className="text-2xl font-bold"
                          style={{
                            color: isDarkMode ? 'var(--primary)' : 'inherit',
                          }}
                        >
                          {insights.totalCategories}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-lg shadow-lg p-6"
                    style={{
                      backgroundColor: isDarkMode
                        ? 'var(--card-background)'
                        : 'white',
                    }}
                  >
                    <div className="flex items-center">
                      <Zap className="h-8 w-8 text-cyan-500 mr-3" />
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: isDarkMode
                              ? 'var(--text-primary)'
                              : 'inherit',
                          }}
                        >
                          Average Transaction
                        </h3>
                        <p
                          className="text-2xl font-bold"
                          style={{
                            color: isDarkMode ? 'var(--primary)' : 'inherit',
                          }}
                        >
                          {formatCurrency(insights.averageTransaction)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{
                  backgroundColor: isDarkMode
                    ? 'var(--card-background)'
                    : 'white',
                }}
              >
                <div
                  className="p-6 border-b"
                  style={{
                    borderColor: isDarkMode ? 'var(--border-color)' : 'inherit',
                  }}
                >
                  <h2
                    className="text-xl font-semibold"
                    style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                    }}
                  >
                    Behavioral Insights
                  </h2>
                </div>

                <div
                  className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`}
                >
                  {mockInsights.map((insight) => (
                    <div key={insight.id} className="p-5">
                      <div className="flex items-start">
                        {insight.type === 'pattern' ? (
                          <Brain className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                        ) : insight.type === 'suggestion' ? (
                          <Lightbulb className="h-6 w-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        ) : (
                          <BadgeCheck className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <h3
                            className="font-semibold text-lg"
                            style={{
                              color: isDarkMode
                                ? 'var(--text-primary)'
                                : 'inherit',
                            }}
                          >
                            {insight.title}
                          </h3>
                          <p
                            className="text-gray-600"
                            style={{
                              color: isDarkMode
                                ? 'var(--text-secondary)'
                                : 'inherit',
                            }}
                          >
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
            <div className="p-6">
              <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold mb-2">
                  Financial Fitness Program
                </h2>
                <p className="mb-4">
                  Complete challenges to build healthy financial habits and earn
                  wellness points.
                </p>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 mr-4">
                    <span className="block text-sm">Current Level</span>
                    <span className="text-xl font-bold">Gold Saver</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <span className="block text-sm">Next Reward</span>
                    <span className="text-xl font-bold">
                      200 pts → Premium Features
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{
                      backgroundColor: isDarkMode
                        ? 'var(--card-background)'
                        : 'white',
                    }}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3
                          className="font-semibold text-lg mb-2"
                          style={{
                            color: isDarkMode
                              ? 'var(--text-primary)'
                              : 'inherit',
                          }}
                        >
                          {challenge.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.difficulty === 'easy'
                              ? 'bg-green-100 text-green-800'
                              : challenge.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                          style={{
                            backgroundColor: isDarkMode
                              ? challenge.difficulty === 'easy'
                                ? 'rgba(74, 222, 128, 0.2)'
                                : challenge.difficulty === 'medium'
                                  ? 'rgba(250, 204, 21, 0.2)'
                                  : 'rgba(248, 113, 113, 0.2)'
                              : undefined,
                            color: isDarkMode
                              ? challenge.difficulty === 'easy'
                                ? 'rgb(74, 222, 128)'
                                : challenge.difficulty === 'medium'
                                  ? 'rgb(250, 204, 21)'
                                  : 'rgb(248, 113, 113)'
                              : undefined,
                          }}
                        >
                          {challenge.difficulty.charAt(0).toUpperCase() +
                            challenge.difficulty.slice(1)}
                        </span>
                      </div>
                      <p
                        className="text-gray-600 mb-4"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        {challenge.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Coins className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="font-semibold">
                            {challenge.reward} points
                          </span>
                        </div>
                        {challenge.completed ? (
                          <span
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                            style={{
                              backgroundColor: isDarkMode
                                ? 'rgba(74, 222, 128, 0.2)'
                                : undefined,
                              color: isDarkMode
                                ? 'rgb(74, 222, 128)'
                                : undefined,
                            }}
                          >
                            <BadgeCheck className="h-4 w-4 mr-1" />
                            Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => completeChallenge(challenge.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: isDarkMode
                                ? 'var(--primary)'
                                : undefined,
                            }}
                          >
                            Complete
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
            <div className="p-6">
              <div
                className="bg-white rounded-lg shadow-lg mb-6"
                style={{
                  backgroundColor: isDarkMode
                    ? 'var(--card-background)'
                    : 'white',
                }}
              >
                <div className="p-6">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                    }}
                  >
                    Budget Impact Simulator
                  </h2>
                  <p
                    className="text-gray-600 mb-6"
                    style={{
                      color: isDarkMode ? 'var(--text-secondary)' : 'inherit',
                    }}
                  >
                    Simulate small changes to your spending habits and see the
                    impact over time.
                  </p>

                  {!simulationActive ? (
                    <div className="text-center">
                      <button
                        onClick={startSimulation}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                        style={{
                          backgroundColor: isDarkMode
                            ? 'var(--primary)'
                            : undefined,
                        }}
                      >
                        Run Smart Simulation
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                        style={{
                          backgroundColor: isDarkMode
                            ? 'rgba(59, 130, 246, 0.1)'
                            : undefined,
                          borderColor: isDarkMode
                            ? 'rgba(59, 130, 246, 0.2)'
                            : undefined,
                        }}
                      >
                        <h3
                          className="font-semibold mb-2 text-blue-800"
                          style={{
                            color: isDarkMode
                              ? 'rgb(147, 197, 253)'
                              : undefined,
                          }}
                        >
                          Potential Monthly Savings
                        </h3>
                        <div
                          className="text-3xl font-bold text-blue-800"
                          style={{
                            color: isDarkMode
                              ? 'rgb(147, 197, 253)'
                              : undefined,
                          }}
                        >
                          {formatCurrency(simulationSavings)}
                        </div>
                        <div
                          className="text-sm text-blue-700 mt-1"
                          style={{
                            color: isDarkMode
                              ? 'rgb(191, 219, 254)'
                              : undefined,
                          }}
                        >
                          That's {formatCurrency(simulationSavings * 12)} per
                          year!
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3
                          className="font-semibold mb-3"
                          style={{
                            color: isDarkMode
                              ? 'var(--text-primary)'
                              : 'inherit',
                          }}
                        >
                          Suggested Changes
                        </h3>
                        <div className="space-y-3">
                          {simulationChanges.map((change, idx) => (
                            <div
                              key={idx}
                              className="flex items-start p-3 border rounded-lg"
                              style={{
                                borderColor: isDarkMode
                                  ? 'var(--border-color)'
                                  : 'inherit',
                              }}
                            >
                              {change.action === 'reduce' ? (
                                <ArrowDownCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                              ) : change.action === 'consolidate' ? (
                                <CircleOff className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                              ) : (
                                <ArrowUpCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                              )}
                              <div>
                                <div
                                  className="font-medium"
                                  style={{
                                    color: isDarkMode
                                      ? 'var(--text-primary)'
                                      : 'inherit',
                                  }}
                                >
                                  {change.action === 'reduce'
                                    ? `Reduce ${change.category} spending`
                                    : change.action === 'consolidate'
                                      ? `Consolidate ${change.category}`
                                      : `Optimize ${change.category} purchases`}
                                </div>
                                <div
                                  className="text-sm text-gray-600"
                                  style={{
                                    color: isDarkMode
                                      ? 'var(--text-secondary)'
                                      : 'inherit',
                                  }}
                                >
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
                          className="px-4 py-2 border rounded-lg text-gray-700 font-medium"
                          style={{
                            borderColor: isDarkMode
                              ? 'var(--border-color)'
                              : 'inherit',
                            color: isDarkMode
                              ? 'var(--text-primary)'
                              : 'inherit',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={applySimulationChanges}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Apply Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? 'var(--card-background)'
                    : 'white',
                }}
              >
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                    }}
                  >
                    Long-Term Projection
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                      className="bg-gray-50 p-4 rounded-lg"
                      style={{
                        backgroundColor: isDarkMode
                          ? 'var(--hover-background)'
                          : undefined,
                      }}
                    >
                      <div
                        className="text-sm text-gray-500 mb-1"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        Current Monthly Savings
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        {formatCurrency(income * 0.1)}
                      </div>
                    </div>

                    <div
                      className="bg-gray-50 p-4 rounded-lg"
                      style={{
                        backgroundColor: isDarkMode
                          ? 'var(--hover-background)'
                          : undefined,
                      }}
                    >
                      <div
                        className="text-sm text-gray-500 mb-1"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        1-Year Projection
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        {formatCurrency(income * 0.1 * 12)}
                      </div>
                    </div>

                    <div
                      className="bg-gray-50 p-4 rounded-lg"
                      style={{
                        backgroundColor: isDarkMode
                          ? 'var(--hover-background)'
                          : undefined,
                      }}
                    >
                      <div
                        className="text-sm text-gray-500 mb-1"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        5-Year Projection
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        {formatCurrency(income * 0.1 * 12 * 5 * 1.15)}
                      </div>
                    </div>
                  </div>

                  <div
                    className="border-t pt-4"
                    style={{
                      borderColor: isDarkMode
                        ? 'var(--border-color)'
                        : 'inherit',
                    }}
                  >
                    <h4
                      className="font-medium mb-3"
                      style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      If you apply the suggested changes
                    </h4>

                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="flex-1 h-1 bg-gray-200 rounded-full"
                        style={{
                          backgroundColor: isDarkMode
                            ? 'var(--border-color)'
                            : undefined,
                        }}
                      >
                        <div
                          className="h-1 bg-green-500 rounded-full"
                          style={{ width: '65%' }}
                        ></div>
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        +65%
                      </span>
                    </div>

                    <div
                      className="text-sm text-gray-600"
                      style={{
                        color: isDarkMode ? 'var(--text-secondary)' : 'inherit',
                      }}
                    >
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
            <div className="p-6">
              <div
                className="bg-white rounded-lg shadow-lg mb-6"
                style={{
                  backgroundColor: isDarkMode
                    ? 'var(--card-background)'
                    : 'white',
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2
                        className="text-xl font-semibold"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        Your Spending Personality
                      </h2>
                      <p
                        className="text-gray-600"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        Based on your spending patterns and financial behavior
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPersonalityQuiz(true)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      style={{
                        color: isDarkMode ? 'var(--primary)' : undefined,
                      }}
                    >
                      Take Quiz
                    </button>
                  </div>

                  <div
                    className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6"
                    style={{
                      background: isDarkMode
                        ? 'linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))'
                        : undefined,
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-purple-500 flex items-center justify-center text-white mr-4">
                        <DollarSign className="h-8 w-8" />
                      </div>
                      <div>
                        <div
                          className="text-sm text-purple-600 mb-1"
                          style={{
                            color: isDarkMode
                              ? 'rgb(192, 132, 252)'
                              : undefined,
                          }}
                        >
                          Your primary type
                        </div>
                        <h3
                          className="text-2xl font-bold text-purple-800"
                          style={{
                            color: isDarkMode
                              ? 'rgb(216, 180, 254)'
                              : undefined,
                          }}
                        >
                          {personalityType}
                        </h3>
                      </div>
                    </div>

                    <p
                      className="text-purple-800"
                      style={{
                        color: isDarkMode ? 'rgb(216, 180, 254)' : undefined,
                      }}
                    >
                      You prioritize financial security and tend to be cautious
                      with spending. You're methodical about saving and prefer
                      predictable expenses to spontaneous purchases.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3
                      className="font-semibold mb-3"
                      style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      Your Financial Strengths
                    </h3>
                    <div className="space-y-2">
                      {userStrengths.map((strength, idx) => (
                        <div key={idx} className="flex items-center">
                          <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                          <span
                            style={{
                              color: isDarkMode
                                ? 'var(--text-primary)'
                                : 'inherit',
                            }}
                          >
                            {strength}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3
                      className="font-semibold mb-3"
                      style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      Areas for Improvement
                    </h3>
                    <div className="space-y-2">
                      {userWeaknesses.map((weakness, idx) => (
                        <div key={idx} className="flex items-center">
                          <ArrowUpCircle className="h-5 w-5 text-orange-500 mr-2" />
                          <span
                            style={{
                              color: isDarkMode
                                ? 'var(--text-primary)'
                                : 'inherit',
                            }}
                          >
                            {weakness}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? 'var(--card-background)'
                    : 'white',
                }}
              >
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                    }}
                  >
                    Personalized Recommendations
                  </h3>

                  <div className="space-y-4">
                    <div
                      className="p-4 border rounded-lg"
                      style={{
                        borderColor: isDarkMode
                          ? 'var(--border-color)'
                          : 'inherit',
                      }}
                    >
                      <h4
                        className="font-medium mb-2"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        Try a 24-Hour Purchase Delay
                      </h4>
                      <p
                        className="text-gray-600 text-sm"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        For non-essential purchases over $50, wait 24 hours
                        before buying. This reduces impulse spending while still
                        allowing planned purchases.
                      </p>
                    </div>

                    <div
                      className="p-4 border rounded-lg"
                      style={{
                        borderColor: isDarkMode
                          ? 'var(--border-color)'
                          : 'inherit',
                      }}
                    >
                      <h4
                        className="font-medium mb-2"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        Set Up Automatic Transfers
                      </h4>
                      <p
                        className="text-gray-600 text-sm"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        Schedule automatic transfers to savings on days you
                        receive income. This helps build your savings without
                        requiring active decisions.
                      </p>
                    </div>

                    <div
                      className="p-4 border rounded-lg"
                      style={{
                        borderColor: isDarkMode
                          ? 'var(--border-color)'
                          : 'inherit',
                      }}
                    >
                      <h4
                        className="font-medium mb-2"
                        style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        Create a "Fun Money" Fund
                      </h4>
                      <p
                        className="text-gray-600 text-sm"
                        style={{
                          color: isDarkMode
                            ? 'var(--text-secondary)'
                            : 'inherit',
                        }}
                      >
                        Allocate a small portion of your budget specifically for
                        spontaneous spending without guilt. This balances your
                        security-seeking nature with occasional enjoyment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Personality Quiz Modal */}
      {showPersonalityQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg w-full max-w-lg mx-4"
            style={{
              backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3
                  className="text-xl font-semibold"
                  style={{
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                  }}
                >
                  Spending Personality Quiz
                </h3>
                <button
                  onClick={() => setShowPersonalityQuiz(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p
                  className="mb-4"
                  style={{
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                  }}
                >
                  Answer a few questions to discover your financial personality
                  type.
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block font-medium mb-2"
                      style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      When making a purchase decision, what matters most to you?
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      style={{
                        backgroundColor: isDarkMode
                          ? 'var(--hover-background)'
                          : 'white',
                        borderColor: isDarkMode
                          ? 'var(--border-color)'
                          : 'inherit',
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      <option>Value and longevity</option>
                      <option>The experience or enjoyment</option>
                      <option>How it makes me look or feel</option>
                      <option>Price and practicality</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block font-medium mb-2"
                      style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      How do you feel about financial risks?
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      style={{
                        backgroundColor: isDarkMode
                          ? 'var(--hover-background)'
                          : 'white',
                        borderColor: isDarkMode
                          ? 'var(--border-color)'
                          : 'inherit',
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      <option>Very cautious - I avoid risks</option>
                      <option>
                        Somewhat cautious - I take calculated risks
                      </option>
                      <option>
                        Somewhat open - I'm willing to take chances
                      </option>
                      <option>Very open - High risk, high reward</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block font-medium mb-2"
                      style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      What best describes your shopping style?
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      style={{
                        backgroundColor: isDarkMode
                          ? 'var(--hover-background)'
                          : 'white',
                        borderColor: isDarkMode
                          ? 'var(--border-color)'
                          : 'inherit',
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit',
                      }}
                    >
                      <option>I research extensively before buying</option>
                      <option>I buy what catches my attention</option>
                      <option>I prefer quality items that last</option>
                      <option>I look for deals and discounts</option>
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--primary)' : undefined,
                  }}
                >
                  See My Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createLazyFileRoute('/about')({
  component: FinancialWellness,
})
