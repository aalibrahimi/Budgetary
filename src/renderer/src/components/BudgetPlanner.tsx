import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Settings, X } from 'lucide-react';
import BudgetInsightCard from './BudgetInsightCard';
// import { useExpenseStore } from '../stores/expenseStore';
import { useExpenseStore, type Expense, type PlannedExpense, type BudgetAllocations } from '../stores/expenseStore';


const BudgetPlanner: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [fixedExpenses, setFixedExpenses] = useState<PlannedExpense[]>(() => {
    const saved = localStorage.getItem('fixedExpenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { 
    income,
    setIncome,
    budgetAllocation,
    setBudgetAllocation,
    setIsPlanGenerated,
    setSavingsGoal,
    isPlanGenerated
  } = useExpenseStore();

  const generateSmartBudget = (monthlyIncome: number): BudgetAllocations => {
    if (!monthlyIncome || monthlyIncome <= 0) {
      return {
        Rent: 0,
        Groceries: 0,
        Insurance: 0,
        Transportation: 0,
        Entertainment: 0,
        'Dining Out': 0,
        Clothes: 0,
        Other: 0,
        Savings: 0
      } as BudgetAllocations;
    }

    // Start with default allocations
    const defaultAllocations: BudgetAllocations = {
      Rent: monthlyIncome * 0.3,
      Groceries: monthlyIncome * 0.12,
      Insurance: monthlyIncome * 0.1,
      Transportation: monthlyIncome * 0.15,
      Entertainment: monthlyIncome * 0.05,
      'Dining Out': monthlyIncome * 0.08,
      Clothes: monthlyIncome * 0.05,
      Other: monthlyIncome * 0.05,
      Savings: monthlyIncome * 0.1
    };

    // Override with actual fixed expenses
    const adjustedAllocations = { ...defaultAllocations };
    fixedExpenses.forEach(expense => {
      if (expense.category in adjustedAllocations) {
        adjustedAllocations[expense.category as keyof BudgetAllocations] = expense.amount;
      }
    });

    // Adjust other categories proportionally
    const totalFixed = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remainingIncome = monthlyIncome - totalFixed;
    const nonFixedTotal = Object.entries(adjustedAllocations)
      .filter(([category]) => !fixedExpenses.find(f => f.category === category))
      .reduce((sum, [, amount]) => sum + amount, 0);

    if (remainingIncome > 0 && nonFixedTotal > 0) {
      const adjustmentRatio = remainingIncome / nonFixedTotal;
      Object.keys(adjustedAllocations).forEach(category => {
        if (!fixedExpenses.find(f => f.category === category)) {
          adjustedAllocations[category as keyof BudgetAllocations] *= adjustmentRatio;
        }
      });
    }

    return adjustedAllocations;
  };

  // Load income from localStorage
  useEffect(() => {
    const savedIncome = localStorage.getItem('monthlyIncome');
    if (savedIncome) {
      const parsedIncome = Number(savedIncome);
      setIncome(parsedIncome);
      const newAllocations = generateSmartBudget(parsedIncome);
      setBudgetAllocation(newAllocations as BudgetAllocations);
      setIsPlanGenerated(true);
      setSavingsGoal(newAllocations.Savings);
    }
  }, []);

  // Auto-detect changes in fixed expenses
  useEffect(() => {
    if (expenses.length > 0) {
      const lastMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return expenseDate >= oneMonthAgo;
      });

      const fixedCategories = ['Rent', 'Insurance'];
      fixedCategories.forEach(category => {
        const recentExpense = lastMonthExpenses.find(e => e.category === category);
        if (recentExpense) {
          const existingFixed = fixedExpenses.find(f => f.category === category);
          if (!existingFixed || Math.abs(existingFixed.amount - recentExpense.amount) > 1) {
            setFixedExpenses(prev => {
              const updated = prev.filter(f => f.category !== category);
              return [...updated, {
                category,
                amount: recentExpense.amount,
                lastUpdated: new Date()
              }];
            });
          }
        }
      });
    }
  }, [expenses]);

  // Save fixed expenses to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
    if (income > 0) {
      const newAllocations = generateSmartBudget(income);
      setBudgetAllocation(newAllocations);
      setIsPlanGenerated(true);
      setSavingsGoal(newAllocations.Savings);
    }
  }, [fixedExpenses]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setIncome(value);
    localStorage.setItem('monthlyIncome', value.toString());
    
    if (value > 0) {
      const newAllocations = generateSmartBudget(value);
      setBudgetAllocation(newAllocations);
      setIsPlanGenerated(true);
      setSavingsGoal(newAllocations.Savings);
    }
  };

  const handleFixedExpenseUpdate = (category: string, amount: number) => {
    setFixedExpenses(prev => {
      const updated = prev.filter(f => f.category !== category);
      return [...updated, {
        category,
        amount,
        lastUpdated: new Date()
      }];
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
      >
        <Settings className="h-5 w-5" />
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-semibold mb-4">Budget Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={income || ''}
                  onChange={handleIncomeChange}
                  placeholder="Enter monthly income"
                />
              </div>

              {['Rent', 'Insurance'].map(category => {
                const fixed = fixedExpenses.find(f => f.category === category);
                return (
                  <div key={category}>
                    <label className="block text-sm font-medium mb-1">
                      Monthly {category}
                      {fixed && (
                        <span className="text-xs text-gray-500 ml-2">
                          Last updated: {new Date(fixed.lastUpdated).toLocaleDateString()}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={fixed?.amount || ''}
                      onChange={(e) => handleFixedExpenseUpdate(category, Number(e.target.value))}
                      placeholder={`Enter monthly ${category.toLowerCase()}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Smart Budget Planner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Income</h3>
            <div className="space-y-4">
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={income || ''}
                onChange={handleIncomeChange}
                placeholder="Enter monthly income"
              />
            </div>
          </div>

          {isPlanGenerated && budgetAllocation && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>
              <div className="space-y-3">
                {Object.entries(budgetAllocation).map(([category, amount]) => {
                  const isFixed = fixedExpenses.find(f => f.category === category);
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="font-medium">
                        {category}
                        {isFixed && <span className="text-xs text-gray-500 ml-2">(Fixed)</span>}
                      </span>
                      <span className="text-lg">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {isPlanGenerated && budgetAllocation && (
          <BudgetInsightCard
            budgetAllocation={budgetAllocation}
            monthlyIncome={income}
            expenses={expenses}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;