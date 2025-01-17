// import { useForm } from '@tanstack/react-form'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import '../assets/expenses.css'
import '../assets/statsCard.css'
import React, { useEffect } from 'react'
import DatePicker from '@renderer/components/DatePicker'
import { useState } from 'react'
import Graphs from '@renderer/components/graphs'
import { useDarkModeStore } from './__root'
import BudgetPlanner from '../components/BudgetPlanner'
import { useExpenseStore } from '../stores/expenseStore'
import NotifyButton from '@renderer/components/notifications/notificationButton'


const Expenses = () => {
  const { isDarkMode } = useDarkModeStore()
  const {
    monthlyTotal,
    topCategory,
    setMonthlyTotal,
    setTopCategory,
    expenseCount,
    setExpenseCount,
    activeTab,
    setActiveTab,
  } = useExpenseStore()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [expenses, setExpenses] = useState<any[]>(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses')
      return savedExpenses ? JSON.parse(savedExpenses) : []
    } catch (error) {
      console.error('Failed to parse expenses from localStorage:', error)
      return [] // Return an empty array if parsing fails
    }
  })

  // date form

  // tab switching is active
  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    console.log(expenses.length)
  }

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses)) //save the current expenses to local whenever it changes
  }, [expenses])

  useEffect(() => {
    // we are going to apply the darkm mode in this instance
    const expensesContainer = document.getElementById('darky')

    if (expenses.length > 0 || expensesContainer) {
      if (isDarkMode) {
        expensesContainer?.classList.add('dark-mode')
      } else {
        expensesContainer?.classList.remove('dark-mode')
      }
      //Checks if theres more than one expenses
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0) //`reduce` calculates the sum of all amounts in the `expenses` array.
      setMonthlyTotal(`$${total.toFixed(2)}`)
      setExpenseCount(expenses.length)

      const categoryTotals: { [key: string]: number } = {} // Create an object to store total amounts per category. The keys are category names.
      expenses.forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
        // so for each expense, add its amount to the rightful category in `categoryTotals`.
      })

      const mostSpentCategory = Object.entries(categoryTotals).reduce(
        (max, entry) => (entry[1] > max[1] ? entry : max),
        ['', 0]
      )[0]
      // Turns `categoryTotals` into an array of [key, value] pairs, finds the one with the highest value (spending), and grabs the key (category name).
      setTopCategory(mostSpentCategory)
    }
  }, [expenses, isDarkMode])

  // this is where i'll add the logic for adding an expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    const category = form.expenseCategory.value
    const amount = parseFloat(form.expenseAmount.value)

    if (!category || isNaN(amount) || !selectedDate) {
      alert('Please fill in all fields correctly')
      return
    }

    setExpenses((prevExpenses) => [
      ...prevExpenses,
      {
        date: selectedDate.toISOString().split('T')[0],
        category,
        amount
      }
    ])

    // Reset form
    form.reset()
    setSelectedDate(null)
  }

  const testNotif = async () => {
    document.getElementById('test-pop')!.click()
    await new Promise((r) => setTimeout(r, 3000))
    document.getElementById('test-pop')!.click()
  }

  const testNotifDesk = async () => {
    await window.api.notify()
  }

  return (
    <>
      {/* <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Expense Tracker</title>
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      
      </head> */}

      <div className={`app-container ${isDarkMode ? 'dark-mode ' : ''}`} id="darky">
        <header className="header">
          <div className="header-top">
            <h1>Budgetary</h1>
            {/* logout feature right here */}
            <Link to="/" className="btn btn-secondary" viewTransition={true}>
              Home
            </Link>
            <button type="button" onClick={() => testNotif()}>
              Test Notif
            </button>
            <button type="button" onClick={() => testNotifDesk()}>
              Test Notif Desktop
            </button>
            <input type="checkbox" name="testpop" id="test-pop" style={{ display: 'none' }} />
            <NotifyButton category='Notification Category' msg='test notif' />
          </div>
          {/* new section {Monthly spending} */}
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stat-label">Monthly Spend</div>
              <div className="stat-value" id="monthlyTotal">
                {monthlyTotal}
              </div>
            </div>
            {/* new section {Most Spent on} */}
            <div className="stat-card">
              <div className="stat-label">Most Spent On</div>
              <div className="stat-value" id="topCategory">
                {topCategory}
              </div>
            </div>
            {/* new section {Total Expenses} */}
            <div className="stat-card">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value" id="expenseCount">
                {expenseCount}
              </div>
            </div>
          </div>
        </header>

        <div className="container">
          {/* creating tabs here */}

          <section className="surrounding-tabs">
            <nav className="tabs">
              {/* <button className="tab-button active" data-tab="expenses">Expenses</button> */}
              {/* Active Tab Switching */}
              <button
                className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
                onClick={() => handleTabClick('expenses')}
              >
                Expenses
              </button>

              <button
                className={`tab-button ${activeTab === 'graphs' ? 'active' : ''}`}
                onClick={() => handleTabClick('graphs')}
              >
                Graphs
              </button>

              <button
                className={`tab-button ${activeTab === 'Categories' ? 'active' : ''}`}
                onClick={() => handleTabClick('Categories')}
              >
                Categories
              </button>
              <button
                className={`tab-button ${activeTab === 'budgetPlan' ? 'active' : ''}`}
                onClick={() => handleTabClick('budgetPlan')}
              >
                Budget Plan
              </button>
            </nav>
          </section>

          <main>
            {activeTab === 'expenses' && (
              <div id="expenses" className="tab-content active">
                <form id="expenseForm" className="expenseDate" onSubmit={handleAddExpense}>
                  <div className="form-inputs">
                    <DatePicker
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                      className="expense-input"
                    />
                    <select name="expenseCategory" id="category" required>
                      <option value="" disabled selected>
                        Select Category
                      </option>
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Dining Out">Dining Out</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      id="expenseAmount"
                      name="amount"
                      placeholder="Amount"
                      step="0.1"
                      required
                    />
                    <button type="submit" id="addExpenseButton" className="add-expense-btn">
                      Add Expense
                    </button>
                  </div>
                </form>

                {/* month selection */}
                <section className="surrounding-month">
                  <div id="monthSelector" className="month-selector">
                    <label id="" htmlFor="monthPicker">
                      SelectMonth:
                    </label>
                    <input type="month" id="monthPicker" />
                  </div>
                </section>

                {/* Your Expense Listed out */}

                <div className="surrouding-expense">
                  <div className="expense-list-container">
                    <ul id="expenseList">
                      {expenses.map((expense, index) => (
                        <li key={index}>
                          <span>{expense.date}</span> - <span>{expense.category}</span> -{''}
                          <span>${expense.amount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <p id="total" className="total-amount">
                      Total: {monthlyTotal}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'graphs' && <Graphs />}

            {/* Categories Tab Content */}
            {activeTab === 'Categories' && (
              <div id="categories" className="tab-content">
                <div className="categories-list">
                  <h2>Henlo!</h2>
                  {/* Categories content will go here */}
                  <p>Categories will be populated here!</p>
                </div>
              </div>
            )}
            {/*  */}
            {activeTab === 'budgetPlan' && (
              <div id="budgetPlan" className="tab-content budget-plan">
                
                <BudgetPlanner expenses ={expenses} />
     
             </div>
             
            )}
          </main>
          </div>
        </div>
        <div className="copyright">
          &copy; 2025 Budgetary Tracker. All rights reserved.
        </div>
    </>
  )
}

export const Route = createLazyFileRoute('/expenses')({
  component: Expenses
})
