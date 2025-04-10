// src/renderer/src/components/CashFlowForecast.tsx

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import '../assets/CashFlowwForecast.css'
import { useExpenseStore } from '@renderer/stores/expenseStore'

const CashFlowForecast: React.FC = () => {
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
    <div className="dashboard-card w-[1150px] mx-auto">
      <div className="dashboard-card-header">
        <h2>
          <AlertTriangle className="dashboard-card-icon" />
          Cash Flow Forecast
        </h2>
        <button onClick={() => setShowModal(true)} className="add-transaction-btn">
          <Plus size={18} />
        </button>
      </div>

      <div className="cash-flow-container">
        <div className="cash-flow-header">
          <h3>Next 30 Days</h3>
          <div className="cash-flow-legend">
            <span className="legend-item">
              <span className="legend-color income"></span>Income
            </span>
            <span className="legend-item">
              <span className="legend-color expense"></span>Expense
            </span>
          </div>
        </div>

        <div className="cash-flow-calendar">
          {days.map((day, index) => {
            const dayTransactions = getTransactionsForDay(day)
            const hasTransactions = dayTransactions.length > 0

            return (
              <div
                key={index}
                className={`calendar-day ${hasTransactions ? 'has-transaction' : ''}`}
              >
                <div className="calendar-date">
                  <span className="day">{day.getDate()}</span>
                  <span className="month">{day.toLocaleString('default', { month: 'short' })}</span>
                </div>

                <div className="day-transactions">
                  {dayTransactions.map((transaction) => (
                    <div key={transaction.id} className={`transaction ${transaction.type}`}>
                      <span className="transaction-label">{transaction.category}</span>
                      <span className="transaction-amount">
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="cash-flow-summary">
          <div className="summary-item">
            <span>Expected Income:</span>
            <span className="summary-amount income">{formatCurrency(summary.income)}</span>
          </div>
          <div className="summary-item">
            <span>Expected Expenses:</span>
            <span className="summary-amount expense">{formatCurrency(summary.expenses)}</span>
          </div>
          <div className="summary-item total">
            <span>Net Cash Flow:</span>
            <span className="summary-amount">{formatCurrency(summary.netCashFlow)}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Transaction</h3>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      checked={newTransaction.type === 'income'}
                      onChange={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                    />
                    <span>Income</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      checked={newTransaction.type === 'expense'}
                      onChange={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                    />
                    <span>Expense</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-input"
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories[newTransaction.type].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
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

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
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
              
              {/* Add recurring option with checkbox */}
              {newTransaction.type === 'expense' && (
                <div className="form-group">
                  <div className="flex items-center">
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
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="isRecurring" className="text-sm">
                      This is a recurring expense (will appear in upcoming bills)
                    </label>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-add"
                  onClick={handleAddTransaction}
                  disabled={!newTransaction.category || newTransaction.amount <= 0}
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CashFlowForecast