import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  DollarSign,
  RefreshCw,
  Edit,
  X
} from 'lucide-react';
import { getSubscriptionIcon } from '@renderer/lib/subscription';


// Define interface for subscription
interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
  nextPayment: Date;
  category: string;
  dateAdded: Date;
  startDate?: Date; // Optional start date
}

interface SubscriptionManagerProps {
  expenses: any[];
  isDarkMode: boolean;
  income: number;
}

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
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Load subscriptions from localStorage
  useEffect(() => {
    const loadSubscriptions = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const savedSubscriptions = localStorage.getItem('userSubscriptions');
        const parsedSubscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : [];
        
        // Convert string dates back to Date objects
        const processedSubscriptions = parsedSubscriptions.map((sub: any) => ({
          ...sub,
          nextPayment: new Date(sub.nextPayment),
          dateAdded: new Date(sub.dateAdded),
          startDate: sub.startDate ? new Date(sub.startDate) : undefined
        }));
        
        setSubscriptions(processedSubscriptions);
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
        setSubscriptions([]);
      }
      
      setIsLoadingSubscriptions(false);
    };
    
    loadSubscriptions();
  }, []);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (!isLoadingSubscriptions) {
      localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions));
    }
  }, [subscriptions, isLoadingSubscriptions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date for input fields
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };


  useEffect(() => {
    // Function to handle clicks outside subscription cards
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside subscription cards
      const subscriptionCards = document.querySelectorAll('.subscription-card');
      let clickedOutside = true;
      
      subscriptionCards.forEach(card => {
        if (card.contains(event.target as Node)) {
          clickedOutside = false;
        }
      });
      
      // If clicked outside, reset selected subscription
      if (clickedOutside && !editingSubscription) {
        setSelectedSubscription(null);
      }
    };
  
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingSubscription]);


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
      dateAdded: new Date(),
      startDate: newSubscription.startDate
    };
    
    setSubscriptions(prev => [...prev, subscription]);
    setNewSubscription({
      name: '',
      amount: 0,
      frequency: 'monthly',
      category: 'Entertainment',
      startDate: undefined
    });
    setShowAddSubscription(false);
  };

  // Start editing a subscription
  const handleStartEditing = (subscription: Subscription) => {
    setEditingSubscription(subscription);
  };

  // Cancel editing
  const handleCancelEditing = () => {
    setEditingSubscription(null);
  };

  // Save edited subscription
  const handleSaveEditing = () => {
    if (!editingSubscription) return;
    
    setSubscriptions(prev => prev.map(sub => 
      sub.id === editingSubscription.id ? editingSubscription : sub
    ));
    setSelectedSubscription(editingSubscription);
    setEditingSubscription(null);
  };

  // Update editing subscription
  const handleUpdateEditingField = (field: string, value: any) => {
    if (!editingSubscription) return;
    
    setEditingSubscription({
      ...editingSubscription,
      [field]: value
    });
  };

  // Delete subscription
  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    if (selectedSubscription?.id === id) {
      setSelectedSubscription(null);
    }
    if (editingSubscription?.id === id) {
      setEditingSubscription(null);
    }
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
            {income > 0 ? `${(calculateAnnualSubscriptionCost() / income * 100).toFixed(1)}% of your annual income` : "Add income to see percentage"}
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
                  list="subscription-suggestions"
                />
                <datalist id="subscription-suggestions">
                  <option value="Netflix" />
                  <option value="Spotify" />
                  <option value="Disney+" />
                  <option value="Hulu" />
                  <option value="Amazon Prime" />
                  <option value="Apple Music" />
                  <option value="YouTube Premium" />
                  <option value="Xbox Game Pass" />
                  <option value="PlayStation Plus" />
                  <option value="Discord Nitro" />
                  <option value="Adobe Creative Cloud" />
                  <option value="Microsoft 365" />
                  <option value="Dropbox" />
                  <option value="Google Drive" />
                  <option value="iCloud" />
                  <option value="NordVPN" />
                  <option value="ExpressVPN" />
                </datalist>
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
                  step="0.01"
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
                  <option value="Music">Music</option>
                  <option value="Video">Video</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Software">Software</option>
                  <option value="Cloud Storage">Cloud Storage</option>
                  <option value="VPN">VPN</option>
                  <option value="News">News</option>
                  <option value="Books">Books</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Smart Home">Smart Home</option>
                  <option value="AI">AI</option>
                  <option value="Services">Services</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* New Start Date Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{
                  color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                }}>
                  Subscription Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={formatDateForInput(newSubscription.startDate)}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setNewSubscription({...newSubscription, startDate: date});
                  }}
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                    borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                    color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                  }}
                />
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
            <p>Loading your subscriptions...</p>
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
            {subscriptions.map((subscription) => {
              // Get icon data for this subscription
              const iconData = getSubscriptionIcon(subscription.name);
              
              // Check if this subscription is being edited
              const isEditing = editingSubscription?.id === subscription.id;
              
              return (
                <div 
                  key={subscription.id}
                   className="p-4 transition-colors hover:bg-gray-50 subscription-card" 
                  style={{
                    backgroundColor: selectedSubscription?.id === subscription.id 
                      ? isDarkMode ? 'var(--hover-background)' : '#f9fafb'
                      : isDarkMode ? 'var(--card-background)' : 'white',
                  }}
                  onClick={() => {
                    if (!isEditing && selectedSubscription?.id !== subscription.id) {
                      setSelectedSubscription(subscription);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div 
                        className="p-2 rounded-lg mr-3 flex-shrink-0"
                        style={{
                          backgroundColor: iconData.backgroundColor,
                          color: iconData.color
                        }}
                      >
                        {iconData.icon}
                      </div>
                      <div>
                        <h3 className="font-medium" style={{
                          color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                        }}>
                          {subscription.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span 
                            className="text-sm px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
                              color: isDarkMode ? 'var(--primary)' : '#3B82F6'
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
                  {selectedSubscription?.id === subscription.id && !isEditing && (
                    <div 
                      className="mt-4 pt-4 border-t"
                      style={{
                        borderColor: isDarkMode ? 'var(--border-color)' : undefined
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                            {subscription.startDate 
                              ? subscription.startDate.toLocaleDateString() 
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 
                            className="text-sm font-medium mb-1"
                            style={{
                              color: isDarkMode ? 'var(--text-secondary)' : '#6B7280'
                            }}
                          >
                            Added To Tracker
                          </h4>
                          <p className="font-medium" style={{
                            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                          }}>
                            {subscription.dateAdded.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleStartEditing(subscription)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Subscription
                        </button>
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
                  
                  {/* Edit Form */}
                  {isEditing && (
                    <div 
                      className="mt-4 pt-4 border-t"
                      style={{
                        borderColor: isDarkMode ? 'var(--border-color)' : undefined
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="font-medium mb-4" style={{
                        color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                      }}>Edit Subscription</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{
                            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                          }}>
                            Subscription Name
                          </label>
                          <input
                            type="text"
                            value={editingSubscription.name}
                            onChange={(e) => handleUpdateEditingField('name', e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{
                              backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                              borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                            }}
                            list="subscription-suggestions"
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
                            value={editingSubscription.amount}
                            onChange={(e) => handleUpdateEditingField('amount', parseFloat(e.target.value))}
                            className="w-full p-2 border rounded"
                            style={{
                              backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                              borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                            }}
                            step="0.01"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{
                            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                          }}>
                            Billing Frequency
                          </label>
                          <select
                            value={editingSubscription.frequency}
                            onChange={(e) => handleUpdateEditingField('frequency', e.target.value)}
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
                            value={editingSubscription.category}
                            onChange={(e) => handleUpdateEditingField('category', e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{
                              backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                              borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                            }}
                          >
                            <option value="Entertainment">Entertainment</option>
                            <option value="Music">Music</option>
                            <option value="Video">Video</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Software">Software</option>
                            <option value="Cloud Storage">Cloud Storage</option>
                            <option value="VPN">VPN</option>
                            <option value="News">News</option>
                            <option value="Books">Books</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Food">Food</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Smart Home">Smart Home</option>
                            <option value="AI">AI</option>
                            <option value="Services">Services</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        {/* Edit Start Date */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1" style={{
                            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                          }}>
                            Subscription Start Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={formatDateForInput(editingSubscription.startDate)}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined;
                              handleUpdateEditingField('startDate', date);
                            }}
                            className="w-full p-2 border rounded"
                            style={{
                              backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                              borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                              color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelEditing}
                          className="px-4 py-2 border rounded flex items-center"
                          style={{
                            backgroundColor: isDarkMode ? 'var(--card-background)' : 'white',
                            borderColor: isDarkMode ? 'var(--border-color)' : undefined,
                            color: isDarkMode ? 'var(--text-primary)' : 'inherit'
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEditing}
                          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                          style={{
                            backgroundColor: isDarkMode ? 'var(--primary)' : undefined
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div 
        className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-950 rounded-lg shadow-lg p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-2">Subscription Optimization</h3>
        <p className="mb-4">Track and manage your subscriptions to avoid subscription creep and save money each month.</p>
        <div className="space-y-3">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>Consider bundling services from the same provider to save on individual subscriptions</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>You can save by switching to annual billing for services you use regularly</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>Family or group plans often provide better value than individual subscriptions</p>
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