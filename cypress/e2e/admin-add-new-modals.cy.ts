import { testA11y } from 'cypress/support/utils';

describe('Admin Add New Modals', () => {
  beforeEach(() => {
    // Must login as an Admin for sidebar to appear
    cy.visit('/login');
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('Add new Community modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-new-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-new-title"]').click();

    cy.get('a[data-test="menu.section.new_community"]').click();

    // Analyze <ds-create-community-parent-selector> for accessibility
    testA11y('ds-create-community-parent-selector');
  });

  it('Add new Collection modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-new-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-new-title"]').click();

    cy.get('a[data-test="menu.section.new_collection"]').click();

    // Analyze <ds-create-collection-parent-selector> for accessibility
    testA11y('ds-create-collection-parent-selector');
  });

  it('Add new Item modal should pass accessibility tests', () => {
    // Pin the sidebar open
    cy.get('[data-test="sidebar-collapse-toggle"]').trigger('mouseover');
    cy.get('[data-test="sidebar-collapse-toggle"]').click();

    // Click on entry of menu
    cy.get('[data-test="admin-menu-section-new-title"]').should('be.visible');
    cy.get('[data-test="admin-menu-section-new-title"]').click();

    cy.get('a[data-test="menu.section.new_item"]').click();

    // Analyze <ds-create-item-parent-selector> for accessibility
    testA11y('ds-create-item-parent-selector');
  });
});
