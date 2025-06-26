import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { bankAPI } from '../services/api';

const TransferForm = ({ onTransferComplete, preSelectedAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fromAccountId: preSelectedAccount ? preSelectedAccount.id.toString() : '',
    toAccountId: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (preSelectedAccount) {
      setFormData(prev => ({
        ...prev,
        fromAccountId: preSelectedAccount.id.toString()
      }));
    }
  }, [preSelectedAccount]);

  const fetchAccounts = async () => {
    try {
      const accountsData = await bankAPI.getAccounts();
      setAccounts(accountsData);
    } catch (error) {
      setError('Failed to load accounts');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fromAccountId || !formData.toAccountId || !formData.amount || !formData.description) {
      setError('All fields are required');
      return false;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      setError('Cannot transfer to the same account');
      return false;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    // Check if source account has sufficient balance
    const sourceAccount = accounts.find(acc => acc.id.toString() === formData.fromAccountId);
    if (sourceAccount && amount > sourceAccount.balance) {
      setError('Insufficient balance in source account');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const transferData = {
        fromAccountId: parseInt(formData.fromAccountId),
        toAccountId: parseInt(formData.toAccountId),
        amount: parseFloat(formData.amount),
        description: formData.description
      };

      await bankAPI.transferMoney(transferData);
      
      setSuccess(true);
      setFormData({
        fromAccountId: preSelectedAccount ? preSelectedAccount.id.toString() : '',
        toAccountId: '',
        amount: '',
        description: ''
      });

      if (onTransferComplete) {
        onTransferComplete();
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Send className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Transfer Money</h2>
          <p className="text-sm text-gray-600">
            {preSelectedAccount 
              ? `Transfer from ${preSelectedAccount.accountHolder}'s account`
              : 'Transfer funds between your accounts'
            }
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-success-600" />
          <span className="text-sm text-success-700">Transfer completed successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fromAccountId" className="block text-sm font-medium text-gray-700 mb-2">
            From Account
          </label>
          <select
            id="fromAccountId"
            name="fromAccountId"
            value={formData.fromAccountId}
            onChange={handleInputChange}
            className="input-field"
            required
            disabled={!!preSelectedAccount}
          >
            <option value="">Select source account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="toAccountId" className="block text-sm font-medium text-gray-700 mb-2">
            To Account
          </label>
          <select
            id="toAccountId"
            name="toAccountId"
            value={formData.toAccountId}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select destination account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="input-field"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter transfer description"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Transfer Money</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferForm; 