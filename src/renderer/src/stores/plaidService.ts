// src/main/plaidService.ts
import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

// Local storage for items and accounts
const userDataPath = app.getPath('userData');
const plaidDataDir = path.join(userDataPath, 'plaidData');
const itemsFile = path.join(plaidDataDir, 'items.json');
const accountsFile = path.join(plaidDataDir, 'accounts.json');
const transactionsFile = path.join(plaidDataDir, 'transactions.json');

// Ensure the plaid data directory exists
if (!fs.existsSync(plaidDataDir)) {
  fs.mkdirSync(plaidDataDir, { recursive: true });
}

// Initialize empty data files if they don't exist
if (!fs.existsSync(itemsFile)) {
  fs.writeFileSync(itemsFile, JSON.stringify([]));
}
if (!fs.existsSync(accountsFile)) {
  fs.writeFileSync(accountsFile, JSON.stringify([]));
}
if (!fs.existsSync(transactionsFile)) {
  fs.writeFileSync(transactionsFile, JSON.stringify([]));
}

// Load data from local storage
const loadItems = () => {
  try {
    if (fs.existsSync(itemsFile)) {
      const data = fs.readFileSync(itemsFile, 'utf8');
      if (data.trim() === '') return [];
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading Plaid items:', error);
    return [];
  }
};

const loadAccounts = () => {
  try {
    if (fs.existsSync(accountsFile)) {
      const data = fs.readFileSync(accountsFile, 'utf8');
      if (data.trim() === '') return [];
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading Plaid accounts:', error);
    return [];
  }
};

const loadTransactions = () => {
  try {
    if (fs.existsSync(transactionsFile)) {
      const data = fs.readFileSync(transactionsFile, 'utf8');
      if (data.trim() === '') return [];
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading Plaid transactions:', error);
    return [];
  }
};

// Save data to local storage
const saveItems = (items) => {
  try {
    fs.writeFileSync(itemsFile, JSON.stringify(items, null, 2));
  } catch (error) {
    console.error('Error saving Plaid items:', error);
  }
};

const saveAccounts = (accounts) => {
  try {
    fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
  } catch (error) {
    console.error('Error saving Plaid accounts:', error);
  }
};

const saveTransactions = (transactions) => {
  try {
    fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error saving Plaid transactions:', error);
  }
};

// Mock data for testing
interface PlaidAccount {
  id: string;
  plaidItemId: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  verificationStatus: string;
  balance: {
    available: number | null;
    current: number;
    limit: number | null;
    isoCurrencyCode: string;
    unofficialCurrencyCode: null;
  };
  lastUpdated: string;
}

const createMockAccounts = (itemId: string) => {
  const now = new Date().toISOString();
  
  // Generate a random number of accounts (2-4)
  const numAccounts = Math.floor(Math.random() * 3) + 2;
  const accounts: PlaidAccount[] = [];
  
  // Add a checking account
  accounts.push({
    id: `acc_${uuidv4()}`,
    plaidItemId: itemId,
    name: 'Checking Account',
    mask: `${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'depository',
    subtype: 'checking',
    verificationStatus: 'none',
    balance: {
      available: 2250.45 + (Math.random() * 1000 - 500),
      current: 2340.20 + (Math.random() * 1000 - 500),
      limit: null,
      isoCurrencyCode: 'USD',
      unofficialCurrencyCode: null,
    },
    lastUpdated: now,
  });
  
  // Add a savings account
  accounts.push({
    id: `acc_${uuidv4()}`,
    plaidItemId: itemId,
    name: 'Savings Account',
    mask: `${Math.floor(1000 + Math.random() * 9000)}`,
    type: 'depository',
    subtype: 'savings',
    verificationStatus: 'none',
    balance: {
      available: 15750.22 + (Math.random() * 5000 - 2500),
      current: 15750.22 + (Math.random() * 5000 - 2500),
      limit: null,
      isoCurrencyCode: 'USD',
      unofficialCurrencyCode: null,
    },
    lastUpdated: now,
  });
  
  // Maybe add a credit card
  if (numAccounts > 2) {
    accounts.push({
      id: `acc_${uuidv4()}`,
      plaidItemId: itemId,
      name: 'Credit Card',
      mask: `${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'credit',
      subtype: 'credit card',
      verificationStatus: 'none',
      balance: {
        available: null,
        current: 340.12 + (Math.random() * 200 - 100),
        limit: 5000 + (Math.random() * 2000),
        isoCurrencyCode: 'USD',
        unofficialCurrencyCode: null,
      },
      lastUpdated: now,
    });
  }
  
  // Maybe add an investment account
  if (numAccounts > 3) {
    accounts.push({
      id: `acc_${uuidv4()}`,
      plaidItemId: itemId,
      name: 'Investment Account',
      mask: `${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'investment',
      subtype: 'brokerage',
      verificationStatus: 'none',
      balance: {
        available: null,
        current: 35000.00 + (Math.random() * 15000 - 7500),
        limit: null,
        isoCurrencyCode: 'USD',
        unofficialCurrencyCode: null,
      },
      lastUpdated: now,
    });
  }
  
  return accounts;
};

// Initialize Plaid API handlers
const plaidService = () => {
  // Create a Plaid Link token (mock implementation)
  ipcMain.handle('plaid-create-link-token', async () => {
    try {
      // Return a mock token
      return {
        expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        link_token: `link-sandbox-${uuidv4()}`,
        request_id: `request-${uuidv4()}`,
      };
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  });

  // Exchange public token for an access token (mock implementation)
  ipcMain.handle('plaid-exchange-public-token', async (event, publicToken, institutionId, institutionName) => {
    try {
      // Create a mock item id
      const itemId = `item-${uuidv4()}`;
      
      // Create a mock item
      const items = loadItems();
      const newItem = {
        id: itemId,
        institutionId,
        institutionName,
        lastUpdated: new Date().toISOString(),
        status: 'good',
      };
      
      // Save the item to local storage
      items.push(newItem);
      saveItems(items);

      // Create mock accounts for this item
      const mockAccounts = createMockAccounts(itemId);
      
      // Save the accounts
      const allAccounts = loadAccounts();
      saveAccounts([...allAccounts, ...mockAccounts]);

      // Return the new item
      return newItem;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  });

  // Fetch accounts for an item
  ipcMain.handle('plaid-get-accounts', async (event, itemId) => {
    try {
      const accounts = loadAccounts();
      const filteredAccounts = accounts.filter(account => account.plaidItemId === itemId);
      
      // If no accounts, create some mock ones
      if (filteredAccounts.length === 0) {
        const mockAccounts = createMockAccounts(itemId);
        const allAccounts = loadAccounts();
        saveAccounts([...allAccounts, ...mockAccounts]);
        return mockAccounts;
      }
      
      return filteredAccounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  });

  // Get all Plaid items
  ipcMain.handle('plaid-get-items', async () => {
    try {
      return loadItems();
    } catch (error) {
      console.error('Error getting items:', error);
      throw error;
    }
  });

  // Update account balances (mock implementation)
  ipcMain.handle('plaid-update-balances', async (event, itemId) => {
    try {
      const accounts = loadAccounts();
      const updatedAccounts = accounts.filter(account => account.plaidItemId === itemId).map(account => {
        // Add small random changes to balances for realistic effect
        const changeAmount = Math.random() * 20 - 10; // Random amount between -10 and 10
        
        // Update balance based on account type
        if (account.type === 'depository') {
          account.balance.available = Math.max(0, (account.balance.available || 0) + changeAmount);
          account.balance.current = Math.max(0, (account.balance.current || 0) + changeAmount);
        } else if (account.type === 'credit') {
          account.balance.current = Math.max(0, (account.balance.current || 0) + changeAmount);
        } else if (account.type === 'investment') {
          // Investments fluctuate more
          const investmentChange = Math.random() * 500 - 250;
          account.balance.current = Math.max(0, (account.balance.current || 0) + investmentChange);
        }
        
        account.lastUpdated = new Date().toISOString();
        return account;
      });
      
      // Save updated accounts
      const otherAccounts = accounts.filter(account => account.plaidItemId !== itemId);
      saveAccounts([...otherAccounts, ...updatedAccounts]);
      
      return updatedAccounts;
    } catch (error) {
      console.error('Error updating balances:', error);
      throw error;
    }
  });

  // Mock get transactions
  ipcMain.handle('plaid-get-transactions', async (event, itemId, startDate, endDate) => {
    try {
      // Return mock transactions
      const accounts = loadAccounts().filter(account => account.plaidItemId === itemId);
      
      interface PlaidTransaction {
        id: string;
        accountId: string;
        amount: number;
        date: string;
        name: string;
        merchantName: string;
        category: string[];
        categoryId: string;
        pending: boolean;
        paymentChannel: string;
        authorizedDate: string;
        location: {
          address: string | null;
          city: string | null;
          region: string | null;
          postalCode: string | null;
          country: string;
          lat: number | null;
          lon: number | null;
        };
        isoCurrencyCode: string;
      }

      const mockTransactions: PlaidTransaction[] = [];
      const now = new Date();
      
      // Create 30 days of mock transactions for each account
      for (const account of accounts) {
        const numTransactions = Math.floor(Math.random() * 10) + 5; // 5-15 transactions per account
        
        for (let i = 0; i < numTransactions; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Random day in the last 30 days
          
          // Only include if within requested date range
          const txDate = date.toISOString().split('T')[0];
          if (txDate >= startDate && txDate <= endDate) {
            // Create a mock transaction
            mockTransactions.push({
              id: `tx-${uuidv4()}`,
              accountId: account.id,
              amount: account.type === 'credit' ? Math.random() * 100 + 5 : -(Math.random() * 100 + 5),
              date: txDate,
              name: getSampleMerchant(),
              merchantName: getSampleMerchant(),
              category: getSampleCategory(),
              categoryId: `cat-${Math.floor(Math.random() * 100)}`,
              pending: Math.random() < 0.1, // 10% are pending
              paymentChannel: Math.random() < 0.7 ? 'online' : 'in store',
              authorizedDate: txDate,
              location: {
                address: null,
                city: null,
                region: null,
                postalCode: null,
                country: 'US',
                lat: null,
                lon: null,
              },
              isoCurrencyCode: 'USD',
            });
          }
        }
      }
      
      // Save these transactions
      const allTransactions = loadTransactions();
      saveTransactions([...allTransactions, ...mockTransactions]);
      
      return mockTransactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  });

  // Mock sync transactions
  ipcMain.handle('plaid-sync-transactions', async (event, itemId) => {
    try {
      // Similar to get transactions but simulates a sync
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      
      // Reuse the get transactions functionality
      return ipcMain.handle['plaid-get-transactions']({}, itemId, startDate, endDate);
    } catch (error) {
      console.error('Error syncing transactions:', error);
      throw error;
    }
  });

  // Remove a Plaid item
  ipcMain.handle('plaid-remove-item', async (event, itemId) => {
    try {
      // Remove the item from our local storage
      const items = loadItems();
      const updatedItems = items.filter(item => item.id !== itemId);
      saveItems(updatedItems);

      // Remove associated accounts
      const accounts = loadAccounts();
      const updatedAccounts = accounts.filter(account => account.plaidItemId !== itemId);
      saveAccounts(updatedAccounts);

      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  });
};

// Helper functions for mock data
function getSampleMerchant() {
  const merchants = [
    'Amazon', 'Walmart', 'Target', 'Starbucks', 'Uber', 'Netflix', 
    'Chipotle', 'Home Depot', 'Spotify', 'Apple', 'Best Buy',
    'Shell', 'Whole Foods', 'CVS Pharmacy', 'Kroger', 'Costco'
  ];
  return merchants[Math.floor(Math.random() * merchants.length)];
}

function getSampleCategory() {
  const categories = [
    ['Food and Drink', 'Restaurants'],
    ['Food and Drink', 'Coffee Shop'],
    ['Shops', 'Groceries'],
    ['Shops', 'Clothing'],
    ['Entertainment', 'Movies'],
    ['Entertainment', 'Music'],
    ['Travel', 'Airlines'],
    ['Travel', 'Hotels'],
    ['Transportation', 'Uber'],
    ['Transportation', 'Public Transit'],
    ['Payment', 'Credit Card']
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

export { plaidService };