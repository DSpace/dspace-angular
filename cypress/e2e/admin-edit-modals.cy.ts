import { testA11y } from 'cypress/support/utils';

describe('Admin Edit Modals', () => {
  beforeEach(() => {
    // Must login as an Admin for sidebar to appear
    cy.visit('/login');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('Edit Community modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-edit-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-edit-title"]').click();

    cy.get('a[data-test="menu.section.edit_community"]').click();

    // Analyze <ds-edit-community-selector> for accessibility
    testA11y('ds-edit-community-selector');
  });

  it('Edit Collection modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-edit-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-edit-title"]').click();

    cy.get('a[data-test="menu.section.edit_collection"]').click();

    // Analyze <ds-edit-collection-selector> for accessibility
    testA11y('ds-edit-collection-selector');
  });

  it('Edit Item modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-edit-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-edit-title"]').click();

    cy.get('a[data-test="menu.section.edit_item"]').click();

    // Analyze <ds-edit-item-selector> for accessibility
    testA11y('ds-edit-item-selector');
  });
});
