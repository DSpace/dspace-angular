import { testA11y } from 'cypress/support/utils';

describe('Create Group', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/access-control/groups/create');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Form must first be visible
    cy.get('ds-group-form').should('be.visible');
    // Analyze <ds-group-form> for accessibility issues
    testA11y('ds-group-form');
  });


  it('should create an EPersonGroup', () => {
    const groupName = `cypress-group-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Fill the GroupName details
    cy.get('#groupName').type(groupName);
    //cy.get('#groupDescription').type('Some description');

    cy.get('ds-group-form ds-form button[type="submit"]').should('not.have.class', 'disabled').click();

    cy.url().should('match', /access-control\/groups\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}\/edit$/);
  });
});
