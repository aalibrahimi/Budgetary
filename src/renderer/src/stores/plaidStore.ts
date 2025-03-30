// src/renderer/src/stores/plaidStore.ts
import { create } from 'zustand';
import { PlaidItem, PlaidBankAccount, PlaidTransaction } from './plaid';
import { plaidService } from './plaidService';


interface PlaidState {
  items: PlaidItem[];
  accounts: Record<string, PlaidBankAccount[]>; // Keyed by itemId
  transactions: Record<string, PlaidTransaction[]>; // Keyed by accountId
  selectedItemId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  fetchAccounts: (itemId: string) => Promise<void>;
  fetchAllAccounts: () => Promise<void>;
  fetchTransactions: (itemId: string, startDate: string, endDate: string) => Promise<void>;
  updateAccountBalances: (itemId: string) => Promise<void>;
  syncTransactions: (itemId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  setSelectedItem: (itemId: string | null) => void;
  clearError: () => void;
  
  // Derived data
  getItemById: (itemId: string) => PlaidItem | undefined;
  getAccountsForItem: (itemId: string) => PlaidBankAccount[];
  getTransactionsForAccount: (accountId: string) => PlaidTransaction[];
  getTotalBalanceForItem: (itemId: string) => number;
  getAllAccounts: () => PlaidBankAccount[];
}

export const usePlaidStore = create<PlaidState>((set, get) => ({
  items: [],
  accounts: {},
  transactions: {},
  selectedItemId: null,
  isLoading: false,
  error: null,
  
  // Fetch all Plaid items
  fetchItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const items = await plaidService.getPlaidItems();
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Error fetching Plaid items:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch Plaid items', 
        isLoading: false 
      });
    }
  },
  
  // Fetch accounts for a specific item
  fetchAccounts: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      const accounts = await plaidService.getPlaidAccounts(itemId);
      set(state => ({
        accounts: {
          ...state.accounts,
          [itemId]: accounts
        },
        isLoading: false
      }));
    } catch (error) {
      console.error(`Error fetching accounts for item ${itemId}:`, error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch accounts', 
        isLoading: false 
      });
    }
  },
  
  // Fetch accounts for all items
  fetchAllAccounts: async () => {
    try {
      set({ isLoading: true, error: null });
      const { items } = get();
      const accountsMap: Record<string, PlaidBankAccount[]> = {};
      
      for (const item of items) {
        const accounts = await plaidService.getPlaidAccounts(item.id);
        accountsMap[item.id] = accounts;
      }
      
      set({ accounts: accountsMap, isLoading: false });
    } catch (error) {
      console.error('Error fetching all accounts:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch all accounts', 
        isLoading: false 
      });
    }
  },
  
  // Fetch transactions for a specific time period
  fetchTransactions: async (itemId: string, startDate: string, endDate: string) => {
    try {
      set({ isLoading: true, error: null });
      const transactions = await plaidService.getTransactions(itemId, startDate, endDate);
      
      // Group transactions by accountId
      const transactionsByAccount: Record<string, PlaidTransaction[]> = {};
      transactions.forEach(transaction => {
        if (!transactionsByAccount[transaction.accountId]) {
          transactionsByAccount[transaction.accountId] = [];
        }
        transactionsByAccount[transaction.accountId].push(transaction);
      });
      
      set(state => ({
        transactions: {
          ...state.transactions,
          ...transactionsByAccount
        },
        isLoading: false
      }));
    } catch (error) {
      console.error(`Error fetching transactions for item ${itemId}:`, error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch transactions', 
        isLoading: false 
      });
    }
  },
  
  // Update account balances
  updateAccountBalances: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      const accounts = await plaidService.updateAccountBalances(itemId);
      set(state => ({
        accounts: {
          ...state.accounts,
          [itemId]: accounts
        },
        isLoading: false
      }));
    } catch (error) {
      console.error(`Error updating account balances for item ${itemId}:`, error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update account balances', 
        isLoading: false 
      });
    }
  },
  
  // Sync transactions
  syncTransactions: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      const transactions = await plaidService.syncTransactions(itemId);
      
      // Group transactions by accountId
      const transactionsByAccount: Record<string, PlaidTransaction[]> = { ...get().transactions };
      
      transactions.forEach(transaction => {
        if (!transactionsByAccount[transaction.accountId]) {
          transactionsByAccount[transaction.accountId] = [];
        }
        
        // Remove existing transaction with the same ID
        transactionsByAccount[transaction.accountId] = transactionsByAccount[transaction.accountId]
          .filter(tx => tx.id !== transaction.id);
        
        // Add the new/updated transaction
        transactionsByAccount[transaction.accountId].push(transaction);
      });
      
      set({
        transactions: transactionsByAccount,
        isLoading: false
      });
    } catch (error) {
      console.error(`Error syncing transactions for item ${itemId}:`, error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sync transactions', 
        isLoading: false 
      });
    }
  },
  
  // Remove a Plaid item
  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      await plaidService.removePlaidItem(itemId);
      
      // Update local state
      set(state => {
        // Remove the item
        const updatedItems = state.items.filter(item => item.id !== itemId);
        
        // Remove accounts for this item
        const { [itemId]: _, ...remainingAccounts } = state.accounts;
        
        // Remove transactions for accounts belonging to this item
        const accountIds = state.accounts[itemId]?.map(account => account.id) || [];
        const updatedTransactions = { ...state.transactions };
        accountIds.forEach(accountId => {
          delete updatedTransactions[accountId];
        });
        
        return {
          items: updatedItems,
          accounts: remainingAccounts,
          transactions: updatedTransactions,
          selectedItemId: state.selectedItemId === itemId ? null : state.selectedItemId,
          isLoading: false
        };
      });
    } catch (error) {
      console.error(`Error removing item ${itemId}:`, error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove item', 
        isLoading: false 
      });
    }
  },
  
  // Set the selected item
  setSelectedItem: (itemId: string | null) => {
    set({ selectedItemId: itemId });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
  
  // Derived data selectors
  getItemById: (itemId: string) => {
    return get().items.find(item => item.id === itemId);
  },
  
  getAccountsForItem: (itemId: string) => {
    return get().accounts[itemId] || [];
  },
  
  getTransactionsForAccount: (accountId: string) => {
    return get().transactions[accountId] || [];
  },
  
  getTotalBalanceForItem: (itemId: string) => {
    const accounts = get().accounts[itemId] || [];
    return accounts.reduce((total, account) => {
      // Only include depository accounts in the total balance
      if (account.type === 'depository') {
        return total + (account.balance.available || account.balance.current || 0);
      }
      return total;
    }, 0);
  },
  
  getAllAccounts: () => {
    const { accounts } = get();
    return Object.values(accounts).flat();
  }
}));