import React, { useEffect, useState, useMemo } from 'react'
import '../../../assets/index.css'
import '../../../assets/expenses.css'
import '../../../assets/statsCard.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Calendar, DollarSign, PiggyBank, Wallet, Sparkles, Plus, Move, Bell } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import CashFlowForecast from '@renderer/components/Themes/Default/CashFlowForecast'
// Import the notification system instead of the button

import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useUpcomingBills } from '@renderer/lib/upcomingBill'
import { useNotificationSystem, NotificationType } from '@renderer/components/NotificationSystem'
import { useExpenseStore } from '@renderer/stores/expenseStore'
import { useDarkModeStore } from '@renderer/stores/themeStore'

// Create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive)

// Function to group small categories together as "Other"
const getCombinedCategoryData = (data, maxCategories) => {
  if (!data || data.length <= maxCategories) return data

  // Sort by value (largest first)
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  // Take the top categories
  const topCategories = sortedData.slice(0, maxCategories - 1)

  // Combine the rest as "Other"
  const otherCategories = sortedData.slice(maxCategories - 1)
  const otherValue = otherCategories.reduce((sum, item) => sum + item.value, 0)

  if (otherValue > 0) {
    topCategories.push({
      name: 'Other',
      value: otherValue
    })
  }

  return topCategories
}

