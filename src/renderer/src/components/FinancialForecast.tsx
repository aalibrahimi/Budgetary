import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { useExpenseStore } from '@renderer/stores/expenseStore';

interface MonthlyData {
  month: string;
  monthKey: string; // For sorting (YYYY-MM)
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

interface FinancialForecastingProps {
  isDarkMode: boolean;
}

const FinancialForecasting: React.FC<FinancialForecastingProps> = ({ isDarkMode }) => {
  // Get data from the store
  const { expenses, cashFlowTransaction } = useExpenseStore();
  
  // Calculate monthly data based on actual expenses and income
  const monthlyData = useMemo(() => {
    // Step 1: Group expenses by month
    const expensesByMonth: Record<string, number> = {};
    expenses.forEach(exp => {
      const monthKey = exp.date.substring(0, 7); // YYYY-MM
      expensesByMonth[monthKey] = (expensesByMonth[monthKey] || 0) + exp.amount;
    });
    
    // Step 2: Group income by month
    const incomeByMonth: Record<string, number> = {};
    cashFlowTransaction
      .filter(t => t.type === 'income')
      .forEach(income => {
        const monthKey = income.date.substring(0, 7); // YYYY-MM
        incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + income.amount;
      });
    
    // Step 3: Merge all months from both datasets
    const allMonths = new Set([
      ...Object.keys(expensesByMonth),
      ...Object.keys(incomeByMonth)
    ]);
    
    // Step 4: Create result data
    const result: MonthlyData[] = Array.from(allMonths).map(monthKey => {
      const income = incomeByMonth[monthKey] || 0;
      const expenses = expensesByMonth[monthKey] || 0;
      const savings = income - expenses;
      const savingsRate = income > 0 ? (savings / income) * 100 : 0;
      
      // Format month for display
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      return {
        month: monthName,
        monthKey,
        income,
        expenses,
        savings,
        savingsRate
      };
    });
    
    // Sort by date (newest first)
    return result.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [expenses, cashFlowTransaction]);
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2>
          <TrendingUp className="dashboard-card-icon" /> 
          Monthly Financial Summary
        </h2>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          {monthlyData.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b" style={{
                  borderColor: isDarkMode ? 'var(--border-color)' : undefined
                }}>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{
                    color: isDarkMode ? 'var(--text-secondary)' : undefined
                  }}>
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{
                    color: isDarkMode ? 'var(--text-secondary)' : undefined
                  }}>
                    Income
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{
                    color: isDarkMode ? 'var(--text-secondary)' : undefined
                  }}>
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{
                    color: isDarkMode ? 'var(--text-secondary)' : undefined
                  }}>
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{
                    color: isDarkMode ? 'var(--text-secondary)' : undefined
                  }}>
                    Savings Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, idx) => (
                  <tr 
                    key={data.monthKey} 
                    className={idx % 2 === 0 ? 'bg-gray-50' : ''}
                    style={{
                      backgroundColor: idx % 2 === 0 && isDarkMode 
                        ? 'var(--hover-background)' 
                        : undefined
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                    }}>
                      {data.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                    }}>
                      {formatCurrency(data.income)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                    }}>
                      {formatCurrency(data.expenses)}
                    </td>
                    <td 
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        data.savings > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                      style={{
                        color: data.savings > 0 
                          ? isDarkMode ? '#4ade80' : undefined 
                          : isDarkMode ? '#f87171' : undefined
                      }}
                    >
                      {formatCurrency(data.savings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                    }}>
                      {data.savingsRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500" style={{
              color: isDarkMode ? 'var(--text-secondary)' : undefined
            }}>
              No financial data available yet. Add expenses and income to see your monthly summary.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialForecasting;