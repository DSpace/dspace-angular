describe('Homepage', () => {
  beforeEach(() => {
    // All tests start with visiting homepage
    cy.visit('/');
  });

  it('should display translated title "DSpace Angular :: Home"', () => {
    cy.title().should('eq', 'DSpace Angular :: Home');
  });

  it('should contain a news section', () => {
    cy.get('ds-home-news').should('be.visible');
  });

  it('should have a working search box', () => {
    const queryString = 'test';
    cy.get('ds-search-form input[name="query"]').type(queryString);
    cy.get('ds-search-form button.search-button').click();
    cy.url().should('include', '/search');
    cy.url().should('include', 'query=' + encodeURI(queryString));
  });

  it('should pass accessibility tests', () => {
    // first must inject Axe into current page
    cy.injectAxe();

    // Analyze entire page for accessibility issues
    // NOTE: this test checks accessibility of header/footer as well
    cy.checkA11y({
      exclude: [
        ['#klaro'],                   // Klaro plugin (privacy policy popup) has color contrast issues
        ['#search-navbar-container'], // search in navbar has duplicative ID. Will be fixed in #1174
        ['.dropdownLogin']            // "Log in" link in header has color contrast issues
      ],
    });
  });
});
