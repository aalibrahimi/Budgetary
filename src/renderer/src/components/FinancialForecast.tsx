import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, BarChart3, CalendarClock } from 'lucide-react';

// Define interface for forecast data
interface ForecastData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface FinancialForecastingProps {
  isDarkMode: boolean;
  expenses: any[];
  income: number;
}

// Mock forecast data function
const generateForecastData = (): ForecastData[] => {
  const currentDate = new Date();
  const data: ForecastData[] = [];
  
  // Generate for the next 6 months
  for (let i = 0; i < 6; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(currentDate.getMonth() + i);
    
    // Base values with some randomness
    const baseIncome = 3500;
    const baseExpenses = 2800;
    
    // Add some trend - expenses increase during holidays
    const month = forecastDate.getMonth();
    let expenseMultiplier = 1.0;
    
    // Higher expenses in November-December, lower in January-February
    if (month === 10 || month === 11) {
      expenseMultiplier = 1.2;
    } else if (month === 0 || month === 1) {
      expenseMultiplier = 0.9;
    }
    
    // Add randomness
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    const income = Math.round(baseIncome * (1 + (i * 0.01))); // Small increase over time
    const expenses = Math.round(baseExpenses * expenseMultiplier * randomFactor);
    const savings = income - expenses;
    
    data.push({
      month: forecastDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
      income,
      expenses,
      savings
    });
  }
  
  return data;
};

const FinancialForecasting: React.FC<FinancialForecastingProps> = ({ isDarkMode, expenses, income }) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Generate forecast data on component mount
  useEffect(() => {
    const data = generateForecastData();
    setForecastData(data);
  }, []);
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Run expense prediction
  const runPrediction = () => {
    setIsPredicting(true);
    
    // Simulate processing
    setTimeout(() => {
      const newForecast = generateForecastData();
      setForecastData(newForecast);
      setIsPredicting(false);
    }, 1500);
  };
  
  // Calculate average monthly expenses
  const averageMonthlyExpenses = () => {
    // In a real app, this would calculate true monthly average
    // For demo, just divide total by 3 to simulate 3 months of data
    return expenses.reduce((sum, exp) => sum + exp.amount, 0) / 3;
  };
  
  return (
    <>
  
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{
        backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
      }}>
        <div className="p-4 border-b" style={{
          borderColor: isDarkMode ? 'var(--border-color)' : undefined
        }}>
          <h2 className="text-lg font-semibold" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            Projected Monthly Cash Flow
          </h2>
        </div>
        
        <div className="p-4">
          <div className="overflow-x-auto">
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
                {forecastData.map((data, idx) => (
                  <tr 
                    key={idx} 
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
                      {((data.savings / data.income) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialForecasting;