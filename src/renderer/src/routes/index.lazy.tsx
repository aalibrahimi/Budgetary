import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import '../assets/index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { useDarkModeStore } from './__root';
import { useExpenseStore } from '../stores/expenseStore';

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useDarkModeStore();
  const [activeTask, setActiveTask] = useState('to-do');
  
  const {
    monthlyTotal,
    topCategory,
    expenseCount,
    expenses,
    getTotal,
    getCategoryTotals,
    setMonthlyTotal,
    setTopCategory,
    setExpenseCount,
    budgetAllocation,
    income
  } = useExpenseStore();

  // Mock subscription data
  const subscriptions = [
    { name: 'Netflix', amount: 15.99, date: '08', icon: 'fa-film' },
    { name: 'Spotify', amount: 9.99, date: '12', icon: 'fa-music' },
    { name: 'Adobe Creative Cloud', amount: 52.99, date: '15', icon: 'fa-paintbrush' },
    { name: 'Amazon Prime', amount: 14.99, date: '21', icon: 'fa-box' },
  ];

  // Mock task data
  const tasks = [
    { id: 1, title: 'Set up monthly budget', priority: 'high', status: 'to-do' },
    { id: 2, title: 'Review spending categories', priority: 'medium', status: 'to-do' },
    { id: 3, title: 'Link bank account', priority: 'medium', status: 'to-do' },
    { id: 4, title: 'Plan savings goal', priority: 'high', status: 'in-progress' },
    { id: 5, title: 'Add recurring bills', priority: 'medium', status: 'in-progress' },
    { id: 6, title: 'Review subscription services', priority: 'low', status: 'done' },
    { id: 7, title: 'Create emergency fund', priority: 'high', status: 'done' }
  ];

  // Credit score data
  const creditScore = {
    score: 730,
    max: 850,
    status: 'Good',
    lastUpdated: '2025-02-15'
  };

  // System health data
  const systemHealth = [
    { name: 'Budget Utilization', value: 201, max: 100, color: 'red' },
    { name: 'Spending Rate', value: 72, max: 100, color: 'yellow' },
    { name: 'Savings Progress', value: 28, max: 100, color: 'green' }
  ];

  // Recent activity data
  const recentActivity = [
    { icon: 'fa-utensils', title: 'Expense Added: Dining Out', time: '2 mins ago', amount: '$24.09' },
    { icon: 'fa-tshirt', title: 'Expense Added: Clothes', time: '5 mins ago', amount: '$45.09' },
    { icon: 'fa-car', title: 'Expense Added: Transportation', time: '15 mins ago', amount: '$65.09' },
    { icon: 'fa-home', title: 'Budget Limit Updated: Rent', time: '30 mins ago', amount: '$1,500.00' }
  ];

  // Sync dark mode with localStorage and DOM
  useEffect(() => {
    const darkMode = localStorage.getItem('isDarkMode');
    const darkModeBoolean = darkMode === 'true';
    setIsDarkMode(darkModeBoolean);

    const darkyElement = document.getElementById('darky');
    if (darkyElement) {
      if (darkModeBoolean) {
        darkyElement.classList.add('dark-mode');
      } else {
        darkyElement.classList.remove('dark-mode');
      }
    }
  }, [setIsDarkMode]);

  // Calculate expense statistics
  useEffect(() => {
    if (expenses.length > 0) {
      // Use store functions for calculations
      const total = getTotal();
      setMonthlyTotal(`$${total.toFixed(2)}`);
      setExpenseCount(expenses.length);

      const categoryTotals = getCategoryTotals();
      const mostSpentCategory = Object.entries(categoryTotals).reduce(
        (max, [category, amount]) => {
          return amount > max[1] ? [category, amount] : max;
        },
        ['', 0]
      )[0];

      setTopCategory(mostSpentCategory);
    }
  }, [
    expenses,
    getTotal,
    getCategoryTotals,
    setMonthlyTotal,
    setExpenseCount,
    setTopCategory
  ]);

  // Get category totals for the category breakdown
  const categoryTotals = getCategoryTotals();
  const total = getTotal();
  
  // Calculate remaining budget
  const remainingBudget = income > 0 ? income - total : 0;
  const remainingPercentage = income > 0 ? Math.round((remainingBudget / income) * 100) : 0;
  const isOverBudget = remainingBudget < 0;

  // Format values
  const formattedTotal = `$${Math.abs(total).toFixed(2)}`;
  const formattedRemaining = `${isOverBudget ? '-' : ''}$${Math.abs(remainingBudget).toFixed(2)}`;
  const monthlyBudget = income > 0 ? `$${income.toFixed(2)}` : '$0.00';
  const topCategoryPercentage = categoryTotals[topCategory] ? Math.round((categoryTotals[topCategory] / total) * 100) : 0;
  
  // Get recent transactions
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get top spending categories
  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      amount,
      percentage: Math.round((amount / total) * 100) || 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  // Filter tasks by status
  const filteredTasks = tasks.filter(task => task.status === activeTask);
  const taskCounts = {
    'to-do': tasks.filter(task => task.status === 'to-do').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    'done': tasks.filter(task => task.status === 'done').length
  };

  return (
    <div 
      id="darky" 
      className="min-h-screen w-full"
      style={{ background: 'linear-gradient(180deg, #090909 0%, #2f0606 100%)' }}
    >
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-red-900/20">
        <h1 className="text-2xl font-bold text-red-500">Dashboard</h1>
        <div className="flex space-x-6">
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-chart-line mr-2"></i>
            Reports
          </button>
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-users mr-2"></i>
            Teams
          </button>
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-book mr-2"></i>
            Resources
          </button>
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-shield-alt mr-2"></i>
            Security
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 relative">
            <i className="fas fa-bell text-xl"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold">
            CEO
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Monthly Spend */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Monthly Spend</p>
                <h2 className="text-4xl font-bold text-white">{formattedTotal}</h2>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-900/20 text-red-500">
                <i className="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div className="flex items-center text-red-500 text-sm">
              <i className="fas fa-arrow-up mr-1"></i>
              <span>12.5% from last month</span>
            </div>
          </div>

          {/* Top Category */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Top Category</p>
                <h2 className="text-4xl font-bold text-white">{topCategory || "N/A"}</h2>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-900/20 text-red-500">
                <i className="fas fa-tag"></i>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {topCategoryPercentage}% of total spending
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Transactions</p>
                <h2 className="text-4xl font-bold text-white">{expenseCount || 0}</h2>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-900/20 text-red-500">
                <i className="fas fa-receipt"></i>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Total expense records
            </div>
          </div>

          {/* Remaining Budget */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Remaining Budget</p>
                <h2 className="text-4xl font-bold text-white">{formattedRemaining}</h2>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-900/20 text-red-500">
                <i className="fas fa-wallet"></i>
              </div>
            </div>
            <div className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-gray-400'}`}>
              {isOverBudget ? '-' : ''}{Math.abs(remainingPercentage)}% of monthly budget
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Overview Panel */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-chart-pie text-red-500 mr-2"></i>
              Spending Overview
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Budget Usage</span>
                <span className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-gray-400'}`}>
                  {isOverBudget ? 'Over Budget' : 'On Track'}
                </span>
              </div>
              <div className="h-1 w-full bg-red-900/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (total / (income || 1)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>{monthlyBudget}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-red-900/10">
                <div className="text-gray-400">Monthly Budget</div>
                <div className="font-medium text-white flex items-center">
                  <i className="fas fa-money-bill-wave text-red-500 mr-2"></i>
                  {monthlyBudget}
                </div>
              </div>
              
              <div className="flex justify-between py-2 border-b border-red-900/10">
                <div className="text-gray-400">Total Spent</div>
                <div className="font-medium text-white flex items-center">
                  <i className="fas fa-credit-card text-red-500 mr-2"></i>
                  {formattedTotal}
                </div>
              </div>
              
              <div className="flex justify-between py-2 border-b border-red-900/10">
                <div className="text-gray-400">Remaining</div>
                <div className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-white'} flex items-center`}>
                  <i className={`fas fa-piggy-bank ${isOverBudget ? 'text-red-500' : 'text-red-500'} mr-2`}></i>
                  {formattedRemaining}
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between mb-1">
                  <div className="text-gray-400">Daily Budget</div>
                  <div className="font-medium text-white">-$303.32/day</div>
                </div>
                <div className="text-xs text-gray-500">
                  Suggested daily spending for the rest of the month
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat/Messages Panel */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-900/20 text-red-500 mr-3">
                <i className="fas fa-comment-alt"></i>
              </div>
              <div>
                <h3 className="text-white font-bold">Financial Assistant</h3>
                <div className="text-gray-400 text-sm">12 Messages</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-red-900/10 rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-white text-sm">How much have I spent on dining out this month?</p>
                <div className="text-xs text-gray-500 text-right mt-1">You, 5m ago</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 max-w-xs">
                <p className="text-white text-sm">You've spent $157.27 on dining out this month, which is 2% of your total spending.</p>
                <div className="text-xs text-gray-500 mt-1">Assistant, 4m ago</div>
              </div>
              
              <div className="bg-red-900/10 rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-white text-sm">What's my biggest expense category?</p>
                <div className="text-xs text-gray-500 text-right mt-1">You, 3m ago</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3 max-w-xs">
                <p className="text-white text-sm">Your biggest expense category is Insurance at $6,000.00, which is 66% of your total spending.</p>
                <div className="text-xs text-gray-500 mt-1">Assistant, 2m ago</div>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask me about your finances..." 
                className="w-full bg-gray-800/30 border border-red-900/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button className="absolute right-2 top-2 text-red-500">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
          
          {/* Members/Billing Panel */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-900/20 text-red-500 mr-3">
                <i className="fas fa-credit-card"></i>
              </div>
              <div>
                <h3 className="text-white font-bold">Premium Subscription</h3>
                <div className="text-gray-400 text-sm">Active</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Current Plan</span>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Premium</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">$9.99/mo</div>
              <div className="text-sm text-gray-400">Next billing date: March 15, 2025</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <i className="fas fa-check text-red-500 mr-2"></i>
                <span>Unlimited expense tracking</span>
              </div>
              <div className="flex items-center text-gray-300">
                <i className="fas fa-check text-red-500 mr-2"></i>
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center text-gray-300">
                <i className="fas fa-check text-red-500 mr-2"></i>
                <span>Financial assistant</span>
              </div>
              <div className="flex items-center text-gray-300">
                <i className="fas fa-check text-red-500 mr-2"></i>
                <span>Multiple budget plans</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">
              Manage Subscription
            </button>
          </div>
        </div>
        
        {/* API & Webhooks Status / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="col-span-2 bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <i className="fas fa-history text-red-500 mr-2"></i>
                <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
              </div>
              <Link 
                to="/expenses" 
                className="text-sm text-red-500 hover:text-red-400"
              >
                View All
              </Link>
            </div>
            
            {recentTransactions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                    <div 
                      className="w-10 h-10 rounded-md flex items-center justify-center mr-4"
                      style={{ background: 'rgba(220, 38, 38, 0.1)' }}
                    >
                      <i className={`fas ${
                        transaction.category === 'Groceries' ? 'fa-shopping-basket' :
                        transaction.category === 'Rent' ? 'fa-home' :
                        transaction.category === 'Insurance' ? 'fa-shield-alt' :
                        transaction.category === 'Dining Out' ? 'fa-utensils' :
                        transaction.category === 'Entertainment' ? 'fa-film' :
                        transaction.category === 'Clothes' ? 'fa-tshirt' :
                        transaction.category === 'Transportation' ? 'fa-car' :
                        'fa-receipt'
                      } text-red-500`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{transaction.category}</div>
                      <div className="text-xs text-gray-400">{transaction.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-500 font-bold">-${transaction.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto flex items-center justify-center mb-3 rounded-full bg-red-900/20">
                  <i className="fas fa-receipt text-gray-600 text-xl"></i>
                </div>
                <p className="text-gray-400 mb-3">No transactions yet</p>
                <Link 
                  to="/expenses" 
                  className="px-4 py-2 bg-red-900/30 text-red-500 rounded-md text-sm hover:bg-red-800/40"
                >
                  Add Expense
                </Link>
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-bell text-red-500 mr-2"></i>
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 mt-1 mr-3">
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.title}</div>
                    <div className="flex justify-between">
                      <div className="text-xs text-gray-400">{activity.time}</div>
                      <div className="text-xs text-red-500 font-medium">{activity.amount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tasks & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks */}
          <div className="col-span-2 bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <i className="fas fa-tasks text-red-500 mr-2"></i>
                Financial Tasks
              </h3>
              <div className="text-sm text-gray-400">{tasks.length} total tasks</div>
            </div>
            
            <div className="flex border-b border-red-900/10 mb-4">
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTask === 'to-do' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setActiveTask('to-do')}
              >
                To Do ({taskCounts['to-do']})
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTask === 'in-progress' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setActiveTask('in-progress')}
              >
                In Progress ({taskCounts['in-progress']})
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTask === 'done' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setActiveTask('done')}
              >
                Done ({taskCounts['done']})
              </button>
            </div>
            
            <div>
              {filteredTasks.map((task) => (
                <div key={task.id} className="flex items-center mb-4 last:mb-0">
                  <div className="flex-none mr-4">
                    <div className="w-8 h-8 bg-red-900/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-fire text-red-500 text-sm"></i>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{task.title}</h4>
                  </div>
                  <div className="flex-none ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex-none ml-2">
                    <button className="text-gray-500 hover:text-white">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-black/20 text-white border border-red-900/20 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Add Task
              </button>
            </div>
          </div>
          
          {/* System Health */}
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-chart-line text-red-500 mr-2"></i>
              System Health
            </h3>
            
            <div className="space-y-6">
              {systemHealth.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{item.name}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        item.color === 'red' ? 'bg-red-500' :
                        item.color === 'yellow' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-red-900/20">
              <div className="text-gray-400 mb-2">Upcoming Budget Deadlines</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="text-white">Monthly Budget Reset</div>
                  <div className="text-red-500">4 days</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-white">Subscription Renewals</div>
                  <div className="text-yellow-500">10 days</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-white">Savings Goal</div>
                  <div className="text-green-500">On Track</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.7);
        }
      `}</style>
    </div>
  );
};

export const Route = createLazyFileRoute('/')({
  component: Dashboard,
});