import { testA11y } from 'cypress/support/utils';

describe('Admin Export Modals', () => {
  beforeEach(() => {
    // Must login as an Admin for sidebar to appear
    cy.visit('/login');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('Export metadata modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-export-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-export-title"]').click();

    cy.get('a[data-test="menu.section.export_metadata"]').click();

    // Analyze <ds-export-metadata-selector> for accessibility
    testA11y('ds-export-metadata-selector');
  });

  it('Export batch modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-export-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-export-title"]').click();

    cy.get('a[data-test="menu.section.export_batch"]').click();

    // Analyze <ds-export-batch-selector> for accessibility
    testA11y('ds-export-batch-selector');
  });
});
