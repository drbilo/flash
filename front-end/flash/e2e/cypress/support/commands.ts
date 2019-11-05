// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// add new command to the existing Cypress interface
declare namespace Cypress {
  interface Chainable {
    /**
       * Passes app config needed for initialize.
       * Must be called on all apps, or no init event will be received.
       *
       * @memberof Cypress.Chainable
       *
       * @example
          ```
          cy.visit('/').withConfig(configData).get('.your-element')
          ```
      */
    withConfig: (configData: {}) => Chainable<Window>;
  }
}

interface Window {
  __initAppWithConfig: (configData: {}) => void;
  __startApp: () => void;
}

/**
 * Enables a test to provide its own config data to initialize an app.
 */
const withConfig = (subject: Window, configData: {}): Window => {
  subject.__initAppWithConfig(configData);
  subject.__startApp();
  return subject;
};

/**
 * Export all commands.
 */
Cypress.Commands.add("withConfig", { prevSubject: "window" }, withConfig);
