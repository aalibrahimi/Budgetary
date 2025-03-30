// src/renderer/src/lib/useUpcomingBills.ts
import { useState, useEffect } from 'react';
import { useExpenseStore } from '../stores/expenseStore';

// Interface for an upcoming bill (from either subscriptions or recurring expenses)
export interface UpcomingBill {
  name: string;
  amount: number;
  dueDate: string;
  type: 'subscription' | 'recurring-expense';
  id: string;
}

export function useUpcomingBills(daysAhead: number = 30) {
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
  const { cashFlowTransaction } = useExpenseStore();
  
  useEffect(() => {
    // Load subscription data from localStorage
    const loadSubscriptions = () => {
      try {
        const savedSubscriptions = localStorage.getItem('userSubscriptions');
        if (!savedSubscriptions) return [];
        
        const parsedSubscriptions = JSON.parse(savedSubscriptions);
        return parsedSubscriptions
          .filter((sub: any) => {
            // Only include subscriptions with upcoming payments in the next X days
            const nextPayment = new Date(sub.nextPayment);
            const futureDate = new Date();
            futureDate.setDate(new Date().getDate() + daysAhead);
            return nextPayment <= futureDate;
          })
          .map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            amount: sub.amount,
            dueDate: new Date(sub.nextPayment).toISOString().split('T')[0],
            type: 'subscription' as const
          }));
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
        return [];
      }
    };
    
    // Get recurring expenses from cashFlowTransaction
    const getRecurringExpenses = () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + daysAhead);
      
      return cashFlowTransaction
        .filter(trans => {
          // Only include transactions marked as recurring and within date range
          return trans.type === 'expense' && 
                 trans.description?.toLowerCase().includes('recurring') &&
                 new Date(trans.date) <= futureDate &&
                 new Date(trans.date) >= today;
        })
        .map(trans => ({
          id: trans.id,
          name: trans.category,
          amount: trans.amount,
          dueDate: trans.date,
          type: 'recurring-expense' as const
        }));
    };
    
    // Combine and sort by due date
    const allBills = [...loadSubscriptions(), ...getRecurringExpenses()]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    setUpcomingBills(allBills);
  }, [cashFlowTransaction, daysAhead]);
  
  return upcomingBills;
}