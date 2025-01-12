import { create } from 'zustand';

// Base interfaces
export interface Expense {
  date: string;
  category: string;
  amount: number;
}

export interface PlannedExpense {
  category: string;
  amount: number;
  lastUpdated: Date;
}

export interface BudgetAllocations {
  Rent: number;
  Groceries: number;
  Insurance: number;
  Transportation: number;
  Entertainment: number;
  'Dining Out': number;
  Clothes: number;
  Other: number;
  Savings: number;
}

// Store state interface
interface ExpenseState {
  monthlyTotal: string;
  setMonthlyTotal: (monthlyTotal: string) => void;
  resetMonthlyTotal: () => void;
  topCategory: string;
  setTopCategory: (topCategory: string) => void;
  expenseCount: number;
  setExpenseCount: (expenseCount: number) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  notif: boolean;
  setNotif: (notif: boolean) => void;
  resetNotfif: () => void;
  income: number;
  setIncome: (income: number) => void;
  savingsGoal: number;
  setSavingsGoal: (savingsGoal: number) => void;
  // Change these two lines to use BudgetAllocations type
  budgetAllocation: BudgetAllocations;
  setBudgetAllocation: (budgetAllocation: BudgetAllocations) => void;
  isPlanGenerated: boolean;
  setIsPlanGenerated: (isPlanGenerated: boolean) => void;
}

export const useExpenseStore = create<ExpenseState>()((set) => ({
  monthlyTotal: '$0.00',
  setMonthlyTotal: (monthlyTotal: string) => set({ monthlyTotal }),
  resetMonthlyTotal: () => set({ monthlyTotal: '$0.00' }),
  topCategory: '-',
  setTopCategory: (topCategory: string) => set({ topCategory }),
  expenseCount: 0,
  setExpenseCount: (expenseCount: number) => set({ expenseCount }),
  activeTab: 'expense',
  setActiveTab: (activeTab: string) => set({ activeTab }),
  notif: false,
  setNotif: (notif: boolean) => set({ notif }),
  resetNotfif: () => set({ notif: false }),
  income: 0,
  setIncome: (income: number) => set({ income }),
  savingsGoal: 0,
  setSavingsGoal: (savingsGoal: number) => set({ savingsGoal }),
  // Initialize with default values for all required properties
  budgetAllocation: {
    Rent: 0,
    Groceries: 0,
    Insurance: 0,
    Transportation: 0,
    Entertainment: 0,
    'Dining Out': 0,
    Clothes: 0,
    Other: 0,
    Savings: 0
  },
  setBudgetAllocation: (budgetAllocation: BudgetAllocations) => set({ budgetAllocation }),
  isPlanGenerated: false,
  setIsPlanGenerated: (isPlanGenerated: boolean) => set({ isPlanGenerated })
}));