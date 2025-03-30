// src/renderer/src/components/PlaidAccountsPage.tsx
import React, { useEffect, useState } from 'react';
import { usePlaidStore } from '../stores/plaidStore';
import PlaidLinkButton from './PlaidLink';
import { 
  Building, 
  CreditCard, 
  Wallet, 
  RefreshCw, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Trash2 
} from 'lucide-react';
import NotifyButton2 from './notifications/notificationButton2';

// Helper function to format currency amounts
const formatCurrency = (amount: number | null, currency: string = 'USD') => {
  if (amount === null) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const PlaidAccountsPage: React.FC = () => {
  const { 
    items, 
    accounts, 
    fetchItems, 
    fetchAccounts, 
    updateAccountBalances, 
    removeItem,
    selectedItemId,
    setSelectedItem,
    getAccountsForItem,
    isLoading,
    error,
    clearError
  } = usePlaidStore();
  
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ category: '', msg: '' });
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // Load items and accounts on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchItems();
      
      // If we have items, load accounts for the first item
      if (items.length > 0 && Object.keys(accounts).length === 0) {
        for (const item of items) {
          await fetchAccounts(item.id);
        }
      }
    };
    
    loadData();
  }, [fetchItems, fetchAccounts, items.length, accounts]);

  // Show notification helper
  const showNotification = (category: string, msg: string) => {
    setNotificationMessage({ category, msg });
    setNotificationVisible(true);
    
    // Hide the notification after 5 seconds
    setTimeout(() => {
      setNotificationVisible(false);
    }, 5000);
  };

  // Handle refreshing account balances
  const handleRefreshBalances = async (itemId: string) => {
    try {
      setIsRefreshing(itemId);
      await updateAccountBalances(itemId);
      showNotification('Success', 'Account balances refreshed successfully');
    } catch (err) {
      showNotification('Error', 'Failed to refresh account balances');
    } finally {
      setIsRefreshing(null);
    }
  };

  // Handle removing a bank connection
  const handleRemoveItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to disconnect this bank account? This action cannot be undone.')) {
      try {
        setIsRemoving(itemId);
        await removeItem(itemId);
        showNotification('Success', 'Bank account disconnected successfully');
      } catch (err) {
        showNotification('Error', 'Failed to disconnect bank account');
      } finally {
        setIsRemoving(null);
      }
    }
  };

  // Render the accounts for a selected item
  const renderAccounts = () => {
    if (!selectedItemId) return null;
    
    const accountsList = getAccountsForItem(selectedItemId);
    
    if (accountsList.length === 0) {
      return (
        <div className="text-center p-6 text-gray-500">
          No accounts found for this connection. Try refreshing the account data.
        </div>
      );
    }
    
    return (
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-semibold">Your Accounts</h3>
        
        {accountsList.map(account => (
          <div 
            key={account.id}
            className="p-4 border rounded-lg"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {account.type === 'depository' ? (
                    <Wallet className="text-blue-600" size={20} />
                  ) : account.type === 'credit' ? (
                    <CreditCard className="text-purple-600" size={20} />
                  ) : (
                    <Building className="text-green-600" size={20} />
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium">{account.name}</h4>
                  <p className="text-sm text-gray-500">
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    {account.mask && <span> •••• {account.mask}</span>}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(
                    account.balance.available !== null 
                      ? account.balance.available 
                      : account.balance.current,
                    account.balance.isoCurrencyCode
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {formatDate(account.lastUpdated)}
                </div>
              </div>
            </div>
            
            {account.type === 'credit' && account.balance.limit !== null && (
              <div className="mt-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Credit Limit:</span>
                  <span>{formatCurrency(account.balance.limit, account.balance.isoCurrencyCode)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Available Credit:</span>
                  <span>
                    {formatCurrency(
                      account.balance.limit - account.balance.current,
                      account.balance.isoCurrencyCode
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render empty state when no bank accounts are connected
  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Building size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Bank Accounts</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Link your bank accounts to automatically track your transactions and balances in real-time.
        </p>
        <PlaidLinkButton 
          buttonText="Connect Your First Bank Account"
          className="px-6 py-3 text-lg"
          onSuccess={() => showNotification('Success', 'Bank account connected successfully!')}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Connected Banks</h2>
        <PlaidLinkButton 
          buttonText="+ Connect New Bank"
          onSuccess={() => showNotification('Success', 'Bank account connected successfully!')}
        />
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">An error occurred</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={clearError} 
            className="text-red-800 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-12 gap-6">
        {/* Bank connections sidebar */}
        <div className="col-span-12 md:col-span-4">
          <div 
            className="border rounded-lg overflow-hidden"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <h3 className="p-4 border-b font-medium">
              Your Banks
            </h3>
            
            <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {items.map(item => (
                <div 
                  key={item.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedItemId === item.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Building className="text-blue-600" size={20} />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{item.institutionName}</h4>
                        <p className="text-xs text-gray-500">
                          Last updated: {formatDate(item.lastUpdated)}
                        </p>
                      </div>
                    </div>
                    
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                  
                  {item.status === 'item_login_required' && (
                    <div className="mt-2 flex items-center text-xs text-amber-600">
                      <Clock size={12} className="mr-1" />
                      <span>Login required</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Account details */}
        <div className="col-span-12 md:col-span-8">
          {selectedItemId ? (
            <div className="border rounded-lg p-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {items.find(item => item.id === selectedItemId)?.institutionName} Accounts
                </h3>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRefreshBalances(selectedItemId)}
                    disabled={isRefreshing === selectedItemId}
                    className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    {isRefreshing === selectedItemId ? (
                      <>
                        <RefreshCw size={14} className="mr-1 animate-spin" />
                        <span>Refreshing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} className="mr-1" />
                        <span>Refresh</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleRemoveItem(selectedItemId)}
                    disabled={isRemoving === selectedItemId}
                    className="flex items-center px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    {isRemoving === selectedItemId ? (
                      <>
                        <Trash2 size={14} className="mr-1 animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} className="mr-1" />
                        <span>Disconnect</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {renderAccounts()}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center" style={{ borderColor: 'var(--border-color)' }}>
              <Building size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a bank</h3>
              <p className="text-gray-500">
                Select a bank from the sidebar to view your accounts.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <NotifyButton2
        category={notificationMessage.category}
        msg={notificationMessage.msg}
        isVisible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
    </div>
  );
};

export default PlaidAccountsPage;