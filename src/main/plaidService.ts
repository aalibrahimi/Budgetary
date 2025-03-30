// src/main/plaidService.ts
import { ipcMain } from 'electron';
import axios from 'axios';
import keytar from 'keytar';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

// Config for storing Plaid credentials securely
const SERVICE_NAME = 'BudgetaryPlaidAccess';
const PLAID_USER_ACCOUNT = 'plaid_user';
const PLAID_API_HOST = process.env.PLAID_API_HOST || 'https://sandbox.plaid.com';

// Config that would come from environment variables in a real app
// In production, these would be stored in a secure environment variable service
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || '';
const PLAID_SECRET = process.env.PLAID_SECRET || '';
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

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
    const data = fs.readFileSync(itemsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading Plaid items:', error);
    return [];
  }
};

const loadAccounts = () => {
  try {
    const data = fs.readFileSync(accountsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading Plaid accounts:', error);
    return [];
  }
};

const loadTransactions = () => {
  try {
    const data = fs.readFileSync(transactionsFile, 'utf8');
    return JSON.parse(data);
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

// Store access token securely
const storeAccessToken = async (itemId, accessToken) => {
  try {
    await keytar.setPassword(SERVICE_NAME, `${PLAID_USER_ACCOUNT}_${itemId}`, accessToken);
    return true;
  } catch (error) {
    console.error('Error storing access token:', error);
    throw error;
  }
};

// Retrieve access token securely
const getAccessToken = async (itemId) => {
  try {
    return await keytar.getPassword(SERVICE_NAME, `${PLAID_USER_ACCOUNT}_${itemId}`);
  } catch (error) {
    console.error('Error retrieving access token:', error);
    throw error;
  }
};

// Remove access token securely
const removeAccessToken = async (itemId) => {
  try {
    return await keytar.deletePassword(SERVICE_NAME, `${PLAID_USER_ACCOUNT}_${itemId}`);
  } catch (error) {
    console.error('Error removing access token:', error);
    throw error;
  }
};

// Initialize Plaid API handlers
const initPlaidService = () => {
  // Create a Plaid Link token
  ipcMain.handle('plaid-create-link-token', async () => {
    try {
      const response = await axios.post(`${PLAID_API_HOST}/link/token/create`, {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        user: {
          client_user_id: PLAID_USER_ACCOUNT,
        },
        client_name: 'Budgetary App',
        products: ['transactions', 'auth'],
        country_codes: ['US'],
        language: 'en',
      });

      return response.data;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  });

  // Exchange public token for an access token
  ipcMain.handle('plaid-exchange-public-token', async (event, publicToken, institutionId, institutionName) => {
    try {
      // 1. Exchange the public token for an access token
      const response = await axios.post(`${PLAID_API_HOST}/item/public_token/exchange`, {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        public_token: publicToken,
      });

      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // 2. Store the access token securely
      await storeAccessToken(itemId, accessToken);

      // 3. Create a local record of the item
      const items = loadItems();
      const newItem = {
        id: itemId,
        institutionId,
        institutionName,
        lastUpdated: new Date().toISOString(),
        status: 'good',
      };
      
      // 4. Save the item to local storage
      items.push(newItem);
      saveItems(items);

      // 5. Get the accounts for this item
      await fetchAndStoreAccounts(itemId, accessToken);

      // 6. Return the new item (without the access token)
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
      return accounts.filter(account => account.plaidItemId === itemId);
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  });

  // Fetch transactions for an item
  ipcMain.handle('plaid-get-transactions', async (event, itemId, startDate, endDate) => {
    try {
      const accessToken = await getAccessToken(itemId);
      if (!accessToken) {
        throw new Error('Access token not found for this item');
      }

      const response = await axios.post(`${PLAID_API_HOST}/transactions/get`, {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });

      // Process and store the transactions
      const newTransactions = response.data.transactions.map(tx => ({
        id: tx.transaction_id,
        accountId: tx.account_id,
        amount: tx.amount,
        date: tx.date,
        name: tx.name,
        merchantName: tx.merchant_name,
        category: tx.category || [],
        categoryId: tx.category_id,
        pending: tx.pending,
        paymentChannel: tx.payment_channel,
        authorizedDate: tx.authorized_date,
        location: {
          address: tx.location.address,
          city: tx.location.city,
          region: tx.location.region,
          postalCode: tx.location.postal_code,
          country: tx.location.country,
          lat: tx.location.lat,
          lon: tx.location.lon,
        },
        isoCurrencyCode: tx.iso_currency_code,
      }));

      // Store these transactions
      const allTransactions = loadTransactions();
      
      // Add new transactions, avoiding duplicates
      const existingIds = new Set(allTransactions.map(tx => tx.id));
      const transactionsToAdd = newTransactions.filter(tx => !existingIds.has(tx.id));
      
      if (transactionsToAdd.length > 0) {
        allTransactions.push(...transactionsToAdd);
        saveTransactions(allTransactions);
      }

      // Return the transactions for the requested time period
      return newTransactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  });

  // Update account balances
  ipcMain.handle('plaid-update-balances', async (event, itemId) => {
    try {
      const accessToken = await getAccessToken(itemId);
      if (!accessToken) {
        throw new Error('Access token not found for this item');
      }

      // Fetch the latest account data
      await fetchAndStoreAccounts(itemId, accessToken);
      
      // Return the updated accounts
      const accounts = loadAccounts();
      return accounts.filter(account => account.plaidItemId === itemId);
    } catch (error) {
      console.error('Error updating balances:', error);
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

  // Remove a Plaid item
  ipcMain.handle('plaid-remove-item', async (event, itemId) => {
    try {
      const accessToken = await getAccessToken(itemId);
      if (!accessToken) {
        throw new Error('Access token not found for this item');
      }

      // Call Plaid to remove the item
      await axios.post(`${PLAID_API_HOST}/item/remove`, {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: accessToken,
      });

      // Remove the access token from the secure store
      await removeAccessToken(itemId);

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

// Helper to fetch and store accounts for an item
const fetchAndStoreAccounts = async (itemId, accessToken) => {
  try {
    const response = await axios.post(`${PLAID_API_HOST}/accounts/get`, {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      access_token: accessToken,
    });

    // Process the accounts
    const newAccounts = response.data.accounts.map(account => ({
      id: account.account_id,
      plaidItemId: itemId,
      name: account.name,
      mask: account.mask,
      type: account.type,
      subtype: account.subtype,
      verificationStatus: 'none', // Default value
      balance: {
        available: account.balances.available,
        current: account.balances.current,
        limit: account.balances.limit,
        isoCurrencyCode: account.balances.iso_currency_code,
        unofficialCurrencyCode: account.balances.unofficial_currency_code,
      },
      lastUpdated: new Date().toISOString(),
    }));

    // Store these accounts, replacing any existing ones for this item
    const allAccounts = loadAccounts();
    const otherAccounts = allAccounts.filter(account => account.plaidItemId !== itemId);
    saveAccounts([...otherAccounts, ...newAccounts]);

    return newAccounts;
  } catch (error) {
    console.error('Error fetching and storing accounts:', error);
    throw error;
  }
};

export { initPlaidService };