import { testA11y } from 'cypress/support/utils';

describe('Groups registry', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/access-control/groups');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Epeople registry page must first be visible
    cy.get('ds-groups-registry').should('be.visible');
    // Analyze <ds-groups-registry> for accessibility issues
    testA11y('ds-groups-registry');
  });
});
