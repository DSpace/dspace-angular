import { testA11y } from 'cypress/support/utils';

describe('Profile page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/profile');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Process form must first be visible
    cy.get('ds-profile-page').should('be.visible');
    // Analyze <ds-profile-page> for accessibility issues
    testA11y('ds-profile-page');
  });
});
