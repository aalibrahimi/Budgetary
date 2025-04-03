import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

import { useNotificationSystem, NotificationType } from '@renderer/components/NotificationSystem'
import { Plus, Trash2, Edit, X, CheckCircle, AlertCircle, Calendar, DollarSign, RefreshCw, Shield, Music, Video, Gamepad2, Cloud, ShoppingBag } from 'lucide-react'
import { getSubscriptionIcon } from '@renderer/lib/subscription'
import { useExpenseStore } from '@renderer/stores/expenseStore'

// Cyberpunk version of the Smart Assistant page (Subscription Manager)
const CyberpunkSmartAssistant: React.FC = () => {
  const { expenses, income } = useExpenseStore()
  const { showNotification } = useNotificationSystem()
  
  // State for subscriptions
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null)
  const [editingSubscription, setEditingSubscription] = useState<any | null>(null)
  
  // State for add subscription form
  const [showAddSubscription, setShowAddSubscription] = useState(false)
  const [newSubscription, setNewSubscription] = useState<any>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    category: 'Entertainment'
  })

  // Load subscriptions from localStorage
  useEffect(() => {
    const loadSubscriptions = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      try {
        const savedSubscriptions = localStorage.getItem('userSubscriptions')
        const parsedSubscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : []
        
        // Convert string dates back to Date objects
        const processedSubscriptions = parsedSubscriptions.map((sub: any) => ({
          ...sub,
          nextPayment: new Date(sub.nextPayment),
          dateAdded: new Date(sub.dateAdded),
          startDate: sub.startDate ? new Date(sub.startDate) : undefined
        }))
        
        setSubscriptions(processedSubscriptions)
      } catch (error) {
        console.error('Failed to load subscriptions:', error)
        setSubscriptions([])
      }
      
      setIsLoadingSubscriptions(false)
    }
    
    loadSubscriptions()
  }, [])

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (!isLoadingSubscriptions) {
      localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions))
    }
  }, [subscriptions, isLoadingSubscriptions])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Format date for input fields
  const formatDateForInput = (date?: Date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Add subscription
  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount) {
      showNotification('ERROR', 'Please fill all required fields!', NotificationType.ERROR)
      return
    }
    
    const subscription = {
      id: Date.now().toString(),
      name: newSubscription.name || '',
      amount: newSubscription.amount || 0,
      frequency: newSubscription.frequency || 'monthly',
      nextPayment: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 30))),
      category: newSubscription.category || 'Other',
      dateAdded: new Date(),
      startDate: newSubscription.startDate
    }
    
    setSubscriptions(prev => [...prev, subscription])
    setNewSubscription({
      name: '',
      amount: 0,
      frequency: 'monthly',
      category: 'Entertainment',
      startDate: undefined
    })
    setShowAddSubscription(false)
    
    showNotification('SUCCESS', `Added ${subscription.name} subscription`, NotificationType.SUCCESS)
  }

  // Start editing a subscription
  const handleStartEditing = (subscription: any) => {
    setEditingSubscription(subscription)
  }

  // Cancel editing
  const handleCancelEditing = () => {
    setEditingSubscription(null)
  }

  // Save edited subscription
  const handleSaveEditing = () => {
    if (!editingSubscription) return
    
    setSubscriptions(prev => prev.map(sub => 
      sub.id === editingSubscription.id ? editingSubscription : sub
    ))
    setSelectedSubscription(editingSubscription)
    setEditingSubscription(null)
    
    showNotification('SUCCESS', 'Subscription updated successfully', NotificationType.SUCCESS)
  }

  // Update editing subscription
  const handleUpdateEditingField = (field: string, value: any) => {
    if (!editingSubscription) return
    
    setEditingSubscription({
      ...editingSubscription,
      [field]: value
    })
  }

  // Delete subscription
  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id))
    if (selectedSubscription?.id === id) {
      setSelectedSubscription(null)
    }
    if (editingSubscription?.id === id) {
      setEditingSubscription(null)
    }
    
    showNotification('SUCCESS', 'Subscription removed successfully', NotificationType.SUCCESS)
  }

  // Calculate total monthly subscription cost
  const calculateMonthlySubscriptionCost = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.frequency === 'monthly') {
        return total + sub.amount
      } else if (sub.frequency === 'quarterly') {
        return total + (sub.amount / 3)
      } else { // annual
        return total + (sub.amount / 12)
      }
    }, 0)
  }

  // Calculate annual subscription cost
  const calculateAnnualSubscriptionCost = () => {
    return calculateMonthlySubscriptionCost() * 12
  }

  // Get upcoming payment amount (next 7 days)
  const getUpcomingPaymentAmount = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    return subscriptions
      .filter(sub => sub.nextPayment <= nextWeek)
      .reduce((total, sub) => total + sub.amount, 0)
  }

  // Check if a date is coming up soon (within 3 days)
  const isDateSoon = (date: Date) => {
    const now = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(now.getDate() + 3)
    
    return date <= threeDaysFromNow
  }

  // Format relative date
  const formatRelativeDate = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'today'
    } else if (diffDays === 1) {
      return 'tomorrow'
    } else if (diffDays > 1 && diffDays <= 7) {
      return `in ${diffDays} days`
    } else {
      return formatDate(date)
    }
  }

  // Get current month and year for header
  const currentDate = new Date()
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]
  const currentMonth = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-red-600/20 mix-blend-screen blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-red-800/10 mix-blend-screen blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-br from-black via-red-950/10 to-black rounded-full mix-blend-screen filter blur-[80px]"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Subscription Add/Edit Modal */}
      {(showAddSubscription || editingSubscription) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-black/70 backdrop-blur-md border border-red-500/80 rounded-lg w-full max-w-lg overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
              <div className="relative p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-widest">
                  {editingSubscription ? '// EDIT SUBSCRIPTION' : '// ADD SUBSCRIPTION'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddSubscription(false)
                    setEditingSubscription(null)
                  }}
                  className="text-red-500 hover:text-red-400 focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-red-500 mb-1">SERVICE NAME</label>
                <input
                  type="text"
                  value={editingSubscription ? editingSubscription.name : newSubscription.name}
                  onChange={(e) => {
                    if (editingSubscription) {
                      handleUpdateEditingField('name', e.target.value)
                    } else {
                      setNewSubscription({...newSubscription, name: e.target.value})
                    }
                  }}
                  className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
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
                    value={editingSubscription ? editingSubscription.amount : newSubscription.amount || ''}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value);
                      if (editingSubscription) {
                        handleUpdateEditingField('amount', amount)
                      } else {
                        setNewSubscription({...newSubscription, amount: amount})
                      }
                    }}
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm pl-8 pr-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                    placeholder="9.99"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-red-500 mb-1">BILLING FREQUENCY</label>
                  <select
                    value={editingSubscription ? editingSubscription.frequency : newSubscription.frequency}
                    onChange={(e) => {
                      if (editingSubscription) {
                        handleUpdateEditingField('frequency', e.target.value)
                      } else {
                        setNewSubscription({...newSubscription, frequency: e.target.value})
                      }
                    }}
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                  <select
                    value={editingSubscription ? editingSubscription.category : newSubscription.category}
                    onChange={(e) => {
                      if (editingSubscription) {
                        handleUpdateEditingField('category', e.target.value)
                      } else {
                        setNewSubscription({...newSubscription, category: e.target.value})
                      }
                    }}
                    className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
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
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-red-500 mb-1">START DATE (OPTIONAL)</label>
                <input
                  type="date"
                  value={editingSubscription 
                    ? formatDateForInput(editingSubscription.startDate)
                    : formatDateForInput(newSubscription.startDate)
                  }
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    if (editingSubscription) {
                      handleUpdateEditingField('startDate', date)
                    } else {
                      setNewSubscription({...newSubscription, startDate: date})
                    }
                  }}
                  className="w-full bg-black/50 border border-red-500/50 rounded-sm px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddSubscription(false)
                    setEditingSubscription(null)
                  }}
                  className="px-4 py-2 bg-black border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                >
                  CANCEL
                </button>
                
                <button
                  onClick={editingSubscription ? handleSaveEditing : handleAddSubscription}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-sm relative overflow-hidden group"
                >
                  <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></span>
                  {editingSubscription ? 'SAVE CHANGES' : 'ADD SUBSCRIPTION'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-4">
       

        {/* Subscription List */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-red-900/20 flex justify-between items-center">
            <h2 className="text-xs text-red-500 tracking-widest">YOUR SUBSCRIPTIONS</h2>
            <div className="text-xs text-gray-500">
              {subscriptions.length} ACTIVE
            </div>
          </div>

          {isLoadingSubscriptions ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
              <p>LOADING SUBSCRIPTIONS...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>NO ACTIVE SUBSCRIPTIONS FOUND. ADD ONE TO GET STARTED.</p>
            </div>
          ) : (
            <div className="divide-y divide-red-900/10">
              {subscriptions.map((subscription) => {
                // Get icon data for this subscription
                const iconData = getSubscriptionIcon(subscription.name)
                
                // Check if this subscription is being edited
                const isEditing = editingSubscription?.id === subscription.id
                
                return (
                  <div 
                    key={subscription.id}
                    className={`p-4 transition-colors hover:bg-gray-950/20 subscription-card ${
                      selectedSubscription?.id === subscription.id ? 'bg-red-950/10' : ''
                    }`}
                    onClick={() => {
                      if (!isEditing && selectedSubscription?.id !== subscription.id) {
                        setSelectedSubscription(subscription)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div 
                          className="p-2 rounded-lg mr-3 flex-shrink-0"
                          style={{
                            backgroundColor: 'rgba(255, 59, 59, 0.1)',
                            color: '#ff3b3b'
                          }}
                        >
                          {(() => {
                            // Render different icons based on category
                            switch(subscription.category) {
                              case 'Music': return <Music className="h-5 w-5" />;
                              case 'Video': return <Video className="h-5 w-5" />;
                              case 'Gaming': return <Gamepad2 className="h-5 w-5" />;
                              case 'Cloud Storage': return <Cloud className="h-5 w-5" />;
                              case 'VPN': return <Shield className="h-5 w-5" />;
                              case 'Shopping': return <ShoppingBag className="h-5 w-5" />;
                              default: return iconData.icon || <DollarSign className="h-5 w-5" />;
                            }
                          })()}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {subscription.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span 
                              className="text-sm px-2 py-0.5 rounded bg-red-950/30 text-red-400"
                            >
                              {subscription.category}
                            </span>
                            <span 
                              className="text-sm text-gray-500 ml-2"
                            >
                              {subscription.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-500">
                          {formatCurrency(subscription.amount)}
                        </div>
                        <div className="text-sm flex items-center justify-end mt-1 text-gray-400">
                          {isDateSoon(subscription.nextPayment) && (
                            <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                          )}
                          Due {formatRelativeDate(subscription.nextPayment)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Extended details when selected */}
                    {selectedSubscription?.id === subscription.id && !isEditing && (
                      <div className="mt-4 pt-4 border-t border-red-900/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">
                              ANNUAL COST
                            </h4>
                            <p className="font-medium">
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
                            <h4 className="text-xs text-gray-500 mb-1">
                              STARTED ON
                            </h4>
                            <p className="font-medium">
                              {subscription.startDate 
                                ? formatDate(subscription.startDate) 
                                : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">
                              ADDED TO TRACKER
                            </h4>
                            <p className="font-medium">
                              {formatDate(subscription.dateAdded)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartEditing(subscription)
                            }}
                            className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Subscription
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSubscription(subscription.id)
                            }}
                            className="flex items-center text-sm text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Cancel Subscription
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Optimization Tips Card */}
        <div className="bg-gradient-to-r from-black to-red-950/30 rounded-lg shadow-lg p-6 text-white border border-red-500/30 mb-8">
          <h3 className="text-xl font-bold mb-2 text-red-500">OPTIMIZATION PROTOCOL</h3>
          <p className="mb-4 text-gray-300">Track and manage your subscriptions to avoid subscription creep and recover system resources.</p>
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-red-500" />
              <p className="text-gray-300">Consider bundling services from the same provider to save on individual subscriptions</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-red-500" />
              <p className="text-gray-300">Save up to 16% by switching to annual billing for services you use regularly</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-red-500" />
              <p className="text-gray-300">Family or group plans provide better resource efficiency than individual subscriptions</p>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <footer className="mt-8 border-t border-red-900/30 pt-3 flex justify-between items-center text-xs text-gray-600">
          <div>BUDGETARY SYSTEM v1.0.4</div>
          <div className="text-right">&copy; 2025 ALL RIGHTS RESERVED</div>
        </footer>
      </div>

      {/* Custom keyframes styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export default CyberpunkSmartAssistant