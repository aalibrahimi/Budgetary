// src/renderer/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { useExpenseStore } from '../stores/expenseStore';
import { useNotificationSystem, NotificationType } from '../components/NotificationSystem';
import { Wallet, PiggyBank, Calendar, BarChart3, Plus } from 'lucide-react';

// Theme-aware styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.3s ease;
  
  /* Add cyberpunk-specific styling */
  ${props => props.themeType === 'cyberpunk' && `
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=');
      opacity: 0.15;
      z-index: -1;
    }
  `}
`;

const Header = styled.header`
  background: ${props => 
    props.themeType === 'cyberpunk' 
      ? 'black' 
      : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`
  };
  padding: 40px 0;
  color: white;
  margin-bottom: 40px;
  width: 100%;
  
  /* Cyberpunk header effects */
  ${props => props.themeType === 'cyberpunk' && `
    border-bottom: 1px solid ${props.theme.colors.primary};
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${props.theme.colors.primary}, transparent);
      animation: glowPulse 2s infinite;
    }
    
    @keyframes glowPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `}
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 96%;
  margin-bottom: 40px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: -60px;
  margin-bottom: 40px;
  padding: 0 30px;
  width: 80%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 24px;
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.card};
  box-shadow: ${props => props.theme.boxShadow};
  transition: all 0.3s ease;
  
  /* Cyberpunk card effects */
  ${props => props.themeType === 'cyberpunk' && `
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(255, 59, 59, 0.7));
    border: 1px solid rgba(255, 59, 59, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  `}
`;

const DashboardCard = styled.div`
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  margin-bottom: 24px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  /* Cyberpunk card effects */
  ${props => props.themeType === 'cyberpunk' && `
    background-color: #141414;
    border: 1px solid rgba(255, 59, 59, 0.3);
    
    &:hover {
      box-shadow: 0 0 20px rgba(255, 59, 59, 0.3);
    }
  `}
`;

const DashboardCardHeader = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Dashboard: React.FC = () => {
  const { themeType, theme } = useTheme();
  const { expenses, addExpense, budgetOverview, income } = useExpenseStore();
  const { showNotification } = useNotificationSystem();
  
  // State for expense form
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Get recent expenses
  const recentExpenses = React.useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [expenses]);
  
  // Handle adding expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (!category || isNaN(amountValue) || amountValue <= 0 || !date) {
      showNotification('Error', 'Please fill all fields correctly!', NotificationType.ERROR);
      return;
    }
    
    const newExpense = {
      date,
      category,
      amount: amountValue
    };
    
    addExpense(newExpense);
    showNotification('Success', `Added ${category} expense`, NotificationType.SUCCESS);
    
    // Reset form
    setAmount('');
    setCategory('');
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <DashboardContainer themeType={themeType}>
      <Header themeType={themeType} theme={theme}>
        <HeaderTop>
          <h1 className="text-4xl font-bold p-5">Dashboard</h1>
          <div className="flex space-x-3">
            <Link
              to="/expenses"
              className="px-4 py-2 bg-white bg-opacity-20 rounded text-white"
            >
              View All Expenses
            </Link>
          </div>
        </HeaderTop>
        
        {/* Stats Cards Row */}
        <StatsGrid>
          <StatCard themeType={themeType}>
            <div className="stat-label">Monthly Income</div>
            <div className="stat-value">{formatCurrency(income)}</div>
          </StatCard>
          <StatCard themeType={themeType}>
            <div className="stat-label">Spent This Month</div>
            <div className="stat-value">{formatCurrency(budgetOverview.spent)}</div>
          </StatCard>
          <StatCard themeType={themeType}>
            <div className="stat-label">Remaining</div>
            <div className="stat-value">{formatCurrency(budgetOverview.remaining)}</div>
          </StatCard>
        </StatsGrid>
        
        {/* Cyberpunk scanner effect */}
        {themeType === 'cyberpunk' && (
          <div className="scanner-container">
            <div className="scanner-line"></div>
          </div>
        )}
      </Header>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Expenses Card */}
          <DashboardCard themeType={themeType}>
            <DashboardCardHeader theme={theme}>
              <h2>
                <Wallet className="mr-2" /> Recent Expenses
              </h2>
              <Link 
                to="/expenses" 
                className="text-sm"
                style={{ color: theme.colors.primary }}
              >
                View All
              </Link>
            </DashboardCardHeader>
            
            <div className="p-4">
              {recentExpenses.length > 0 ? (
                <ul className="divide-y" style={{ borderColor: theme.colors.border }}>
                  {recentExpenses.map((expense, index) => (
                    <li key={index} className="py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{expense.category}</span>
                        <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                          {formatDate(expense.date)}
                        </div>
                      </div>
                      <div className="font-bold" style={{ color: theme.colors.primary }}>
                        {formatCurrency(expense.amount)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  No recent expenses to display
                </div>
              )}
            </div>
          </DashboardCard>
          
          {/* Quick Add Expense Card */}
          <DashboardCard themeType={themeType}>
            <DashboardCardHeader theme={theme}>
              <h2>
                <Plus className="mr-2" /> Quick Add Expense
              </h2>
            </DashboardCardHeader>
            
            <div className="p-4">
              <form onSubmit={handleAddExpense}>
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block mb-1 text-sm font-medium"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 rounded border"
                      style={{ 
                        backgroundColor: themeType === 'cyberpunk' ? '#1a1a1a' : 'white',
                        color: theme.colors.text.primary,
                        borderColor: theme.colors.border
                      }}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block mb-1 text-sm font-medium"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 rounded border"
                      style={{ 
                        backgroundColor: themeType === 'cyberpunk' ? '#1a1a1a' : 'white',
                        color: theme.colors.text.primary,
                        borderColor: theme.colors.border
                      }}
                    >
                      <option value="">Select Category</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Dining Out">Dining Out</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label 
                      className="block mb-1 text-sm font-medium"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full p-2 rounded border"
                      style={{ 
                        backgroundColor: themeType === 'cyberpunk' ? '#1a1a1a' : 'white',
                        color: theme.colors.text.primary,
                        borderColor: theme.colors.border
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 rounded font-medium"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: 'white',
                      backgroundImage: themeType === 'cyberpunk' 
                        ? 'linear-gradient(to right, rgba(255,59,59,0.8), rgba(255,59,59,0.6))' 
                        : undefined
                    }}
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </DashboardCard>
        </div>
        
        {/* Spending Overview Card */}
        <DashboardCard themeType={themeType}>
          <DashboardCardHeader theme={theme}>
            <h2>
              <BarChart3 className="mr-2" /> Spending Overview
            </h2>
          </DashboardCardHeader>
          
          <div className="p-4">
            {/* Graph component would go here */}
            <div className="h-64 flex items-center justify-center">
              <p>Spending graph visualization would go here</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;