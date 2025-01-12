import { create } from 'zustand'

interface ExpenseState {
  monthlyTotal: string
  setMonthlyTotal: (monthlyTotal: string) => void
  resetMonthlyTotal: () => void
  topCategory: string
  setTopCategory: (topCategory: string) => void
  expenseCount: number
  setExpenseCount: (expenseCount: number) => void
  activeTab: string
  setActiveTab: (activeTab: string) => void
  notif: boolean
  setNotif: (notif: boolean) => void
  resetNotfif: () => void
  income: number
  setIncome: (income: number) => void
  savingsGoal: number
  setSavingsGoal: (savingsGoal: number) => void
  budgetAllocation: { [key: string]: number }
  setBudgetAllocation: (budgetAllocation: { [key: string]: number }) => void
  isPlanGenerated: boolean
  setIsPlanGenerated: (isPlanGenerated: boolean) => void
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
  budgetAllocation: {},
  setBudgetAllocation: (budgetAllocation) => set({ budgetAllocation }),
  isPlanGenerated: false,
  setIsPlanGenerated: (isPlanGenerated: boolean) => set({ isPlanGenerated })
}))