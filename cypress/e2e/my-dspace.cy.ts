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

  describe('Testing new submissions', () => {
    const startSubmission = (title: string, collection: string) => {
      cy.get('#entityControlsDropdownMenu button[title="'.concat(title).concat('"]')).click();

      //Validate selector be visible and enter SUBMIT_COLLECTION_NAME
      cy.get('ds-create-item-parent-selector').should('be.visible');
      cy.get('ds-authorized-collection-selector input[type="search"]').type(collection);
      cy.get('ds-create-item-parent-selector button[title="'.concat(collection).concat('"]')).click();
    };

    const fillSubmission = (requiredInputs: Array<string>, title: string = 'test item', name: string = 'Tester') => {
      if (requiredInputs.includes('title')) {
        cy.get('#dc_title').type(title);
      }
      if (requiredInputs.includes('date_issued')) {
        const currentYear = new Date().getFullYear();
        cy.get('#dc_date_issued_year').type(currentYear.toString());
      }
      if (requiredInputs.includes('type')) {
        cy.get('input[name="dc.type"]').click();
        cy.get('.dropdown-menu').should('be.visible').contains('button', 'Other').click();
      }
      if (requiredInputs.includes('givenName')) {
        cy.get('#person_givenName').type(name);
      }
      if (requiredInputs.includes('legalName')) {
        cy.get('#organization_legalName').type(name);
      }

      cy.get('#granted').check();

      const fileName = 'example.pdf';
      cy.get('ds-uploader .well').selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop' });
      cy.get('ds-uploader .filename').should('exist').and('contain.text', fileName);
      cy.get('ds-uploader .upload-item-top').should('have.length', 1);
      cy.wait(1000);

      cy.get('button[data-test="deposit"]').click();
    };

    const validateSubmission = (title: string = 'test item') => {
      cy.url().should('include', '/mydspace');
      cy.contains('[data-test="list-object"]', title).should('exist');
    };

    //Enter to MyDspace and validate that submission-dropdown is visible
    beforeEach(() => {
      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      cy.get('[data-test="submission-dropdown"]').should('be.visible').click();
    });

    it('should let you send a new Item', () => {
      const title = 'test item';
      startSubmission('none', Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME'));
      fillSubmission(['title', 'date_issued', 'type'], title);
      validateSubmission(title);
    });

    it('should let you send a new Publication', () => {
      const title = 'test publication';
      startSubmission('Publication', Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME'));
      fillSubmission(['title', 'date_issued', 'type'], title);
      validateSubmission(title);
    });

    it('should let you send a new Peson', () => {
      const name = 'Tester';
      startSubmission('Person', Cypress.env('DSPACE_TEST_PEOPLE_COLLECTION_NAME'));
      fillSubmission(['givenName'], undefined, name);
      validateSubmission(name);
    });

    it('should let you send a new Org Unit', () => {
      const name = 'test Org Unit';
      startSubmission('OrgUnit', Cypress.env('DSPACE_TEST_ORG_UNIT_COLLECTION_NAME'));
      fillSubmission(['legalName'], undefined, name);
      validateSubmission(name);
    });

    it('should let you send a new Journal', () => {
      const title = 'test Journal';
      startSubmission('Journal', Cypress.env('DSPACE_TEST_JOURNAL_COLLECTION_NAME'));
      fillSubmission(['title'], title);
      validateSubmission(title);
    });

    it('should let you send a new Journal Volume', () => {
      const title = 'test Journal Volume';
      startSubmission('JournalVolume', Cypress.env('DSPACE_TEST_JOURNAL_VOLUME_COLLECTION_NAME'));
      fillSubmission(['title'], title);
      validateSubmission(title);
    });

    it('should let you send a new Journal Issue', () => {
      const title = 'test Journal Issue';
      startSubmission('JournalIssue', Cypress.env('DSPACE_TEST_JOURNAL_ISSUE_COLLECTION_NAME'));
      fillSubmission(['title'], title);
      validateSubmission(title);
    });

  });

  describe('Testing import external button', () => {
    it('should pass accesibility tests', () => {
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

    it('should let you import an item from external source', () => {
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

      // Search a value
      cy.get('input[data-test="import-external-input"]').type('test');
      cy.get('button[data-test="import-external-search"]').click();

      // Select first item
      cy.get('ds-external-source-entry-list-submission-element div').should('exist');
      cy.get('ds-importable-list-item-control button').first().click();

      // Validate that import modal is visible
      cy.get('ds-submission-import-external-preview').should('be.visible');
      cy.get('ds-submission-import-external-preview button.btn-success').scrollIntoView().should('be.visible').click();

      // ds-collection-dropdown should be visible
      cy.get('ds-collection-dropdown').should('be.visible');

      // Type the name of the collection and click
      cy.get('ds-collection-dropdown input[type="search"]').type(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME'));
      cy.get('ds-collection-dropdown li[title="'.concat(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME')).concat('"]')).click();

      // And the new URL should include /workspaceitems, as we've started a new submission
      cy.url().should('include', '/workspaceitems');
    });

    it('should let you import an publication from external source', () => {
      cy.visit('/mydspace');

      // This page is restricted, so we will be shown the login form. Fill it out & submit.
      cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

      // Open the New Import dropdown
      cy.get('button[data-test="import-dropdown"]').click();

      // Click on the "Item" type in that dropdown
      cy.get('#importControlsDropdownMenu button[title="Publication"]').click();

      // New URL should include /import-external, as we've moved to the import page
      cy.url().should('include', '/import-external');

      // The external import searchbox should be visible
      cy.get('ds-submission-import-external-searchbar').should('be.visible');

      // Search a value
      cy.get('input[data-test="import-external-input"]').type('test');
      cy.get('button[data-test="import-external-search"]').click();

      // Select first item
      cy.get('ds-external-source-entry-list-submission-element div').should('exist');
      cy.get('ds-importable-list-item-control button').first().click();

      // Validate that import modal is visible
      cy.get('ds-submission-import-external-preview').should('be.visible');
      cy.get('ds-submission-import-external-preview button.btn-success').scrollIntoView().should('be.visible').click();

      // ds-collection-dropdown should be visible
      cy.get('ds-collection-dropdown').should('be.visible');

      // Type the name of the collection and click
      cy.get('ds-collection-dropdown input[type="search"]').type(Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME'));
      cy.get('ds-collection-dropdown li[title="'.concat(Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME')).concat('"]')).click();

      // And the new URL should include /workspaceitems, as we've started a new submission
      cy.url().should('include', '/workspaceitems');
    });

    it('should let you import a person from external source', () => {
      cy.visit('/mydspace');

      // This page is restricted, so we will be shown the login form. Fill it out & submit.
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));

      // Open the New Import dropdown
      cy.get('button[data-test="import-dropdown"]').click();

      // Click on the "Item" type in that dropdown
      cy.get('#importControlsDropdownMenu button[title="Person"]').click();

      // New URL should include /import-external, as we've moved to the import page
      cy.url().should('include', '/import-external');

      // The external import searchbox should be visible
      cy.get('ds-submission-import-external-searchbar').should('be.visible');

      // Search a value
      cy.get('input[data-test="import-external-input"]').type('John');
      cy.get('button[data-test="import-external-search"]').click();

      // Select first item
      cy.get('ds-external-source-entry-list-submission-element div').should('exist');
      cy.get('ds-importable-list-item-control button').first().click();

      // Validate that import modal should exists
      cy.get('ds-submission-import-external-preview').should('exist');
      cy.get('ds-submission-import-external-preview button.btn-success').scrollIntoView().should('be.visible').click();

      // ds-collection-dropdown should be visible
      cy.get('ds-collection-dropdown').should('be.visible');

      // Type the name of the collection and click
      cy.get('ds-collection-dropdown input[type="search"]').type(Cypress.env('DSPACE_TEST_PEOPLE_COLLECTION_NAME'));
      cy.get('ds-collection-dropdown li[title="'.concat(Cypress.env('DSPACE_TEST_PEOPLE_COLLECTION_NAME')).concat('"]')).click();

      // And the new URL should include /workspaceitems, as we've started a new submission
      cy.url().should('include', '/workspaceitems');
    });
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

    //wait to ds-uploader render
    cy.wait(500);

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

  describe('Testing workflow tasks', () => {
    const generateNewItemToWorkflow = () => {
      const fileName = 'example.pdf';
      const currentYear = new Date().getFullYear();

      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));
      cy.get('ds-my-dspace-page').should('be.visible');

      cy.wait(500);
      cy.get('ds-uploader .well').selectFile(`cypress/fixtures/${fileName}`, { action: 'drag-drop' });
      cy.get('ds-collection-dropdown').should('be.visible');
      cy.get('ds-collection-dropdown input[type="search"]').type(Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME'));
      cy.get('ds-collection-dropdown li[title="'.concat(Cypress.env('DSPACE_TEST_SUBMIT_WORKFLOW_COLLECTION_NAME')).concat('"]')).click();
      cy.url().should('include', '/workspaceitems');

      cy.get('#dc_title').type('Workflow test item');
      cy.get('#dc_date_issued_year').type(currentYear.toString());
      cy.get('input[name="dc.type"]').click();
      cy.get('.dropdown-menu').should('be.visible').contains('button', 'Other').click();
      cy.get('#granted').check();

      cy.get('button[data-test="deposit"]').click();

      //We always log out to allow other methods and tasks to log in as the admin user
      cy.visit('/logout');
      cy.get('button[data-test="logout-button"]').should('be.visible').click();
      cy.url().should('include', '/home');
    };

    const takeLastSubmittedItem = () => {
      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      cy.get('[data-test="objects"]').should('be.visible');

      cy.intercept({
        method: 'GET',
        url: '/server/api/discover/search/objects**',
      }).as('workflowSearch');
      cy.get('ds-search-switch-configuration select option[data-test="workflow"]')
        .should('exist')
        .invoke('attr', 'value')
        .then(value => {
          cy.get('ds-search-switch-configuration select').select(value);
        });
      cy.wait('@workflowSearch');
      cy.url().should('include', 'configuration=workflow');

      //Wait to render the list and at leat one item
      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('[data-test="claim-button"]').should('exist');

      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaim = [...$items].find(item =>
            item.querySelector('[data-test="claim-button"]'),
          );
          cy.wrap(itemWithClaim).should('exist');
          cy.wrap(itemWithClaim).within(() => {
            cy.get('ds-pool-task-actions').should('exist');
            cy.get('[data-test="claim-button"]').click();
          });
        });

      //We reload the page to make the next step work with the last workflow item
      cy.reload();
    };

    it('should let you see workflow item metadata', () => {
      //Prepare the test
      generateNewItemToWorkflow();
      takeLastSubmittedItem();

      //Validate that the list is on the view
      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-claimed-task-actions').should('exist');

      //Find the first item with ds-claimed-task-actions in it
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-claimed-task-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).within(() => {
            cy.get('ds-claimed-task-actions .workflow-view').should('exist');
            cy.get('ds-claimed-task-actions .workflow-view').click();
          });
        });

      //And validate that the url is the correct
      cy.location('pathname').should('match', /\/workflowitems\/\d+\/view/);
    });

    //This test uses the last item selected in the previous test workflow, so no preparation is necessary.
    it('should let you return to pool the workflow item', () => {
      //Log in
      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      cy.get('[data-test="objects"]').should('be.visible');

      //Go to workflow items
      cy.intercept({
        method: 'GET',
        url: '/server/api/discover/search/objects**',
      }).as('workflowSearch');
      cy.get('ds-search-switch-configuration select option[data-test="workflow"]')
        .should('exist')
        .invoke('attr', 'value')
        .then(value => {
          cy.get('ds-search-switch-configuration select').select(value);
        });
      cy.wait('@workflowSearch');
      cy.url().should('include', 'configuration=workflow');

      //Validate that the list is on the view
      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-claimed-task-actions').should('exist');

      //Find the first item with ds-claimed-task-actions in it
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-claimed-task-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).as('selectedItem');
          cy.wrap(itemWithClaimed).within(() => {
            //And back to pool the item
            cy.get('ds-claimed-task-actions-return-to-pool button').should('exist');
            cy.get('ds-claimed-task-actions-return-to-pool button').click();
          });
        });

      //Finally, when you click the ‘Claim’ button, the actions for the selected item should have ds-pool-task-actions
      cy.get('@selectedItem').within(() => {
        cy.get('ds-pool-task-actions').should('exist');
      });
    });

    it('should let you edit a workflow item metadata', () => {
      //prepare the test
      takeLastSubmittedItem();

      //Validate that the list is on the view
      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-claimed-task-actions').should('exist');

      //Find the first item with ds-claimed-task-actions in it
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-claimed-task-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).within(() => {
            cy.get('ds-claimed-task-actions-edit-metadata a').should('exist');
            cy.get('ds-claimed-task-actions-edit-metadata a').click();
          });
        });

      //Validate that now the url is workflow edit and make a change
      cy.location('pathname').should('match', /\/workflowitems\/\d+\/edit/);
      cy.get('#dc_title').clear().type('Workflow test item edited');
      cy.get('button[data-test="save-for-later"]').scrollIntoView();
      cy.get('button[data-test="save-for-later"]').click();

      //Finally validate that the we back to workflow list and the item is edited
      cy.url().should('include', 'configuration=workflow');
      cy.get('ds-item-list-preview h2').should('contain', 'Workflow test item edited');
    });

    it('should let you reject an workflow item', () => {
      //Log in
      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      cy.get('[data-test="objects"]').should('be.visible');

      //Go to workflow items
      cy.intercept({
        method: 'GET',
        url: '/server/api/discover/search/objects**',
      }).as('workflowSearch');
      cy.get('ds-search-switch-configuration select option[data-test="workflow"]')
        .should('exist')
        .invoke('attr', 'value')
        .then(value => {
          cy.get('ds-search-switch-configuration select').select(value);
        });
      cy.wait('@workflowSearch');
      cy.url().should('include', 'configuration=workflow');

      //Validate that the list is on the view
      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-claimed-task-actions').should('exist');

      //Find the first item with ds-claimed-task-actions in it
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-claimed-task-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).as('selectedItem');
          cy.wrap(itemWithClaimed).within(() => {
            //And click on reject button
            cy.get('ds-claimed-task-actions-reject button').should('exist');
            cy.get('ds-claimed-task-actions-reject button').click();
          });
        });

      //Reject the item
      cy.get('ngb-modal-window').should('be.visible');
      cy.get('ngb-modal-window textarea').type('workflow item test reject reason');
      cy.get('ngb-modal-window button[id=btn-chat]').click();

      //And validate that the item is really rekected
      cy.get('ds-claimed-declined-search-result-list-element').should('be.visible');
    });

    it('should let you approve an workflow item', () => {
      //Prepare the test
      generateNewItemToWorkflow();
      takeLastSubmittedItem();


      //Validate that the list is on the view
      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-claimed-task-actions').should('exist');

      //Find the first item with ds-claimed-task-actions in it
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-claimed-task-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).as('selectedItem');
          cy.wrap(itemWithClaimed).within(() => {
            //And click on reject button
            cy.get('ds-claimed-task-actions-approve button').should('exist');
            cy.get('ds-claimed-task-actions-approve button').click();
          });
        });

      //And validate that the item is really rekected
      cy.get('ds-claimed-approved-search-result-list-element').should('be.visible');
    });
  });

  describe('Testing supervised items', () => {
    before(()=> {
      cy.visit('/admin/workflow');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      //We are going to use an submission test item to generate a supervised item
      cy.get('input[data-test="search-box"]').type('workflow item');
      cy.get('button[data-test="search-button"]').type('workflow item');

      cy.get('[data-test="list-object"]')
        .filter(':has(.supervision-group-selector)')
        .first()
        .find('.supervision-group-selector')
        .click();

      cy.get('#supervisionOrder').should('be.visible');
      //Select order type as editor
      cy.get('#supervisionOrder').select('EDITOR');

      //And select group as administrador
      cy.get('ds-group-search-box input#query').type('Administrator');
      cy.get('ds-group-search-box button[type="submit"]').click();
      cy.get('#groups button').click();

      //Finally save
      cy.get('div.modal-footer button.save').click();
      cy.get('div.notification-title').should('be.visible');
    });

    it('should let you view metadata of supervised item', () => {
      //Go to my Dspace
      cy.visit('/mydspace');
      cy.get('[data-test="objects"]').should('be.visible');

      //Select the supervisedItemSearch value on selector
      cy.intercept({
        method: 'GET',
        url: '/server/api/discover/search/objects**',
      }).as('SupervisedItemSearch');

      cy.get('ds-search-switch-configuration select option[data-test="supervisedWorkspace"]')
        .should('exist')
        .invoke('attr', 'value')
        .then(value => {
          cy.get('ds-search-switch-configuration select').select(value);
        });

      cy.wait('@SupervisedItemSearch');
      //Validate that url gets updated
      cy.url().should('include', 'configuration=supervisedWorkspace');

      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-workspaceitem-actions').should('exist');

      //Find the first item available and hit view option
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-workspaceitem-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).within(() => {
            cy.get('ds-workspaceitem-actions .workflow-view').should('exist');
            cy.get('ds-workspaceitem-actions .workflow-view').click();
          });
        });

      //And validate that the url is the correct
      cy.location('pathname').should('match', /\/workspaceitems\/\d+\/view/);
    });

    it('should let you edit metadata of supervised item', () => {
      //Visit myDSpace page
      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      cy.get('[data-test="objects"]').should('be.visible');

      //Select the supervisedItemSearch value on selector
      cy.intercept({
        method: 'GET',
        url: '/server/api/discover/search/objects**',
      }).as('SupervisedItemSearch');

      cy.get('ds-search-switch-configuration select option[data-test="supervisedWorkspace"]')
        .should('exist')
        .invoke('attr', 'value')
        .then(value => {
          cy.get('ds-search-switch-configuration select').select(value);
        });

      cy.wait('@SupervisedItemSearch');
      //Validate that url gets updated
      cy.url().should('include', 'configuration=supervisedWorkspace');

      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-workspaceitem-actions').should('exist');

      //Find the first item available and hit in edit button
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-workspaceitem-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).within(() => {
            cy.get('ds-workspaceitem-actions .edit-btn').should('exist');
            cy.get('ds-workspaceitem-actions .edit-btn').click();
          });
        });

      //Change the title of the supervised item
      cy.location('pathname').should('match', /\/workspaceitems\/\d+\/edit/);
      cy.get('#dc_title').clear().type('Supervised test item edited');
      cy.get('button[data-test="save-for-later"]').scrollIntoView();
      cy.get('button[data-test="save-for-later"]').click();

      //And validate that the change get applied
      cy.url().should('include', 'configuration=supervisedWorkspace');
      cy.get('span.item-list-title').should('contain', 'Supervised test item edited');
    });

    it('should let you delete a supervised item', () => {
      //Visit myDSpace page
      cy.visit('/mydspace');
      cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
      cy.get('[data-test="objects"]').should('be.visible');

      //Select the supervisedItemSearch value on selector
      cy.intercept({
        method: 'GET',
        url: '/server/api/discover/search/objects**',
      }).as('SupervisedItemSearch');

      cy.get('ds-search-switch-configuration select option[data-test="supervisedWorkspace"]')
        .should('exist')
        .invoke('attr', 'value')
        .then(value => {
          cy.get('ds-search-switch-configuration select').select(value);
        });

      cy.wait('@SupervisedItemSearch');
      //Validate that url gets updated
      cy.url().should('include', 'configuration=supervisedWorkspace');

      cy.get('[data-test="list-object"]').should('have.length.greaterThan', 0);
      cy.get('ds-workspaceitem-actions').should('exist');

      //Find the first item available and hit in edit button
      cy.get('[data-test="list-object"]')
        .then(($items) => {
          const itemWithClaimed = [...$items].find(item =>
            item.querySelector('ds-workspaceitem-actions'),
          );
          cy.wrap(itemWithClaimed).should('exist');
          cy.wrap(itemWithClaimed).within(() => {
            cy.get('ds-workspaceitem-actions .btn-danger').should('exist');
            cy.get('ds-workspaceitem-actions .btn-danger').click();
          });
        });

      //Confirm delete the supervised item
      cy.get('ngb-modal-window').should('be.visible');
      cy.get('ngb-modal-window button[id=delete_confirm]').click();

      //And validate that the change get applied
      cy.url().should('include', 'configuration=supervisedWorkspace');
      cy.get('ds-notification').should('be.visible');
    });
  });
});
