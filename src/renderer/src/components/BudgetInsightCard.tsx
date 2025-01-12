import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface Expense {
  date: string;
  category: string;
  amount: number;
}

interface BudgetInsightCardProps {
  budgetAllocation: { [key: string]: number };
  monthlyIncome: number;
  expenses: Expense[];
}

const BudgetInsightCard: React.FC<BudgetInsightCardProps> = ({
  budgetAllocation,
  monthlyIncome,
  expenses
}) => {
  // Calculate percentage spent of allocated budget
  const calculatePercentage = (spent: number, allocated: number) => {
    return Math.min((spent / allocated) * 100, 100);
  };

  // Determine status color based on spending
  const getStatusColor = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage > 90) return 'text-red-500';
    if (percentage > 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate current spending by category
  const categorySpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Budget Overview</h2>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="text-sm font-medium">Monthly Income</span>
            <span className="text-lg font-bold">{formatCurrency(monthlyIncome)}</span>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-6">
          {Object.entries(budgetAllocation).map(([category, allocated]) => {
            const spent = categorySpending[category] || 0;
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <span className={getStatusColor(spent, allocated)}>
                    {formatCurrency(spent)} / {formatCurrency(allocated)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${calculatePercentage(spent, allocated)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Spending Insights */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>
          {Object.entries(budgetAllocation).map(([category, allocated]) => {
            const spent = categorySpending[category] || 0;
            if (spent > allocated) {
              const overPercent = Math.round((spent / allocated - 1) * 100);
              return (
                <div key={`insight-${category}`} className="flex items-center space-x-2 p-3 bg-gray-50 rounded mb-2">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <p className="text-sm">
                    {category} is {overPercent}% over budget
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetInsightCard;