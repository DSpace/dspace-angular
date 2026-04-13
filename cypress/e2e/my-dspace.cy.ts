import { testA11y } from 'cypress/support/utils';

describe('My DSpace page', () => {
  it('should display recent submissions and pass accessibility tests', () => {
    cy.visit('/mydspace');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    cy.get('ds-my-dspace-page').should('be.visible');

    // At least one recent submission should be displayed
    cy.get('[data-test="list-object"]').should('be.visible');

    // Click each filter toggle to open *every* filter
    // (As we want to scan filter section for accessibility issues as well)
    cy.get('.filter-toggle').click({ multiple: true });

    // Analyze <ds-my-dspace-page> for accessibility issues
    testA11y('ds-my-dspace-page');
  });

  it('should have a working detailed view that passes accessibility tests', () => {
    cy.visit('/mydspace');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    cy.get('ds-my-dspace-page').should('be.visible');

    // Click button in sidebar to display detailed view
    cy.get('ds-search-sidebar [data-test="detail-view"]').click();

    cy.get('ds-object-detail').should('be.visible');

    // Analyze <ds-my-dspace-page> for accessibility issues
    testA11y('ds-my-dspace-page');
  });

  // NOTE: Deleting existing submissions is exercised by submission.spec.ts
  it('should let you start a new submission & edit in-progress submissions', () => {
    cy.visit('/mydspace');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    // Open the New Submission dropdown
    cy.get('button[data-test="submission-dropdown"]').click();
    // Click on the "Item" type in that dropdown
    cy.get('#entityControlsDropdownMenu button[title="none"]').click();

    // This should display the <ds-create-item-parent-selector> (popup window)
    cy.get('ds-create-item-parent-selector').should('be.visible');

    // Type in a known Collection name in the search box
    cy.get('ds-authorized-collection-selector input[type="search"]').type(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME'));

    // Click on the button matching that known Collection name
    cy.get('ds-authorized-collection-selector button[title="'.concat(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME')).concat('"]')).click();

    // New URL should include /workspaceitems, as we've started a new submission
    cy.url().should('include', '/workspaceitems');

    // The Submission edit form tag should be visible
    cy.get('ds-submission-edit').should('be.visible');

    // A Collection menu button should exist & its value should be the selected collection
    cy.get('#collectionControlsMenuButton span').should('have.text', Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME'));

    // Now that we've created a submission, we'll test that we can go back and Edit it.
    // Get our Submission URL, to parse out the ID of this new submission
    cy.location().then(fullUrl => {
      // This will be the full path (/workspaceitems/[id]/edit)
      const path = fullUrl.pathname;
      // Split on the slashes
      const subpaths = path.split('/');
      // Part 2 will be the [id] of the submission
      const id = subpaths[2];

      // Click the "Save for Later" button to save this submission
      cy.get('ds-submission-form-footer [data-test="save-for-later"]').click();

      // "Save for Later" should send us to MyDSpace
      cy.url().should('include', '/mydspace');

      // Close any open notifications, to make sure they don't get in the way of next steps
      cy.get('[data-bs-dismiss="alert"]').click({ multiple: true });

      // This is the GET command that will actually run the search
      cy.intercept('GET', '/server/api/discover/search/objects*').as('search-results');
      // On MyDSpace, find the submission we just created via its ID
      cy.get('[data-test="search-box"]').type(id);
      cy.get('[data-test="search-button"]').click();

      // Wait for search results to come back from the above GET command
      cy.wait('@search-results');

      // Click the Edit button for this in-progress submission
      cy.get('#edit_' + id).click();

      // Should send us back to the submission form
      cy.url().should('include', '/workspaceitems/' + id + '/edit');

      // Discard our new submission by clicking Discard in Submission form & confirming
      cy.get('ds-submission-form-footer [data-test="discard"]').click();
      cy.get('button#discard_submit').click();

      // Discarding should send us back to MyDSpace
      cy.url().should('include', '/mydspace');
    });
  });

  it('should let you import from external sources', () => {
    cy.visit('/mydspace');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    // Open the New Import dropdown
    cy.get('button[data-test="import-dropdown"]').click();
    // Click on the "Item" type in that dropdown
    cy.get('#importControlsDropdownMenu button[title="none"]').click();

    // New URL should include /import-external, as we've moved to the import page
    cy.url().should('include', '/import-external');

    // The external import searchbox should be visible
    cy.get('ds-submission-import-external-searchbar').should('be.visible');

    // Test for accessibility issues
    testA11y('ds-submission-import-external');
  });

  it('should let you filter to only archived items', () => {
    cy.visit('/mydspace');

    //To wait filter be ready
    cy.intercept({
      method: 'GET',
      url: '/server/api/discover/facets/namedresourcetype**',
    }).as('facetNamedResourceType');

    //This page is restricted, so we will be shown the login form. Fill it in and submit it
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));

    //Wait for the page to display
    cy.wait('@facetNamedResourceType');

    //Open all filters
    cy.get('.filter-toggle').click({ multiple: true });

    //The authority filter should be visible.
    cy.get('ds-search-authority-filter').scrollIntoView().should('be.visible');

    //Intercept the request to filter and the request of filter.
    cy.intercept({
      method: 'GET',
      url: '/server/api/discover/search/objects**',
    }).as('filterByItem');

    //Apply the filter to the “archived” items.
    cy.get('ds-search-authority-filter a[href*="f.namedresourcetype=item,authority"]').find('input[type="checkbox"]').click();

    //Wait for the response.
    cy.wait('@filterByItem');

    //Check that we have at least one item and that they all have the archived badge.
    cy.get('ds-item-search-result-list-element-submission').should('exist');
    cy.get('ds-item-search-result-list-element-submission')
      .each(($item) => {
        cy.wrap($item)
          .find('.badge-archived')
          .should('exist');
      });
  });

  //This test also generate an item to validate workflow task section
  it('should upload a file via drag & drop, display it in the UI and submit the item', () => {
    const fileName = 'example.pdf';
    const currentYear = new Date().getFullYear();

    cy.visit('/mydspace');

    //This page is restricted, so we will be shown the login form. Fill it in and submit it
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    //Wait for the page to display
    cy.get('ds-my-dspace-page').should('be.visible');

    //Select the uploader and perform the drag-and-drop action.
    cy.get('ds-uploader .well').selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop' });

    //Validate that the file appears in the UI
    cy.get('ds-uploader .filename').should('exist').and('contain.text', fileName);

    //Validate that there is now exactly 1 file in the queue
    cy.get('ds-uploader .upload-item-top').should('have.length', 1);

    // This should display the <ds-collection-dropdown> (popup window)
    cy.get('ds-collection-dropdown').should('be.visible');

    // Type in a known Collection name in the search box
    cy.get('ds-collection-dropdown input[type="search"]').type(Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME'));

    // Click on the button matching that known Collection name
    cy.get('ds-collection-dropdown li[title="'.concat(Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME')).concat('"]')).click();

    // New URL should include /workspaceitems, as we've started a new submission
    cy.url().should('include', '/workspaceitems');

    //Fill required fields
    cy.get('#dc_title').type('Workflow test item');
    cy.get('#dc_date_issued_year').type(currentYear.toString());
    cy.get('input[name="dc.type"]').click();
    cy.get('.dropdown-menu').should('be.visible').contains('button', 'Other').click();
    cy.get('#granted').check();

    //Press deposit button
    cy.get('button[data-test="deposit"]').click();

    //validate that URL is /mydspace
    cy.url().should('include', '/mydspace');

  });

  it('should let you take task from workflow', () => {
    cy.visit('/mydspace');

    //This page is restricted, so we will be shown the login form. Fill it in and submit it
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));

    //Wait for the page to display
    cy.get('ds-my-dspace-page').should('be.visible');

    //And wait to list is ready
    cy.get('[data-test="objects"]').should('be.visible');

    //Intercept to await backend response
    cy.intercept({
      method: 'GET',
      url: '/server/api/discover/search/objects**',
    }).as('workflowSearch');

    //Change view to see workflow tasks
    cy.get('ds-search-switch-configuration select option[data-test="workflow"]')
      .should('exist')
      .invoke('attr', 'value')
      .then(value => {
        cy.get('ds-search-switch-configuration select').select(value);
      });

    //Await backend search response
    cy.wait('@workflowSearch');

    //Validate URL
    cy.url().should('include', 'configuration=workflow');

    //Wait to render the list and at leat one item
    cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
    cy.get('[data-test="claim-button"]').should('exist');

    //Check that we have at least one item in worflow search, the item have claim-button and can click in it.
    cy.get('[data-test="list-object"]')
      .then(($items) => {
        const itemWithClaim = [...$items].find(item =>
          item.querySelector('[data-test="claim-button"]'),
        );
        cy.wrap(itemWithClaim).should('exist');
        cy.wrap(itemWithClaim).as('selectedItem');
        cy.wrap(itemWithClaim).within(() => {
          cy.get('ds-pool-task-actions').should('exist');
          cy.get('[data-test="claim-button"]').click();
        });
      });

    //Finally, when you click the ‘Claim’ button, the actions for the selected item change
    cy.get('@selectedItem').within(() => {
      cy.get('ds-claimed-task-actions').should('exist');
    });
  });
});
