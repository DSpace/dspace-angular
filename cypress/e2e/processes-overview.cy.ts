import { testA11y } from 'cypress/support/utils';

describe('Processes Overview', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/processes');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {

    // Process overview must first be visible
    cy.get('ds-process-overview').should('be.visible');
    // Analyze <ds-process-overview> for accessibility issues
    testA11y('ds-process-overview');
  });
});
