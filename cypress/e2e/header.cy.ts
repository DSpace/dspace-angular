import { testA11y } from 'cypress/support/utils';

describe('Header', () => {
  it('should pass accessibility tests', () => {
    cy.visit('/');

    // Header must first be visible
    cy.get('ds-header').should('be.visible');

    // Analyze <ds-header> for accessibility
    testA11y('ds-header');
  });
});
