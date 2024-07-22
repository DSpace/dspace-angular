import { testA11y } from 'cypress/support/utils';

describe('Edit Group', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/access-control/groups/'.concat(Cypress.env('DSPACE_ADMINISTRATOR_GROUP')).concat('/edit'));
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should pass accessibility tests', () => {
    // Form must first be visible
    cy.get('ds-group-form').should('be.visible');
    // Analyze <ds-group-form> for accessibility issues
    testA11y('ds-group-form');
  });
});
