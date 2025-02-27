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
  }, [isDarkMode])

  console.log('Dark mode state:', isDarkMode)

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
            <div className="hero-visual">
              <div className="floating-icon"><i className="fas fa-coins"></i></div>
              <div className="floating-icon"><i className="fas fa-chart-pie"></i></div>
              <div className="floating-icon"><i className="fas fa-piggy-bank"></i></div>

             </div>

        </section>
        

        <section id="features" className="features">
          <h2>Explore Budgetary Tracker Features</h2>
          <div className="feature-grid">
            <FeatureCard
              icon="fa-wallet"
              title="Smart Budgeting"
              description="Set and monitor your budgets with AI-powered insights"
            />
            <FeatureCard
              icon="fa-chart-pie"
              title="Advanced Analytics"
              description="Visualize your spending patterns with interactive charts"
            />
            <FeatureCard
              icon="fa-bell"
              title="Intelligent Reminders"
              description="Get personalized alerts to avoid overspending"
            />
          </div>
        </section>

        <section id="testimonials" className="testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonial-carousel">
            <TestimonialCard
              quote="Budgetary Tracker changed my financial life. I've never been more in control of my spending!"
              author="Sarah J."
              rating={5}
            />
            <TestimonialCard
              quote="The insights I get from this app are incredible. It's like having a personal financial advisor."
              author="Mike T."
              rating={5}
            />
            <TestimonialCard
              quote="I love how easy it is to use. The reminders have saved me from late fees multiple times!"
              author="Emily R."
              rating={4}
            />
          </div>
        </section>
        {/* When writing a button like option 1, it only executes the function when button is clicked.
        When writing a button like option 2, it constantly 'runs' the function. */}
        {/* <button type="button" onClick={() => handleFunc()}>Test button</button> Option 1 */}
        {/* <button type="button" onClick={handleFunc}>Test button</button> Option 2 */}
      </main>

      <footer>
        <canvas id="footer-wave-canvas"></canvas>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="copyright">
          &copy; 2025 Budgetary Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="feature-card">
    <i className={`fas ${icon}`}></i>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, author, rating }: {
  quote: string;
  author: string;
  rating: number;
}) => (
  <div className="testimonial-card">
    <p>{quote}</p>
    <div className="testimonial-author">{author}</div>
    <div className="rating">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </div>
  </div>
);

export const Route = createLazyFileRoute('/')({
  component: Index,
});