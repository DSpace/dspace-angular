beforeEach(() => {
  cy.visit('/communities/create');
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));

  // Accept all cookies to make sure cookie window does not block other elements
  cy.get('.orejime-Button--save').click();
});

it('should show loading component while saving', () => {
  const title = 'Test Community Title';
  cy.get('#title').type(title);

  cy.get('button[type="submit"]').click();

  cy.get('ds-loading').should('be.visible');
});
