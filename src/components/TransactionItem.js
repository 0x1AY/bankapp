import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, ArrowRightLeft } from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <Plus className="h-4 w-4 text-success-600" />;
      case 'withdrawal':
        return <Minus className="h-4 w-4 text-warning-600" />;
      case 'transfer_in':
        return <ArrowDownLeft className="h-4 w-4 text-success-600" />;
      case 'transfer_out':
        return <ArrowUpRight className="h-4 w-4 text-warning-600" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return 'text-success-600';
      case 'withdrawal':
      case 'transfer_out':
        return 'text-warning-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer_in':
        return 'Transfer In';
      case 'transfer_out':
        return 'Transfer Out';
      default:
        return type;
    }
  };

  return (
    <div className="card hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-2 rounded-lg">
            {getTransactionIcon(transaction.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                {getTransactionTypeLabel(transaction.type)}
              </h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                #{transaction.id}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {transaction.description || 'No description'}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>Account #{transaction.accountId}</span>
              <span>•</span>
              <span className="text-xs">{formatDate(transaction.timestamp)}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
            {transaction.type === 'withdrawal' || transaction.type === 'transfer_out' ? '-' : '+'}
            {formatAmount(transaction.amount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Balance: {formatAmount(transaction.balanceAfter)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem; 