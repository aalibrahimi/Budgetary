import React, { FormEvent, useEffect, useState } from 'react'
import _ from 'lodash'
import { Settings, X, Calendar, PiggyBank } from 'lucide-react'
import BudgetInsightCard from './BudgetInsightCard'
import {
  useExpenseStore,
  type Expense,
  type PlannedExpense,
  type BudgetAllocations,
  type SavingsGoal,
  type BillSchedule
} from '../stores/expenseStore'
import NotifyButton from './notifications/notificationButton'

// Helper function to calculate months between dates
const monthsBetween = (date1: Date, date2: Date) => {
  return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth())
}

const BudgetPlanner: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  // All state declarations at the top
  const [showSettings, setShowSettings] = useState(false)
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [showBillsModal, setShowBillsModal] = useState(false)
  const [fixedExpenses, setFixedExpenses] = useState<PlannedExpense[]>(() => {
    const saved = localStorage.getItem('fixedExpenses')
    return saved ? JSON.parse(saved) : []
  })

  // const [newGoal, setNewGoal] = useState({
  //   category: '',
  //   targetAmount: 0,
  //   alertThreshold: 80,
  //   currentAmount: 0
  // })

  const [newSavingGoal, setNewSavingGoal] = useState({
    name: '',
    targetAmount: 0,
    deadline: new Date(),
    currentAmount: 0
  })

  const [newBill, setNewBill] = useState<{
    category: string
    dueDate: Date
    amount: number
    isRecurring: boolean
    frequency: 'monthly' | 'quarterly' | 'annual'
  }>({
    category: '',
    dueDate: new Date(),
    amount: 0,
    isRecurring: true,
    frequency: 'monthly'
  })

  // Zustand store hooks
  const {
    income,
    setIncome,
    planningMode,
    setPlanningMode,
    savingsGoals,
    addSavingsGoal,
    billSchedules,
    addBillSchedule,
    budgetAllocation,
    setBudgetAllocation,
    setIsPlanGenerated,
    setSavingsGoal,
    isPlanGenerated
  } = useExpenseStore()

  // useEffect hooks at the component level
  useEffect(() => {
    const savedIncome = localStorage.getItem('monthlyIncome')
    if (savedIncome) {
      const parsedIncome = Number(savedIncome)
      setIncome(parsedIncome)
      const newAllocations = generateSmartBudget(parsedIncome)
      setBudgetAllocation(newAllocations as BudgetAllocations)
      setIsPlanGenerated(true)
      setSavingsGoal(newAllocations.Savings)
    }
  }, [])

  useEffect(() => {
    const today = new Date()
    const upcoming = billSchedules.filter((bill) => {
      const daysUntilDue = (bill.nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      return daysUntilDue <= 7 && daysUntilDue > 0 // Within next 7 days
    })

    upcoming.forEach((bill) => {
      console.info(`Upcoming bill: ${bill.category} due on ${bill.nextDueDate.toLocaleDateString()}`)
      // <NotifyButton category='Upcoming Bill' msg={`Upcoming bill: ${bill.category} due on ${bill.nextDueDate.toLocaleDateString()}`} />
      // document.getElementById('test-pop')!.click()
    })
  }, [billSchedules])

  useEffect(() => {
    if (expenses.length > 0) {
      const lastMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        return expenseDate >= oneMonthAgo
      })

      const fixedCategories = ['Rent', 'Insurance']
      fixedCategories.forEach((category) => {
        const recentExpense = lastMonthExpenses.find((e) => e.category === category)
        if (recentExpense) {
          const existingFixed = fixedExpenses.find((f) => f.category === category)
          if (!existingFixed || Math.abs(existingFixed.amount - recentExpense.amount) > 1) {
            setFixedExpenses((prev) => {
              const updated = prev.filter((f) => f.category !== category)
              return [
                ...updated,
                {
                  category,
                  amount: recentExpense.amount,
                  lastUpdated: new Date()
                }
              ]
            })
          }
        }
      })
    }
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses))
    if (income > 0) {
      const newAllocations = generateSmartBudget(income)
      setBudgetAllocation(newAllocations)
      setIsPlanGenerated(true)
      setSavingsGoal(newAllocations.Savings)
    }
  }, [fixedExpenses])

  // Core budget generation function
  const generateSmartBudget = (monthlyIncome: number): BudgetAllocations => {
    if (!monthlyIncome || monthlyIncome <= 0) {
      return {
        Rent: 0,
        Groceries: 0,
        Insurance: 0,
        Transportation: 0,
        Entertainment: 0,
        'Dining Out': 0,
        Clothes: 0,
        Other: 0,
        Savings: 0
      } as BudgetAllocations
    }

    const defaultAllocations: BudgetAllocations = {
      Rent: monthlyIncome * 0.3,
      Groceries: monthlyIncome * 0.12,
      Insurance: monthlyIncome * 0.1,
      Transportation: monthlyIncome * 0.15,
      Entertainment: monthlyIncome * 0.05,
      'Dining Out': monthlyIncome * 0.08,
      Clothes: monthlyIncome * 0.05,
      Other: monthlyIncome * 0.05,
      Savings: monthlyIncome * 0.1
    }

    const adjustedAllocations = { ...defaultAllocations }
    fixedExpenses.forEach((expense) => {
      if (expense.category in adjustedAllocations) {
        adjustedAllocations[expense.category as keyof BudgetAllocations] = expense.amount
      }
    })

    const totalFixed = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const remainingIncome = monthlyIncome - totalFixed
    const nonFixedTotal = Object.entries(adjustedAllocations)
      .filter(([category]) => !fixedExpenses.find((f) => f.category === category))
      .reduce((sum, [, amount]) => sum + amount, 0)

    if (remainingIncome > 0 && nonFixedTotal > 0) {
      const adjustmentRatio = remainingIncome / nonFixedTotal
      Object.keys(adjustedAllocations).forEach((category) => {
        if (!fixedExpenses.find((f) => f.category === category)) {
          adjustedAllocations[category as keyof BudgetAllocations] *= adjustmentRatio
        }
      })
    }

    return adjustedAllocations
  }

  // Event handlers
  const handleAddSavingsGoal = (e: FormEvent) => {
    e.preventDefault()
    
    const today = new Date()
    const monthsUntilDeadline = monthsBetween(today, newSavingGoal.deadline)
    const remainingAmount = newSavingGoal.targetAmount - newSavingGoal.currentAmount
    const monthlyContribution = remainingAmount / monthsUntilDeadline

    const savingsGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: newSavingGoal.name,
      targetAmount: newSavingGoal.targetAmount,
      deadline: newSavingGoal.deadline,
      currentAmount: newSavingGoal.currentAmount,
      monthlyContribution,
      isActive: true
    }

    addSavingsGoal(savingsGoal)

    // Reset form
    setNewSavingGoal({
      name: '',
      targetAmount: 0,
      deadline: new Date(),
      currentAmount: 0
    })
  }

  const handleAddBillSchedule = (e: FormEvent) => {
    e.preventDefault()
    
    // Calculate the next due date based on the day of month
    const today = new Date()
    const nextDueDate = new Date(today.getFullYear(), today.getMonth(), newBill.dueDate)
    
    // If the day has already passed this month, set it to next month
    if (nextDueDate < today) {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    }

    const billSchedule: BillSchedule = {
      id: Date.now().toString(),
      category: newBill.category,
      amount: newBill.amount,
      dueDate: newBill.dueDate,
      nextDueDate: nextDueDate,
      isRecurring: newBill.isRecurring,
      frequency: newBill.frequency
    }

    addBillSchedule(billSchedule)

    // Reset form
    setNewBill({
      category: '',
      dueDate: new Date(),
      amount: 0,
      isRecurring: true,
      frequency: 'monthly'
    })
  }

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setIncome(value)
    localStorage.setItem('monthlyIncome', value.toString())

    if (value > 0) {
      const newAllocations = generateSmartBudget(value)
      setBudgetAllocation(newAllocations)
      setIsPlanGenerated(true)
      setSavingsGoal(newAllocations.Savings)
    }
  }

  const handleFixedExpenseUpdate = (category: string, amount: number) => {
    setFixedExpenses((prev) => {
      const updated = prev.filter((f) => f.category !== category)
      return [
        ...updated,
        {
          category,
          amount,
          lastUpdated: new Date()
        }
      ]
    })
  }



  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {/* Header Actions */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setShowGoalsModal(true)}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Savings Goals"
        >
          <PiggyBank className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowBillsModal(true)}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Bill Schedules"
        >
          <Calendar className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4">Budget Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Planning Mode</label>
                <select
                  className="w-full p-2 border rounded"
                  value={planningMode}
                  onChange={(e) => setPlanningMode(e.target.value as 'monthly' | 'annual')}
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={income || ''}
                  onChange={handleIncomeChange}
                  placeholder="Enter monthly income"
                />
              </div>

              {['Rent', 'Insurance'].map((category) => {
                const fixed = fixedExpenses.find((f) => f.category === category)
                return (
                  <div key={category}>
                    <label className="block text-sm font-medium mb-1">
                      Monthly {category}
                      {fixed && (
                        <span className="text-xs text-gray-500 ml-2">
                          Last updated: {new Date(fixed.lastUpdated).toLocaleDateString()}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={fixed?.amount || ''}
                      onChange={(e) => handleFixedExpenseUpdate(category, Number(e.target.value))}
                      placeholder={`Enter monthly ${category.toLowerCase()}`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowGoalsModal(false)} className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4">Savings Goals</h3>

            <form onSubmit={handleAddSavingsGoal} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newSavingGoal.name}
                  onChange={(e) =>
                    setNewSavingGoal({
                      ...newSavingGoal,
                      name: e.target.value
                    })
                  }
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newSavingGoal.currentAmount || ''}
                  onChange={(e) =>
                    setNewSavingGoal({
                      ...newSavingGoal,
                      currentAmount: Number(e.target.value)
                    })
                  }
                  placeholder="Enter target amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newSavingGoal.deadline.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setNewSavingGoal({
                      ...newSavingGoal,
                      deadline: new Date(e.target.value)
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newSavingGoal.currentAmount || ''}
                  onChange={(e) =>
                    setNewSavingGoal({
                      ...newSavingGoal,
                      currentAmount: Number(e.target.value)
                    })
                  }
                  placeholder="Enter current amount saved"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add Savings Goal
              </button>
            </form>

            {/* Display existing savings goals */}
            <div className="space-y-4">
              <h4 className="font-medium">Current Goals</h4>
              {savingsGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id} className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-500">
                        ${goal.currentAmount} / ${goal.targetAmount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Monthly Need: ${goal.monthlyContribution.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bills Modal */}
      {showBillsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setShowBillsModal(false)} className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4">Bill Schedules</h3>

            <form onSubmit={handleAddBillSchedule} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newBill.category}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      category: e.target.value
                    })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(budgetAllocation).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  min="1"
                  max="31"
                  className="w-full p-2 border rounded"
                  value={newBill.dueDate.toISOString().split('T')[0]} // This was wrong - was using category
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      dueDate: new Date(e.target.value) // This was wrong - was setting category
                    })
                  }
                  placeholder="Day of month (1-31)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newBill.amount || ''}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      amount: Number(e.target.value)
                    })
                  }
                  placeholder="Enter bill amount"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newBill.isRecurring}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      isRecurring: e.target.checked
                    })
                  }
                  id="isRecurring"
                />
                <label htmlFor="isRecurring" className="text-sm font-medium">
                  Recurring Bill
                </label>
              </div>

              {newBill.isRecurring && (
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newBill.frequency}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        frequency: e.target.value as 'monthly' | 'quarterly' | 'annual'
                      })
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add Bill Schedule
              </button>
            </form>

            {/* Display upcoming bills */}
            <div className="space-y-4">
              <h4 className="font-medium">Upcoming Bills</h4>
              {billSchedules.map((bill) => (
                <div key={bill.id} className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{bill.category}</span>
                    <span>${bill.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {bill.nextDueDate.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {bill.isRecurring ? `Repeats: ${bill.frequency}` : 'One-time bill'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Smart Budget Planner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Income</h3>
            <div className="space-y-4">
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={income || ''}
                onChange={handleIncomeChange}
                placeholder="Enter monthly income"
              />
            </div>
          </div>

          {isPlanGenerated && budgetAllocation && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>
              <div className="space-y-3">
                {Object.entries(budgetAllocation).map(([category, amount]) => {
                  const isFixed = fixedExpenses.find((f) => f.category === category)
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="font-medium">
                        {category}
                        {isFixed && <span className="text-xs text-gray-500 ml-2">(Fixed)</span>}
                      </span>
                      <span className="text-lg">${amount.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {isPlanGenerated && budgetAllocation && (
          <BudgetInsightCard
            budgetAllocation={budgetAllocation}
            monthlyIncome={income}
            expenses={expenses}
          />
        )}
      </div>
    </div>
  )
}

export default BudgetPlanner
