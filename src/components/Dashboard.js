import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Activity, Send } from 'lucide-react';
import { bankAPI } from '../services/api';
import AccountCard from './AccountCard';
import TransactionItem from './TransactionItem';

const Dashboard = ({ onViewAccountDetails, onTransferFromAccount, onTransferFromDashboard }) => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Dashboard: Starting to fetch data...');
      
      // Fetch accounts first to see if it works
      console.log('Dashboard: Fetching accounts...');
      const accountsData = await bankAPI.getAccounts();
      console.log('Dashboard: Accounts fetched successfully:', accountsData);
      
      // Then fetch transactions
      console.log('Dashboard: Fetching transactions...');
      const transactionsData = await bankAPI.getTransactions();
      console.log('Dashboard: Transactions fetched successfully:', transactionsData);
      
      setAccounts(accountsData);
      setTransactions(transactionsData.slice(0, 5)); // Show only recent 5 transactions
    } catch (error) {
      console.error('Dashboard: Data fetch error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">{error}</p>
        <pre className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto overflow-auto">
          {/* Show detailed error info */}
          Check the console for more details (F12)
        </pre>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalBalance = calculateTotalBalance();
  const activeAccounts = accounts.filter(account => account.status === 'active').length;

  console.log('Rendering dashboard with:', { accounts: accounts.length, transactions: transactions.length });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-success-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-warning-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recent Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Accounts</h2>
          <button className="btn-primary">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.length > 0 ? (
            accounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account}
                onViewDetails={onViewAccountDetails}
                onTransfer={onTransferFromAccount}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No accounts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
          <button className="btn-secondary">View All</button>
        </div>
        
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onTransferFromDashboard}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Transfer Money</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Check Balance</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>View Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 