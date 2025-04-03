import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

import { useNotificationSystem, NotificationType } from '@renderer/components/NotificationSystem'
import { ChevronDown, Plus, TrendingUp, Trash2, Filter, Calendar, ArrowUpDown, X } from 'lucide-react'
import { useExpenseStore } from '@renderer/stores/expenseStore'

// Cyberpunk version of the Expenses page
const CyberpunkExpenses: React.FC = () => {
  // Get all the necessary state from the store
  const { 
    expenses, 
    addExpense, 
    selectedDate, 
    setSelectedDate 
  } = useExpenseStore()
  
  const { showNotification } = useNotificationSystem()
  
  // State for expense input
  const [expenseCategory, setExpenseCategory] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string[]>([])
  
  // State for selected month in month picker
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    // Default to current month
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Filter expenses based on selected month
  const filteredExpenses = React.useMemo(() => {
    let result = expenses.filter(expense => {
      // Extract year and month from the expense date (format: YYYY-MM-DD)
      const expenseYearMonth = expense.date.substring(0, 7) // Gets "YYYY-MM"
      return expenseYearMonth === selectedMonth
    })
    
    // Apply category filter if active
    if (filterCategory.length > 0) {
      result = result.filter(expense => filterCategory.includes(expense.category))
    }
    
    return result
  }, [expenses, selectedMonth, filterCategory])

  // Calculate summary data
  const expenseSummary = React.useMemo(() => {
    if (filteredExpenses.length === 0) return { total: 0, topCategory: '-', count: 0 }
    
    // Calculate total
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    
    // Calculate category totals
    const categoryTotals: Record<string, number> = {}
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
    })
    
    // Find top category
    let maxCategory = ''
    let maxAmount = 0
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > maxAmount) {
        maxCategory = category
        maxAmount = amount
      }
    })
    
    return { 
      total,
      topCategory: maxCategory || '-',
      count: filteredExpenses.length
    }
  }, [filteredExpenses])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (!expenseCategory || !expenseAmount || !selectedDate) {
      showNotification('ERROR', 'Please fill all fields correctly!', NotificationType.ERROR)
      return
    }

    const amount = parseFloat(expenseAmount)
    if (isNaN(amount) || amount <= 0) {
      showNotification('ERROR', 'Please enter a valid amount', NotificationType.ERROR)
      return
    }

    const newExpense = {
      date: selectedDate.toISOString().split('T')[0],
      category: expenseCategory,
      amount: amount
    }

    addExpense(newExpense)
    showNotification('SUCCESS', `Added ${expenseCategory} expense`, NotificationType.SUCCESS)
    
    // Reset form
    setExpenseCategory('')
    setExpenseAmount('')
    setShowAddModal(false)
  }
  
  // Get all unique categories for filter
  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>()
    expenses.forEach(exp => categories.add(exp.category))
    return Array.from(categories).sort()
  }, [expenses])

  // Get current month and year for display
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

      {/* Expense Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-black/70 backdrop-blur-md border border-red-500/80 rounded-lg w-full max-w-md overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
              <div className="relative p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-widest">// ADD EXPENSE</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-red-500 hover:text-red-400 focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-red-500 mb-1">DATE</label>
                <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">SELECT CATEGORY</option>
                  <option value="Rent">RENT</option>
                  <option value="Groceries">GROCERIES</option>
                  <option value="Insurance">INSURANCE</option>
                  <option value="Dining Out">DINING OUT</option>
                  <option value="Entertainment">ENTERTAINMENT</option>
                  <option value="Clothes">CLOTHES</option>
                  <option value="Transportation">TRANSPORTATION</option>
                  <option value="Other">OTHER</option>
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
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm pl-8 pr-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleAddExpense}
                  className="w-full bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-sm relative overflow-hidden group"
                >
                  <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></span>
                  SAVE EXPENSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4">
       

        {/* Filters and Month Selection */}
        <div className="mb-6 flex flex-wrap justify-between items-center border-b border-red-900/30 pb-4">
          <div className="relative mb-4 md:mb-0">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-red-500/30 text-white rounded-sm"
            >
              <Filter size={16} />
              <span>FILTER</span>
              {filterCategory.length > 0 && (
                <span className="ml-1 text-sm">({filterCategory.length})</span>
              )}
              <ChevronDown size={16} />
            </button>
  
            {showFilterMenu && (
              <div
                className="absolute top-full mt-2 p-2 rounded-sm shadow-lg z-10 bg-black/70 backdrop-blur-md border border-red-500/30"
              >
                {uniqueCategories.map(category => (
                  <div
                    key={category}
                    className="flex items-center gap-2 p-2 hover:bg-red-950/20 cursor-pointer transition-colors"
                    onClick={() => {
                      setFilterCategory(prev => 
                        prev.includes(category) 
                          ? prev.filter(c => c !== category) 
                          : [...prev, category]
                      )
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filterCategory.includes(category)}
                      onChange={() => {}}
                      className="rounded text-red-500 bg-black border-red-500/50"
                    />
                    <span>{category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">MONTH:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-black/50 border border-red-500/30 text-white rounded-sm px-3 py-2 focus:outline-none focus:border-red-500/70"
            />
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-red-900/20 flex justify-between items-center">
            <h2 className="text-xs text-red-500 tracking-widest">EXPENSE LOG</h2>
            <div className="text-xs text-gray-500">
              {filteredExpenses.length} RECORDS
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              NO EXPENSES FOUND FOR THIS PERIOD
            </div>
          ) : (
            <div className="divide-y divide-red-900/10">
              {filteredExpenses.map((expense, index) => (
                <div key={index} className="p-4 hover:bg-red-500/5 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-start space-x-3">
                      <div className="h-6 w-1 bg-red-500/70 mt-1"></div>
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
                        {Math.round((expense.amount / expenseSummary.total) * 100)}% of total
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Total row */}
          <div className="p-4 border-t border-red-900/20 flex justify-between items-center">
            <span className="text-sm font-medium">TOTAL</span>
            <span className="font-bold text-red-500">{formatCurrency(expenseSummary.total)}</span>
          </div>
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
      `}</style>
    </div>
  )
}

export default CyberpunkExpenses