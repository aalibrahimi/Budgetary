import React, { useState } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import '../assets/CashFlowwForecast.css';

// Types for transactions and modal state
interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

interface CashFlowForecastProps {
  initialTransactions?: Transaction[];
}

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ initialTransactions = [] }) => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date(),
    type: 'expense',
    category: '',
    description: '',
    amount: 0
  });

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Categories for dropdown
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
    expense: ['Rent', 'Utilities', 'Insurance', 'Groceries', 'Dining Out', 'Transportation', 'Entertainment', 'Other']
  };

  // Add a new transaction
  const handleAddTransaction = () => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString()
    };
    
    setTransactions([...transactions, transaction]);
    setShowModal(false);
    setNewTransaction({
      date: new Date(),
      type: 'expense',
      category: '',
      description: '',
      amount: 0
    });
  };

  // Get all days for the next 30 days
  const getDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  // Get transactions for a specific day
  const getTransactionsForDay = (date: Date) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getDate() === date.getDate() &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Calculate summary totals
  const calculateSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income,
      expenses,
      netCashFlow: income - expenses
    };
  };

  const summary = calculateSummary();
  const days = getDays();

  return (
    
    <div className="dashboard-card w-[1150px] mx-auto">
      <div className="dashboard-card-header">
        <h2>
          <AlertTriangle className="dashboard-card-icon" /> 
          Cash Flow Forecast
        </h2>
        <button 
          onClick={() => setShowModal(true)}
          className="add-transaction-btn"
        >
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
            const dayTransactions = getTransactionsForDay(day);
            const hasTransactions = dayTransactions.length > 0;
            
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
                  {dayTransactions.map(transaction => (
                    <div 
                      key={transaction.id}
                      className={`transaction ${transaction.type}`}
                    >
                      <span className="transaction-label">{transaction.category}</span>
                      <span className="transaction-amount">
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
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
              <button
                onClick={() => setShowModal(false)}
                className="modal-close-btn"
              >
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
                      onChange={() => setNewTransaction({...newTransaction, type: 'income'})}
                    />
                    <span>Income</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      checked={newTransaction.type === 'expense'}
                      onChange={() => setNewTransaction({...newTransaction, type: 'expense'})}
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
                  value={newTransaction.date.toISOString().split('T')[0]}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    date: new Date(e.target.value)
                  })}
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-input"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    category: e.target.value
                  })}
                >
                  <option value="">Select Category</option>
                  {categories[newTransaction.type].map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    description: e.target.value
                  })}
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
                  onChange={(e) => setNewTransaction({
                    ...newTransaction,
                    amount: parseFloat(e.target.value) || 0
                  })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
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
  );
};

export default CashFlowForecast;