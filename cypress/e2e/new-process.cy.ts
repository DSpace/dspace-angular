import { testA11y } from 'cypress/support/utils';

describe('New Process', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/processes/new');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should pass accessibility tests', () => {
    // Process form must first be visible
    cy.get('ds-new-process').should('be.visible');
    // Analyze <ds-new-process> for accessibility issues
    testA11y('ds-new-process');
  });
});
