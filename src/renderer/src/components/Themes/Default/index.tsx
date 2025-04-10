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

export const DefaultIndex = () => {
  const { isDarkMode } = useDarkModeStore()
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')

  // For quick entry form
  const { expenses, addExpense, addCashFlowTransaction } = useExpenseStore()
  const [quickEntryDate, setQuickEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [quickEntryCategory, setQuickEntryCategory] = useState('')
  const [quickEntryAmount, setQuickEntryAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  // Replace old notification state with the new notification system
  const { showNotification } = useNotificationSystem()

  // Get upcoming bills using our new hook
  const upcomingBills = useUpcomingBills(30) // Show bills for next 30 days

  // Layout state for grid items
  const [layouts, setLayouts] = useState(() => {
    // Try to load saved layout from localStorage
    const savedLayouts = localStorage.getItem('dashboardLayouts')
    if (savedLayouts) {
      return JSON.parse(savedLayouts)
    }

    // Default layout configuration
    return {
      lg: [
        { i: 'stats', x: 0, y: 0, w: 12, h: 1, static: true },
        { i: 'recent-expenses', x: 0, y: 1, w: 6, h: 4 },
        { i: 'upcoming-bills', x: 0, y: 5, w: 6, h: 4 },
        { i: 'spending-category', x: 6, y: 1, w: 6, h: 4 },
        { i: 'savings-goals', x: 6, y: 5, w: 6, h: 4 },
        { i: 'budget-allocation', x: 0, y: 9, w: 12, h: 4 },
        { i: 'financial-insights', x: 0, y: 13, w: 12, h: 3 },
        { i: 'quick-entry', x: 0, y: 16, w: 12, h: 3 }
      ],
      md: [
        { i: 'stats', x: 0, y: 0, w: 10, h: 1, static: true },
        { i: 'recent-expenses', x: 0, y: 1, w: 5, h: 4 },
        { i: 'upcoming-bills', x: 0, y: 5, w: 5, h: 4 },
        { i: 'spending-category', x: 5, y: 1, w: 5, h: 4 },
        { i: 'savings-goals', x: 5, y: 5, w: 5, h: 4 },
        { i: 'budget-allocation', x: 0, y: 9, w: 10, h: 4 },
        { i: 'financial-insights', x: 0, y: 13, w: 10, h: 3 },
        { i: 'quick-entry', x: 0, y: 16, w: 10, h: 3 }
      ],
      sm: [
        { i: 'stats', x: 0, y: 0, w: 6, h: 1, static: true },
        { i: 'recent-expenses', x: 0, y: 1, w: 6, h: 4 },
        { i: 'upcoming-bills', x: 0, y: 5, w: 6, h: 4 },
        { i: 'spending-category', x: 0, y: 9, w: 6, h: 4 },
        { i: 'savings-goals', x: 0, y: 13, w: 6, h: 4 },
        { i: 'budget-allocation', x: 0, y: 17, w: 6, h: 4 },
        { i: 'financial-insights', x: 0, y: 21, w: 6, h: 3 },
        { i: 'quick-entry', x: 0, y: 24, w: 6, h: 3 }
      ]
    }
  })

  // Custom label rendering function with adjusted connector lines
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    index
  }) => {
    // Only show labels for categories with more than 5% of total
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.15
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // State to toggle edit mode
  const [isEditMode, setIsEditMode] = useState(false)

  // Save layouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardLayouts', JSON.stringify(layouts))
  }, [layouts])

  // Handle quick entry form submission
  const handleQuickAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(quickEntryAmount)

    if (!quickEntryCategory || isNaN(amount) || amount <= 0 || !quickEntryDate) {
      // Show error notification
      showNotification('Error', 'Please fill all fields correctly!', NotificationType.ERROR)
      return
    }

    // Add to the regular expense tracking
    const newExpense = {
      date: quickEntryDate,
      category: quickEntryCategory,
      amount: amount
    }
    addExpense(newExpense)

    // If it's marked as recurring, add as a cash flow transaction with special description
    if (isRecurring) {
      const newTransaction = {
        date: quickEntryDate,
        type: 'expense' as 'expense' | 'income',
        category: quickEntryCategory,
        // Mark as recurring so it will show up in upcoming bills
        description: `Recurring ${quickEntryCategory} payment`,
        amount: amount
      }
      addCashFlowTransaction(newTransaction)

      // Show success notification for recurring expense
      showNotification(
        'Success',
        `Added to your upcoming bills: ${quickEntryCategory}`,
        NotificationType.SUCCESS
      )
    } else {
      // Show success notification for one-time expense
      showNotification(
        'Success',
        `Added ${quickEntryCategory} expense of $${amount.toFixed(2)}`,
        NotificationType.SUCCESS
      )
    }

    // Reset form
    setQuickEntryAmount('')
    setQuickEntryCategory('')
  }

  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get recent expenses (latest 4)
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4)
  }, [expenses])

  // Calculate category totals for pie chart
  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}

    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
    })

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))
  }, [expenses])

  // Calculate budget overview
  const budgetOverview = useMemo(() => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const estimatedIncome = 3500 // This would come from income in a real app
    return {
      income: estimatedIncome,
      spent: totalSpent,
      remaining: estimatedIncome - totalSpent
    }
  }, [expenses])

  // Sample data for sections that would be implemented later
  // Only keeping savings goals since we replaced upcoming bills with real data
  const sampleData = {
    savingsGoals: [
      { name: 'Emergency Fund', target: 10000, current: 6500, color: '#FF6B6B' },
      { name: 'Vacation', target: 3000, current: 1200, color: '#4ECDC4' },
      { name: 'New Car', target: 15000, current: 4500, color: '#1A535C' }
    ]
  }

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Chart colors
  const COLORS = ['#FF6B6B', '#4ECDC4', '#1A535C', '#FFE66D', '#FF9E80']

  // Helper function to get icon based on category
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      Groceries: 'shopping-cart',
      Rent: 'home',
      Insurance: 'shield',
      'Dining Out': 'utensils',
      Entertainment: 'film',
      Transportation: 'car',
      Clothes: 'tshirt',
      Other: 'tag'
    }
    return icons[category] || 'circle'
  }

  // Handle layout changes
  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts)
  }

  // Reset layout to default
  const resetLayout = () => {
    localStorage.removeItem('dashboardLayouts')
    window.location.reload()
  }

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  // Calculate how many days until a bill is due
  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return 'Overdue'
    return `In ${diffDays} days`
  }

  // LOGIN CHECK FOR INACTIVITY
  useEffect(() => {
    // Check last login date from localStorage
    const lastLogin = localStorage.getItem('lastLoginDate')

    if (lastLogin) {
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      if (new Date(lastLogin) < twoWeeksAgo) {
        // Use new notification system with appropriate message and type
        showNotification(
          'Welcome Back',
          "It's been 2 weeks since your last visit. Don't forget to track your expenses!",
          NotificationType.WARNING
        )
      }
    }

    // Update last login date
    localStorage.setItem('lastLoginDate', new Date().toISOString())
  }, [])

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`} id="darky">
      <header className="header">
        <div className="header-top">
          <h1 className="p-5">Dashboard</h1>
          <div className="header-actions">
            <button
              className={`btn ${isEditMode ? 'btn-success' : 'btn-primary'}`}
              onClick={toggleEditMode}
              style={{ marginRight: '10px' }}
            >
              {isEditMode ? 'Save Layout' : 'Edit Layout'}
            </button>
            {isEditMode && (
              <button
                className="btn btn-warning"
                onClick={resetLayout}
                style={{ marginRight: '10px' }}
              >
                Reset Layout
              </button>
            )}
            <Link to="/expenses" className="btn btn-secondary" viewTransition={true}>
              View Expenses
            </Link>
          </div>
        </div>

        {/* Stats Cards Row - This stays at the top */}
        <div className="stats-grid" id="stats">
          <div className="stat-card">
            <div className="stat-label">Monthly Income</div>
            <div className="stat-value">{formatCurrency(budgetOverview.income)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Spent This Month</div>
            <div className="stat-value">{formatCurrency(budgetOverview.spent)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Remaining</div>
            <div className="stat-value">{formatCurrency(budgetOverview.remaining)}</div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Period Selector */}
        <section className="surrounding-tabs">
          <nav className="tabs">
            <button
              className={`tab-button ${activePeriod === 'daily' ? 'active' : ''}`}
              onClick={() => setActivePeriod('daily')}
            >
              Daily
            </button>
            <button
              className={`tab-button ${activePeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => setActivePeriod('weekly')}
            >
              Weekly
            </button>
            <button
              className={`tab-button ${activePeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setActivePeriod('monthly')}
            >
              Monthly
            </button>
          </nav>
        </section>

        <main className="dashboard-content">
          {/* Swappable Grid Layout */}
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            useCSSTransforms={true}
          >
            {/* Recent Expenses Card */}
            <div key="recent-expenses" className="dashboard-card">
              {isEditMode && <div className="drag-handle"> Drag</div>}
              <div className="dashboard-card-header">
                <h2 style={{ color: isDarkMode ? 'white' : 'black' }}>
                  <Wallet className="dashboard-card-icon" /> Recent Expenses
                </h2>
                <Link to="/expenses" className="dashboard-card-link">
                  View All
                </Link>
              </div>
              <div className="expense-list-container" style={{ boxShadow: 'none' }}>
                <ul id="expenseList">
                  {recentExpenses.length > 0 ? (
                    recentExpenses.map((expense, index) => (
                      <li key={index}>
                        <span>{formatDate(expense.date)}</span> - <span>{expense.category}</span> -
                        <span>{formatCurrency(expense.amount)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="empty-list-message">No recent expenses</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Upcoming Bills Card - Now using real data */}
            <div key="upcoming-bills" className="dashboard-card">
              {isEditMode && <div className="drag-handle"> Drag</div>}
              <div className="dashboard-card-header">
                <h2 style={{ color: isDarkMode ? 'white' : 'black' }}>
                  <Calendar className="dashboard-card-icon" /> Upcoming Bills
                </h2>
                <Link to="/smart-assistant" className="dashboard-card-link">
                  Manage
                </Link>
              </div>
              <div className="bills-list">
                {upcomingBills.length === 0 ? (
                  <div className="bill-item flex items-center justify-center p-4 text-gray-500">
                    <p>
                      No upcoming bills. Add subscriptions or recurring expenses to see them here.
                    </p>
                  </div>
                ) : (
                  upcomingBills.map((bill) => (
                    <div key={bill.id} className="bill-item">
                      <div className="bill-info">
                        <span
                          className="bill-name"
                          style={{ color: isDarkMode ? 'white' : 'black' }}
                        >
                          {bill.name}
                        </span>
                        <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                      </div>
                      <div className="bill-due-date flex justify-between">
                        <span>Due: {formatDate(bill.dueDate)}</span>
                        <span
                          className={`text-sm ${
                            getDaysUntil(bill.dueDate) === 'Today' ||
                            getDaysUntil(bill.dueDate) === 'Tomorrow'
                              ? 'text-red-500'
                              : getDaysUntil(bill.dueDate) === 'Overdue'
                                ? 'text-red-600 font-bold'
                                : ''
                          }`}
                        >
                          {getDaysUntil(bill.dueDate)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Spending by Category Card - Fixed Legend */}
            <div key="spending-category" className="dashboard-card">
              {isEditMode && <div className="drag-handle"> Drag</div>}
              <div className="dashboard-card-header">
                <h2 style={{ color: isDarkMode ? 'white' : 'black' }}>Spending by Category</h2>
              </div>
              <div
                className="chart-container "
                style={{
                  height: 'auto',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {categoryData.length > 0 ? (
                  <>
                    {/* Reduced chart height to make room for legend */}
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={getCombinedCategoryData(categoryData, 5)}
                          cx="50%"
                          cy="50%"
                          labelLine={false} // Removed connector lines to clean up chart
                          outerRadius={80}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {getCombinedCategoryData(categoryData, 5).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="rgba(0,0,0,0.2)"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#2A2A2A' : '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Fixed Legend with improved visibility */}
                    <div className="mt-2 mb-4 px-4 w-full">
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          gap: '16px',
                          marginTop: '8px'
                        }}
                      >
                        {getCombinedCategoryData(categoryData, 5).map((entry, index) => (
                          <div
                            key={`legend-${index}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '8px'
                            }}
                          >
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: COLORS[index % COLORS.length],
                                marginRight: '6px',
                                border: '1px solid rgba(255,255,255,0.2)'
                              }}
                            />
                            <span
                              style={{
                                fontSize: '14px',
                                color: isDarkMode ? 'white' : 'black',
                                fontWeight: '500'
                              }}
                            >
                              {entry.name}:{' '}
                              {Math.round(
                                (entry.value /
                                  getCombinedCategoryData(categoryData, 5).reduce(
                                    (sum, item) => sum + item.value,
                                    0
                                  )) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-chart-message">No expense data to display</div>
                )}
              </div>
            </div>
            {/* Savings Goals Card */}
            <div key="savings-goals" className="dashboard-card">
              {isEditMode && <div className="drag-handle"> Drag</div>}
              <div className="dashboard-card-header">
                <h2 style={{ color: isDarkMode ? 'white' : 'black' }}>
                  <PiggyBank className="dashboard-card-icon" /> Savings Goals
                </h2>
              </div>
              <div className="savings-goals">
                {sampleData.savingsGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100
                  return (
                    <div key={index} className="savings-goal">
                      <div className="savings-goal-header">
                        <span
                          className="savings-goal-name"
                          style={{ color: isDarkMode ? 'white' : 'black' }}
                        >
                          {goal.name}
                        </span>
                        <span className="savings-goal-amount">
                          {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                        </span>
                      </div>
                      <div className="savings-goal-progress-bg">
                        <div
                          className="savings-goal-progress-bar"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: goal.color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Budget Allocation Card */}
            <div key="budget-allocation" className="dashboard-card">
              {isEditMode && <div className="drag-handle"> Drag</div>}
              <div className="dashboard-card-header">
                <h2 style={{ color: isDarkMode ? 'white' : 'black' }}>
                  <DollarSign className="dashboard-card-icon" /> Budget Allocation
                </h2>
                <Link to="/expenses" className="dashboard-card-link">
                  Adjust Budget
                </Link>
              </div>
              <div className="budget-allocation-container">
                {categoryData.length > 0 ? (
                  categoryData.map((category, index) => (
                    <div key={index} className="budget-allocation-item">
                      <div className="budget-allocation-header">
                        <span
                          className="category-icon"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          <i className={`fas fa-${getCategoryIcon(category.name)}`}> </i>
                        </span>
                        <div className="category-details">
                          <span
                            className="category-name"
                            style={{ color: isDarkMode ? 'white' : 'black' }}
                          >
                            {category.name}
                          </span>
                          <span
                            className="category-amount"
                            style={{ color: isDarkMode ? 'white' : 'black' }}
                          >
                            {formatCurrency(category.value)}
                          </span>
                        </div>
                        <span className="category-percentage">
                          {Math.round((category.value / budgetOverview.income) * 100)}%
                        </span>
                      </div>
                      <div className="budget-progress-bg">
                        <div
                          className="budget-progress-bar"
                          style={{
                            width: `${Math.min(100, (category.value / (category.value * 1.2)) * 100)}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-allocation-message">No categories to display</div>
                )}
              </div>
            </div>

            {/* Financial Insights Card */}
            <div key="financial-insights" className="dashboard-card">
              {isEditMode && <div className="drag-handle"> Drag</div>}
              <div className="dashboard-card-header">
                <h2 style={{ color: isDarkMode ? 'white' : 'black' }}>
                  <Sparkles className="dashboard-card-icon" /> Financial Insights
                </h2>
              </div>
              <div className="insights-container">
                <div className="insight-item">
                  <div className="insight-icon" style={{ backgroundColor: COLORS[0] }}>
                    <i className="fas fa-arrow-trend-up"></i>
                  </div>
                  <div className="insight-content">
                    <h3 style={{ color: isDarkMode ? 'white' : 'black' }}>Spending Trend</h3>
                    <p>
                      Your spending on Dining Out is 15% higher than last month. Consider setting a
                      stricter budget.
                    </p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon" style={{ backgroundColor: COLORS[1] }}>
                    <i className="fas fa-piggy-bank"></i>
                  </div>
                  <div className="insight-content">
                    <h3 style={{ color: isDarkMode ? 'white' : 'black' }}>Savings Opportunity</h3>
                    <p>
                      You could save an extra $120/month by reducing your Entertainment expenses by
                      20%.
                    </p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon" style={{ backgroundColor: COLORS[2] }}>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="insight-content">
                    <h3 style={{ color: isDarkMode ? 'white' : 'black' }}>Income Allocation</h3>
                    <p>
                      You're currently saving 8% of your income. Financial experts recommend 15-20%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Entry Card - Optimized layout with fixed button spacing */}
            <div key="quick-entry" className="dashboard-card p-5">
              {isEditMode && <div className="drag-handle">Drag</div>}
              <div className="dashboard-card-header mb-3">
                <h2
                  className="flex items-center text-lg font-medium"
                  style={{ color: isDarkMode ? 'white' : 'black' }}
                >
                  <Plus className="dashboard-card-icon mr-2" size={18} />
                  Quick Expense Entry
                </h2>
              </div>

              <form className="quick-entry-form" onSubmit={handleQuickAddExpense}>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="quick-entry-field">
                    <label className="block text-sm mb-1">Date</label>
                    <input
                      type="date"
                      value={quickEntryDate}
                      style={{ color: isDarkMode ? 'white' : 'black' }}
                      onChange={(e) => setQuickEntryDate(e.target.value)}
                      className="quick-entry-input w-full p-2 rounded border"
                    />
                  </div>

                  <div className="quick-entry-field">
                    <label className="block text-sm mb-1">Category</label>
                    <select
                      className="quick-entry-input w-full p-2 rounded border"
                      value={quickEntryCategory}
                      style={{ color: isDarkMode ? 'white' : 'black' }}
                      onChange={(e) => setQuickEntryCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="Rent">Rent</option>
                      <option value="Mortgage">Mortgage</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Internet">Internet</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Phone">Phone</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Dining Out">Dining Out</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="quick-entry-field">
                    <label className="block text-sm mb-1">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="quick-entry-input w-full p-2 rounded border"
                      value={quickEntryAmount}
                      step="0.01"
                      min="0.01"
                      onChange={(e) => setQuickEntryAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Simplified recurring checkbox */}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="isRecurring"
                    className="text-sm flex items-center text-white"
                    style={{ color: isDarkMode ? 'white' : 'black' }}
                  >
                    <Bell size={14} className="mr-1" />
                    Recurring bill
                  </label>
                </div>

                {/* Button with proper spacing - added padding and margin */}
                <div className="flex justify-center items-center pb-4">
                  <button
                    type="submit"
                    className="w-[600px] py-2 rounded bg-gradient-to-r from-red-700 to-red-500 text-white font-medium hover:opacity-90"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </ResponsiveGridLayout>
        </main>
      </div>

      <CashFlowForecast />

      <div className="copyright">&copy; 2025 Budgetary Tracker. All rights reserved.</div>
    </div>
  )
}
