/**
 * Regression test for a Cross-Site Scripting (XSS) vulnerability that was introduced by
 * https://github.com/DSpace/dspace-angular/pull/4776.
 *
 * This test creates a new item submission whose abstract contains such a payload and verifies that:
 *  - the payload is NOT executed (no JavaScript side effect happens), and
 *  - the dangerous `onerror` attribute is stripped from the rendered markup (while safe, surrounding
 *    markup/tags are preserved),
 * when the abstract is displayed via the `[dsMetadata]` directive.
 *
 */
describe('Metadata XSS sanitization', () => {
  // A classic XSS payload: an image with a broken `src` so that its `onerror` handler fires as soon as
  // the browser tries (and fails) to load it. If the payload is not sanitized, `onerror` will run and set
  // `window.dsXssExecuted = true`.
  const XSS_PAYLOAD = 'XSS Test <img src="x" onerror="window.dsXssExecuted = true;"/>';
  const SAFE_TEXT = 'XSS Test';
  const UNIQUE_TITLE = `XSS sanitization test item ${Date.now()}`;

  /**
   * Asserts that the XSS payload has NOT executed on the current page.
   */
  function assertXssDidNotExecute(): void {
    cy.window().then((win: any) => {
      expect(win.dsXssExecuted).to.not.equal(true);
    });
  }

  it('should sanitize a malicious item abstract and not execute injected script when rendered via [dsMetadata]', () => {
    cy.visit('/mydspace');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.env(['DSPACE_TEST_SUBMIT_USER', 'DSPACE_TEST_SUBMIT_USER_PASSWORD']).then(({ DSPACE_TEST_SUBMIT_USER, DSPACE_TEST_SUBMIT_USER_PASSWORD }) => {
      cy.loginViaForm(DSPACE_TEST_SUBMIT_USER, DSPACE_TEST_SUBMIT_USER_PASSWORD);
    });

    // Start a submission
    cy.get('button[data-test="submission-dropdown"]').click();
    cy.get('#entityControlsDropdownMenu button[title="none"]').click();
    cy.get('ds-authorized-collection-selector input[type="search"]').type(Cypress.expose('DSPACE_TEST_SUBMIT_COLLECTION_NAME'));
    cy.get('ds-authorized-collection-selector button[title="'.concat(Cypress.expose('DSPACE_TEST_SUBMIT_COLLECTION_NAME')).concat('"]')).click();

    // Give the item a unique (safe) title so we can reliably find it again afterward
    cy.get('#dc_title', { timeout: 10000 }).type(UNIQUE_TITLE);

    // Enter our malicious abstract into the dc.description.abstract field
    cy.get('#dc_description_abstract').type(XSS_PAYLOAD);

    // Save for Later to persist the (unsanitized, as stored) abstract on the workspace item
    cy.get('ds-submission-form-footer [data-test="save-for-later"]').click();

    // "Save for Later" should send us to MyDSpace
    cy.url().should('include', '/mydspace');
    // The malicious payload should NOT have executed while the submission form/footer rendered the abstract
    assertXssDidNotExecute();

    // Close any open notifications, to make sure they don't get in the way of next steps
    cy.get('[data-bs-dismiss="alert"]').click({ multiple: true });

    // Search for the item we just created via its unique title
    cy.intercept('GET', '/server/api/discover/search/objects*').as('search-results');
    cy.get('[data-test="search-box"]').type(UNIQUE_TITLE);
    cy.get('[data-test="search-button"]').click();
    cy.wait('@search-results');

    // Find the specific result matching our unique title, and scope all further assertions to it.
    cy.contains('[data-test="list-object"]', UNIQUE_TITLE, { timeout: 10000 })
      .should('exist')
      .as('result');

    // The XSS payload must NOT have executed while the [dsMetadata] directive rendered the abstract
    assertXssDidNotExecute();

    // The abstract should be rendered (via the [dsMetadata] directive) inside a truncatable part
    cy.get('@result').find('.item-list-abstract span').first().then(($abstract) => {
      // Sanitization removes *dangerous attributes* (like `onerror`), but it does NOT necessarily
      // remove the surrounding element itself (e.g. `<img>` is a permitted tag). So we assert that:
      // - the safe text content is still present,
      // - the `onerror` attribute is gone from the markup entirely,
      // - if the `<img>` tag survived sanitization, it has no `onerror` attribute on it.
      expect($abstract.text()).to.include(SAFE_TEXT);
      expect($abstract.html()).to.not.include('onerror');

      const img = $abstract.find('img');
      if (img.length > 0) {
        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        expect(img.attr('onerror')).to.be.undefined;
      }
    });
  });
});

