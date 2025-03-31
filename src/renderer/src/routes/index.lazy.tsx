import { createLazyFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useExpenseStore } from '../stores/expenseStore';
import { useDarkModeStore } from './__root';
import { useUpcomingBills } from '@renderer/lib/upcomingBill';
import { useNotificationSystem, NotificationType } from '@renderer/components/NotificationSystem';

// Dashboard component
const DashboardIndex = () => {
  const { expenses, addExpense, addCashFlowTransaction } = useExpenseStore();
  const { isDarkMode } = useDarkModeStore();
  const { showNotification } = useNotificationSystem();
  const upcomingBills = useUpcomingBills(30);
  
  // Form state for quick expense entry
  const [quickEntryDate, setQuickEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickEntryCategory, setQuickEntryCategory] = useState('');
  const [quickEntryAmount, setQuickEntryAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Active section tracking
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Calculate budget overview
  const budgetOverview = useMemo(() => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const estimatedIncome = 3500; // This would come from income in a real app
    return {
      income: estimatedIncome,
      spent: totalSpent,
      remaining: estimatedIncome - totalSpent,
      percentage: Math.round((totalSpent / estimatedIncome) * 100)
    };
  }, [expenses]);
  
  // Get recent expenses
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);
  
  // Calculate category totals
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);
  
  // Get upcoming bills due in the next 7 days
  const urgentBills = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return upcomingBills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate <= nextWeek;
    }).slice(0, 3);
  }, [upcomingBills]);
  
  // Handle expense form submission
  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = parseFloat(quickEntryAmount);
    
    if (!quickEntryCategory || isNaN(amount) || amount <= 0 || !quickEntryDate) {
      showNotification(
        "Error", 
        "Please fill all fields correctly!",
        NotificationType.ERROR
      );
      return;
    }

    // Add expense
    const newExpense = {
      date: quickEntryDate,
      category: quickEntryCategory,
      amount: amount
    };
    addExpense(newExpense);

    // Add as recurring if selected
    if (isRecurring) {
      const newTransaction = {
        date: quickEntryDate,
        type: 'expense',
        category: quickEntryCategory,
        description: `Recurring ${quickEntryCategory} payment`,
        amount: amount
      };
      addCashFlowTransaction(newTransaction);
      
      showNotification(
        "Success", 
        `Added recurring ${quickEntryCategory} expense`,
        NotificationType.SUCCESS
      );
    } else {
      showNotification(
        "Success", 
        `Added ${quickEntryCategory} expense`,
        NotificationType.SUCCESS
      );
    }

    // Reset form
    setQuickEntryAmount('');
    setQuickEntryCategory('');
    setShowQuickAdd(false);
  };
  
  // Categories for expense form
  const categories = [
    'Rent', 'Groceries', 'Utilities', 'Insurance', 
    'Dining Out', 'Entertainment', 'Transportation', 
    'Clothes', 'Health', 'Education', 'Other'
  ];
  
  // Calculate how many days until a bill is due
  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `${diffDays} days`;
  };
  
  // Get current month and year
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Chart data for spending trend (sample data)
  const getDailyData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i - 1));
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 50) + 10
      });
    }
    return data;
  };
  
  const spendingTrendData = getDailyData();
  const maxAmount = Math.max(...spendingTrendData.map(d => d.amount));
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Decorative gradient elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-red-900/20 rounded-full blur-3xl"></div>
      
      {/* Quick add expense form - fixed position */}
      {showQuickAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="w-full max-w-md bg-[#111]/90 backdrop-blur-md rounded-xl border border-red-900/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-red-900/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add Expense</h2>
              <button 
                onClick={() => setShowQuickAdd(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddExpense} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={quickEntryDate} 
                    onChange={(e) => setQuickEntryDate(e.target.value)} 
                    className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-700/50 focus:border-red-700"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select 
                    value={quickEntryCategory} 
                    onChange={(e) => setQuickEntryCategory(e.target.value)} 
                    className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-700/50 focus:border-red-700"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      type="number" 
                      value={quickEntryAmount} 
                      onChange={(e) => setQuickEntryAmount(e.target.value)} 
                      placeholder="0.00" 
                      step="0.01" 
                      min="0.01" 
                      className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2 pl-8 text-white focus:ring-2 focus:ring-red-700/50 focus:border-red-700"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isRecurring} 
                        onChange={(e) => setIsRecurring(e.target.checked)} 
                        className="sr-only" 
                      />
                      <div className="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                      <div className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full transform transition ${
                        isRecurring ? 'translate-x-5 bg-red-500' : 'translate-x-0'
                      }`}></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-300">Recurring expense</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-5 flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowQuickAdd(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 mr-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg hover:from-red-800 hover:to-red-950"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="max-w-screen-2xl mx-auto p-4">
        {/* Header with menu and quick actions */}
        <header className="flex justify-between items-center py-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
              BUDGETARY
            </h1>
            <p className="text-gray-500 text-sm">
              {currentMonth} {currentYear}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center px-3 py-1.5 bg-red-900 hover:bg-red-800 rounded-lg text-sm font-medium transition"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0 0H6m6 0h6"></path>
              </svg>
              Add Expense
            </button>
            
            <div className="relative">
              <button className="w-9 h-9 bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-red-900/30 transition-shadow">
                <span className="text-xs font-bold">JS</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main navigation */}
        <nav className="mb-6">
          <div className="flex space-x-1 md:space-x-2 overflow-x-auto hide-scrollbar p-1">
            <button 
              onClick={() => setActiveSection('dashboard')} 
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                activeSection === 'dashboard' 
                  ? 'bg-red-900/60 text-white' 
                  : 'text-gray-400 hover:bg-red-900/30 hover:text-white'
              } transition-colors`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveSection('expenses')} 
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                activeSection === 'expenses' 
                  ? 'bg-red-900/60 text-white' 
                  : 'text-gray-400 hover:bg-red-900/30 hover:text-white'
              } transition-colors`}
            >
              Expenses
            </button>
            <button 
              onClick={() => setActiveSection('bills')} 
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                activeSection === 'bills' 
                  ? 'bg-red-900/60 text-white' 
                  : 'text-gray-400 hover:bg-red-900/30 hover:text-white'
              } transition-colors`}
            >
              Bills & Subscriptions
            </button>
            <button 
              onClick={() => setActiveSection('analytics')} 
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                activeSection === 'analytics' 
                  ? 'bg-red-900/60 text-white' 
                  : 'text-gray-400 hover:bg-red-900/30 hover:text-white'
              } transition-colors`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActiveSection('settings')} 
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                activeSection === 'settings' 
                  ? 'bg-red-900/60 text-white' 
                  : 'text-gray-400 hover:bg-red-900/30 hover:text-white'
              } transition-colors`}
            >
              Settings
            </button>
          </div>
        </nav>
        
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            {/* Financial Overview Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Income Card */}
              <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                <div className="relative p-5">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/30 rounded-bl-full"></div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Monthly Income</h3>
                  <div className="text-3xl font-bold">{formatCurrency(budgetOverview.income)}</div>
                  <div className="mt-2 text-xs text-green-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    +2.5% from last month
                  </div>
                </div>
              </div>
              
              {/* Expenses Card */}
              <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                <div className="relative p-5">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/30 rounded-bl-full"></div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Monthly Spent</h3>
                  <div className="text-3xl font-bold">{formatCurrency(budgetOverview.spent)}</div>
                  <div className="w-full bg-gray-900/50 rounded-full h-1 mt-3">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-700 h-1 rounded-full" 
                      style={{ width: `${budgetOverview.percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
                    <span>{budgetOverview.percentage}% of income</span>
                    <span className="text-red-500">{budgetOverview.percentage > 80 ? 'Warning: High spending' : ''}</span>
                  </div>
                </div>
              </div>
              
              {/* Remaining Card */}
              <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                <div className="relative p-5">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/30 rounded-bl-full"></div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Remaining Budget</h3>
                  <div className="text-3xl font-bold">{formatCurrency(budgetOverview.remaining)}</div>
                  <div className="w-full bg-gray-900/50 rounded-full h-1 mt-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-1 rounded-full" 
                      style={{ width: `${100 - budgetOverview.percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {100 - budgetOverview.percentage}% of income remaining
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Recent Expenses - 7 columns */}
              <div className="col-span-12 lg:col-span-7 bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-red-900/30 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Recent Expenses</h2>
                  <Link 
                    to="/expenses" 
                    className="text-xs text-red-500 hover:text-red-400 flex items-center"
                  >
                    View All
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
                <div className="divide-y divide-gray-800/50">
                  {recentExpenses.length > 0 ? (
                    recentExpenses.map((expense, index) => (
                      <div key={index} className="p-4 hover:bg-black/20 transition">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">{expense.category}</div>
                              <div className="text-xs text-gray-500">{formatDate(expense.date)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-500">{formatCurrency(expense.amount)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No recent expenses found
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - 5 columns */}
              <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
                {/* Upcoming Bills Card */}
                <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-red-900/30 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Upcoming Bills</h2>
                    <Link 
                      to="/smart-assistant" 
                      className="text-xs text-red-500 hover:text-red-400 flex items-center"
                    >
                      Manage
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="divide-y divide-gray-800/50">
                    {urgentBills.length > 0 ? (
                      urgentBills.map((bill, index) => (
                        <div key={index} className="p-4 hover:bg-black/20 transition">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium flex items-center">
                                {bill.name}
                                {(getDaysUntil(bill.dueDate) === 'Today' || getDaysUntil(bill.dueDate) === 'Tomorrow' || getDaysUntil(bill.dueDate) === 'Overdue') && (
                                  <span className="ml-2 px-2 py-0.5 bg-red-900/30 text-red-500 text-xs rounded-full">
                                    {getDaysUntil(bill.dueDate)}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">Due {formatDate(bill.dueDate)}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(bill.amount)}</div>
                              <button className="text-xs text-red-500 hover:text-red-400">
                                Pay Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No upcoming bills
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Monthly Distribution Card */}
                <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-red-900/30">
                    <h2 className="text-lg font-semibold">Spending Distribution</h2>
                  </div>
                  <div className="p-4">
                    {categoryData.length > 0 ? (
                      <div className="space-y-3">
                        {categoryData.slice(0, 5).map((category, index) => {
                          const percentage = Math.round((category.value / budgetOverview.spent) * 100);
                          return (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="font-medium text-sm">{category.name}</div>
                                <div className="text-xs font-semibold">{percentage}%</div>
                              </div>
                              <div className="w-full h-2 bg-gray-900/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full"
                                  style={{ 
                                    width: `${percentage}%`, 
                                    background: index === 0 
                                      ? 'linear-gradient(to right, #d00, #900)' 
                                      : `linear-gradient(to right, rgba(220, 38, 38, ${0.9 - index * 0.15}), rgba(127, 29, 29, ${0.9 - index * 0.15}))` 
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No expense data found
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Daily Spending Trend - Full width */}
              <div className="col-span-12 bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-red-900/30">
                  <h2 className="text-lg font-semibold">Daily Spending Trend</h2>
                </div>
                <div className="p-5">
                  <div className="w-full h-60 flex items-end">
                    {spendingTrendData.slice(-14).map((day, i) => {
                      const height = (day.amount / maxAmount) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full max-w-[20px] bg-gradient-to-t from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 rounded-sm transition-all cursor-pointer group relative"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black border border-red-900/50 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formatCurrency(day.amount)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {formatDate(day.date).split(' ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Expenses Section */}
        {activeSection === 'expenses' && (
          <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-5">Expense Management (Coming soon)</h2>
            <div className="min-h-60 flex items-center justify-center">
              <p className="text-gray-500">This feature is under development.</p>
            </div>
          </div>
        )}
        
        {/* Bills Section */}
        {activeSection === 'bills' && (
          <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-5">Bills & Subscriptions (Coming soon)</h2>
            <div className="min-h-60 flex items-center justify-center">
              <p className="text-gray-500">This feature is under development.</p>
            </div>
          </div>
        )}
        
        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-5">Analytics (Coming soon)</h2>
            <div className="min-h-60 flex items-center justify-center">
              <p className="text-gray-500">This feature is under development.</p>
            </div>
          </div>
        )}
        
        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="bg-[#111]/60 backdrop-blur-sm border border-red-900/50 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-5">Settings (Coming soon)</h2>
            <div className="min-h-60 flex items-center justify-center">
              <p className="text-gray-500">This feature is under development.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-600">
        &copy; 2025 Budgetary Tracker. All rights reserved.
      </footer>
      
      {/* Custom CSS for glass effects and animations */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Glowing effect for header */
        h1 {
          filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.5));
        }
        
        /* Glass card hover effect */
        .backdrop-blur-sm {
          transition: all 0.3s ease;
        }
        
        .backdrop-blur-sm:hover {
          box-shadow: 0 0 15px 0 rgba(220, 38, 38, 0.2);
        }
        
        /* Animated gradient background */
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .bg-gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export const Route = createLazyFileRoute('/')({
  component: DashboardIndex,
});