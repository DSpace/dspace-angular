const ADD_TEMPLATE_ITEM_PAGE = '/collections/'.concat(Cypress.env('DSPACE_TEST_COLLECTION')).concat('/itemtemplate');

describe('Item Template', () => {
  beforeEach(() => {
    cy.visit(ADD_TEMPLATE_ITEM_PAGE);
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
  });

  it('should load properly', () => {
    cy.contains('.ds-header-row .lbl-cell', 'Field', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('.ds-header-row b', 'Value', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('.ds-header-row b', 'Lang', { timeout: 10000 }).should('exist').should('be.visible');
    cy.contains('.ds-header-row b', 'Edit', { timeout: 10000 }).should('exist').should('be.visible');
  });
});
