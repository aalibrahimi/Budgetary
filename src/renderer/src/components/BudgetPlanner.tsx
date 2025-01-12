import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import BudgetInsightCard from './BudgetInsightCard';
import { useExpenseStore } from '../stores/expenseStore';

interface Expense {
  date: string;
  category: string;
  amount: number;
}

interface PlannedExpense {
  category: string;
  amount: number;
  dueDate: Date;
  isRecurring: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly';
  isFixed: boolean;
}

const getDefaultAllocations = (income: number) => ({
  Rent: income * 0.3,
  Groceries: income * 0.12,
  Insurance: income * 0.1,
  Transportation: income * 0.15,
  Entertainment: income * 0.05,
  'Dining Out': income * 0.08,
  Clothes: income * 0.05,
  Other: income * 0.05,
  Savings: income * 0.1
});

const BudgetPlanner: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupForm, setSetupForm] = useState({
    rent: 0,
    rentDueDate: '',
    insurance: 0,
    insuranceDueDate: ''
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

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlannedExpenses: PlannedExpense[] = [
      {
        category: 'Rent',
        amount: setupForm.rent,
        dueDate: new Date(setupForm.rentDueDate),
        isRecurring: true,
        frequency: 'monthly',
        isFixed: true
      },
      {
        category: 'Insurance',
        amount: setupForm.insurance,
        dueDate: new Date(setupForm.insuranceDueDate),
        isRecurring: true,
        frequency: 'monthly',
        isFixed: true
      }
    ];
    
    setPlannedExpenses(newPlannedExpenses);
    setSetupComplete(true);
    const newAllocations = generateSmartBudget(income, expenses, newPlannedExpenses);
    setBudgetAllocation(newAllocations);
    setIsPlanGenerated(true);
    setSavingsGoal(newAllocations.Savings);
  };

  const generateSmartBudget = (
    monthlyIncome: number,
    historicalExpenses: Expense[],
    planned: PlannedExpense[]
  ) => {
    if (!monthlyIncome || monthlyIncome <= 0) return {};

    const defaultAllocations = getDefaultAllocations(monthlyIncome);
    const adjustedAllocations = { ...defaultAllocations };

    // Adjust allocations based on planned fixed expenses
    planned.forEach(expense => {
      if (expense.isFixed) {
        adjustedAllocations[expense.category] = expense.amount;
      }
    });

    // Blend with historical data if available
    if (historicalExpenses.length > 0) {
      const categoryTotals = historicalExpenses.reduce<{ [key: string]: number }>((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
      }, {});

      Object.keys(adjustedAllocations).forEach(category => {
        if (categoryTotals[category]) {
          adjustedAllocations[category] = (
            categoryTotals[category] * 0.7 + 
            adjustedAllocations[category] * 0.3
          );
        }
      });
    }

    return adjustedAllocations;
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setIncome(value);
    if (value > 0) {
      const newAllocations = generateSmartBudget(value, expenses, plannedExpenses);
      setBudgetAllocation(newAllocations);
      setIsPlanGenerated(true);
      setSavingsGoal(newAllocations.Savings);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {isNewUser && !setupComplete ? (
        <form onSubmit={handleSetupSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Initial Budget Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={income || ''}
                  onChange={handleIncomeChange}
                  placeholder="Enter monthly income"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Rent</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={setupForm.rent || ''}
                  onChange={(e) => setSetupForm({ ...setupForm, rent: Number(e.target.value) })}
                  placeholder="Enter monthly rent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rent Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={setupForm.rentDueDate}
                  onChange={(e) => setSetupForm({ ...setupForm, rentDueDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monthly Insurance</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={setupForm.insurance || ''}
                  onChange={(e) => setSetupForm({ ...setupForm, insurance: Number(e.target.value) })}
                  placeholder="Enter monthly insurance"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Insurance Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={setupForm.insuranceDueDate}
                  onChange={(e) => setSetupForm({ ...setupForm, insuranceDueDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Complete Setup
            </button>
          </div>
        </form>
      ) : (
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

          {isPlanGenerated && budgetAllocation && (
            <BudgetInsightCard
              budgetAllocation={budgetAllocation}
              monthlyIncome={income}
              expenses={expenses}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;