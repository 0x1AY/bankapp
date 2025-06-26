describe('Transactions Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.navigateTo('transactions')
    cy.waitForLoading()
  })

  it('should load the transactions page successfully', () => {
    // Check page title
    cy.checkPageTitle('Transactions')
    
    // Check navigation is active
    cy.checkActiveNavigation('Transactions')
    
    // Check page description
    cy.contains('View and manage all your transaction history').should('be.visible')
  })

  it('should display transaction statistics', () => {
    // Check stats cards
    cy.get('.card').contains('Total Transactions').should('be.visible')
    cy.get('.card').contains('Net Amount').should('be.visible')
    cy.get('.card').contains('Deposits').should('be.visible')
    cy.get('.card').contains('Withdrawals').should('be.visible')
    
    // Check stats have values
    cy.get('.card').contains('5').should('be.visible') // Total transactions
    cy.get('.card').contains('$').should('be.visible') // Amounts
  })

  it('should display all transactions', () => {
    // Check transactions are loaded
    cy.get('.card').should('have.length.at.least', 5)
    
    // Check specific transactions exist
    cy.checkTransaction('Salary deposit')
    cy.checkTransaction('ATM withdrawal')
    cy.checkTransaction('Initial deposit')
    cy.checkTransaction('Transfer to')
    cy.checkTransaction('Transfer from')
  })

  it('should have working search functionality', () => {
    // Search for specific transaction
    cy.searchTransactions('Salary')
    
    // Should show only matching transactions
    cy.get('.card').should('have.length', 1)
    cy.checkTransaction('Salary deposit')
    
    // Clear search
    cy.get('button').contains('Clear search').click()
    
    // Should show all transactions again
    cy.get('.card').should('have.length.at.least', 5)
  })

  it('should filter transactions by type', () => {
    // Filter by deposits
    cy.filterByTransactionType('deposit')
    
    // Should show only deposits
    cy.get('.card').contains('Deposit').should('be.visible')
    cy.get('.card').contains('Withdrawal').should('not.exist')
    
    // Filter by withdrawals
    cy.filterByTransactionType('withdrawal')
    
    // Should show only withdrawals
    cy.get('.card').contains('Withdrawal').should('be.visible')
    cy.get('.card').contains('Deposit').should('not.exist')
    
    // Reset to all types
    cy.filterByTransactionType('all')
    
    // Should show all transactions
    cy.get('.card').should('have.length.at.least', 5)
  })

  it('should filter transactions by account', () => {
    // Filter by specific account
    cy.get('select').contains('John Doe').parent().select('John Doe (1234567890) - $1500')
    
    // Should show only transactions for that account
    cy.get('.card').should('have.length.at.least', 1)
    
    // Reset to all accounts
    cy.get('select').contains('All Accounts').parent().select('All Accounts')
    
    // Should show all transactions
    cy.get('.card').should('have.length.at.least', 5)
  })

  it('should sort transactions correctly', () => {
    // Sort by date (default)
    cy.sortBy('date')
    cy.get('.card').should('have.length.at.least', 5)
    
    // Sort by amount
    cy.sortBy('amount')
    cy.get('.card').first().should('contain', '3000000') // Highest amount
    
    // Sort by type
    cy.sortBy('type')
    cy.get('.card').first().should('contain', 'Deposit')
    
    // Sort by account
    cy.sortBy('account')
    cy.get('.card').should('have.length.at.least', 5)
  })

  it('should show results summary', () => {
    // Check results summary is displayed
    cy.contains('Showing 5 of 5 transactions').should('be.visible')
    
    // Search and check updated summary
    cy.searchTransactions('Salary')
    cy.contains('Showing 1 of 5 transactions').should('be.visible')
  })

  it('should handle empty search results', () => {
    // Search for non-existent transaction
    cy.searchTransactions('NonExistentTransaction')
    
    // Should show no results message
    cy.contains('No transactions found').should('be.visible')
    cy.contains('Try adjusting your search terms').should('be.visible')
  })

  it('should display transaction details correctly', () => {
    // Check transaction details are visible
    cy.get('.card').first().within(() => {
      // Check transaction type
      cy.get('h4').should('be.visible')
      
      // Check description
      cy.get('p').should('be.visible')
      
      // Check amount
      cy.get('.font-semibold').should('be.visible')
      
      // Check timestamp
      cy.get('.text-xs').should('be.visible')
    })
  })

  it('should have export functionality', () => {
    // Check export button exists
    cy.get('button').contains('Export').should('be.visible').and('not.be.disabled')
  })

  it('should be responsive on different screen sizes', () => {
    // Test desktop view
    cy.setViewport('desktop')
    cy.get('.space-y-4').should('be.visible')
    
    // Test tablet view
    cy.setViewport('tablet')
    cy.get('.space-y-4').should('be.visible')
    
    // Test mobile view
    cy.setViewport('mobile')
    cy.get('.space-y-4').should('be.visible')
  })

  it('should handle API errors gracefully', () => {
    // Intercept API call and return error
    cy.intercept('GET', '**/api/transactions', { statusCode: 500, body: {} }).as('transactionsError')
    
    // Reload page
    cy.reload()
    
    // Should show error message
    cy.get('.text-red-600').should('be.visible')
    cy.get('button').contains('Retry').should('be.visible')
  })

  it('should combine search and filters', () => {
    // Search for Salary
    cy.searchTransactions('Salary')
    
    // Filter by deposits
    cy.filterByTransactionType('deposit')
    
    // Should show only salary deposit
    cy.get('.card').should('have.length', 1)
    cy.checkTransaction('Salary deposit')
  })

  it('should show correct transaction amounts', () => {
    // Check that amounts are formatted correctly
    cy.get('.card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.font-semibold').should('contain', '$')
      })
    })
  })

  it('should show transaction timestamps', () => {
    // Check that timestamps are displayed
    cy.get('.card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.text-xs').should('be.visible')
      })
    })
  })

  it('should handle multiple filters simultaneously', () => {
    // Filter by deposits
    cy.filterByTransactionType('deposit')
    
    // Filter by specific account
    cy.get('select').contains('John Doe').parent().select('John Doe (1234567890) - $1500')
    
    // Should show filtered results
    cy.get('.card').should('have.length.at.least', 1)
    
    // Clear filters
    cy.filterByTransactionType('all')
    cy.get('select').contains('All Accounts').parent().select('All Accounts')
    
    // Should show all transactions
    cy.get('.card').should('have.length.at.least', 5)
  })
}) 