beforeEach(() => {
  cy.visit('/communities/create');
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

it('should show loading component while saving', () => {
  const title = 'Test Community Title';
  cy.get('#title-en').type(title);

  cy.get('button[type="button"].btn-primary').click();

  cy.get('ds-loading').should('be.visible');
});
