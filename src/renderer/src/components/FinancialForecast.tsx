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
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2"
          style={{
            backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold" style={{
              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
            }}>
              6-Month Financial Forecast
            </h2>
            <button
              onClick={runPrediction}
              disabled={isPredicting}
              className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              style={{
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined,
                color: isDarkMode ? 'var(--primary)' : undefined
              }}
            >
              {isPredicting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Forecast
                </>
              )}
            </button>
          </div>
          
          {/* Chart area - In a real app, this would be a proper chart component */}
          <div className="h-64 mb-4">
            <div className="flex h-full items-end space-x-4 pl-10 pb-2">
              {forecastData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex space-x-0.5">
                    {/* Expenses bar */}
                    <div 
                      className="flex-1 bg-red-400"
                      style={{
                        height: `${(data.expenses / 4000) * 100}%`,
                        backgroundColor: isDarkMode ? '#f87171' : undefined
                      }}
                    ></div>
                    {/* Income bar */}
                    <div 
                      className="flex-1 bg-green-400"
                      style={{
                        height: `${(data.income / 4000) * 100}%`,
                        backgroundColor: isDarkMode ? '#4ade80' : undefined
                      }}
                    ></div>
                  </div>
                  <div 
                    className="text-xs mt-1 w-full text-center whitespace-nowrap"
                    style={{
                      color: isDarkMode ? 'var(--text-secondary)' : '#6B7280'
                    }}
                  >
                    {data.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-400 mr-1" style={{
                backgroundColor: isDarkMode ? '#4ade80' : undefined
              }}></div>
              <span className="text-sm" style={{
                color: isDarkMode ? 'var(--text-primary)' : 'inherit'
              }}>Income</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-red-400 mr-1" style={{
                backgroundColor: isDarkMode ? '#f87171' : undefined
              }}></div>
              <span className="text-sm" style={{
                color: isDarkMode ? 'var(--text-primary)' : 'inherit'
              }}>Expenses</span>
            </div>
          </div>
        </div>
        
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            Forecast Insights
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-blue-100 mr-3" style={{
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined
              }}>
                <TrendingUp className="h-5 w-5 text-blue-600" style={{
                  color: isDarkMode ? 'var(--primary)' : undefined
                }} />
              </div>
              <div>
                <h4 className="font-medium" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Expected Savings
                </h4>
                <p className="text-sm text-gray-600" style={{
                  color: isDarkMode ? 'var(--text-secondary)' : undefined
                }}>
                  {formatCurrency(forecastData.reduce((sum, data) => sum + data.savings, 0))} over the next 6 months
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-amber-100 mr-3" style={{
                backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : undefined
              }}>
                <CalendarClock className="h-5 w-5 text-amber-600" style={{
                  color: isDarkMode ? 'rgb(217, 119, 6)' : undefined
                }} />
              </div>
              <div>
                <h4 className="font-medium" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Seasonal Patterns
                </h4>
                <p className="text-sm text-gray-600" style={{
                  color: isDarkMode ? 'var(--text-secondary)' : undefined
                }}>
                  Spending typically increases by 20% in Nov-Dec and decreases in Jan-Feb
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-purple-100 mr-3" style={{
                backgroundColor: isDarkMode ? 'rgba(147, 51, 234, 0.1)' : undefined
              }}>
                <BarChart3 className="h-5 w-5 text-purple-600" style={{
                  color: isDarkMode ? 'rgb(147, 51, 234)' : undefined
                }} />
              </div>
              <div>
                <h4 className="font-medium" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Budget Impact
                </h4>
                <p className="text-sm text-gray-600" style={{
                  color: isDarkMode ? 'var(--text-secondary)' : undefined
                }}>
                  Your current savings rate is {((income - averageMonthlyExpenses()) / income * 100).toFixed(1)}% and projected to remain stable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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