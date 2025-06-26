describe('API Tests', () => {
  it('should be able to fetch accounts from API', () => {
    cy.request('GET', 'https://cursorworkshopserver.onrender.com/api/accounts')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        console.log('Accounts response:', response.body.slice(0, 3))
      })
  })

  it('should be able to fetch transactions from API', () => {
    cy.request('GET', 'https://cursorworkshopserver.onrender.com/api/transactions')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        console.log('Transactions response:', response.body.slice(0, 3))
      })
  })

  it('should load dashboard and make API calls', () => {
    cy.visit('/')
    
    // Intercept API calls
    cy.intercept('GET', '**/api/accounts').as('getAccounts')
    cy.intercept('GET', '**/api/transactions').as('getTransactions')
    
    // Wait for API calls
    cy.wait('@getAccounts')
    cy.wait('@getTransactions')
    
    // Check that data is loaded
    cy.get('.card').should('have.length.at.least', 4)
  })
}) 