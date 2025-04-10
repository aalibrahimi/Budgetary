import React, { useState } from 'react';
import { TrendingUp, AlertCircle, DollarSign, ArrowUpRight, Shield, ZapIcon } from 'lucide-react';
import { BudgetAllocations, Expense } from '../stores/expenseStore';

interface CyberpunkBudgetInsightCardProps {
  budgetAllocation: BudgetAllocations;
  monthlyIncome: number;
  expenses: Expense[];
}

const CyberpunkBudgetInsightCard: React.FC<CyberpunkBudgetInsightCardProps> = ({
  budgetAllocation,
  monthlyIncome,
  expenses
}) => {
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState(false);

  // Start scan animation periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setScanMode(true);
      setTimeout(() => setScanMode(false), 1500);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

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

  // Get cyberpunk progress color
  const getCyberpunkProgressColor = (percentage: number) => {
    if (percentage > 90) return 'from-red-700 to-red-500';
    if (percentage > 75) return 'from-yellow-700 to-yellow-500';
    return 'from-green-700 to-green-500';
  };

  // Calculate total budget spent
  const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
  const totalBudget = Object.values(budgetAllocation).reduce((sum, amount) => sum + amount, 0);
  const totalPercentage = Math.min((totalSpent / totalBudget) * 100, 100);

  // Get categories that are over budget
  const overBudgetCategories = Object.entries(budgetAllocation)
    .filter(([category, allocated]) => {
      const spent = categorySpending[category] || 0;
      return spent > allocated;
    })
    .map(([category, allocated]) => {
      const spent = categorySpending[category] || 0;
      const overPercent = Math.round((spent / allocated - 1) * 100);
      return { category, overPercent, spent, allocated };
    })
    .sort((a, b) => b.overPercent - a.overPercent);

  return (
    <div className="space-y-6">
      <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-lg overflow-hidden">
        {/* Header with glitch effect */}
        <div className="relative p-4 border-b border-red-900/20">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-red-500 tracking-widest">BUDGET OVERVIEW</h2>
            <div className="flex space-x-2">
              <div className="text-xs px-2 py-0.5 rounded border border-red-900/30 text-gray-400 tracking-wide">
                <span className={scanMode ? 'animate-pulse' : ''}>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Income Overview */}
        <div className="p-4 border-b border-red-900/20">
          <div className="flex justify-between items-center p-3 bg-black/50 rounded group hover:bg-black/70 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-8 w-8 rounded bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-500/30">
                <DollarSign className="h-4 w-4 text-red-500" />
              </div>
              <span className="text-xs text-gray-400">MONTHLY INCOME</span>
            </div>
            <span className="text-lg font-bold group-hover:text-red-500 transition-colors">{formatCurrency(monthlyIncome)}</span>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="p-4 space-y-4">
          {/* Overall progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-400">OVERALL BUDGET</div>
              <div className="text-sm text-white">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
                <span className={`ml-2 ${
                  totalPercentage > 90 ? 'text-red-500' : 
                  totalPercentage > 75 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  ({totalPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-black/70 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getCyberpunkProgressColor(totalPercentage)}`}
                style={{ width: `${totalPercentage}%` }}
              />
              {/* Tick marks */}
              <div className="absolute top-0 left-1/4 h-full w-0.5 bg-white/10" />
              <div className="absolute top-0 left-1/2 h-full w-0.5 bg-white/20" />
              <div className="absolute top-0 left-3/4 h-full w-0.5 bg-white/10" />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600">
              <div>0%</div>
              <div>25%</div>
              <div>50%</div>
              <div>75%</div>
              <div>100%</div>
            </div>
          </div>

          {/* Individual categories */}
          <div className={`space-y-4 ${scanMode ? 'animate-scanEffect' : ''}`}>
            {Object.entries(budgetAllocation).map(([category, allocated]) => {
              const spent = categorySpending[category] || 0;
              const percentage = calculatePercentage(spent, allocated);
              const isOverBudget = spent > allocated;
              const isHighlighted = highlightedCategory === category;
              
              return (
                <div 
                  key={category} 
                  className={`space-y-2 ${
                    isHighlighted ? 'bg-black/70 p-3 rounded border border-red-900/30' : ''
                  }`}
                  onMouseEnter={() => setHighlightedCategory(category)}
                  onMouseLeave={() => setHighlightedCategory(null)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className="font-medium text-sm">{category}</span>
                    </div>
                    <span className={getStatusColor(spent, allocated)}>
                      {formatCurrency(spent)} / {formatCurrency(allocated)}
                    </span>
                  </div>
                  <div className="w-full bg-black/70 rounded-sm h-1.5 overflow-hidden relative">
                    <div
                      className={`h-full bg-gradient-to-r ${getCyberpunkProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                    {isOverBudget && (
                      <div className="absolute top-0 right-0 h-full w-1 bg-red-500 animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Extra details when highlighted */}
                  {isHighlighted && (
                    <div className="mt-3 pt-3 border-t border-red-900/20 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <div>ALLOCATED</div>
                        <div>{formatCurrency(allocated)}</div>
                      </div>
                      <div className="flex justify-between text-gray-400 mt-1">
                        <div>SPENT</div>
                        <div className={isOverBudget ? 'text-red-500' : 'text-green-500'}>
                          {formatCurrency(spent)}
                        </div>
                      </div>
                      <div className="flex justify-between text-gray-400 mt-1">
                        <div>REMAINING</div>
                        <div className={isOverBudget ? 'text-red-500' : 'text-green-500'}>
                          {formatCurrency(allocated - spent)}
                        </div>
                      </div>
                      <div className="flex justify-between text-gray-400 mt-1">
                        <div>STATUS</div>
                        <div className={isOverBudget ? 'text-red-500' : 'text-green-500'}>
                          {isOverBudget ? `OVER BY ${Math.round((spent / allocated - 1) * 100)}%` : `UNDER BY ${Math.round((1 - spent / allocated) * 100)}%`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spending Insights */}
        {overBudgetCategories.length > 0 && (
          <div className="border-t border-red-900/20 p-4">
            <div className="flex items-center mb-3">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <h3 className="text-sm text-red-500 tracking-widest">BUDGET ALERTS</h3>
            </div>
            <div className="space-y-3">
              {overBudgetCategories.map(({ category, overPercent }) => (
                <div key={`insight-${category}`} className="flex items-start space-x-3 p-3 bg-black/50 rounded border border-red-900/30 group hover:border-red-500/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="p-1 rounded bg-red-900/30 border border-red-900/50 group-hover:bg-red-900/50 transition-colors">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      <span className="text-red-500 font-bold">{category}</span> is <span className="text-red-500 font-bold">{overPercent}%</span> over budget
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Consider adjusting your spending in this category or reallocating budget</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights footer */}
        <div className="bg-gradient-to-r from-black to-red-950/10 p-4 border-t border-red-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-500">BUDGET SHIELD ACTIVE</span>
            </div>
            
            {/* Scanner effect */}
            <div className="relative h-4 w-40 bg-black/50 rounded overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-full flex items-center px-2">
                <span className="text-xs text-gray-600">ANALYZING DATA</span>
              </div>
              <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-scanner"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      {/* <style >{`
        @keyframes scanner {
          0% {
            left: -20%;
          }
          100% {
            left: 120%;
          }
        }
        
        .animate-scanner {
          animation: scanner 3s ease-in-out infinite;
        }
        
        @keyframes scanEffect {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-scanEffect {
          animation: scanEffect 1.5s linear;
        }
      `}</style> */}
    </div>
  );
};

export default CyberpunkBudgetInsightCard;