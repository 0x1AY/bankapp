describe('Save HTML', () => {
  it('should save the rendered HTML', () => {
    cy.visit('/')
    
    // Wait for loading to complete
    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')
    
    // Wait a bit more for data to load
    cy.wait(2000)
    
    // Save the entire page HTML
    cy.get('body').then(($body) => {
      const html = $body.html()
      cy.writeFile('cypress/downloads/page.html', html)
    })
    
    // Save just the cards HTML
    cy.get('.card').then(($cards) => {
      const cardsHtml = $cards.map((index, card) => Cypress.$(card).html()).get().join('\n\n---\n\n')
      cy.writeFile('cypress/downloads/cards.html', cardsHtml)
    })
  })
}) 