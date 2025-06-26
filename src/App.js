import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransferForm from './components/TransferForm';
import AccountDetails from './components/AccountDetails';
import AccountsPage from './components/AccountsPage';
import TransactionsPage from './components/TransactionsPage';
import { bankAPI } from './services/api';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [preSelectedAccount, setPreSelectedAccount] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTransferComplete = () => {
    // Trigger a refresh of the dashboard data
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewAccountDetails = (account) => {
    setSelectedAccount(account);
    setCurrentView('account-details');
  };

  const handleTransferFromAccount = (account) => {
    setPreSelectedAccount(account);
    setCurrentView('transfer');
  };

  const handleTransferFromDashboard = () => {
    setPreSelectedAccount(null);
    setCurrentView('transfer');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAccount(null);
    setPreSelectedAccount(null);
  };

  // Navigation functions for header
  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAccount(null);
    setPreSelectedAccount(null);
  };

  const navigateToTransfer = () => {
    setCurrentView('transfer');
    setPreSelectedAccount(null);
  };

  const navigateToAccounts = () => {
    setCurrentView('accounts');
    setSelectedAccount(null);
    setPreSelectedAccount(null);
  };

  const navigateToTransactions = () => {
    setCurrentView('transactions');
    setSelectedAccount(null);
    setPreSelectedAccount(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            key={refreshTrigger} 
            onViewAccountDetails={handleViewAccountDetails}
            onTransferFromAccount={handleTransferFromAccount}
            onTransferFromDashboard={handleTransferFromDashboard}
          />
        );
      case 'transfer':
        return (
          <TransferForm 
            onTransferComplete={handleTransferComplete}
            preSelectedAccount={preSelectedAccount}
          />
        );
      case 'account-details':
        return (
          <AccountDetails 
            account={selectedAccount}
            onBack={handleBackToDashboard}
            onTransferClick={handleTransferFromAccount}
          />
        );
      case 'accounts':
        return (
          <AccountsPage 
            onViewAccountDetails={handleViewAccountDetails}
            onTransferFromAccount={handleTransferFromAccount}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage />
        );
      default:
        return (
          <Dashboard 
            key={refreshTrigger}
            onViewAccountDetails={handleViewAccountDetails}
            onTransferFromAccount={handleTransferFromAccount}
            onTransferFromDashboard={handleTransferFromDashboard}
          />
        );
    }
  };

  const getCurrentViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'transfer':
        return 'Transfer Money';
      case 'account-details':
        return 'Account Details';
      case 'accounts':
        return 'Accounts';
      case 'transactions':
        return 'Transactions';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu}
        currentView={currentView}
        onNavigateToDashboard={navigateToDashboard}
        onNavigateToTransfer={navigateToTransfer}
        onNavigateToAccounts={navigateToAccounts}
        onNavigateToTransactions={navigateToTransactions}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{getCurrentViewTitle()}</h1>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Bank App. This is a demo application for educational purposes.</p>
            <p className="mt-2 text-sm">
              Connected to: <span className="font-mono text-xs">https://cursorworkshopserver.onrender.com</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 