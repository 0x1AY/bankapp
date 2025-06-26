describe('Transfer Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.navigateTo('transfer')
    cy.waitForLoading()
  })

  it('should load the transfer page successfully', () => {
    // Check page title
    cy.checkPageTitle('Transfer Money')
    
    // Check navigation is active
    cy.checkActiveNavigation('Transfer')
    
    // Check page description
    cy.contains('Transfer funds between your accounts').should('be.visible')
  })

  it('should display transfer form with all fields', () => {
    // Check form fields exist
    cy.get('label').contains('From Account').should('be.visible')
    cy.get('label').contains('To Account').should('be.visible')
    cy.get('label').contains('Amount ($)').should('be.visible')
    cy.get('label').contains('Description').should('be.visible')
    
    // Check form elements
    cy.get('select[name="fromAccountId"]').should('be.visible')
    cy.get('select[name="toAccountId"]').should('be.visible')
    cy.get('input[name="amount"]').should('be.visible')
    cy.get('input[name="description"]').should('be.visible')
    
    // Check submit button
    cy.get('button').contains('Transfer Money').should('be.visible').and('not.be.disabled')
  })

  it('should populate account dropdowns with account data', () => {
    // Check from account dropdown has options
    cy.get('select[name="fromAccountId"]').find('option').should('have.length.at.least', 5) // 4 accounts + placeholder
    
    // Check to account dropdown has options
    cy.get('select[name="toAccountId"]').find('option').should('have.length.at.least', 5) // 4 accounts + placeholder
    
    // Check specific accounts are in dropdowns
    cy.get('select[name="fromAccountId"]').contains('John Doe').should('be.visible')
    cy.get('select[name="fromAccountId"]').contains('Jane Smith').should('be.visible')
    cy.get('select[name="fromAccountId"]').contains('El Ildaro').should('be.visible')
    cy.get('select[name="fromAccountId"]').contains('juancho').should('be.visible')
  })

  it('should validate form fields are required', () => {
    // Try to submit empty form
    cy.get('button').contains('Transfer Money').click()
    
    // Should show error message
    cy.checkErrorMessage('All fields are required')
  })

  it('should validate amount is positive', () => {
    // Fill form with invalid amount
    cy.fillTransferForm('John Doe', 'Jane Smith', '-50', 'Test transfer')
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Should show error message
    cy.checkErrorMessage('Please enter a valid amount')
  })

  it('should validate amount is a number', () => {
    // Fill form with invalid amount
    cy.fillTransferForm('John Doe', 'Jane Smith', 'abc', 'Test transfer')
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Should show error message
    cy.checkErrorMessage('Please enter a valid amount')
  })

  it('should prevent transfer to same account', () => {
    // Fill form with same account
    cy.fillTransferForm('John Doe', 'John Doe', '50', 'Test transfer')
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Should show error message
    cy.checkErrorMessage('Cannot transfer to the same account')
  })

  it('should validate insufficient balance', () => {
    // Fill form with amount higher than balance
    cy.fillTransferForm('El Ildaro', 'John Doe', '1000', 'Test transfer') // El Ildaro has $34
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Should show error message
    cy.checkErrorMessage('Insufficient balance in source account')
  })

  it('should successfully complete a transfer', () => {
    // Intercept API call
    cy.intercept('POST', '**/api/transfer', {
      statusCode: 200,
      body: { success: true, message: 'Transfer completed successfully' }
    }).as('transferAPI')
    
    // Fill form with valid data
    cy.fillTransferForm('John Doe', 'Jane Smith', '50', 'Test transfer')
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Wait for API call
    cy.wait('@transferAPI')
    
    // Should show success message
    cy.checkSuccessMessage('Transfer completed successfully')
    
    // Form should be reset
    cy.get('input[name="amount"]').should('have.value', '')
    cy.get('input[name="description"]').should('have.value', '')
  })

  it('should handle API errors gracefully', () => {
    // Intercept API call with error
    cy.intercept('POST', '**/api/transfer', {
      statusCode: 500,
      body: { error: 'Transfer failed' }
    }).as('transferError')
    
    // Fill form with valid data
    cy.fillTransferForm('John Doe', 'Jane Smith', '50', 'Test transfer')
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Wait for API call
    cy.wait('@transferError')
    
    // Should show error message
    cy.checkErrorMessage('Transfer failed. Please try again.')
  })

  it('should show loading state during transfer', () => {
    // Intercept API call with delay
    cy.intercept('POST', '**/api/transfer', (req) => {
      req.reply({
        delay: 2000,
        statusCode: 200,
        body: { success: true, message: 'Transfer completed successfully' }
      })
    }).as('transferWithDelay')
    
    // Fill form with valid data
    cy.fillTransferForm('John Doe', 'Jane Smith', '50', 'Test transfer')
    
    // Submit form
    cy.get('button').contains('Transfer Money').click()
    
    // Should show loading state
    cy.get('button').contains('Processing...').should('be.visible')
    cy.get('.animate-spin').should('be.visible')
    
    // Wait for completion
    cy.wait('@transferWithDelay')
    
    // Should show success message
    cy.checkSuccessMessage('Transfer completed successfully')
  })

  it('should pre-select source account when coming from account card', () => {
    // Navigate from account card
    cy.visit('/')
    cy.get('.card').first().contains('Transfer').click()
    
    // Should show transfer page with pre-selected account
    cy.checkPageTitle('Transfer Money')
    cy.contains('Transfer from').should('be.visible')
    
    // Source account should be disabled
    cy.get('select[name="fromAccountId"]').should('be.disabled')
  })

  it('should be responsive on different screen sizes', () => {
    // Test desktop view
    cy.setViewport('desktop')
    cy.get('form').should('be.visible')
    
    // Test tablet view
    cy.setViewport('tablet')
    cy.get('form').should('be.visible')
    
    // Test mobile view
    cy.setViewport('mobile')
    cy.get('form').should('be.visible')
  })

  it('should clear error messages when form is corrected', () => {
    // Submit empty form to show error
    cy.get('button').contains('Transfer Money').click()
    cy.checkErrorMessage('All fields are required')
    
    // Fill form correctly
    cy.fillTransferForm('John Doe', 'Jane Smith', '50', 'Test transfer')
    
    // Error should be cleared
    cy.get('.bg-red-50').should('not.exist')
  })

  it('should format amount input correctly', () => {
    // Type amount with decimals
    cy.get('input[name="amount"]').type('100.50')
    
    // Should accept decimal values
    cy.get('input[name="amount"]').should('have.value', '100.50')
  })

  it('should handle large amounts', () => {
    // Type large amount
    cy.get('input[name="amount"]').type('999999.99')
    
    // Should accept large amounts
    cy.get('input[name="amount"]').should('have.value', '999999.99')
  })

  it('should validate description length', () => {
    // Fill form with very long description
    const longDescription = 'A'.repeat(1000)
    cy.fillTransferForm('John Doe', 'Jane Smith', '50', longDescription)
    
    // Should accept long descriptions
    cy.get('input[name="description"]').should('have.value', longDescription)
  })

  it('should handle special characters in description', () => {
    // Fill form with special characters
    cy.fillTransferForm('John Doe', 'Jane Smith', '50', 'Test transfer with special chars: !@#$%^&*()')
    
    // Should accept special characters
    cy.get('input[name="description"]').should('have.value', 'Test transfer with special chars: !@#$%^&*()')
  })
}) 