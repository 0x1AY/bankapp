import axios from 'axios';

const API_BASE_URL = 'https://cursorworkshopserver.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper function to get account display name
const getAccountDisplayName = (account) => {
  return `${account.accountHolder} (${account.accountNumber}) - ${formatCurrency(account.balance)}`;
};

// API service functions
export const bankAPI = {
  // Get API information
  getAPIInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('API Info Error:', error);
      throw new Error('Failed to fetch API information');
    }
  },

  // Get all accounts with proper formatting
  getAccounts: async () => {
    try {
      console.log('API: Fetching accounts...');
      const response = await api.get('/api/accounts');
      const accounts = response.data;
      console.log('API: Raw accounts data:', accounts.slice(0, 3));
      
      // Transform accounts to match expected format
      const transformedAccounts = accounts.map(account => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountHolder: account.accountHolder,
        balance: account.balance || 0,
        accountType: account.accountType,
        status: account.status,
        createdAt: account.createdAt,
        freezeReason: account.freezeReason,
        frozenAt: account.frozenAt,
        unfrozenAt: account.unfrozenAt,
        // Add formatted fields for display
        formattedBalance: formatCurrency(account.balance || 0),
        formattedCreatedAt: formatDate(account.createdAt),
        displayName: getAccountDisplayName(account),
        isActive: account.status === 'active',
        isFrozen: account.status === 'frozen'
      }));
      
      console.log('API: Transformed accounts:', transformedAccounts.slice(0, 3));
      return transformedAccounts;
    } catch (error) {
      console.error('Get Accounts Error:', error);
      throw new Error('Failed to fetch accounts');
    }
  },

  // Get account balance
  getAccountBalance: async (accountId) => {
    try {
      const response = await api.get(`/api/accounts/${accountId}/balance`);
      return response.data;
    } catch (error) {
      console.error('Get Balance Error:', error);
      throw new Error('Failed to fetch account balance');
    }
  },

  // Get all transactions with proper formatting
  getTransactions: async () => {
    try {
      console.log('API: Fetching transactions...');
      const response = await api.get('/api/transactions');
      const transactions = response.data;
      console.log('API: Raw transactions data:', transactions.slice(0, 3));
      
      // Transform transactions to match expected format
      const transformedTransactions = transactions.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type,
        amount: transaction.amount || 0,
        description: transaction.description || '',
        timestamp: transaction.timestamp,
        balanceAfter: transaction.balanceAfter || 0,
        // Add formatted fields for display
        formattedAmount: formatCurrency(transaction.amount || 0),
        formattedTimestamp: formatDate(transaction.timestamp),
        formattedBalanceAfter: formatCurrency(transaction.balanceAfter || 0),
        // Add transaction type display
        typeDisplay: transaction.type === 'deposit' ? 'Deposit' : 
                    transaction.type === 'withdrawal' ? 'Withdrawal' :
                    transaction.type === 'transfer_in' ? 'Transfer In' :
                    transaction.type === 'transfer_out' ? 'Transfer Out' : 'Transaction'
      }));
      
      console.log('API: Transformed transactions:', transformedTransactions.slice(0, 3));
      return transformedTransactions;
    } catch (error) {
      console.error('Get Transactions Error:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  // Transfer money
  transferMoney: async (transferData) => {
    try {
      const response = await api.post('/api/transfer', transferData);
      return response.data;
    } catch (error) {
      console.error('Transfer Error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Transfer failed. Please try again.');
    }
  },

  // Freeze account
  freezeAccount: async (accountId) => {
    try {
      const response = await api.post(`/api/accounts/${accountId}/freeze`);
      return response.data;
    } catch (error) {
      console.error('Freeze Account Error:', error);
      throw new Error('Failed to freeze account');
    }
  },

  // Unfreeze account
  unfreezeAccount: async (accountId) => {
    try {
      const response = await api.post(`/api/accounts/${accountId}/unfreeze`);
      return response.data;
    } catch (error) {
      console.error('Unfreeze Account Error:', error);
      throw new Error('Failed to unfreeze account');
    }
  },

  // Get account interest
  getAccountInterest: async (accountId) => {
    try {
      const response = await api.get(`/api/accounts/${accountId}/interest`);
      return response.data;
    } catch (error) {
      console.error('Get Interest Error:', error);
      throw new Error('Failed to fetch account interest');
    }
  },

  // Get account statement
  getAccountStatement: async (accountId) => {
    try {
      const response = await api.get(`/api/accounts/${accountId}/statement`);
      return response.data;
    } catch (error) {
      console.error('Get Statement Error:', error);
      throw new Error('Failed to fetch account statement');
    }
  },

  // Get transactions for a specific account
  getAccountTransactions: async (accountId) => {
    try {
      const response = await api.get('/api/transactions');
      const allTransactions = response.data;
      
      // Filter transactions for the specific account
      const accountTransactions = allTransactions.filter(
        transaction => transaction.accountId === parseInt(accountId)
      );
      
      // Transform and return
      return accountTransactions.map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount || 0,
        description: transaction.description || '',
        timestamp: transaction.timestamp,
        balanceAfter: transaction.balanceAfter || 0,
        formattedAmount: formatCurrency(transaction.amount || 0),
        formattedTimestamp: formatDate(transaction.timestamp),
        formattedBalanceAfter: formatCurrency(transaction.balanceAfter || 0),
        typeDisplay: transaction.type === 'deposit' ? 'Deposit' : 
                    transaction.type === 'withdrawal' ? 'Withdrawal' :
                    transaction.type === 'transfer_in' ? 'Transfer In' :
                    transaction.type === 'transfer_out' ? 'Transfer Out' : 'Transaction'
      }));
    } catch (error) {
      console.error('Get Account Transactions Error:', error);
      throw new Error('Failed to fetch account transactions');
    }
  },

  // Create a new account
  createAccount: async (accountData) => {
    try {
      const response = await api.post('/api/accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Create Account Error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to create account');
    }
  }
};

export default api; 