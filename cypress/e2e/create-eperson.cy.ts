import { testA11y } from 'cypress/support/utils';

describe('Create Eperson', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/access-control/epeople/create');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Form must first be visible
    cy.get('ds-eperson-form').should('be.visible');
    // Analyze <ds-eperson-form> for accessibility issues
    testA11y('ds-eperson-form');
  });

  it('should create an EPerson', () => {
    const email = `cypress-person-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

    // Fill the EPerson details
    cy.get('#firstName').type('Smith');
    cy.get('#lastName').type('Cypress');
    cy.get('#email').type(email).blur();

    cy.get('ds-eperson-form ds-form button[type="submit"]').should('not.have.class', 'disabled').click();

    // Focus the people search field after returning to the registry
    cy.url().should('match', /\/access-control\/epeople$/);
    cy.get('#query').focus();
  });
});
