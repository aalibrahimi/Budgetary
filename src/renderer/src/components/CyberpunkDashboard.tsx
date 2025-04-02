import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from '@tanstack/react-router';
import CyberpunkNavbar from './CyberpunkNavbar';
import { useExpenseStore } from '../stores/expenseStore';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ExpenseRow {
  date: string;
  formattedDate: string;
  category: string;
  amount: number;
}

const CyberpunkDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { expenses } = useExpenseStore();
  const [activePeriod, setActivePeriod] = useState('monthly');
  
  // Only render when cyberpunk theme is active
  if (theme !== 'cyberpunk') return null;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  // Get date with month and day only
  const getShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`;
  };
  
  // Mock data
  const monthlyIncome = 3500.00;
  const totalSpent = 7375.55;
  const remaining = monthlyIncome - totalSpent;
  
  // Prepare recent expenses
  const recentExpenses: ExpenseRow[] = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(expense => ({
      date: expense.date,
      formattedDate: `Apr ${new Date(expense.date).getDate()}`,
      category: expense.category,
      amount: expense.amount
    }));
    
  // Add mortgage if not present
  if (!recentExpenses.some(exp => exp.category === 'Mortgage')) {
    recentExpenses.push({
      date: '2025-04-01',
      formattedDate: 'Apr 1',
      category: 'Mortgage',
      amount: 4500.89
    });
  }
  
  // Calculate category totals for pie chart
  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    [...expenses, { date: '2025-04-01', category: 'Mortgage', amount: 4500.89 }].forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  const categoryTotals = getCategoryTotals();
  
  // Pie chart colors
  const COLORS = ['#ff3b3b', '#40E0D0', '#FFC75F', '#E67E22', '#F1C40F'];
  
  // Upcoming bills (mock data)
  const upcomingBills = [
    { name: 'Discord Nitro', dueDate: 'Mar 30', amount: 9.99 },
    { name: 'Google Drive', dueDate: 'Mar 30', amount: 15.00 },
    { name: 'Apple Music', dueDate: 'Apr 2', amount: 15.00 },
  ];
  
  // Budget allocations
  const budgetAllocations = [
    { category: 'Housing', percentage: 50 },
    { category: 'Food', percentage: 20 },
    { category: 'Transportation', percentage: 15 },
    { category: 'Utilities', percentage: 10 },
    { category: 'Entertainment', percentage: 5 },
  ];
  
  return (
    <div className="cyberpunk-dashboard">
      {/* Fixed header with cyber theme */}
      <CyberpunkNavbar />
      
      {/* Main dashboard container */}
      <div className="p-5">
        {/* Dashboard title */}
        <h1 className="text-3xl uppercase text-gray-500 mb-6 font-bold ml-1">Dashboard</h1>
        
        {/* Stats cards */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="stat-label">Income</div>
            <div className="stat-value">${monthlyIncome.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">100% AVAILABLE</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Spent this month</div>
            <div className="stat-value">${totalSpent.toFixed(2)}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Remaining</div>
            <div className={`stat-value ${remaining < 0 ? 'remaining-negative' : ''}`}>
              ${remaining.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Period tabs */}
        <div className="surrounding-tabs">
          <div className="tabs">
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
          </div>
        </div>
        
        {/* Main dashboard grid */}
        <div className="dashboard-grid grid-cols-2 gap-4">
          {/* Recent Expenses */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>
                Recent Expenses
              </h2>
              <Link to="/expenses" className="dashboard-card-link">View All</Link>
            </div>
            
            <div className="p-3">
              <table className="expense-list w-full">
                <tbody>
                  {recentExpenses.map((expense, index) => (
                    <tr key={index}>
                      <td className="expense-date">
                        {expense.formattedDate}
                      </td>
                      <td className="expense-category">
                        {expense.category}
                      </td>
                      <td className="expense-amount">
                        ${expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Spending by Category */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>Spending by Category</h2>
            </div>
            
            {categoryTotals.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryTotals.slice(0, 5)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={30}
                      fill="#ff3b3b"
                    >
                      {categoryTotals.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="chart-legend">
                  {categoryTotals.slice(0, 5).map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span>{entry.name}: {Math.round((entry.value / totalSpent) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No expense data to display
              </div>
            )}
          </div>
          
          {/* Upcoming Bills */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                Upcoming Bills
              </h2>
              <a href="#" className="dashboard-card-link">Manage →</a>
            </div>
            
            <div className="p-3">
              <div className="space-y-4">
                {upcomingBills.map((bill, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{bill.name}</div>
                      <div className="text-xs text-gray-500">Due {bill.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-500 font-bold">${bill.amount.toFixed(2)}</div>
                      <div className="text-xs text-red-500">Overdue</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-red-500/10">
                <button className="w-full py-2 text-xs uppercase bg-black/30 border border-red-500/20 hover:bg-red-500/10">
                  Pay All Due Bills
                </button>
              </div>
            </div>
          </div>
          
          {/* Budget Allocations */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>Budget Allocations</h2>
            </div>
            
            <div className="budget-allocations">
              {budgetAllocations.map((allocation, idx) => (
                <div key={idx} className="allocation-item">
                  <div className="allocation-header">
                    <span className="allocation-name">{allocation.category}</span>
                    <span className="allocation-percentage">{allocation.percentage}%</span>
                  </div>
                  <div className="allocation-bar-bg">
                    <div 
                      className="allocation-bar-fill"
                      style={{ width: `${allocation.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-3 border-t border-red-500/10">
                <button className="w-full py-2 text-xs uppercase bg-red-500/20 border border-red-500/30 text-red-500 hover:bg-red-500/30">
                  Adjust Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* System status indicators */}
      <div className="system-status">
        <div className="status-pill">
          <span className="status-indicator"></span>
          <span>System Online</span>
        </div>
        <div className="status-pill">
          <span>Next Scan: 50</span>
        </div>
      </div>
      
      {/* Scanner effect at the bottom */}
      <div className="scanner-line"></div>
    </div>
  );
};

export default CyberpunkDashboard;