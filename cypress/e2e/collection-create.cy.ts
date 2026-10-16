beforeEach(() => {
  cy.visit('/collections/create?parent='.concat(Cypress.expose('DSPACE_TEST_COMMUNITY')));
  cy.env(['DSPACE_TEST_ADMIN_USER', 'DSPACE_TEST_ADMIN_PASSWORD']).then(({ DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD }) => {
    cy.loginViaForm(DSPACE_TEST_ADMIN_USER, DSPACE_TEST_ADMIN_PASSWORD);
  });
});

it('should show loading component while saving', () => {
  const title = 'Test Collection Title';
  cy.get('#title').type(title);

  cy.get('button[type="submit"]').click();

  cy.get('ds-loading').should('be.visible');
});
