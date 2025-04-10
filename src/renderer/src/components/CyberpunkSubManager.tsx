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
  X,
  ZapIcon,
  Shield,
  Package,
  Monitor,
  Music,
  Film,
  Gamepad,
  Cloud,
  Radio
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

interface CyberpunkSubscriptionManagerProps {
  expenses: any[];
  isDarkMode: boolean;
  income: number;
}

const CyberpunkSubscriptionManager: React.FC<CyberpunkSubscriptionManagerProps> = ({ expenses, isDarkMode, income }) => {
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
      const subscriptionCards = document.querySelectorAll('.cyberpunk-subscription-card');
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
    
    const today = new Date();
    
    // Calculate the next payment date based on frequency
    let nextPaymentDate = new Date(today);
    
    // Add days based on frequency (this is a simple example approach)
    if (newSubscription.frequency === 'monthly') {
      nextPaymentDate.setMonth(today.getMonth() + 1);
    } else if (newSubscription.frequency === 'quarterly') {
      nextPaymentDate.setMonth(today.getMonth() + 3);
    } else {
      nextPaymentDate.setFullYear(today.getFullYear() + 1);
    }
    
    const subscription: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.name || '',
      amount: newSubscription.amount || 0,
      frequency: newSubscription.frequency || 'monthly',
      nextPayment: nextPaymentDate,
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

  // Get cyberpunk color based on subscription name
  const getCyberpunkColor = (name: string) => {
    // Map subscription names to cyberpunk colors
    const colors: {[key: string]: {bg: string, highlight: string, border: string}} = {
      Netflix: { bg: 'from-red-900/30 to-red-800/10', highlight: 'bg-red-500', border: 'border-red-500/50' },
      Spotify: { bg: 'from-green-900/30 to-green-800/10', highlight: 'bg-green-500', border: 'border-green-500/50' },
      'Disney+': { bg: 'from-blue-900/30 to-blue-800/10', highlight: 'bg-blue-500', border: 'border-blue-500/50' },
      Hulu: { bg: 'from-green-900/30 to-green-800/10', highlight: 'bg-green-500', border: 'border-green-500/50' },
      'Apple Music': { bg: 'from-pink-900/30 to-pink-800/10', highlight: 'bg-pink-500', border: 'border-pink-500/50' },
      'Amazon Prime': { bg: 'from-blue-900/30 to-blue-800/10', highlight: 'bg-blue-500', border: 'border-blue-500/50' },
      'YouTube Premium': { bg: 'from-red-900/30 to-red-800/10', highlight: 'bg-red-500', border: 'border-red-500/50' },
      'Xbox Game Pass': { bg: 'from-green-900/30 to-green-800/10', highlight: 'bg-green-500', border: 'border-green-500/50' },
      'PlayStation Plus': { bg: 'from-blue-900/30 to-blue-800/10', highlight: 'bg-blue-500', border: 'border-blue-500/50' },
      'Discord Nitro': { bg: 'from-indigo-900/30 to-indigo-800/10', highlight: 'bg-indigo-500', border: 'border-indigo-500/50' },
      default: { bg: 'from-red-900/30 to-red-800/10', highlight: 'bg-red-500', border: 'border-red-500/50' }
    };
    
    return colors[name] || colors.default;
  };

  // Get cyberpunk icon for subscription
  const getCyberpunkIcon = (name: string, category: string) => {
    const icons: {[key: string]: React.ReactNode} = {
      Netflix: <Film size={18} />,
      Spotify: <Music size={18} />,
      'Apple Music': <Music size={18} />,
      'Disney+': <Film size={18} />,
      Hulu: <Film size={18} />,
      'Amazon Prime': <Package size={18} />,
      'YouTube Premium': <Film size={18} />,
      'Xbox Game Pass': <Gamepad size={18} />,
      'PlayStation Plus': <Gamepad size={18} />,
      'Discord Nitro': <Radio size={18} />,
      'Adobe Creative Cloud': <Monitor size={18} />,
      'Microsoft 365': <Monitor size={18} />,
      'Dropbox': <Cloud size={18} />,
      'Google Drive': <Cloud size={18} />,
      'iCloud': <Cloud size={18} />,
      'NordVPN': <Shield size={18} />,
      'ExpressVPN': <Shield size={18} />
    };
    
    // If no specific icon, use category-based fallback
    if (!icons[name]) {
      if (category === 'Entertainment' || category === 'Video') return <Film size={18} />;
      if (category === 'Music') return <Music size={18} />;
      if (category === 'Gaming') return <Gamepad size={18} />;
      if (category === 'VPN') return <Shield size={18} />;
      if (category === 'Cloud Storage') return <Cloud size={18} />;
      if (category === 'Software') return <Monitor size={18} />;
      
      // Default icon
      return <Package size={18} />;
    }
    
    return icons[name];
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow overflow-hidden group hover:border-red-500/60 transition-colors">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">TOTAL MONTHLY</h2>
              <RefreshCw className="h-4 w-4 text-red-500 opacity-70" />
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">
              {formatCurrency(calculateMonthlySubscriptionCost())}
            </div>
            <div className="text-xs text-gray-500">
              ACROSS {subscriptions.length} ACTIVE SUBSCRIPTIONS
            </div>
          </div>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow overflow-hidden group hover:border-red-500/60 transition-colors">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">NEXT 7 DAYS</h2>
              <Calendar className="h-4 w-4 text-red-500 opacity-70" />
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">
              {formatCurrency(getUpcomingPaymentAmount())}
            </div>
            <div className="text-xs text-gray-500">
              DUE WITHIN THE NEXT WEEK
            </div>
          </div>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow overflow-hidden group hover:border-red-500/60 transition-colors">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">ANNUAL COST</h2>
              <DollarSign className="h-4 w-4 text-red-500 opacity-70" />
            </div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">
              {formatCurrency(calculateAnnualSubscriptionCost())}
            </div>
            <div className="text-xs text-gray-500">
              {income > 0 
                ? `${(calculateAnnualSubscriptionCost() / income * 100).toFixed(1)}% OF ANNUAL INCOME` 
                : "ADD INCOME TO SEE PERCENTAGE"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Subscription Panel */}
      <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow mb-8">
        <div className="p-4 border-b border-red-900/20 flex justify-between items-center">
          <h2 className="text-xs text-red-500 tracking-widest">YOUR SUBSCRIPTIONS</h2>
          <button
            onClick={() => setShowAddSubscription(!showAddSubscription)}
            className="p-1.5 rounded bg-black text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Add Subscription Form */}
        {showAddSubscription && (
          <div className="p-4 border-b border-red-900/20 bg-black/50">
            <h3 className="text-sm text-red-500 tracking-widest mb-4">ADD NEW SUBSCRIPTION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-red-500 mb-1">SUBSCRIPTION NAME</label>
                <input
                  type="text"
                  value={newSubscription.name || ''}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                  placeholder="NETFLIX, SPOTIFY, ETC."
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
                <label className="block text-xs text-red-500 mb-1">AMOUNT</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    value={newSubscription.amount || ''}
                    onChange={(e) => setNewSubscription({...newSubscription, amount: parseFloat(e.target.value)})}
                    className="w-full bg-black/50 border border-red-500/30 rounded p-2 pl-7 text-white focus:border-red-500/70 focus:outline-none"
                    placeholder="9.99"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-red-500 mb-1">BILLING FREQUENCY</label>
                <select
                  value={newSubscription.frequency || 'monthly'}
                  onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value as any})}
                  className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                >
                  <option value="monthly">MONTHLY</option>
                  <option value="quarterly">QUARTERLY</option>
                  <option value="annual">ANNUAL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                <select
                  value={newSubscription.category || 'Entertainment'}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                >
                  <option value="Entertainment">ENTERTAINMENT</option>
                  <option value="Music">MUSIC</option>
                  <option value="Video">VIDEO</option>
                  <option value="Gaming">GAMING</option>
                  <option value="Software">SOFTWARE</option>
                  <option value="Cloud Storage">CLOUD STORAGE</option>
                  <option value="VPN">VPN</option>
                  <option value="News">NEWS</option>
                  <option value="Books">BOOKS</option>
                  <option value="Fitness">FITNESS</option>
                  <option value="Food">FOOD</option>
                  <option value="Shopping">SHOPPING</option>
                  <option value="Smart Home">SMART HOME</option>
                  <option value="AI">AI</option>
                  <option value="Services">SERVICES</option>
                  <option value="Health">HEALTH</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>
              
              {/* Start Date Field */}
              <div className="md:col-span-2">
                <label className="block text-xs text-red-500 mb-1">SUBSCRIPTION START DATE (OPTIONAL)</label>
                <input
                  type="date"
                  value={formatDateForInput(newSubscription.startDate)}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setNewSubscription({...newSubscription, startDate: date});
                  }}
                  className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSubscription(false)}
                className="px-4 py-2 border border-red-900/30 text-gray-300 hover:bg-red-900/20 transition-colors text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddSubscription}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs relative overflow-hidden group"
              >
                <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></span>
                ADD SUBSCRIPTION
              </button>
            </div>
          </div>
        )}
        
        {/* Subscription List */}
        {isLoadingSubscriptions ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-8 w-8 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-gray-500">LOADING SUBSCRIPTIONS...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">NO ACTIVE SUBSCRIPTIONS FOUND. ADD ONE TO GET STARTED.</p>
          </div>
        ) : (
          <div className="divide-y divide-red-900/20">
            {subscriptions.map((subscription) => {
              // Get custom styling for this subscription
              const colors = getCyberpunkColor(subscription.name);
              
              // Check if this subscription is being edited
              const isEditing = editingSubscription?.id === subscription.id;
              const isSelected = selectedSubscription?.id === subscription.id;
              
              // Is payment due soon
              const isPaymentSoon = isDateSoon(subscription.nextPayment);
              
              return (
                <div 
                  key={subscription.id}
                  className={`p-4 transition-colors cyberpunk-subscription-card relative ${
                    isSelected ? 'bg-gradient-to-r from-black to-red-950/10' : 'hover:bg-black/50'
                  }`}
                  onClick={() => {
                    if (!isEditing && selectedSubscription?.id !== subscription.id) {
                      setSelectedSubscription(subscription);
                    }
                  }}
                >
                  {/* Left border indicator */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 h-full w-1 bg-red-500"></div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div 
                        className={`p-2 rounded flex-shrink-0 mr-3 bg-gradient-to-br ${colors.bg} border ${colors.border}`}
                      >
                        {getCyberpunkIcon(subscription.name, subscription.category)}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-white">{subscription.name}</h3>
                          {isPaymentSoon && (
                            <span className="ml-2 inline-flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-black/50 border border-red-500/30 text-red-500">
                            {subscription.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {subscription.frequency.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{formatCurrency(subscription.amount)}</div>
                      <div 
                        className={`text-xs flex items-center justify-end mt-1 ${
                          isPaymentSoon ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        {isPaymentSoon && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        DUE {formatRelativeDate(subscription.nextPayment)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Extended details when selected */}
                  {isSelected && !isEditing && (
                    <div className="mt-4 pt-4 border-t border-red-900/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-black/50 p-3 rounded border border-red-900/30">
                          <h4 className="text-xs text-gray-500 mb-1">ANNUAL COST</h4>
                          <p className="font-medium text-white">
                            {formatCurrency(
                              subscription.frequency === 'monthly' 
                                ? subscription.amount * 12 
                                : subscription.frequency === 'quarterly'
                                  ? subscription.amount * 4
                                  : subscription.amount
                            )}
                          </p>
                        </div>
                        <div className="bg-black/50 p-3 rounded border border-red-900/30">
                          <h4 className="text-xs text-gray-500 mb-1">STARTED ON</h4>
                          <p className="font-medium text-white">
                            {subscription.startDate 
                              ? subscription.startDate.toLocaleDateString() 
                              : "NOT SPECIFIED"}
                          </p>
                        </div>
                        <div className="bg-black/50 p-3 rounded border border-red-900/30">
                          <h4 className="text-xs text-gray-500 mb-1">ADDED TO TRACKER</h4>
                          <p className="font-medium text-white">
                            {subscription.dateAdded.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditing(subscription);
                          }}
                          className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          EDIT SUBSCRIPTION
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubscription(subscription.id);
                          }}
                          className="flex items-center text-xs text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          CANCEL SUBSCRIPTION
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Edit Form */}
                  {isEditing && (
                    <div 
                      className="mt-4 pt-4 border-t border-red-900/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-sm text-red-500 tracking-widest mb-4">EDIT SUBSCRIPTION</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-red-500 mb-1">SUBSCRIPTION NAME</label>
                          <input
                            type="text"
                            value={editingSubscription.name}
                            onChange={(e) => handleUpdateEditingField('name', e.target.value)}
                            className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                            list="subscription-suggestions"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-red-500 mb-1">AMOUNT</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <input
                              type="number"
                              value={editingSubscription.amount}
                              onChange={(e) => handleUpdateEditingField('amount', parseFloat(e.target.value))}
                              className="w-full bg-black/50 border border-red-500/30 rounded p-2 pl-7 text-white focus:border-red-500/70 focus:outline-none"
                              step="0.01"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-red-500 mb-1">BILLING FREQUENCY</label>
                          <select
                            value={editingSubscription.frequency}
                            onChange={(e) => handleUpdateEditingField('frequency', e.target.value)}
                            className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                          >
                            <option value="monthly">MONTHLY</option>
                            <option value="quarterly">QUARTERLY</option>
                            <option value="annual">ANNUAL</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                          <select
                            value={editingSubscription.category}
                            onChange={(e) => handleUpdateEditingField('category', e.target.value)}
                            className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                          >
                            <option value="Entertainment">ENTERTAINMENT</option>
                            <option value="Music">MUSIC</option>
                            <option value="Video">VIDEO</option>
                            <option value="Gaming">GAMING</option>
                            <option value="Software">SOFTWARE</option>
                            <option value="Cloud Storage">CLOUD STORAGE</option>
                            <option value="VPN">VPN</option>
                            <option value="News">NEWS</option>
                            <option value="Books">BOOKS</option>
                            <option value="Fitness">FITNESS</option>
                            <option value="Food">FOOD</option>
                            <option value="Shopping">SHOPPING</option>
                            <option value="Smart Home">SMART HOME</option>
                            <option value="AI">AI</option>
                            <option value="Services">SERVICES</option>
                            <option value="Health">HEALTH</option>
                            <option value="Other">OTHER</option>
                          </select>
                        </div>
                        
                        {/* Edit Start Date */}
                        <div className="md:col-span-2">
                          <label className="block text-xs text-red-500 mb-1">SUBSCRIPTION START DATE (OPTIONAL)</label>
                          <input
                            type="date"
                            value={formatDateForInput(editingSubscription.startDate)}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined;
                              handleUpdateEditingField('startDate', date);
                            }}
                            className="w-full bg-black/50 border border-red-500/30 rounded p-2 text-white focus:border-red-500/70 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelEditing}
                          className="px-4 py-2 border border-red-900/30 text-gray-300 hover:bg-red-900/20 transition-colors text-xs flex items-center"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          CANCEL
                        </button>
                        <button
                          onClick={handleSaveEditing}
                          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs flex items-center relative overflow-hidden group"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          SAVE CHANGES
                          <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></span>
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
      
      {/* Tips and Optimization Card */}
      <div className="bg-gradient-to-r from-black via-red-950/20 to-black backdrop-blur-sm border border-red-500/30 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <ZapIcon className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-sm text-red-500 tracking-widest">SUBSCRIPTION OPTIMIZATION</h3>
        </div>
        <p className="mb-4 text-gray-300 text-sm">Track and manage your subscriptions to avoid subscription creep and save money each month.</p>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-2">
              <div className="p-1 rounded-full bg-black border border-red-500/50">
                <CheckCircle className="h-3 w-3 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-gray-300">Consider bundling services from the same provider to save on individual subscriptions</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-2">
              <div className="p-1 rounded-full bg-black border border-red-500/50">
                <CheckCircle className="h-3 w-3 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-gray-300">You can save by switching to annual billing for services you use regularly</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-2">
              <div className="p-1 rounded-full bg-black border border-red-500/50">
                <CheckCircle className="h-3 w-3 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-gray-300">Family or group plans often provide better value than individual subscriptions</p>
          </div>
        </div>
        
        {/* Scanner effect line */}
        <div className="relative h-0.5 w-full bg-black overflow-hidden mt-6">
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scanner"></div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style >{`
        @keyframes scanner {
          0% {
            left: -20%;
          }
          100% {
            left: 120%;
          }
        }
        
        .animate-scanner {
          animation: scanner 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
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
    return 'TODAY';
  } else if (diffDays === 1) {
    return 'TOMORROW';
  } else if (diffDays > 1 && diffDays <= 7) {
    return `IN ${diffDays} DAYS`;
  } else {
    return date.toLocaleDateString().toUpperCase();
  }
};

export default CyberpunkSubscriptionManager;