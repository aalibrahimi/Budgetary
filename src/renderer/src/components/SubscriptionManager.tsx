import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';

// Define interface for subscription
interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
  nextPayment: Date;
  category: string;
  dateAdded: Date;
}

interface SubscriptionManagerProps {
  expenses: any[];
  isDarkMode: boolean;
  income: number;
}

// For demo purposes, this is a mock subscription detector
// In a real app, this would use ML to analyze transaction patterns
const detectSubscriptionsFromTransactions = (expenses: any[]): Subscription[] => {
  // Group transactions by merchant and search for recurring patterns
  const potentialSubscriptions: Record<string, any[]> = {};

  // Simplified logic for demonstration - actual implementation would be more sophisticated
  expenses.forEach(exp => {
    if (!potentialSubscriptions[exp.category]) {
      potentialSubscriptions[exp.category] = [];
    }
    potentialSubscriptions[exp.category].push({
      date: new Date(exp.date),
      amount: exp.amount
    });
  });

  // Mock results
  return [
    {
      id: '1',
      name: 'Netflix',
      amount: 15.99,
      frequency: 'monthly',
      nextPayment: new Date(new Date().setDate(new Date().getDate() + 12)),
      category: 'Entertainment',
      dateAdded: new Date(new Date().setMonth(new Date().getMonth() - 3))
    },
    {
      id: '2',
      name: 'Spotify',
      amount: 9.99,
      frequency: 'monthly',
      nextPayment: new Date(new Date().setDate(new Date().getDate() + 5)),
      category: 'Entertainment',
      dateAdded: new Date(new Date().setMonth(new Date().getMonth() - 5))
    },
    {
      id: '3',
      name: 'Gym Membership',
      amount: 49.99,
      frequency: 'monthly',
      nextPayment: new Date(new Date().setDate(new Date().getDate() + 18)),
      category: 'Health',
      dateAdded: new Date(new Date().setMonth(new Date().getMonth() - 8))
    },
    {
      id: '4',
      name: 'Cloud Storage',
      amount: 2.99,
      frequency: 'monthly',
      nextPayment: new Date(new Date().setDate(new Date().getDate() + 21)),
      category: 'Services',
      dateAdded: new Date(new Date().setMonth(new Date().getMonth() - 2))
    }
  ];
};

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ expenses, isDarkMode, income }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [newSubscription, setNewSubscription] = useState<Partial<Subscription>>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    category: 'Entertainment'
  });
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Detect subscriptions on component mount
  useEffect(() => {
    const loadSubscriptions = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const detected = detectSubscriptionsFromTransactions(expenses);
      setSubscriptions(detected);
      setIsLoadingSubscriptions(false);
    };
    
    loadSubscriptions();
  }, [expenses]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Add subscription
  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount) return;
    
    const subscription: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.name || '',
      amount: newSubscription.amount || 0,
      frequency: newSubscription.frequency || 'monthly',
      nextPayment: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 30))),
      category: newSubscription.category || 'Other',
      dateAdded: new Date()
    };
    
    setSubscriptions(prev => [...prev, subscription]);
    setNewSubscription({
      name: '',
      amount: 0,
      frequency: 'monthly',
      category: 'Entertainment'
    });
    setShowAddSubscription(false);
  };

  // Delete subscription
  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  // Calculate total monthly subscription cost
  const calculateMonthlySubscriptionCost = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.frequency === 'monthly') {
        return total + sub.amount;
      } else if (sub.frequency === 'quarterly') {
        return total + (sub.amount / 3);
      } else { // annual
        return total + (sub.amount / 12);
      }
    }, 0);
  };

  // Calculate annual subscription cost
  const calculateAnnualSubscriptionCost = () => {
    return calculateMonthlySubscriptionCost() * 12;
  };

  // Get upcoming payment amount (next 7 days)
  const getUpcomingPaymentAmount = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return subscriptions
      .filter(sub => sub.nextPayment <= nextWeek)
      .reduce((total, sub) => total + sub.amount, 0);
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
          }}
        >
          <div className="flex items-center mb-4">
            <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold" style={{
              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
            }}>Total Monthly</h3>
          </div>
          <p className="text-3xl font-bold" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            {formatCurrency(calculateMonthlySubscriptionCost())}
          </p>
          <p className="text-sm text-gray-500 mt-2" style={{
            color: isDarkMode ? 'var(--text-secondary)' : undefined
          }}>
            Across {subscriptions.length} active subscriptions
          </p>
        </div>
        
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
          }}
        >
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="text-lg font-semibold" style={{
              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
            }}>Next 7 Days</h3>
          </div>
          <p className="text-3xl font-bold" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            {formatCurrency(getUpcomingPaymentAmount())}
          </p>
          <p className="text-sm text-gray-500 mt-2" style={{
            color: isDarkMode ? 'var(--text-secondary)' : undefined
          }}>
            Due within the next week
          </p>
        </div>
        
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
          }}
        >
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
            <h3 className="text-lg font-semibold" style={{
              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
            }}>Annual Cost</h3>
          </div>
          <p className="text-3xl font-bold" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            {formatCurrency(calculateAnnualSubscriptionCost())}
          </p>
          <p className="text-sm text-gray-500 mt-2" style={{
            color: isDarkMode ? 'var(--text-secondary)' : undefined
          }}>
            {(calculateAnnualSubscriptionCost() / income * 100).toFixed(1)}% of your annual income
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6" style={{
        backgroundColor: isDarkMode ? 'var(--card-background)' : 'white'
      }}>
        <div className="p-4 border-b flex justify-between items-center" style={{
          borderColor: isDarkMode ? 'var(--border-color)' : undefined
        }}>
          <h2 className="text-lg font-semibold" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            Your Subscriptions
          </h2>
          <button
            onClick={() => setShowAddSubscription(!showAddSubscription)}
            className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
            style={{
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined,
              color: isDarkMode ? 'var(--primary)' : undefined
            }}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Add Subscription Form */}
        {showAddSubscription && (
          <div className="p-4 border-b" style={{
            borderColor: isDarkMode ? 'var(--border-color)' : undefined,
            backgroundColor: isDarkMode ? 'var(--hover-background)' : '#F9FAFB'
          }}>
            <h3 className="font-medium mb-4" style={{
              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
            }}>Add New Subscription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Subscription Name
                </label>
                <input
                  type="text"
                  value={newSubscription.name || ''}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                    borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                  }}
                  placeholder="Netflix, Spotify, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Amount
                </label>
                <input
                  type="number"
                  value={newSubscription.amount || ''}
                  onChange={(e) => setNewSubscription({...newSubscription, amount: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                    borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                  }}
                  placeholder="9.99"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Billing Frequency
                </label>
                <select
                  value={newSubscription.frequency || 'monthly'}
                  onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value as any})}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                    borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                  }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Category
                </label>
                <select
                  value={newSubscription.category || 'Entertainment'}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                    borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                  }}
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="Services">Services</option>
                  <option value="Health">Health & Fitness</option>
                  <option value="Software">Software & Apps</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSubscription(false)}
                className="px-4 py-2 border rounded"
                style={{
                  backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                  borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubscription}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                style={{
                  backgroundColor: isDarkMode ? 'var(--primary)' : undefined
                }}
              >
                Add Subscription
              </button>
            </div>
          </div>
        )}
        
        {/* Subscription List */}
        {isLoadingSubscriptions ? (
          <div className="p-8 text-center" style={{
            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
          }}>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p>Analyzing your transaction patterns to detect subscriptions...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-8 text-center text-gray-500" style={{
            color: isDarkMode ? 'var(--text-secondary)' : undefined
          }}>
            <p>No active subscriptions found. Add one to get started!</p>
          </div>
        ) : (
          <div className="divide-y" style={{
            borderColor: isDarkMode ? 'var(--border-color)' : undefined
          }}>
            {subscriptions.map((subscription) => (
              <div 
                key={subscription.id}
                className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-[var(--hover-background)]"
                style={{
                  backgroundColor: selectedSubscription?.id === subscription.id 
                    ? isDarkMode ? 'var(--hover-background)' : '#333333'
                    : undefined
                }}
                onClick={() => setSelectedSubscription(
                  selectedSubscription?.id === subscription.id ? null : subscription
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div 
                      className="p-2 rounded-lg mr-3 flex-shrink-0"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF'
                      }}
                    >
                      <CreditCard 
                        className="h-5 w-5"
                        style={{
                          color: isDarkMode ? 'var(--primary)' : '#3B82F6'
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium" style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                      }}>
                        {subscription.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span 
                          className="text-sm px-2 py-0.5 rounded bg-blue-50 text-blue-700"
                          style={{
                            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined,
                            color: isDarkMode ? 'var(--primary)' : undefined
                          }}
                        >
                          {subscription.category}
                        </span>
                        <span 
                          className="text-sm text-gray-500 ml-2"
                          style={{
                            color: isDarkMode ? 'var(--text-secondary)' : undefined
                          }}
                        >
                          {subscription.frequency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{
                      color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                    }}>
                      {formatCurrency(subscription.amount)}
                    </div>
                    <div 
                      className="text-sm flex items-center justify-end mt-1"
                      style={{
                        color: isDateSoon(subscription.nextPayment) 
                          ? '#EF4444' 
                          : isDarkMode ? 'var(--text-secondary)' : '#6B7280'
                      }}
                    >
                      {isDateSoon(subscription.nextPayment) && (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      Due {formatRelativeDate(subscription.nextPayment)}
                    </div>
                  </div>
                </div>
                
                {/* Extended details when selected */}
                {selectedSubscription?.id === subscription.id && (
                  <div 
                    className="mt-4 pt-4 border-t"
                    style={{
                      borderColor: isDarkMode ? 'var(--border-color)' : undefined
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 
                          className="text-sm font-medium mb-1"
                          style={{
                            color: isDarkMode ? 'var(--text-secondary)' : '#6B7280'
                          }}
                        >
                          Annual Cost
                        </h4>
                        <p className="font-medium" style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                        }}>
                          {formatCurrency(
                            subscription.frequency === 'monthly' 
                              ? subscription.amount * 12 
                              : subscription.frequency === 'quarterly'
                                ? subscription.amount * 4
                                : subscription.amount
                          )}
                        </p>
                      </div>
                      <div>
                        <h4 
                          className="text-sm font-medium mb-1"
                          style={{
                            color: isDarkMode ? 'var(--text-secondary)' : '#6B7280'
                          }}
                        >
                          Started On
                        </h4>
                        <p className="font-medium" style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                        }}>
                          {subscription.dateAdded.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteSubscription(subscription.id)}
                        className="flex items-center text-sm text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div 
        className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-950 rounded-lg shadow-lg p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-2">Subscription Optimization</h3>
        <p className="mb-4">Based on your subscription patterns, here are some ways you could save:</p>
        <div className="space-y-3">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>Consider the Entertainment bundle of Disney+, Hulu, and ESPN+ to save $7.99/month</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>You could save $59.99/year by switching to annual billing for your streaming services</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>Using a family plan for your music subscription could save you $7.99/month</p>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper functions
const isDateSoon = (date: Date) => {
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);
  
  return date <= threeDaysFromNow;
};

const formatRelativeDate = (date: Date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'tomorrow';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `in ${diffDays} days`;
  } else {
    return date.toLocaleDateString();
  }
};

export default SubscriptionManager;