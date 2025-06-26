import axios from 'axios';

const API_BASE_URL = 'https://cursorworkshopserver.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    teamId: 'demo-team'
  }
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  // Ensure teamId is in query params for all requests
  request.params = {
    ...request.params,
    teamId: 'demo-team'
  };
  
  console.log('Starting API Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    params: request.params,
    data: request.data
  });
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data?.slice?.(0, 2) || response.data // Log only first 2 items if array
    });
    return response;
  },
  error => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      params: error.config?.params
    });
    throw error;
  }
);

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
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('API: Invalid accounts data format:', response.data);
        throw new Error('Invalid response format from server');
      }

      const accounts = response.data;
      console.log('API: Raw accounts data:', accounts.slice(0, 2));
      
      // Transform accounts to match expected format
      const transformedAccounts = accounts.map(account => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountHolder: account.accountHolder,
        balance: parseFloat(account.balance) || 0,
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
      
      console.log('API: Transformed accounts:', transformedAccounts.slice(0, 2));
      return transformedAccounts;
    } catch (error) {
      console.error('Get Accounts Error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch accounts';
      throw new Error(errorMessage);
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
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('API: Invalid transactions data format:', response.data);
        throw new Error('Invalid response format from server');
      }

      const transactions = response.data;
      console.log('API: Raw transactions data:', transactions.slice(0, 2));
      
      // Transform transactions to match expected format
      const transformedTransactions = transactions.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type,
        amount: parseFloat(transaction.amount) || 0,
        description: transaction.description || '',
        timestamp: transaction.timestamp,
        balanceAfter: parseFloat(transaction.balanceAfter) || 0,
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
      
      console.log('API: Transformed transactions:', transformedTransactions.slice(0, 2));
      return transformedTransactions;
    } catch (error) {
      console.error('Get Transactions Error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch transactions';
      throw new Error(errorMessage);
    }
  },

  // Transfer money
  transferMoney: async (transferData) => {
    try {
      const response = await api.post('/api/transfer', transferData);
      return response.data;
    } catch (error) {
      console.error('Transfer Error:', error);
      throw new Error(error.response?.data?.error || 'Transfer failed. Please try again.');
    }
  },

  // Freeze account
  freezeAccount: async (accountId) => {
    try {
      const response = await api.post(`/api/accounts/${accountId}/freeze`);
      return response.data;
    } catch (error) {
      console.error('Freeze Account Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to freeze account');
    }
  },

  // Unfreeze account
  unfreezeAccount: async (accountId) => {
    try {
      const response = await api.post(`/api/accounts/${accountId}/unfreeze`);
      return response.data;
    } catch (error) {
      console.error('Unfreeze Account Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to unfreeze account');
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
      console.log('Creating account:', accountData);
      // Make sure teamId is included in both query params and request body
      const response = await api.post('/api/accounts', {
        ...accountData,
        teamId: 'demo-team'
      }, {
        params: {
          teamId: 'demo-team'
        }
      });
      console.log('Account created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create Account Error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create account';
      throw new Error(errorMessage);
    }
  }
};

export default api; 