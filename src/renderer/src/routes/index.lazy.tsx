import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useMemo } from 'react';
import '../assets/index.css';
import '../assets/expenses.css';
import '../assets/statsCard.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { useDarkModeStore } from './__root';
import { useExpenseStore } from '../stores/expenseStore';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, DollarSign, PiggyBank, Wallet, Sparkles, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import CashFlowForecast from '@renderer/components/CashFlowForecast';

const DashboardIndex = () => {
  const { isDarkMode } = useDarkModeStore();
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  
  // Get real expense data from store
  const { expenses } = useExpenseStore();
  
  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get recent expenses (latest 4)
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [expenses]);
  
  // Calculate category totals for pie chart
  const categoryData = useMemo(() => {
    const categoryTotals: {[key: string]: number} = {};
    
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [expenses]);
  
  // Calculate budget overview
  const budgetOverview = useMemo(() => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const estimatedIncome = 3500; // This would come from income in a real app
    return {
      income: estimatedIncome,
      spent: totalSpent,
      remaining: estimatedIncome - totalSpent
    };
  }, [expenses]);

  // Sample data for sections that would be implemented later
  const sampleData = {
    upcomingBills: [
      { name: 'Rent', amount: 1200, dueDate: '2025-04-01' },
      { name: 'Internet', amount: 65, dueDate: '2025-04-05' },
      { name: 'Electricity', amount: 120, dueDate: '2025-04-12' }
    ],
    savingsGoals: [
      { name: 'Emergency Fund', target: 10000, current: 6500, color: '#FF6B6B' },
      { name: 'Vacation', target: 3000, current: 1200, color: '#4ECDC4' },
      { name: 'New Car', target: 15000, current: 4500, color: '#1A535C' }
    ]
  };
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Chart colors
  const COLORS = ['#FF6B6B', '#4ECDC4', '#1A535C', '#FFE66D', '#FF9E80'];

  // Helper function to get icon based on category
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Groceries': 'shopping-cart',
      'Rent': 'home',
      'Insurance': 'shield',
      'Dining Out': 'utensils',
      'Entertainment': 'film',
      'Transportation': 'car',
      'Clothes': 'tshirt',
      'Other': 'tag'
    };
    return icons[category] || 'circle';
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`} id="darky">
      <header className="header">
        <div className="header-top">
          <h1>Dashboard</h1>
          <Link to="/expenses" className="btn btn-secondary" viewTransition={true}>
            View Expenses
          </Link>
        </div>
        
        {/* Stats Cards Row */}
        <div className="stats-grid">
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
          {/* Two-column layout for larger screens */}
          <div className="dashboard-grid">
            {/* Left column */}
            <div className="dashboard-section">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2><Wallet className="dashboard-card-icon" /> Recent Expenses</h2>
                  <Link to="/expenses" className="dashboard-card-link">View All</Link>
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

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2><Calendar className="dashboard-card-icon" /> Upcoming Bills</h2>
                </div>
                <div className="bills-list">
                  {sampleData.upcomingBills.map((bill, index) => (
                    <div key={index} className="bill-item">
                      <div className="bill-info">
                        <span className="bill-name">{bill.name}</span>
                        <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                      </div>
                      <div className="bill-due-date">
                        Due: {bill.dueDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="dashboard-section">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2>Spending by Category</h2>
                </div>
                <div className="chart-container">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart-message">No expense data to display</div>
                  )}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2><PiggyBank className="dashboard-card-icon" /> Savings Goals</h2>
                </div>
                <div className="savings-goals">
                  {sampleData.savingsGoals.map((goal, index) => {
                    const progress = (goal.current / goal.target) * 100;
                    return (
                      <div key={index} className="savings-goal">
                        <div className="savings-goal-header">
                          <span className="savings-goal-name">{goal.name}</span>
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Full-width card for budget allocation */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2><DollarSign className="dashboard-card-icon" /> Budget Allocation</h2>
              <Link to="/expenses?tab=budgetPlan" className="dashboard-card-link">Adjust Budget</Link>
            </div>
            <div className="budget-allocation-container">
              {categoryData.length > 0 ? (
                categoryData.map((category, index) => (
                  <div key={index} className="budget-allocation-item">
                    <div className="budget-allocation-header">
                      <span className="category-icon" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                        <i className={`fas fa-${getCategoryIcon(category.name)}`}></i>
                      </span>
                      <div className="category-details">
                        <span className="category-name">{category.name}</span>
                        <span className="category-amount">{formatCurrency(category.value)}</span>
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
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2><Sparkles className="dashboard-card-icon" /> Financial Insights</h2>
            </div>
            <div className="insights-container">
              <div className="insight-item">
                <div className="insight-icon" style={{ backgroundColor: COLORS[0] }}>
                  <i className="fas fa-arrow-trend-up"></i>
                </div>
                <div className="insight-content">
                  <h3>Spending Trend</h3>
                  <p>Your spending on Dining Out is 15% higher than last month. Consider setting a stricter budget.</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon" style={{ backgroundColor: COLORS[1] }}>
                  <i className="fas fa-piggy-bank"></i>
                </div>
                <div className="insight-content">
                  <h3>Savings Opportunity</h3>
                  <p>You could save an extra $120/month by reducing your Entertainment expenses by 20%.</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon" style={{ backgroundColor: COLORS[2] }}>
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="insight-content">
                  <h3>Income Allocation</h3>
                  <p>You're currently saving 8% of your income. Financial experts recommend 15-20%.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Entry */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2><Plus className="dashboard-card-icon" /> Quick Expense Entry</h2>
            </div>
            <div className="quick-entry-container">
              <form className="quick-entry-form">
                <div className="quick-entry-inputs">
                  <div className="quick-entry-field">
                    <label>Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="quick-entry-input" />
                  </div>
                  <div className="quick-entry-field">
                    <label>Category</label>
                    <select className="quick-entry-input">
                      <option value="">Select Category</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Dining Out">Dining Out</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="quick-entry-field">
                    <label>Amount</label>
                    <input type="number" placeholder="0.00" className="quick-entry-input" />
                  </div>
                </div>
                <button type="button" className="quick-entry-btn">Add Expense</button>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <CashFlowForecast />

      <div className="copyright">
        &copy; 2025 Budgetary Tracker. All rights reserved.
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/')({
  component: DashboardIndex,
});