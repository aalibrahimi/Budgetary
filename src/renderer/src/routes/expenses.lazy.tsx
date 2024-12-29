import { useForm } from '@tanstack/react-form'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import '../assets/expenses.css'
import React from "react";
import { useState } from "react";

const Expenses: React.FC = () => {
  const [is_authenticated,  setIsAuthenticated] = useState(true);
  const [monthlyTotal, setmonthlyTotal] = useState("$0.00")
  const [topCategory,  setTopCategory] = useState("-")
  const [expenseCount, setExpenseCount] = useState(0)

  // this is where ill add the logic for adding an expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
  }
  // const form = useForm({
  //   defaultValues: {
  //     fullName: '',
  //   },
  //   onSubmit: async ({ value }) => {
  //     console.log(value)
  //   },
  // })

  return (
   <>
   
      <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Expense Tracker</title>
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      
      </head>
      
         <div>
        <div className="container">

          <header className="header">
            <div className="header-top">
              <h1>Expense Tracker</h1>
              {/* logout feature right here */}
                <div className="auth-links">
                  {is_authenticated && <a href="/logout">Logout</a>}
                </div>    
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

          {/* creating tabs here */}
          <nav className="tabs">
            <button className="tab-button active" data-tab="expenses">Expenses</button>
            <button className="tab-button" data-tab="graphs">Graphs</button>
            <button className="tab-button" data-tab="Categories">Categories</button>
          </nav>

          <main>
            <div id="expenses" className="tab-content active">
              <form id= "expenseForm" className="expenseDate" action="POST">
                <div className="form-inputs">
                  <input type="date" id="expenseDate" name="date" required/>
                  <select name="expenseCategory" id="category" required>
                  <option value="" disabled>
                      Select Category
                    </option>
                    <option value="" disabled selected>Select Category</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Rent">Rent</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Dining Out">Dining Out</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Clothes">Clothes</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Other">Other</option>
                  </select>
                  <input type="text" id="expenseAmount" name="amount" placeholder='Amount' step="0.1" required/>
                  <button type="submit" id="addExpenseButton" className="add-expense-btn">Add Expense</button>
                </div>
              </form>

              {/* month selection */}
              <div id="monthSelector" className="month-selector">
                <label htmlFor="monthPicker">SelectMonth:</label>
                <input type="month" id="monthPicker" />
              </div>

              {/* Your Expense Listed out */}
              <div className="expense-list-container">
                <ul id="expenseList">
                  <p id="total" className="total-amount"></p>
                </ul>
              </div>
            </div>

            {/* graph section Here */}
            <div id="graphs" className="tab-content">
              <select id="graphType" className="graph-select">
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="line">Line Chart</option>
              </select>
              <div id="graphContainer" className="graph-container"></div>
            </div>

            <div id="categories" className="tab-content">
              <div className="categories-list">
                {/* this will be populated by jss hehe */}
              </div>
            </div>
          </main>
          <footer className="footer">
            {/* <a href="/landing" className="btn btn-secondary">
            Home
            </a> */}
            <Link to='/' className="btn btn-secondary" viewTransition={true} >Home</Link>
            
          </footer>
        </div>
      </div>
     
     
    </>
  )
}

export const Route = createLazyFileRoute('/expenses')({
  component: Expenses,
})
