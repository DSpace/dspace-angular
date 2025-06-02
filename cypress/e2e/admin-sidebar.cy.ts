import { testA11y } from 'cypress/support/utils';
import { Options } from 'cypress-axe';

describe('Admin Sidebar', () => {
  beforeEach(() => {
    // Must login as an Admin for sidebar to appear
    cy.visit('/login');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should be pinnable and pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('#sidebar-collapse-toggle').click();

    // Click on every expandable section to open all menus
    cy.get('ds-expandable-admin-sidebar-section').click({ multiple: true });

    // Analyze <ds-admin-sidebar> for accessibility
    testA11y('ds-admin-sidebar',
        {
          rules: {
            // Currently all expandable sections have nested interactive elements
            // See https://github.com/DSpace/dspace-angular/issues/2178
            'nested-interactive': { enabled: false },
          },
        } as Options);
  });
});
