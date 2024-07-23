import { testA11y } from 'cypress/support/utils';

describe('Feedback', () => {
  it('should pass accessibility tests', () => {
    cy.visit('/info/feedback');

    // Page must first be visible
    cy.get('ds-feedback').should('be.visible');

    // Analyze <ds-feedback> for accessibility
    testA11y('ds-feedback');
  });
});
