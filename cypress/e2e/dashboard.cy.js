describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForLoading()
  })

  it('should load the dashboard successfully', () => {
    // Check page title
    cy.checkPageTitle('Dashboard')
    
    // Check navigation is active
    cy.checkActiveNavigation('Dashboard')
    
    // Check main sections exist
    cy.get('h2').contains('Your Accounts').should('be.visible')
    cy.get('h2').contains('Recent Transactions').should('be.visible')
    cy.get('h3').contains('Quick Actions').should('be.visible')
  })

  it('should display statistics cards', () => {
    // Check all stats cards are present
    cy.get('.card').should('have.length.at.least', 4)
    
    // Check specific stats
    cy.get('.card').contains('Total Balance').should('be.visible')
    cy.get('.card').contains('Active Accounts').should('be.visible')
    cy.get('.card').contains('Total Accounts').should('be.visible')
    cy.get('.card').contains('Recent Transactions').should('be.visible')
  })

  it('should display account cards', () => {
    // Check account cards are loaded
    cy.get('.card').should('have.length.at.least', 4)
    
    // Check that account cards exist (any account)
    cy.get('.card').should('contain.text', 'Account #')
    
    // Check that specific account cards exist
    cy.get('.card').contains('John Doe').should('be.visible')
    cy.get('.card').contains('Jane Smith').should('be.visible')
    
    // Check that account cards have proper structure
    cy.get('.card').contains('John Doe').closest('.card').within(() => {
      cy.get('h3').should('exist') // Account holder name
      cy.get('p').should('exist') // Account number
      cy.get('span').contains('$').should('exist') // Balance
    })
  })

  it('should display recent transactions', () => {
    // Check transactions section
    cy.get('h2').contains('Recent Transactions').should('be.visible')
    
    // Check transactions are loaded
    cy.get('.card').should('have.length.at.least', 1)
    
    // Check that transactions exist (any transaction)
    cy.get('.card').should('contain.text', 'Transaction')
    
    // Check transaction structure
    cy.get('.card').first().within(() => {
      cy.get('h4').should('exist') // Transaction type
      cy.get('span').contains('$').should('exist') // Amount
    })
  })

  it('should have working quick action buttons', () => {
    // Check quick actions section
    cy.get('h3').contains('Quick Actions').should('be.visible')
    
    // Check transfer button
    cy.get('button').contains('Transfer Money').should('be.visible').and('not.be.disabled')
    
    // Check other action buttons
    cy.get('button').contains('Check Balance').should('be.visible')
    cy.get('button').contains('View Statement').should('be.visible')
  })

  it('should navigate to transfer page from quick actions', () => {
    // Click transfer button
    cy.get('button').contains('Transfer Money').click()
    
    // Should navigate to transfer page
    cy.checkPageTitle('Transfer Money')
    cy.url().should('include', '/')
  })

  it('should display account details when clicking view details', () => {
    // Click view details on first account card
    cy.get('.card').contains('John Doe').closest('.card').within(() => {
      cy.get('button').contains('View Details').click()
    })
    
    // Should show account details
    cy.checkPageTitle('Account Details')
  })

  it('should navigate to transfer from account card', () => {
    // Click transfer on first account card
    cy.get('.card').contains('John Doe').closest('.card').within(() => {
      cy.get('button').contains('Transfer').click()
    })
    
    // Should navigate to transfer page with pre-selected account
    cy.checkPageTitle('Transfer Money')
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
    // Intercept API calls and return error
    cy.intercept('GET', '**/api/accounts', { statusCode: 500, body: {} }).as('accountsError')
    cy.intercept('GET', '**/api/transactions', { statusCode: 500, body: {} }).as('transactionsError')
    
    // Reload page
    cy.reload()
    
    // Should show error message
    cy.get('.text-red-600').should('be.visible')
    cy.get('button').contains('Retry').should('be.visible')
  })

  it('should refresh data after successful transfer', () => {
    // Navigate to transfer page
    cy.get('button').contains('Transfer Money').click()
    
    // Wait for accounts to load
    cy.wait(2000)
    
    // Check if transfer form is loaded
    cy.get('form').should('be.visible')
    cy.get('select[name="fromAccountId"]').should('be.visible')
    cy.get('select[name="toAccountId"]').should('be.visible')
    
    // Fill transfer form with any available accounts
    cy.get('select[name="fromAccountId"]').select(1)
    cy.get('select[name="toAccountId"]').select(2)
    cy.get('input[name="amount"]').type('50')
    cy.get('input[name="description"]').type('Test transfer')
    
    // Submit transfer
    cy.get('button').contains('Transfer Money').click()
    
    // Should show success message
    cy.get('.bg-success-50').should('contain', 'Transfer completed successfully')
    
    // Navigate back to dashboard
    cy.get('nav').contains('Dashboard').click()
    
    // Should show updated data
    cy.get('.card').should('have.length.at.least', 4)
  })
}) 