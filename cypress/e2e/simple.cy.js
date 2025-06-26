describe('Simple Tests', () => {
  it('should load the page and show basic content', () => {
    cy.visit('/')
    
    // Check basic page structure
    cy.get('h1').should('contain', 'Dashboard')
    cy.get('nav').should('be.visible')
    
    // Check if any content is loaded
    cy.get('body').should('not.be.empty')
    
    // Wait a bit and check again
    cy.wait(2000)
    cy.get('body').should('not.be.empty')
  })

  it('should show loading state initially', () => {
    cy.visit('/')
    
    // Should show loading spinner initially
    cy.get('.animate-spin').should('exist')
    
    // Wait for loading to complete
    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')
  })

  it('should show some cards after loading', () => {
    cy.visit('/')
    
    // Wait for loading to complete
    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')
    
    // Should show some cards
    cy.get('.card').should('have.length.at.least', 1)
  })
}) 