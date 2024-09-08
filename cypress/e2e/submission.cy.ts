import { testA11y } from 'cypress/support/utils';
//import { TEST_SUBMIT_USER, TEST_SUBMIT_USER_PASSWORD, TEST_SUBMIT_COLLECTION_NAME, TEST_SUBMIT_COLLECTION_UUID, TEST_ADMIN_USER, TEST_ADMIN_PASSWORD } from 'cypress/support/e2e';
import { Options } from 'cypress-axe';

describe('New Submission page', () => {

  // NOTE: We already test that new Item submissions can be started from MyDSpace in my-dspace.spec.ts
  it('should create a new submission when using /submit path & pass accessibility', () => {
    // Test that calling /submit with collection & entityType will create a new submission
    cy.visit('/submit?collection='.concat(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_UUID')).concat('&entityType=none'));

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    // Should redirect to /workspaceitems, as we've started a new submission
    cy.url().should('include', '/workspaceitems');

    // The Submission edit form tag should be visible
    cy.get('ds-submission-edit').should('be.visible');

    // A Collection menu button should exist & it's value should be the selected collection
    cy.get('#collectionControlsMenuButton span').should('have.text', Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME'));

    // 4 sections should be visible by default
    cy.get('div#section_traditionalpageone').should('be.visible');
    cy.get('div#section_traditionalpagetwo').should('be.visible');
    cy.get('div#section_upload').should('be.visible');
    cy.get('div#section_license').should('be.visible');

    // Test entire page for accessibility
    testA11y('ds-submission-edit',
            {
              rules: {
                // Author & Subject fields have invalid "aria-multiline" attrs.
                // See https://github.com/DSpace/dspace-angular/issues/1272
                'aria-allowed-attr': { enabled: false },
                // All panels are accordians & fail "aria-required-children" and "nested-interactive".
                // Seem to require updating ng-bootstrap and https://github.com/DSpace/dspace-angular/issues/2216
                'aria-required-children': { enabled: false },
                'nested-interactive': { enabled: false },
                // All select boxes fail to have a name / aria-label.
                // This is a bug in ng-dynamic-forms and may require https://github.com/DSpace/dspace-angular/issues/2216
                'select-name': { enabled: false },
              },

            } as Options,
    );

    // Discard button should work
    // Clicking it will display a confirmation, which we will confirm with another click
    cy.get('button#discard').click();
    cy.get('button#discard_submit').click();
  });

  it('should block submission & show errors if required fields are missing', () => {
    // Create a new submission
    cy.visit('/submit?collection='.concat(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_UUID')).concat('&entityType=none'));

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    // Attempt an immediate deposit without filling out any fields
    cy.get('button#deposit').click();

    // A warning alert should display.
    cy.get('ds-notification div.alert-success').should('not.exist');
    cy.get('ds-notification div.alert-warning').should('be.visible');

    // First section should have an exclamation error in the header
    // (as it has required fields)
    cy.get('div#traditionalpageone-header i.fa-exclamation-circle').should('be.visible');

    // Title field should have class "is-invalid" applied, as it's required
    cy.get('input#dc_title').should('have.class', 'is-invalid');

    // Date Year field should also have "is-valid" class
    cy.get('input#dc_date_issued_year').should('have.class', 'is-invalid');

    // FINALLY, cleanup after ourselves. This also exercises the MyDSpace delete button.
    // Get our Submission URL, to parse out the ID of this submission
    cy.location().then(fullUrl => {
      // This will be the full path (/workspaceitems/[id]/edit)
      const path = fullUrl.pathname;
      // Split on the slashes
      const subpaths = path.split('/');
      // Part 2 will be the [id] of the submission
      const id = subpaths[2];

      // Even though form is incomplete, the "Save for Later" button should still work
      cy.get('button#saveForLater').click();

      // "Save for Later" should send us to MyDSpace
      cy.url().should('include', '/mydspace');

      // A success alert should be visible
      cy.get('ds-notification div.alert-success').should('be.visible');
      // Now, dismiss any open alert boxes (may be multiple, as tests run quickly)
      cy.get('[data-dismiss="alert"]').click({ multiple: true });

      // This is the GET command that will actually run the search
      cy.intercept('GET', '/server/api/discover/search/objects*').as('search-results');
      // On MyDSpace, find the submission we just saved via its ID
      cy.get('[data-test="search-box"]').type(id);
      cy.get('[data-test="search-button"]').click();

      // Wait for search results to come back from the above GET command
      cy.wait('@search-results');

      // Delete our created submission & confirm deletion
      cy.get('button#delete_' + id).click();
      cy.get('button#delete_confirm').click();
    });
  });

  it('should allow for deposit if all required fields completed & file uploaded', () => {
    // Create a new submission
    cy.visit('/submit?collection='.concat(Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_UUID')).concat('&entityType=none'));

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    cy.loginViaForm(Cypress.env('DSPACE_TEST_SUBMIT_USER'), Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD'));

    // Fill out all required fields (Title, Date)
    cy.get('input#dc_title').type('DSpace logo uploaded via e2e tests');
    cy.get('input#dc_date_issued_year').type('2022');

    // Confirm the required license by checking checkbox
    // (NOTE: requires "force:true" cause Cypress claims this checkbox is covered by its own <span>)
    cy.get('input#granted').check( { force: true } );

    // Before using Cypress drag & drop, we have to manually trigger the "dragover" event.
    // This ensures our UI displays the dropzone that covers the entire submission page.
    // (For some reason Cypress drag & drop doesn't trigger this even itself & upload won't work without this trigger)
    cy.get('ds-uploader').trigger('dragover');

    // This is the POST command that will upload the file
    cy.intercept('POST', '/server/api/submission/workspaceitems/*').as('upload');

    // Upload our DSpace logo via drag & drop onto submission form
    // cy.get('div#section_upload')
    cy.get('div.ds-document-drop-zone').selectFile('src/assets/images/dspace-logo.svg', {
      action: 'drag-drop',
    });

    // Wait for upload to complete before proceeding
    cy.wait('@upload');

    // Wait for deposit button to not be disabled & click it.
    cy.get('button#deposit').should('not.be.disabled').click();

    // No warnings should exist. Instead, just successful deposit alert is displayed
    cy.get('ds-notification div.alert-warning').should('not.exist');
    cy.get('ds-notification div.alert-success').should('be.visible');
  });

  it('is possible to submit a new "Person" and that form passes accessibility', () => {
    // To submit a different entity type, we'll start from MyDSpace
    cy.visit('/mydspace');

    // This page is restricted, so we will be shown the login form. Fill it out & submit.
    // NOTE: At this time, we MUST login as admin to submit Person objects
    cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));

    // Open the New Submission dropdown
    cy.get('button[data-test="submission-dropdown"]').click();
    // Click on the "Person" type in that dropdown
    cy.get('#entityControlsDropdownMenu button[title="Person"]').click();

    // This should display the <ds-create-item-parent-selector> (popup window)
    cy.get('ds-create-item-parent-selector').should('be.visible');

    // Type in a known Collection name in the search box
    cy.get('ds-authorized-collection-selector input[type="search"]').type(Cypress.env('DSPACE_TEST_SUBMIT_PERSON_COLLECTION_NAME'));

    // Click on the button matching that known Collection name
    cy.get('ds-authorized-collection-selector button[title="'.concat(Cypress.env('DSPACE_TEST_SUBMIT_PERSON_COLLECTION_NAME')).concat('"]')).click();

    // New URL should include /workspaceitems, as we've started a new submission
    cy.url().should('include', '/workspaceitems');

    // The Submission edit form tag should be visible
    cy.get('ds-submission-edit').should('be.visible');

    // A Collection menu button should exist & its value should be the selected collection
    cy.get('#collectionControlsMenuButton span').should('have.text', Cypress.env('DSPACE_TEST_SUBMIT_PERSON_COLLECTION_NAME'));

    // 3 sections should be visible by default
    cy.get('div#section_personStep').should('be.visible');
    cy.get('div#section_upload').should('be.visible');
    cy.get('div#section_license').should('be.visible');

    // Test entire page for accessibility
    testA11y('ds-submission-edit',
            {
              rules: {
                // All panels are accordians & fail "aria-required-children" and "nested-interactive".
                // Seem to require updating ng-bootstrap and https://github.com/DSpace/dspace-angular/issues/2216
                'aria-required-children': { enabled: false },
                'nested-interactive': { enabled: false },
              },

            } as Options,
    );

    // Click the lookup button next to "Publication" field
    cy.get('button[data-test="lookup-button"]').click();

    // A popup modal window should be visible
    cy.get('ds-dynamic-lookup-relation-modal').should('be.visible');

    // Popup modal should also pass accessibility tests
    //testA11y('ds-dynamic-lookup-relation-modal');
    testA11y({
      include: ['ds-dynamic-lookup-relation-modal'],
      exclude: [
        ['ul.nav-tabs'], // Tabs at top of model have several issues which seem to be caused by ng-bootstrap
      ],
    });

    // Close popup window
    cy.get('ds-dynamic-lookup-relation-modal button.close').click();

    // Back on the form, click the discard button to remove new submission
    // Clicking it will display a confirmation, which we will confirm with another click
    cy.get('button#discard').click();
    cy.get('button#discard_submit').click();
  });
});
