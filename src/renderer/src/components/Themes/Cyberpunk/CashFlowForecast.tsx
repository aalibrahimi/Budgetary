// src/renderer/src/components/CyberpunkCashFlowForecast.tsx

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Plus, X, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { useExpenseStore } from '@renderer/stores/expenseStore'

const CyberpunkCashFlowForecast: React.FC = () => {
  const { cashFlowTransaction, addCashFlowTransaction } = useExpenseStore()

  // State
  const [showModal, setShowModal] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'expense' | 'income',
    category: '',
    description: '',
    amount: 0,
    isRecurring: false // New field for recurring transactions
  })

  // Get subscriptions from localStorage to include them in the forecast
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  // Load subscriptions
  useEffect(() => {
    try {
      const savedSubscriptions = localStorage.getItem('userSubscriptions')
      if (savedSubscriptions) {
        const parsedSubscriptions = JSON.parse(savedSubscriptions)
        setSubscriptions(parsedSubscriptions)
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    }
  }, [])

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Categories for dropdown
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
    expense: [
      'Rent',
      'Mortgage',
      'Utilities',
      'Insurance',
      'Groceries',
      'Dining Out',
      'Transportation',
      'Entertainment',
      'Other'
    ]
  }

  // Add a new transaction, with option to mark as recurring
  const handleAddTransaction = () => {
    // Create description that indicates if it's recurring
    const description = newTransaction.isRecurring 
      ? `Recurring ${newTransaction.category} ${newTransaction.description}`
      : newTransaction.description

    addCashFlowTransaction({
      ...newTransaction,
      description,
      date: newTransaction.date
    })

    setShowModal(false)
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category: '',
      description: '',
      amount: 0,
      isRecurring: false
    })
  }

  // Get all days for the next 30 days
  const getDays = () => {
    const days: any[] = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)
      days.push(date)
    }

    return days
  }

  // Get transactions for a specific day, including subscriptions
  const getTransactionsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]

    // Get transactions from CashFlow
    const transactions = cashFlowTransaction.filter((transaction) => {
      const transactionDateStr = transaction.date.split('T')[0]
      return transactionDateStr === dateString
    })

    // Get subscriptions due on this day
    const subscriptionPayments = subscriptions.filter((sub) => {
      const nextPaymentDate = new Date(sub.nextPayment)
      return nextPaymentDate.toISOString().split('T')[0] === dateString
    }).map(sub => ({
      id: `sub-${sub.id}`,
      date: dateString,
      type: 'expense' as 'expense' | 'income',
      category: sub.name,
      description: `Subscription payment: ${sub.name}`,
      amount: sub.amount
    }))

    // Combine both sources
    return [...transactions, ...subscriptionPayments]
  }

  // Calculate summary totals
  const calculateSummary = () => {
    // Calculate income/expenses from cash flow transactions
    const income = cashFlowTransaction
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = cashFlowTransaction
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    // Calculate upcoming subscription payments for the next 30 days
    const today = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)

    const subscriptionExpenses = subscriptions
      .filter(sub => {
        const nextPayment = new Date(sub.nextPayment)
        return nextPayment >= today && nextPayment <= thirtyDaysLater
      })
      .reduce((sum, sub) => sum + sub.amount, 0)

    // Combine regular expenses with subscription expenses
    const totalExpenses = expenses + subscriptionExpenses

    return {
      income,
      expenses: totalExpenses,
      netCashFlow: income - totalExpenses
    }
  }

  const summary = calculateSummary()
  const days = getDays()

  return (
    <div className="mt-8 p-6 bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-red-900/20 pb-4 mb-6">
        <h2 className="flex items-center text-sm text-red-500 tracking-widest">
          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
          CASH FLOW FORECAST
        </h2>
        <button 
          onClick={() => setShowModal(true)} 
          className="text-red-500 border border-red-500/50 hover:bg-red-500/10 px-4 py-1.5 text-xs flex items-center transition-colors"
        >
          <Plus size={14} className="mr-1" />
          ADD TRANSACTION
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <h3 className="text-gray-400">NEXT 30 DAYS</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="h-3 w-3 bg-green-500/70 mr-1"></span>
              <span className="text-gray-400">INCOME</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-red-500/70 mr-1"></span>
              <span className="text-gray-400">EXPENSE</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-1 border border-red-900/20 bg-black/50 p-2 rounded">
          {days.map((day, index) => {
            const dayTransactions = getTransactionsForDay(day)
            const hasTransactions = dayTransactions.length > 0
            const incomeTotal = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expenseTotal = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const netFlow = incomeTotal - expenseTotal;

            return (
              <div
                key={index}
                className={`relative border ${hasTransactions ? 'border-red-900/50' : 'border-gray-900/30'} 
                  rounded p-1 bg-black/30 hover:bg-black/50 transition-colors cursor-pointer group`}
              >
                <div className="flex flex-col items-center pb-1 border-b border-gray-900/30">
                  <span className="text-xs text-gray-500">{day.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-sm font-bold text-white">{day.getDate()}</span>
                </div>

                {hasTransactions ? (
                  <div className="py-1">
                    {incomeTotal > 0 && (
                      <div className="flex items-center justify-between px-1 text-xs">
                        <span className="text-green-500">
                          <ArrowUp size={10} className="inline-block mr-0.5" />
                        </span>
                        <span className="text-green-500 text-right">{formatCurrency(incomeTotal)}</span>
                      </div>
                    )}
                    {expenseTotal > 0 && (
                      <div className="flex items-center justify-between px-1 text-xs">
                        <span className="text-red-500">
                          <ArrowDown size={10} className="inline-block mr-0.5" />
                        </span>
                        <span className="text-red-500 text-right">{formatCurrency(expenseTotal)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-2"></div>
                )}
                
                {/* Tooltip on hover - only appears for days with transactions */}
                {hasTransactions && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                )}
                
                {/* Detailed tooltip */}
                {hasTransactions && (
                  <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-52 
                    bg-black border border-red-500/50 rounded shadow-lg opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none">
                    <div className="py-1 px-2 border-b border-red-900/30 text-xs font-medium text-gray-300">
                      {day.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {dayTransactions.map((transaction, idx) => (
                        <div key={idx} className={`p-2 border-b border-gray-900/30 
                          ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="flex justify-between text-xs">
                            <span>{transaction.category}</span>
                            <span>
                              {transaction.type === 'income' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                          {transaction.description && (
                            <div className="text-gray-500 text-xs mt-0.5 truncate">
                              {transaction.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="py-1 px-2 flex justify-between text-xs font-medium">
                      <span>NET</span>
                      <span className={netFlow >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatCurrency(netFlow)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="border border-red-900/20 bg-black/50 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">EXPECTED INCOME</span>
            <span className="text-sm text-green-500 font-bold">{formatCurrency(summary.income)}</span>
          </div>
          <div className="h-1 w-full bg-black/50 rounded overflow-hidden">
            <div className="h-full bg-green-500/70" style={{ width: "100%" }}></div>
          </div>
        </div>
        
        <div className="border border-red-900/20 bg-black/50 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">EXPECTED EXPENSES</span>
            <span className="text-sm text-red-500 font-bold">{formatCurrency(summary.expenses)}</span>
          </div>
          <div className="h-1 w-full bg-black/50 rounded overflow-hidden">
            <div className="h-full bg-red-500/70" 
              style={{ width: `${summary.income > 0 ? (summary.expenses / summary.income) * 100 : 0}%` }}></div>
          </div>
        </div>
        
        <div className="border border-red-900/20 bg-black/50 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">NET CASH FLOW</span>
            <span className={`text-sm font-bold ${summary.netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(summary.netCashFlow)}
            </span>
          </div>
          <div className="h-1 w-full bg-black/50 rounded overflow-hidden">
            <div 
              className={`h-full ${summary.netCashFlow >= 0 ? 'bg-green-500/70' : 'bg-red-500/70'}`} 
              style={{ width: `${Math.min(Math.abs(summary.netCashFlow) / (summary.income || 1) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Scanner effect line */}
      <div className="relative h-0.5 w-full bg-black overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-red-500/70 to-transparent animate-scanner"></div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-black/90 border border-red-500/80 rounded-lg w-full max-w-md overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
              <div className="relative p-4 flex justify-between items-center border-b border-red-900/30">
                <h2 className="text-sm text-red-500 tracking-widest">ADD TRANSACTION</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-red-500 hover:text-red-400 focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-red-500 mb-1">TYPE</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={newTransaction.type === 'income'}
                      onChange={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                      className="appearance-none h-4 w-4 border border-red-500/50 rounded bg-black checked:bg-red-500 checked:border-transparent focus:outline-none"
                    />
                    <span className="text-xs">INCOME</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={newTransaction.type === 'expense'}
                      onChange={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                      className="appearance-none h-4 w-4 border border-red-500/50 rounded bg-black checked:bg-red-500 checked:border-transparent focus:outline-none"
                    />
                    <span className="text-xs">EXPENSE</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">DATE</label>
                <input
                  type="date"
                  className="w-full bg-black/50 border border-red-500/50 rounded px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                <select
                  className="w-full bg-black/50 border border-red-500/50 rounded px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value
                    })
                  }
                >
                  <option value="">SELECT CATEGORY</option>
                  {categories[newTransaction.type].map((category) => (
                    <option key={category} value={category}>
                      {category.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">DESCRIPTION (OPTIONAL)</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-red-500/50 rounded px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value
                    })
                  }
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">AMOUNT</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-black/50 border border-red-500/50 rounded pl-8 pr-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                    value={newTransaction.amount || ''}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: parseFloat(e.target.value) || 0
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              {/* Add recurring option with checkbox */}
              {newTransaction.type === 'expense' && (
                <div className="pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={newTransaction.isRecurring}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          isRecurring: e.target.checked
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-black/70 border border-red-500/50 rounded-sm peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-red-500 after:border-red-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-red-900/30"></div>
                    <span className="ml-3 text-xs">RECURRING EXPENSE (WILL APPEAR IN UPCOMING BILLS)</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-red-900/30 text-gray-300 hover:bg-red-900/20 transition-colors text-xs"
                  onClick={() => setShowModal(false)}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs relative overflow-hidden group"
                  onClick={handleAddTransaction}
                  disabled={!newTransaction.category || newTransaction.amount <= 0}
                >
                  <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></span>
                  ADD TRANSACTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add styles for scanner animation */}
      {/* <style >{`
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
      `}</style> */}
    </div>
  )
}

export default CyberpunkCashFlowForecast