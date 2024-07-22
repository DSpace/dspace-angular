import { testA11y } from 'cypress/support/utils';

describe('Admin Notifications Publication Claim Page', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/notifications/publication-claim');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {

    //Page must first be visible
    cy.get('ds-admin-notifications-publication-claim-page').should('be.visible');
    // Analyze <ds-admin-notifications-publication-claim-page> for accessibility issues
    testA11y('ds-admin-notifications-publication-claim-page');
  });
});
