import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, Plus, DollarSign } from 'lucide-react';
import { bankAPI } from '../services/api';
import AccountCard from './AccountCard';
import Modal from './Modal';

const AccountsPage = ({ onViewAccountDetails, onTransferFromAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountType: 'checking',
    initialBalance: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await bankAPI.getAccounts();
      setAccounts(accountsData);
    } catch (error) {
      setError('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getFilteredAndSortedAccounts = () => {
    let filtered = accounts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber.includes(searchTerm)
      );
    }

    // Filter by account type
    if (filterType !== 'all') {
      filtered = filtered.filter(account => account.accountType === filterType);
    }

    // Sort accounts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.accountHolder.localeCompare(b.accountHolder);
        case 'balance':
          return b.balance - a.balance;
        case 'type':
          return a.accountType.localeCompare(b.accountType);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAccounts = getFilteredAndSortedAccounts();
  const totalBalance = calculateTotalBalance();
  const activeAccounts = accounts.filter(account => account.status === 'active').length;

  const handleOpenModal = () => {
    setFormError('');
    setFormSuccess('');
    setFormData({ accountHolder: '', accountType: 'checking', initialBalance: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!formLoading) {
      setIsModalOpen(false);
      setFormError('');
      setFormSuccess('');
      setFormData({ accountHolder: '', accountType: 'checking', initialBalance: '' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    // Validate form data
    if (!formData.accountHolder.trim()) {
      setFormError('Account holder name is required');
      setFormLoading(false);
      return;
    }

    if (!formData.accountType) {
      setFormError('Account type is required');
      setFormLoading(false);
      return;
    }

    const balance = parseFloat(formData.initialBalance);
    if (isNaN(balance) || balance < 0) {
      setFormError('Initial balance must be a valid non-negative number');
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        accountHolder: formData.accountHolder.trim(),
        accountType: formData.accountType,
        balance: balance,
        teamId: 'demo-team'  // Add team ID to the payload
      };

      console.log('Creating account with payload:', payload);
      await bankAPI.createAccount(payload);
      await fetchAccounts(); // Refresh the accounts list
      setFormSuccess('Account created successfully!');
      
      // Only close the modal and reset form after success
      setTimeout(() => {
        setFormData({ accountHolder: '', accountType: 'checking', initialBalance: '' });
        setFormSuccess('');
        setIsModalOpen(false);
      }, 2000); // Give user more time to see success message
    } catch (error) {
      console.error('Failed to create account:', error);
      setFormError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setFormLoading(false);
    }
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
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchAccounts}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-2">Manage and view all your bank accounts</p>
        </div>
        <button className="btn-primary flex items-center space-x-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          <span>New Account</span>
        </button>
      </div>

      {/* Modal for New Account */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <form className="space-y-4 p-4 w-full max-w-md" onSubmit={handleFormSubmit}>
            <h2 className="text-xl font-bold mb-4">Add New Account</h2>
            
            {formError && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md mb-4">
                {formError}
              </div>
            )}
            
            {formSuccess && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md mb-4">
                {formSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleFormChange}
                  disabled={formLoading}
                  required
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleFormChange}
                  disabled={formLoading}
                  required
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    min="0"
                    step="0.01"
                    className="input-field w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={formLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {formLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-success-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="balance">Balance</option>
              <option value="type">Type</option>
              <option value="date">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(account => (
            <AccountCard 
              key={account.id} 
              account={account}
              onViewDetails={onViewAccountDetails}
              onTransfer={onTransferFromAccount}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No accounts found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'No accounts available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage; 