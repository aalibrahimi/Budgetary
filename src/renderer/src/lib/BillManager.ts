// src/renderer/src/hooks/useBillManager.ts
import { useState, useEffect } from 'react';
import { useExpenseStore } from '../stores/expenseStore';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one-time';
  source: 'subscription' | 'manual-entry';
}

export function useBillManager() {
  const [bills, setBills] = useState<Bill[]>([]);
  const { cashFlowTransaction, addCashFlowTransaction } = useExpenseStore();
  
  // Load bills from both subscriptions and manually entered recurring expenses
  useEffect(() => {
    const loadAllBills = () => {
      // Get subscription data from SubscriptionManager
      const subscriptionBills = loadSubscriptionsAsBills();
      
      // Get recurring expenses
      const expenseBills = loadRecurringExpensesAsBills();
      
      // Combine and remove duplicates (based on similar name, amount and date)
      const combinedBills = [...subscriptionBills, ...expenseBills];
      
      // Sort by due date
      const sortedBills = combinedBills.sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      
      setBills(sortedBills);
    };
    
    loadAllBills();
  }, [cashFlowTransaction]);
  
  // Load subscriptions from localStorage and convert to bills
  const loadSubscriptionsAsBills = (): Bill[] => {
    try {
      const savedSubscriptions = localStorage.getItem('userSubscriptions');
      if (!savedSubscriptions) return [];
      
      const parsedSubscriptions = JSON.parse(savedSubscriptions);
      return parsedSubscriptions.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        amount: sub.amount,
        dueDate: new Date(sub.nextPayment).toISOString().split('T')[0],
        category: sub.category,
        isRecurring: true,
        frequency: sub.frequency,
        source: 'subscription' as const
      }));
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      return [];
    }
  };
  
  // Extract recurring expenses from cashFlowTransaction
  const loadRecurringExpensesAsBills = (): Bill[] => {
    return cashFlowTransaction
      .filter(trans => 
        trans.type === 'expense' && 
        trans.description?.toLowerCase().includes('recurring')
      )
      .map(trans => ({
        id: trans.id,
        name: trans.category,
        amount: trans.amount,
        dueDate: trans.date,
        category: trans.category,
        isRecurring: true,
        frequency: 'monthly' as const,  // Default assumption
        source: 'manual-entry' as const
      }));
  };
  
  // Add a new bill
  const addBill = (billData: Omit<Bill, 'id' | 'source'>) => {
    // Create a transaction for the bill
    const transaction = {
      date: billData.dueDate,
      type: 'expense' as 'expense' | 'income',
      category: billData.category,
      description: `Recurring ${billData.name}`,
      amount: billData.amount
    };
    
    // Add to cashFlowTransaction store, which will trigger the useEffect to update bills
    addCashFlowTransaction(transaction);
  };
  
  // Get all upcoming bills due within a certain number of days
  const getUpcomingBills = (daysAhead: number = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);
    
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate >= today && dueDate <= futureDate;
    });
  };
  
  return {
    bills,
    addBill,
    getUpcomingBills
  };
}