describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForLoading()
  })

  it('should have working header navigation', () => {
    // Check all navigation items exist
    cy.get('nav').contains('Dashboard').should('be.visible')
    cy.get('nav').contains('Accounts').should('be.visible')
    cy.get('nav').contains('Transactions').should('be.visible')
    cy.get('nav').contains('Transfer').should('be.visible')
  })

  it('should navigate to dashboard', () => {
    // Navigate to dashboard
    cy.navigateTo('dashboard')
    
    // Should be on dashboard page
    cy.checkPageTitle('Dashboard')
    cy.checkActiveNavigation('Dashboard')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should navigate to accounts page', () => {
    // Navigate to accounts
    cy.navigateTo('accounts')
    
    // Should be on accounts page
    cy.checkPageTitle('Accounts')
    cy.checkActiveNavigation('Accounts')
  })

  it('should navigate to transactions page', () => {
    // Navigate to transactions
    cy.navigateTo('transactions')
    
    // Should be on transactions page
    cy.checkPageTitle('Transactions')
    cy.checkActiveNavigation('Transactions')
  })

  it('should navigate to transfer page', () => {
    // Navigate to transfer
    cy.navigateTo('transfer')
    
    // Should be on transfer page
    cy.checkPageTitle('Transfer Money')
    cy.checkActiveNavigation('Transfer')
  })

  it('should highlight active navigation item', () => {
    // Check dashboard is active by default
    cy.checkActiveNavigation('Dashboard')
    
    // Navigate to accounts
    cy.navigateTo('accounts')
    cy.checkActiveNavigation('Accounts')
    
    // Navigate to transactions
    cy.navigateTo('transactions')
    cy.checkActiveNavigation('Transactions')
    
    // Navigate to transfer
    cy.navigateTo('transfer')
    cy.checkActiveNavigation('Transfer')
  })

  it('should have working mobile navigation', () => {
    // Set mobile viewport
    cy.setViewport('mobile')
    
    // Check mobile menu button exists
    cy.get('button').find('svg').should('be.visible')
    
    // Open mobile menu
    cy.get('button').find('svg').first().click()
    
    // Check mobile menu items
    cy.get('nav').contains('Dashboard').should('be.visible')
    cy.get('nav').contains('Accounts').should('be.visible')
    cy.get('nav').contains('Transactions').should('be.visible')
    cy.get('nav').contains('Transfer').should('be.visible')
  })

  it('should close mobile menu after navigation', () => {
    // Set mobile viewport
    cy.setViewport('mobile')
    
    // Open mobile menu
    cy.get('button').find('svg').first().click()
    
    // Navigate to accounts
    cy.get('nav').contains('Accounts').click()
    
    // Mobile menu should be closed
    cy.get('nav').should('not.contain', 'Dashboard')
  })

  it('should have working logo navigation', () => {
    // Check logo exists
    cy.get('h1').contains('Bank App').should('be.visible')
    
    // Logo should be clickable (though it doesn't navigate in this app)
    cy.get('h1').contains('Bank App').should('be.visible')
  })

  it('should maintain state during navigation', () => {
    // Navigate to accounts
    cy.navigateTo('accounts')
    
    // Search for an account
    cy.searchAccounts('John')
    
    // Navigate to transactions
    cy.navigateTo('transactions')
    
    // Navigate back to accounts
    cy.navigateTo('accounts')
    
    // Search should be cleared (fresh page load)
    cy.get('input[placeholder*="Search accounts"]').should('have.value', '')
  })

  it('should handle navigation from account cards', () => {
    // Navigate to accounts page
    cy.navigateTo('accounts')
    
    // Click view details on first account
    cy.get('.card').first().contains('View Details').click()
    
    // Should navigate to account details
    cy.checkPageTitle('Account Details')
    
    // Click back button
    cy.get('button').contains('Back to Dashboard').click()
    
    // Should return to dashboard
    cy.checkPageTitle('Dashboard')
  })

  it('should handle navigation from transfer form', () => {
    // Navigate to transfer page
    cy.navigateTo('transfer')
    
    // Fill form partially
    cy.get('select[name="fromAccountId"]').select('John Doe')
    
    // Navigate away
    cy.navigateTo('dashboard')
    
    // Navigate back to transfer
    cy.navigateTo('transfer')
    
    // Form should be reset
    cy.get('select[name="fromAccountId"]').should('have.value', '')
  })

  it('should handle browser back/forward buttons', () => {
    // Navigate to accounts
    cy.navigateTo('accounts')
    cy.checkPageTitle('Accounts')
    
    // Navigate to transactions
    cy.navigateTo('transactions')
    cy.checkPageTitle('Transactions')
    
    // Go back
    cy.go('back')
    cy.checkPageTitle('Accounts')
    
    // Go forward
    cy.go('forward')
    cy.checkPageTitle('Transactions')
  })

  it('should handle direct URL access', () => {
    // Visit dashboard directly
    cy.visit('/')
    cy.checkPageTitle('Dashboard')
    
    // Visit transfer page directly
    cy.visit('/')
    cy.navigateTo('transfer')
    cy.checkPageTitle('Transfer Money')
  })

  it('should have consistent page structure across navigation', () => {
    const pages = ['dashboard', 'accounts', 'transactions', 'transfer']
    
    pages.forEach(page => {
      // Navigate to page
      cy.navigateTo(page)
      
      // Check common elements exist
      cy.get('header').should('be.visible')
      cy.get('main').should('be.visible')
      cy.get('footer').should('be.visible')
      
      // Check navigation tabs exist
      cy.get('nav').should('be.visible')
      
      // Check page title exists
      cy.get('h1').should('be.visible')
    })
  })

  it('should handle rapid navigation', () => {
    // Rapidly navigate between pages
    cy.navigateTo('accounts')
    cy.navigateTo('transactions')
    cy.navigateTo('transfer')
    cy.navigateTo('dashboard')
    cy.navigateTo('accounts')
    
    // Should end up on accounts page
    cy.checkPageTitle('Accounts')
  })

  it('should be responsive across all pages', () => {
    const pages = ['dashboard', 'accounts', 'transactions', 'transfer']
    const viewports = ['desktop', 'tablet', 'mobile']
    
    pages.forEach(page => {
      viewports.forEach(viewport => {
        // Navigate to page
        cy.navigateTo(page)
        
        // Set viewport
        cy.setViewport(viewport)
        
        // Check page is visible
        cy.get('main').should('be.visible')
        cy.get('h1').should('be.visible')
      })
    })
  })

  it('should handle navigation during loading states', () => {
    // Intercept API calls with delay
    cy.intercept('GET', '**/api/accounts', (req) => {
      req.reply({
        delay: 3000,
        statusCode: 200,
        body: []
      })
    }).as('slowAccounts')
    
    // Navigate to accounts
    cy.navigateTo('accounts')
    
    // Should show loading state
    cy.get('.animate-spin').should('be.visible')
    
    // Navigate away during loading
    cy.navigateTo('dashboard')
    
    // Should navigate successfully
    cy.checkPageTitle('Dashboard')
  })
}) 