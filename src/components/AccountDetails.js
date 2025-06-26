import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  ArrowLeft, 
  Download,
  Lock,
  Unlock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { bankAPI } from '../services/api';
import TransactionItem from './TransactionItem';

const AccountDetails = ({ account, onBack, onTransferClick }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountBalance, setAccountBalance] = useState(account.balance);

  useEffect(() => {
    fetchAccountData();
  }, [account.id]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const [transactionsData, balanceData] = await Promise.all([
        bankAPI.getTransactions(),
        bankAPI.getAccountBalance(account.id)
      ]);
      
      // Filter transactions for this specific account
      const accountTransactions = transactionsData.filter(
        transaction => transaction.accountId === account.id
      );
      
      setTransactions(accountTransactions);
      setAccountBalance(balanceData.balance);
    } catch (error) {
      setError('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(balance);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAccountTypeColor = (type) => {
    return type === 'savings' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800';
  };

  const handleFreezeAccount = async () => {
    try {
      await bankAPI.freezeAccount(account.id);
      // Refresh account data
      fetchAccountData();
    } catch (error) {
      setError('Failed to freeze account');
    }
  };

  const handleUnfreezeAccount = async () => {
    try {
      await bankAPI.unfreezeAccount(account.id);
      // Refresh account data
      fetchAccountData();
    } catch (error) {
      setError('Failed to unfreeze account');
    }
  };

  const handleGetStatement = async () => {
    try {
      const statement = await bankAPI.getAccountStatement(account.id);
      // In a real app, you might want to download this as a PDF
      console.log('Account Statement:', statement);
      alert('Statement downloaded (check console for demo)');
    } catch (error) {
      setError('Failed to generate statement');
    }
  };

  const handleGetInterest = async () => {
    try {
      const interest = await bankAPI.getAccountInterest(account.id);
      alert(`Interest calculation: ${JSON.stringify(interest)}`);
    } catch (error) {
      setError('Failed to calculate interest');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <CreditCard className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{account.accountHolder}</h1>
              <p className="text-gray-600">Account #{account.accountNumber}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccountTypeColor(account.accountType)}`}>
              {account.accountType}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(account.status)}`}>
              {account.status}
            </span>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="bg-primary-50 p-3 rounded-lg mb-2">
              <DollarSign className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-xl font-bold text-gray-900">{formatBalance(accountBalance)}</p>
          </div>

          <div className="text-center">
            <div className="bg-gray-50 p-3 rounded-lg mb-2">
              <User className="h-6 w-6 text-gray-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">Account ID</p>
            <p className="text-xl font-bold text-gray-900">#{account.id}</p>
          </div>

          <div className="text-center">
            <div className="bg-green-50 p-3 rounded-lg mb-2">
              <Calendar className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(account.createdAt)}</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 p-3 rounded-lg mb-2">
              <Activity className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={() => onTransferClick(account)}
            className="btn-primary flex items-center space-x-2"
          >
            <DollarSign className="h-4 w-4" />
            <span>Transfer Money</span>
          </button>

          {account.status === 'active' ? (
            <button
              onClick={handleFreezeAccount}
              className="btn-secondary flex items-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>Freeze Account</span>
            </button>
          ) : (
            <button
              onClick={handleUnfreezeAccount}
              className="btn-secondary flex items-center space-x-2"
            >
              <Unlock className="h-4 w-4" />
              <span>Unfreeze Account</span>
            </button>
          )}

          <button
            onClick={handleGetStatement}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Statement</span>
          </button>

          <button
            onClick={handleGetInterest}
            className="btn-secondary flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Calculate Interest</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          <span className="text-sm text-gray-500">{transactions.length} transactions</span>
        </div>

        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions found for this account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails; 