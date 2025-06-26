import React from 'react';
import { Wallet, Menu, X } from 'lucide-react';

const Header = ({ 
  isMenuOpen, 
  toggleMenu, 
  currentView,
  onNavigateToDashboard,
  onNavigateToTransfer,
  onNavigateToAccounts,
  onNavigateToTransactions
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bank App</h1>
              <p className="text-sm text-gray-500">Modern Banking</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={onNavigateToDashboard}
              className={`font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={onNavigateToAccounts}
              className={`font-medium transition-colors ${
                currentView === 'accounts'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Accounts
            </button>
            <button
              onClick={onNavigateToTransactions}
              className={`font-medium transition-colors ${
                currentView === 'transactions'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={onNavigateToTransfer}
              className={`font-medium transition-colors ${
                currentView === 'transfer'
                  ? 'text-primary-600'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Transfer
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onNavigateToDashboard();
                  toggleMenu();
                }}
                className={`text-left font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigateToAccounts();
                  toggleMenu();
                }}
                className={`text-left font-medium transition-colors ${
                  currentView === 'accounts'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Accounts
              </button>
              <button
                onClick={() => {
                  onNavigateToTransactions();
                  toggleMenu();
                }}
                className={`text-left font-medium transition-colors ${
                  currentView === 'transactions'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => {
                  onNavigateToTransfer();
                  toggleMenu();
                }}
                className={`text-left font-medium transition-colors ${
                  currentView === 'transfer'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Transfer
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 