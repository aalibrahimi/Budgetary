import React, { useEffect } from 'react';
import _ from 'lodash';
import BudgetInsightCard from './BudgetInsightCard';
import { useExpenseStore } from '../stores/expenseStore';

interface Expense {
  date: string;
  category: string;
  amount: number;
}

const BudgetPlanner: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const { 
    income,
    setIncome,
    savingsGoal,
    setSavingsGoal,
    budgetAllocation,
    setBudgetAllocation,
    isPlanGenerated,
    setIsPlanGenerated
  } = useExpenseStore();

  useEffect(() => {
    if (expenses.length > 0) {
      // Group expenses by month and category
      const monthlySpending = _.groupBy(expenses, (expense) => {
        return expense.date.substring(0, 7); // YYYY-MM format
      });

      // Calculate category totals from expenses
      const categoryTotals = expenses.reduce<{ [key: string]: number }>((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
      }, {});

      // Store these totals in budgetAllocation if we have income set
      if (income > 0) {
        generateBudgetPlan(income, categoryTotals);
      }
    }
  }, [expenses, income]);

  const generateBudgetPlan = (monthlyIncome: number, categoryTotals: { [key: string]: number }) => {
    if (!monthlyIncome || monthlyIncome <= 0) return;

    const totalSpent = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

    // Calculate base allocations using 50/30/20 rule
    const essentialBudget = monthlyIncome * 0.5;
    const discretionaryBudget = monthlyIncome * 0.3;
    const savingsBudget = monthlyIncome * 0.2;

    // Categorize expenses
    const essentialCategories = ['Rent', 'Groceries', 'Insurance', 'Transportation'];
    const discretionaryCategories = ['Entertainment', 'Dining Out', 'Clothes', 'Other'];

    // Calculate allocations based on historical spending patterns
    const newAllocations: { [key: string]: number } = {};

    // Handle essential categories
    const essentialTotal = essentialCategories.reduce((sum, category) => 
      sum + (categoryTotals[category] || 0), 0);
    
    essentialCategories.forEach(category => {
      const categorySpend = categoryTotals[category] || 0;
      const ratio = essentialTotal > 0 ? categorySpend / essentialTotal : 1 / essentialCategories.length;
      newAllocations[category] = essentialBudget * ratio;
    });

    // Handle discretionary categories
    const discretionaryTotal = discretionaryCategories.reduce((sum, category) => 
      sum + (categoryTotals[category] || 0), 0);
    
    discretionaryCategories.forEach(category => {
      const categorySpend = categoryTotals[category] || 0;
      const ratio = discretionaryTotal > 0 ? categorySpend / discretionaryTotal : 1 / discretionaryCategories.length;
      newAllocations[category] = discretionaryBudget * ratio;
    });

    // Add savings allocation
    newAllocations['Savings'] = savingsBudget;

    // Update Zustand store
    setBudgetAllocation(newAllocations);
    setSavingsGoal(savingsBudget);
    setIsPlanGenerated(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Smart Budget Planner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Income Setup</h3>
            <div className="space-y-4">
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={income || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setIncome(value);
                }}
                placeholder="Enter monthly income"
              />
            </div>
          </div>

          {isPlanGenerated && budgetAllocation && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>
              <div className="space-y-3">
                {Object.entries(budgetAllocation).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <span className="text-lg">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isPlanGenerated && budgetAllocation && (
        <BudgetInsightCard
          budgetAllocation={budgetAllocation}
          monthlyIncome={income}
          expenses={expenses}
        />
      )}
    </div>
  );
};

export default BudgetPlanner;