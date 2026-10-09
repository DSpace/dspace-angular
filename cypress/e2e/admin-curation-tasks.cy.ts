import { testA11y } from 'cypress/support/utils';

describe('Admin Curation Tasks', () => {
  beforeEach(() => {
    // Must login as an Admin to see the page
    cy.visit('/admin/curation-tasks');
    cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
    });

    // Wait until login is complete, then explicitly open the curation tasks page
    cy.get('[data-test="user-menu"]').should('exist');
    cy.visit('/admin/curation-tasks');
  });

  it('should pass accessibility tests', () => {
    // Page must first be visible
    cy.get('ds-admin-curation-task').should('be.visible');
    // Analyze <ds-admin-curation-task> for accessibility issues
    testA11y('ds-admin-curation-task');
  });

  it('should start a system curation task', () => {
    // Page must first be visible
    cy.get('ds-admin-curation-task').should('be.visible');

    // Select the first available curation task
    cy.get('ds-curation-form #task option').first().then(($option) => {
      cy.get('ds-curation-form #task').select($option.val() as string);
    });

    // Start the curation task
    cy.get('ds-curation-form button[type="submit"]').click();

    // The started curation task redirects to its process page
    cy.url().should('match', /\/processes\/\d+$/);
  });
});
