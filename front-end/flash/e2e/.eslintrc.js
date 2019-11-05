/**
 * Extend ESLint to understand the e2e tests
 * i.e. globals from Cypress
 *
 * https://github.com/cypress-io/eslint-plugin-cypress
 * (Does not enable the rules from this plugin, just takes the global definitions)
 */
module.exports = {
  env: {
    "cypress/globals": true
  }
};
