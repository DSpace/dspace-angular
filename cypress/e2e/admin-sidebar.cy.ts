import { testA11y } from 'cypress/support/utils';

describe('Admin Sidebar', () => {
  beforeEach(() => {
    // Must login as an Admin for sidebar to appear
    cy.visit('/login');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });
  });

  it('should be pinnable and pass accessibility tests', () => {
    // Make sure the admin sidebar is collapsed by default.
    cy.get('#admin-sidebar').should('have.class', 'collapsed');
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').click();
    // Make sure the admin sidebar is pinned now.
    cy.get('#admin-sidebar').should('have.class', 'expanded');

    // Click on every expandable section to open all menus
    cy.get('ds-expandable-admin-sidebar-section').click({ multiple: true });

    // Analyze <ds-admin-sidebar> for accessibility
    testA11y('ds-admin-sidebar');
  });
});