export const CyberpunkIndex = () => {
  const { expenses, addExpense, addCashFlowTransaction } = useExpenseStore()
  const { isDarkMode } = useDarkModeStore()
  const { showNotification } = useNotificationSystem()
  const upcomingBills = useUpcomingBills(30)

  // Form state for expense entry
  const [quickEntryDate, setQuickEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [quickEntryCategory, setQuickEntryCategory] = useState('')
  const [quickEntryAmount, setQuickEntryAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  // UI state
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [animateHeader, setAnimateHeader] = useState(true)
  const [highlightedSection, setHighlightedSection] = useState('overview')

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  // Format percentage helper
  const formatPercentage = (value, total) => {
    if (total === 0) return '0%'
    return Math.round((value / total) * 100) + '%'
  }

  // Calculate budget overview
  const budgetOverview = useMemo(() => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const estimatedIncome = 3500 // This would come from income in a real app
    return {
      income: estimatedIncome,
      spent: totalSpent,
      remaining: estimatedIncome - totalSpent,
      percentage: Math.round((totalSpent / estimatedIncome) * 100)
    }
  }, [expenses])

  // Get recent expenses
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [expenses])

  // Calculate category totals
  const categoryData = useMemo(() => {
    const categoryTotals = {}

    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a: any, b: any) => b.value - a.value)
  }, [expenses])

  // Handle expense form submission
  const handleAddExpense = (e) => {
    e.preventDefault()
    const amount = parseFloat(quickEntryAmount)

    if (!quickEntryCategory || isNaN(amount) || amount <= 0 || !quickEntryDate) {
      showNotification('ERROR', 'Please fill all fields correctly!', NotificationType.ERROR)
      return
    }

    // Add expense
    const newExpense = {
      date: quickEntryDate,
      category: quickEntryCategory,
      amount: amount
    }
    addExpense(newExpense)

    // Add as recurring if selected
    if (isRecurring) {
      const newTransaction = {
        date: quickEntryDate,
        type: 'expense',
        category: quickEntryCategory,
        description: `Recurring ${quickEntryCategory} payment`,
        amount: amount
      }
      addCashFlowTransaction(newTransaction)

      showNotification(
        'SUCCESS',
        `Added recurring ${quickEntryCategory} expense`,
        NotificationType.SUCCESS
      )
    } else {
      showNotification('SUCCESS', `Added ${quickEntryCategory} expense`, NotificationType.SUCCESS)
    }

    // Reset form and close modal
    setQuickEntryAmount('')
    setQuickEntryCategory('')
    setShowExpenseModal(false)
  }

  // Categories for expense form
  const categories = [
    'Rent',
    'Groceries',
    'Utilities',
    'Insurance',
    'Dining Out',
    'Entertainment',
    'Transportation',
    'Clothes',
    'Health',
    'Education',
    'Other'
  ]

  // Calculate how many days until a bill is due
  const getDaysUntil = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return 'Overdue'
    return `${diffDays} days`
  }

  // Get urgent bills
  const urgentBills = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    return upcomingBills
      .filter((bill) => {
        const dueDate = new Date(bill.dueDate)
        return dueDate <= nextWeek
      })
      .slice(0, 3)
  }, [upcomingBills])

  // Get current month and year
  const currentDate = new Date()
  const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER'
  ]
  const currentMonth = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()

  // Spending chart data (simplified)
  const generateSpendingData = () => {
    const data: number[] = []
    for (let i = 0; i < 12; i++) {
      const value = Math.floor(Math.random() * 80) + 20
      data.push(value)
    }
    return data
  }

  const spendingData = generateSpendingData()
  const maxValue = Math.max(...spendingData)

  // Disable header animation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateHeader(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}

      {/* <div className="relative z-10 max-w-screen-2xl mx-auto p-4"> 
    
    <header className={`mb-8 ${animateHeader }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <div className="relative">
              <h1 className="text-4xl font-black text-red-500 tracking-tighter glitch-text">
DASHBOARD
                <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-2">DASHBOARD</span>
                <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-3">DASHBOARD</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-[1px] w-2 bg-red-500"></div>
                <div className="text-xs text-gray-500">{currentMonth} {currentDay}, {currentYear}</div>
              </div>
            </div>
          </div>
        </header>
        </div> */}
        {/* mb */}
        <div className="mb-[60px]"></div>
      
      <div className="fixed inset-0 z-0 ">
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-red-600/20 mix-blend-screen blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-red-800/10 mix-blend-screen blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-br from-black via-red-950/10 to-black rounded-full mix-blend-screen filter blur-[80px]">
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-black/70 backdrop-blur-md border border-red-500/80 rounded-lg w-full max-w-md overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
              <div className="relative p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-widest">// ADD EXPENSE</h2>
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="text-red-500 hover:text-red-400 focus:outline-none glitch-effect"
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

            <form onSubmit={handleAddExpense} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-red-500 mb-1">DATE</label>
                <input
                  type="date"
                  value={quickEntryDate}
                  onChange={(e) => setQuickEntryDate(e.target.value)}
                  className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                <select
                  value={quickEntryCategory}
                  onChange={(e) => setQuickEntryCategory(e.target.value)}
                  className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">SELECT CATEGORY</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">AMOUNT</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    value={quickEntryAmount}
                    onChange={(e) => setQuickEntryAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm pl-8 pr-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/70 border border-red-500/50 rounded-sm peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-red-500 after:border-red-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-red-900/30"></div>
                  <span className="ml-3 text-xs">RECURRING</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-sm relative overflow-hidden group"
                >
                  <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></span>
                  SAVE EXPENSE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-screen-2xl mx-auto p-4">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Financial Summary */}
          <div className="lg:col-span-1">
            {/* Income Card */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg mb-6 group hover:border-red-500/60 transition-colors">
              <div className="p-4 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">INCOME</h2>
                  <div className="text-xs text-green-500 animate-pulse-slow">ACTIVE</div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">
                  {formatCurrency(budgetOverview.income)}
                </div>
                <div className="text-xs text-gray-500">100% AVAILABLE</div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">SPENT</div>
                    <div className="font-bold text-red-500">
                      {formatCurrency(budgetOverview.spent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">REMAINING</div>
                    <div className="font-bold text-green-500">
                      {formatCurrency(budgetOverview.remaining)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg mb-6 overflow-hidden">
              <div className="p-4 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">PROGRESS</h2>
                  <div className="text-xs text-gray-500">{budgetOverview.percentage}%</div>
                </div>
              </div>

              <div className="h-2 w-full bg-black">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-700"
                  style={{ width: `${budgetOverview.percentage}%` }}
                ></div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 gap-1">
                  {[25, 50, 75].map((mark) => (
                    <div
                      key={mark}
                      className={`text-xs ${
                        budgetOverview.percentage >= mark ? 'text-red-500' : 'text-gray-700'
                      }`}
                    >
                      {mark}%
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <div className="p-4 border-b border-red-900/20">
                <h2 className="text-xs text-red-500 tracking-widest">QUICK STATS</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">BIGGEST EXPENSE</div>
                  <div className="text-lg font-bold">
                    {categoryData.length > 0 ? categoryData[0].name : 'N/A'}
                  </div>
                  <div className="text-sm text-red-500">
                    {categoryData.length > 0 ? formatCurrency(categoryData[0].value) : '-'}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">THIS MONTH</div>
                  <div className="text-lg font-bold">{recentExpenses.length} Expenses</div>
                  <div className="text-sm text-red-500">{formatCurrency(budgetOverview.spent)}</div>
                </div>

                {/* Status indicator */}
                <div className="pt-2">
                  <div className="inline-flex items-center space-x-1 bg-black rounded-full px-2 py-0.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs text-gray-500">MONITORING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content - Expenses & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Expenses */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <div className="p-4 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">RECENT EXPENSES</h2>
                  <Link to="/expenses" className="text-xs text-gray-500 hover:text-white">
                    VIEW ALL →
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-red-900/10">
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((expense, index) => (
                    <div key={index} className="p-4 hover:bg-red-500/5 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-start space-x-3">
                          <div className="h-6 w-1 bg-red-500/70"></div>
                          <div>
                            <div className="font-medium">{expense.category}</div>
                            <div className="text-xs text-gray-500">{formatDate(expense.date)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-500">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPercentage(expense.amount, budgetOverview.spent)} of spending
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">NO EXPENSE DATA FOUND</div>
                )}
              </div>
            </div>

            {/* Spending Chart */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <div className="p-4 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">SPENDING TREND</h2>
                  <div className="text-xs text-gray-500">LAST 12 DAYS</div>
                </div>
              </div>

              <div className="p-4">
                <div className="h-40 flex items-end space-x-1">
                  {spendingData.map((value, index) => {
                    const height = (value / maxValue) * 100
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group"
                        title={`$${value}`}
                      >
                        <div
                          className="w-full bg-red-800/50 group-hover:bg-red-500/70 relative transition-colors"
                          style={{ height: `${height}%` }}
                        >
                          {/* Value tooltip on hover */}
                          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-black border border-red-500/50 px-1.5 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            ${value}
                          </div>

                          {/* Top glow effect */}
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-400/50"></div>
                        </div>
                        <div className="text-xs text-gray-700 mt-1 group-hover:text-gray-500 transition-colors">
                          {index + 1}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <div className="p-4 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">CATEGORIES</h2>
                  <div className="text-xs text-gray-500">{categoryData.length} TOTAL</div>
                </div>
              </div>

              <div className="p-4">
                {categoryData.length > 0 ? (
                  <div className="space-y-4">
                    {categoryData.slice(0, 4).map((category: any, index) => {
                      const percentage = Math.round((category.value / budgetOverview.spent) * 100)
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm">{category.name}</div>
                            <div className="text-sm">{formatCurrency(category.value)}</div>
                          </div>
                          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-red-600/70 to-red-500/70"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{percentage}%</div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">NO CATEGORY DATA FOUND</div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar - Bills & Budget */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Bills */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <div className="p-4 border-b border-red-900/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs text-red-500 tracking-widest">UPCOMING BILLS</h2>
                  <Link to="/smart-assistant" className="text-xs text-gray-500 hover:text-white">
                    MANAGE →
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-red-900/10">
                {urgentBills.length > 0 ? (
                  urgentBills.map((bill, index) => (
                    <div key={index} className="p-4 hover:bg-red-500/5 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{bill.name}</div>
                          <div className="text-xs text-gray-500">
                            Due {formatDate(bill.dueDate)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-500">
                            {formatCurrency(bill.amount)}
                          </div>
                          <div
                            className={`text-xs ${
                              getDaysUntil(bill.dueDate) === 'Today' ||
                              getDaysUntil(bill.dueDate) === 'Tomorrow' ||
                              getDaysUntil(bill.dueDate) === 'Overdue'
                                ? 'text-red-500 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {getDaysUntil(bill.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">NO UPCOMING BILLS</div>
                )}
              </div>

              {urgentBills.length > 0 && (
                <div className="p-4 border-t border-red-900/10">
                  <button className="w-full bg-black/50 hover:bg-red-900/20 text-xs text-gray-300 py-2 border border-red-900/30 transition-colors">
                    PAY ALL DUE BILLS
                  </button>
                </div>
              )}
            </div>

            {/* Budget Allocations */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <div className="p-4 border-b border-red-900/20">
                <h2 className="text-xs text-red-500 tracking-widest">BUDGET ALLOCATIONS</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment'].map(
                    (category, index) => {
                      const percentage = [30, 20, 15, 10, 5][index]
                      return (
                        <div key={category} className="group">
                          <div className="flex justify-between text-xs mb-1">
                            <div>{category.toUpperCase()}</div>
                            <div className="text-gray-500">{percentage}%</div>
                          </div>
                          <div className="h-1 w-full bg-black/50 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-900/70 via-red-800/70 to-red-700/70 group-hover:from-red-600/70 group-hover:to-red-500/70 transition-colors"
                              style={{ width: `${percentage * 3}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-red-900/10">
                  <button className="w-full bg-red-900/20 hover:bg-red-900/30 text-xs text-red-500 py-2 border border-red-900/30 transition-colors">
                    ADJUST BUDGET
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
              <div className="relative p-4 border-b border-red-900/20">
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-red-500/5 to-transparent"></div>
                <h2 className="text-xs text-red-500 tracking-widest">SYSTEM</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-500">STATUS</div>
                    <div className="text-green-500">ONLINE</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-500">LAST UPDATE</div>
                    <div className="text-white">1 MIN AGO</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-500">NEXT SCAN</div>
                    <div className="text-white countdown" data-value="59">
                      59
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated scanner effect */}
              <div className="relative h-1 w-full bg-black overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-red-500/70 to-transparent animate-scanner"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <footer className="mt-8 border-t border-red-900/30 pt-3 flex justify-between items-center text-xs text-gray-600">
          <div>BUDGETARY SYSTEM v1.0.4</div>
          <div className="text-right">&copy; 2025 ALL RIGHTS RESERVED</div>
        </footer>
      </div>

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
          animation: glitch 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
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
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Shimmer animation */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Countdown animation */
        .countdown::after {
          content: attr(data-value);
          animation: countdown 60s linear infinite;
        }

        @keyframes countdown {
          0% {
            content: '60';
          }
          1.66% {
            content: '59';
          }
          3.33% {
            content: '58';
          }
          /* ... and so on for each second ... */
          98.33% {
            content: '1';
          }
          100% {
            content: '0';
          }
        }
      `}</style>
    </div>
  )
}
