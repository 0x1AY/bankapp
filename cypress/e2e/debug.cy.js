describe('Debug Tests', () => {
  it('should debug the dashboard rendering', () => {
    cy.visit('/')
    
    // Wait for loading to complete
    cy.wait(3000)
    
    // Log the page content
    cy.get('body').then(($body) => {
      console.log('Body HTML:', $body.html())
    })
    
    // Check what cards are actually rendered
    cy.get('.card').then(($cards) => {
      console.log('Number of cards found:', $cards.length)
      $cards.each((index, card) => {
        console.log(`Card ${index}:`, card.innerHTML)
      })
    })
    
    // Check if there are any error messages
    cy.get('body').then(($body) => {
      if ($body.find('.text-red-600').length > 0) {
        console.log('Error messages found:', $body.find('.text-red-600').text())
      }
    })
    
    // Check if there are any loading spinners
    cy.get('body').then(($body) => {
      if ($body.find('.animate-spin').length > 0) {
        console.log('Loading spinners found')
      }
    })
  })
}) 