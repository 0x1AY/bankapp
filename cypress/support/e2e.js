// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // for uncaught exceptions that might occur during API calls
  if (err.message.includes('Failed to fetch') || 
      err.message.includes('NetworkError') ||
      err.message.includes('API')) {
    return false
  }
  return true
})

// Custom viewport sizes for responsive testing
Cypress.Commands.add('setViewport', (size) => {
  switch (size) {
    case 'mobile':
      cy.viewport(375, 667)
      break
    case 'tablet':
      cy.viewport(768, 1024)
      break
    case 'desktop':
      cy.viewport(1280, 720)
      break
    default:
      cy.viewport(1280, 720)
  }
}) 