// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for API data to load
Cypress.Commands.add('waitForData', () => {
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist')
  cy.get('.card').should('have.length.at.least', 1)
})

// Custom command to navigate to a specific page
Cypress.Commands.add('navigateTo', (page) => {
  switch (page) {
    case 'dashboard':
      cy.get('nav').contains('Dashboard').click()
      break
    case 'accounts':
      cy.get('nav').contains('Accounts').click()
      break
    case 'transactions':
      cy.get('nav').contains('Transactions').click()
      break
    case 'transfer':
      cy.get('nav').contains('Transfer').click()
      break
  }
})

// Custom command to check if element is visible and clickable
Cypress.Commands.add('shouldBeVisibleAndClickable', (selector) => {
  cy.get(selector).should('be.visible').should('not.be.disabled')
})

// Custom command to format currency for assertions
Cypress.Commands.add('formatCurrency', (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
})

// Custom command to wait for API response
Cypress.Commands.add('waitForAPI', (method, url) => {
  cy.intercept(method, url).as('apiCall')
  cy.wait('@apiCall')
})

// Custom command to check account card exists (updated for actual data)
Cypress.Commands.add('checkAccountCard', (accountName) => {
  cy.get('.card').contains(accountName).should('be.visible')
})

// Custom command to check transaction exists (updated for actual data)
Cypress.Commands.add('checkTransaction', (description) => {
  cy.get('.card').contains(description).should('be.visible')
})

// Custom command to fill transfer form (updated for actual data)
Cypress.Commands.add('fillTransferForm', (fromAccount, toAccount, amount, description) => {
  if (fromAccount) {
    cy.get('select[name="fromAccountId"]').select(fromAccount)
  }
  if (toAccount) {
    cy.get('select[name="toAccountId"]').select(toAccount)
  }
  if (amount) {
    cy.get('input[name="amount"]').type(amount)
  }
  if (description) {
    cy.get('input[name="description"]').type(description)
  }
})

// Custom command to search for accounts
Cypress.Commands.add('searchAccounts', (searchTerm) => {
  cy.get('input[placeholder*="Search accounts"]').type(searchTerm)
})

// Custom command to search for transactions
Cypress.Commands.add('searchTransactions', (searchTerm) => {
  cy.get('input[placeholder*="Search transactions"]').type(searchTerm)
})

// Custom command to filter by account type
Cypress.Commands.add('filterByAccountType', (type) => {
  cy.get('select').first().select(type)
})

// Custom command to filter by transaction type
Cypress.Commands.add('filterByTransactionType', (type) => {
  cy.get('select').first().select(type)
})

// Custom command to sort by option
Cypress.Commands.add('sortBy', (option) => {
  cy.get('select').last().select(option)
})

// Custom command to check page title
Cypress.Commands.add('checkPageTitle', (title) => {
  cy.get('h1').should('contain', title)
})

// Custom command to check navigation is active
Cypress.Commands.add('checkActiveNavigation', (navItem) => {
  cy.get('nav').contains(navItem).should('have.class', 'text-primary-600')
})

// Custom command to check success message
Cypress.Commands.add('checkSuccessMessage', (message) => {
  cy.get('.bg-success-50').should('contain', message)
})

// Custom command to check error message
Cypress.Commands.add('checkErrorMessage', (message) => {
  cy.get('.bg-red-50').should('contain', message)
})

// Custom command to wait for loading to complete
Cypress.Commands.add('waitForLoading', () => {
  cy.get('.animate-spin', { timeout: 10000 }).should('not.exist')
})

// Custom command to wait for accounts to load
Cypress.Commands.add('waitForAccounts', () => {
  cy.get('.card', { timeout: 10000 }).should('have.length.at.least', 1)
})

// Custom command to wait for transactions to load
Cypress.Commands.add('waitForTransactions', () => {
  cy.get('.card', { timeout: 10000 }).should('have.length.at.least', 1)
}) 