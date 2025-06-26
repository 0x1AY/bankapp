describe('Accounts Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.navigateTo('accounts')
    cy.waitForLoading()
  })

  it('should load the accounts page successfully', () => {
    // Check page title
    cy.checkPageTitle('Accounts')
    
    // Check navigation is active
    cy.checkActiveNavigation('Accounts')
    
    // Check page description
    cy.contains('Manage and view all your bank accounts').should('be.visible')
  })

  it('should display accounts statistics', () => {
    // Check stats cards
    cy.get('.card').contains('Total Accounts').should('be.visible')
    cy.get('.card').contains('Total Balance').should('be.visible')
    cy.get('.card').contains('Active Accounts').should('be.visible')
    
    // Check stats have values
    cy.get('.card').contains('4').should('be.visible') // Total accounts
    cy.get('.card').contains('$').should('be.visible') // Balance
  })

  it('should display all account cards', () => {
    // Check all accounts are displayed
    cy.checkAccountCard('John Doe')
    cy.checkAccountCard('Jane Smith')
    cy.checkAccountCard('El Ildaro')
    cy.checkAccountCard('juancho')
    
    // Check account details are visible
    cy.get('.card').should('have.length.at.least', 4)
    cy.get('.card').contains('checking').should('be.visible')
    cy.get('.card').contains('savings').should('be.visible')
  })

  it('should have working search functionality', () => {
    // Search for specific account
    cy.searchAccounts('John Doe')
    
    // Should show only matching accounts
    cy.get('.card').should('have.length', 1)
    cy.checkAccountCard('John Doe')
    
    // Clear search
    cy.get('button').contains('Clear search').click()
    
    // Should show all accounts again
    cy.get('.card').should('have.length.at.least', 4)
  })

  it('should filter accounts by type', () => {
    // Filter by checking accounts
    cy.filterByAccountType('checking')
    
    // Should show only checking accounts
    cy.get('.card').contains('checking').should('be.visible')
    cy.get('.card').contains('savings').should('not.exist')
    
    // Filter by savings accounts
    cy.filterByAccountType('savings')
    
    // Should show only savings accounts
    cy.get('.card').contains('savings').should('be.visible')
    cy.get('.card').contains('checking').should('not.exist')
    
    // Reset to all types
    cy.filterByAccountType('all')
    
    // Should show all accounts
    cy.get('.card').should('have.length.at.least', 4)
  })

  it('should sort accounts correctly', () => {
    // Sort by name
    cy.sortBy('name')
    cy.get('.card').first().should('contain', 'El Ildaro')
    
    // Sort by balance
    cy.sortBy('balance')
    cy.get('.card').first().should('contain', 'juancho') // Highest balance
    
    // Sort by type
    cy.sortBy('type')
    cy.get('.card').first().should('contain', 'checking')
    
    // Sort by date
    cy.sortBy('date')
    cy.get('.card').should('have.length.at.least', 4)
  })

  it('should show results summary', () => {
    // Check results summary is displayed
    cy.contains('Showing 4 of 4 accounts').should('be.visible')
    
    // Search and check updated summary
    cy.searchAccounts('John')
    cy.contains('Showing 1 of 4 accounts').should('be.visible')
  })

  it('should handle empty search results', () => {
    // Search for non-existent account
    cy.searchAccounts('NonExistentAccount')
    
    // Should show no results message
    cy.contains('No accounts found').should('be.visible')
    cy.contains('Try adjusting your search terms').should('be.visible')
  })

  it('should have working account card actions', () => {
    // Check view details button
    cy.get('.card').first().contains('View Details').should('be.visible').and('not.be.disabled')
    
    // Check transfer button
    cy.get('.card').first().contains('Transfer').should('be.visible').and('not.be.disabled')
  })

  it('should navigate to account details from card', () => {
    // Click view details on first account
    cy.get('.card').first().contains('View Details').click()
    
    // Should navigate to account details
    cy.checkPageTitle('Account Details')
  })

  it('should navigate to transfer from account card', () => {
    // Click transfer on first account
    cy.get('.card').first().contains('Transfer').click()
    
    // Should navigate to transfer page
    cy.checkPageTitle('Transfer Money')
  })

  it('should have new account button', () => {
    // Check new account button exists
    cy.get('button').contains('New Account').should('be.visible').and('not.be.disabled')
  })

  it('should be responsive on different screen sizes', () => {
    // Test desktop view
    cy.setViewport('desktop')
    cy.get('.grid').should('be.visible')
    
    // Test tablet view
    cy.setViewport('tablet')
    cy.get('.grid').should('be.visible')
    
    // Test mobile view
    cy.setViewport('mobile')
    cy.get('.grid').should('be.visible')
  })

  it('should handle API errors gracefully', () => {
    // Intercept API call and return error
    cy.intercept('GET', '**/api/accounts', { statusCode: 500, body: {} }).as('accountsError')
    
    // Reload page
    cy.reload()
    
    // Should show error message
    cy.get('.text-red-600').should('be.visible')
    cy.get('button').contains('Retry').should('be.visible')
  })

  it('should combine search and filters', () => {
    // Search for John
    cy.searchAccounts('John')
    
    // Filter by checking
    cy.filterByAccountType('checking')
    
    // Should show only John's checking account
    cy.get('.card').should('have.length', 1)
    cy.checkAccountCard('John Doe')
    cy.get('.card').contains('checking').should('be.visible')
  })
}) 