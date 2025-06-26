# Bank Frontend Application

A modern, responsive banking frontend application built with React, Tailwind CSS, and connected to a Bank Backend API.

## Features

- **Dashboard**: Overview of accounts, recent transactions, and quick actions
- **Accounts Management**: View all accounts with search, filtering, and sorting
- **Transaction History**: Complete transaction history with advanced filtering
- **Money Transfer**: Secure transfer between accounts with validation
- **Account Details**: Detailed view of individual accounts with management actions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **HTTP Client**: Axios for API communication
- **Testing**: Cypress for end-to-end testing
- **Styling**: Tailwind CSS with custom configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bank-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Configuration

The application connects to the Bank Backend API at `https://cursorworkshopserver.onrender.com`. The API configuration is in `src/services/api.js`.

## Testing

### End-to-End Testing with Cypress

This project includes comprehensive end-to-end tests using Cypress to ensure all functionality works correctly across different scenarios.

#### Test Structure

- **Dashboard Tests** (`cypress/e2e/dashboard.cy.js`): Tests dashboard functionality, statistics, account cards, and quick actions
- **Accounts Tests** (`cypress/e2e/accounts.cy.js`): Tests accounts page with search, filtering, sorting, and account management
- **Transactions Tests** (`cypress/e2e/transactions.cy.js`): Tests transaction history with filtering, search, and export functionality
- **Transfer Tests** (`cypress/e2e/transfer.cy.js`): Tests money transfer functionality, form validation, and API interactions
- **Navigation Tests** (`cypress/e2e/navigation.cy.js`): Tests navigation between pages, mobile responsiveness, and browser navigation
- **Integration Tests** (`cypress/e2e/integration.cy.js`): Tests complete user workflows across multiple pages

#### Running Tests

1. **Install Cypress** (if not already installed):
```bash
npm install cypress --save-dev
```

2. **Open Cypress Test Runner** (interactive mode):
```bash
npm run cypress:open
```

3. **Run Tests in Headless Mode**:
```bash
npm run cypress:run
```

4. **Run Tests with Application Server** (automatically starts server and runs tests):
```bash
npm run test:e2e
```

#### Test Features

- **Custom Commands**: Reusable test commands for common operations
- **API Interception**: Mock API responses for testing different scenarios
- **Responsive Testing**: Tests across desktop, tablet, and mobile viewports
- **Error Handling**: Tests for API errors, validation errors, and edge cases
- **Data Validation**: Ensures correct data display and formatting
- **User Workflows**: Complete end-to-end user journeys

#### Test Coverage

The tests cover:

- ✅ Page loading and navigation
- ✅ Data display and formatting
- ✅ Search and filtering functionality
- ✅ Form validation and submission
- ✅ API interactions and error handling
- ✅ Responsive design across devices
- ✅ User workflows and integrations
- ✅ Browser navigation (back/forward)
- ✅ Loading states and error recovery
- ✅ Mobile menu and navigation

#### Custom Commands

The tests use custom Cypress commands for better readability:

- `cy.navigateTo(page)` - Navigate to specific pages
- `cy.waitForLoading()` - Wait for data to load
- `cy.fillTransferForm()` - Fill transfer form with data
- `cy.searchAccounts()` / `cy.searchTransactions()` - Search functionality
- `cy.filterByAccountType()` / `cy.filterByTransactionType()` - Filter functionality
- `cy.sortBy()` - Sort functionality
- `cy.checkPageTitle()` - Verify page titles
- `cy.checkSuccessMessage()` / `cy.checkErrorMessage()` - Verify messages

#### Test Data

Test fixtures are available in `cypress/fixtures/`:
- `accounts.json` - Sample account data
- `transactions.json` - Sample transaction data

#### Continuous Integration

The tests are configured to run in CI environments with:
- Headless Chrome browser
- Screenshot capture on failures
- Video recording disabled for performance
- Proper timeouts for API calls

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard component
│   ├── AccountsPage.js  # Accounts management page
│   ├── TransactionsPage.js # Transaction history page
│   ├── TransferForm.js  # Money transfer form
│   ├── AccountDetails.js # Individual account details
│   ├── AccountCard.js   # Account card component
│   ├── TransactionItem.js # Transaction item component
│   └── Header.js        # Navigation header
├── services/
│   └── api.js          # API service functions
└── App.js              # Main application component

cypress/
├── e2e/                # End-to-end test files
├── fixtures/           # Test data fixtures
├── support/            # Custom commands and configuration
└── cypress.config.js   # Cypress configuration
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run unit tests
- `npm run cypress:open` - Open Cypress test runner
- `npm run cypress:run` - Run Cypress tests in headless mode
- `npm run test:e2e` - Start server and run end-to-end tests

## API Endpoints

The application uses the following API endpoints:

- `GET /api/accounts` - Get all accounts
- `GET /api/transactions` - Get all transactions
- `POST /api/transfer` - Transfer money between accounts
- `GET /api/accounts/:id` - Get specific account details
- `POST /api/accounts/:id/freeze` - Freeze/unfreeze account
- `GET /api/accounts/:id/statement` - Download account statement
- `POST /api/accounts/:id/interest` - Calculate interest

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Check the API documentation in `bank-api-documentation.md`
- Review the console for error messages
- Ensure all dependencies are properly installed 