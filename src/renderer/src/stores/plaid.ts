// src/renderer/src/types/plaid.ts

// Base Plaid item interface
export interface PlaidItem {
    id: string;
    institutionId: string;
    institutionName: string;
    accessToken: string; // This should never be exposed to the client
    lastUpdated: string;
    status: 'good' | 'item_login_required' | 'error';
    error?: string;
  }
  
  // Plaid account interface
  export interface PlaidBankAccount {
    id: string;
    plaidItemId: string;
    name: string;
    mask: string;
    type: 'depository' | 'credit' | 'loan' | 'investment' | 'other';
    subtype: string;
    verificationStatus: 'pending_automatic_verification' | 'pending_manual_verification' | 'manually_verified' | 'automatically_verified' | 'verification_expired' | 'verification_failed' | 'none';
    balance: {
      available: number | null;
      current: number;
      limit: number | null;
      isoCurrencyCode: string;
      unofficialCurrencyCode: string | null;
    };
    lastUpdated: string;
  }
  
  // Interface for raw Plaid transactions
  export interface PlaidTransaction {
    id: string;
    accountId: string;
    amount: number;
    date: string;
    name: string;
    merchantName: string | null;
    category: string[];
    categoryId: string | null;
    pending: boolean;
    paymentChannel: 'online' | 'in store' | 'other';
    authorizedDate: string | null;
    location: {
      address: string | null;
      city: string | null;
      region: string | null;
      postalCode: string | null;
      country: string | null;
      lat: number | null;
      lon: number | null;
    };
    isoCurrencyCode: string;
  }
  
  // Response interfaces for the Plaid API endpoints
  export interface PlaidLinkTokenResponse {
    expiration: string;
    link_token: string;
    request_id: string;
  }
  
  export interface PlaidItemResponse {
    item: {
      institution_id: string;
      item_id: string;
    };
    status: {
      transactions: {
        last_successful_update: string | null;
        last_failed_update: string | null;
      }
    };
    request_id: string;
  }
  
  export interface PlaidAccountsResponse {
    accounts: {
      account_id: string;
      balances: {
        available: number | null;
        current: number;
        limit: number | null;
        iso_currency_code: string;
        unofficial_currency_code: string | null;
      };
      mask: string;
      name: string;
      official_name: string | null;
      subtype: string;
      type: 'depository' | 'credit' | 'loan' | 'investment' | 'other';
    }[];
    item: {
      available_products: string[];
      billed_products: string[];
      consent_expiration_time: string | null;
      error: null | {
        display_message: string | null;
        error_code: string;
        error_message: string;
        error_type: string;
      };
      institution_id: string;
      item_id: string;
      webhook: string | null;
    };
    request_id: string;
  }
  
  export interface PlaidTransactionsResponse {
    accounts: Array<{
      account_id: string;
      balances: {
        available: number | null;
        current: number;
        limit: number | null;
        iso_currency_code: string;
        unofficial_currency_code: string | null;
      };
      mask: string;
      name: string;
      official_name: string | null;
      subtype: string;
      type: 'depository' | 'credit' | 'loan' | 'investment' | 'other';
    }>;
    item: {
      available_products: string[];
      billed_products: string[];
      consent_expiration_time: string | null;
      error: null | {
        display_message: string | null;
        error_code: string;
        error_message: string;
        error_type: string;
      };
      institution_id: string;
      item_id: string;
      webhook: string | null;
    };
    request_id: string;
    total_transactions: number;
    transactions: Array<{
      account_id: string;
      amount: number;
      iso_currency_code: string;
      unofficial_currency_code: string | null;
      category: string[] | null;
      category_id: string | null;
      date: string;
      authorized_date: string | null;
      location: {
        address: string | null;
        city: string | null;
        country: string | null;
        lat: number | null;
        lon: number | null;
        postal_code: string | null;
        region: string | null;
        store_number: string | null;
      };
      merchant_name: string | null;
      name: string;
      payment_channel: string;
      pending: boolean;
      pending_transaction_id: string | null;
      account_owner: string | null;
      transaction_id: string;
      transaction_type: string | null;
    }>;
  }
  
  export interface PlaidInstitutionResponse {
    institution: {
      institution_id: string;
      name: string;
      products: string[];
      country_codes: string[];
      logo: string | null;
      primary_color: string | null;
      url: string | null;
    };
    request_id: string;
  }