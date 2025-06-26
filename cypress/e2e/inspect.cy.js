describe('Inspect Content', () => {
  it('should inspect the actual rendered content', () => {
    cy.visit('/')
    
    // Wait for loading to complete
    cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')
    
    // Wait a bit more for data to load
    cy.wait(2000)
    
    // Get all cards and log their content
    cy.get('.card').then(($cards) => {
      console.log('Total cards found:', $cards.length)
      
      $cards.each((index, card) => {
        const $card = Cypress.$(card)
        console.log(`Card ${index}:`)
        console.log('  - HTML:', $card.html())
        console.log('  - Text:', $card.text())
        console.log('  - Classes:', $card.attr('class'))
      })
    })
    
    // Check if there are any h3 elements
    cy.get('h3').then(($h3s) => {
      console.log('H3 elements found:', $h3s.length)
      $h3s.each((index, h3) => {
        console.log(`H3 ${index}:`, Cypress.$(h3).text())
      })
    })
    
    // Check if there are any h4 elements
    cy.get('h4').then(($h4s) => {
      console.log('H4 elements found:', $h4s.length)
      $h4s.each((index, h4) => {
        console.log(`H4 ${index}:`, Cypress.$(h4).text())
      })
    })
    
    // Check if there are any buttons
    cy.get('button').then(($buttons) => {
      console.log('Buttons found:', $buttons.length)
      $buttons.each((index, button) => {
        console.log(`Button ${index}:`, Cypress.$(button).text())
      })
    })
  })
}) 