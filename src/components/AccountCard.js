import React from 'react';
import { CreditCard, DollarSign, Calendar, User } from 'lucide-react';

const AccountCard = ({ account, onViewDetails, onTransfer }) => {
  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(balance);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAccountTypeColor = (type) => {
    return type === 'savings' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800';
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.accountHolder}</h3>
            <p className="text-sm text-gray-500">Account #{account.accountNumber}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
            {account.accountType}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
            {account.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Balance</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            {formatBalance(account.balance)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Account ID</span>
          </div>
          <span className="text-sm font-medium text-gray-900">#{account.id}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Created</span>
          </div>
          <span className="text-sm text-gray-900">
            {formatDate(account.createdAt)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button 
            onClick={() => onViewDetails && onViewDetails(account)}
            className="flex-1 btn-primary text-sm"
          >
            View Details
          </button>
          <button 
            onClick={() => onTransfer && onTransfer(account)}
            className="flex-1 btn-secondary text-sm"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard; 