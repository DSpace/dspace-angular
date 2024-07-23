import { testA11y } from 'cypress/support/utils';

describe('Privacy', () => {
  it('should pass accessibility tests', () => {
    cy.visit('/info/privacy');

    // Page must first be visible
    cy.get('ds-privacy').should('be.visible');

    // Analyze <ds-privacy> for accessibility
    testA11y('ds-privacy');
  });
});
