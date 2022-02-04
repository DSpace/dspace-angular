import { Options } from 'cypress-axe';
import { TEST_ADMIN_USER, TEST_ADMIN_PASSWORD, TEST_COLLECTION_NAME } from 'cypress/support';
import { testA11y } from 'cypress/support/utils';

describe('My DSpace page', () => {
    it('should display recent submissions and pass accessibility tests', () => {
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);

        cy.visit('/mydspace');

        cy.get('ds-my-dspace-page').should('exist');

        // At least one recent submission should be displayed
        cy.get('ds-item-search-result-list-element-submission').should('be.visible');

        // Click each filter toggle to open *every* filter
        // (As we want to scan filter section for accessibility issues as well)
        cy.get('.filter-toggle').click({ multiple: true });

        // Analyze <ds-my-dspace-page> for accessibility issues
        testA11y(
            {
                include: ['ds-my-dspace-page'],
                exclude: [
                    ['nouislider'] // Date filter slider is missing ARIA labels. Will be fixed by #1175
                ],
            },
            {
                rules: {
                    // Search filters fail these two "moderate" impact rules
                    'heading-order': { enabled: false },
                    'landmark-unique': { enabled: false }
                }
            } as Options
        );
    });

    it('should have a working detailed view that passes accessibility tests', () => {
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        
        cy.visit('/mydspace');

        cy.get('ds-my-dspace-page').should('exist');

        // Click button in sidebar to display detailed view
        cy.get('ds-search-sidebar [data-e2e="detail-view"]').click();

        cy.get('ds-object-detail').should('exist');

        // Analyze <ds-search-page> for accessibility issues
        testA11y('ds-my-dspace-page',
            {
                rules: {
                    // Search filters fail these two "moderate" impact rules
                    'heading-order': { enabled: false },
                    'landmark-unique': { enabled: false }
                }
            } as Options
        );
    });


    it('should let you start a new submission', () => {
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.visit('/mydspace');

        // Open the New Submission dropdown
        cy.get('#dropdownSubmission').click();
        // Click on the "Item" type in that dropdown
        cy.get('#entityControlsDropdownMenu button[title="none"]').click();

        // This should display the <ds-create-item-parent-selector> (popup window)
        cy.get('ds-create-item-parent-selector').should('be.visible');

        // Type in a known Collection name in the search box
        cy.get('ds-authorized-collection-selector input[type="search"]').type(TEST_COLLECTION_NAME);

        // Click on the button matching that known Collection name
        cy.get('ds-authorized-collection-selector button[title="' + TEST_COLLECTION_NAME + '"]').click();

        // New URL should include /workspaceitems, as we've started a new submission
        cy.url().should('include', '/workspaceitems');

        // The Submission edit form tag should be visible
        cy.get('ds-submission-edit').should('be.visible');

        // A Collection menu button should exist & it's value should be the selected collection
        cy.get('#collectionControlsMenuButton span').should('have.text', TEST_COLLECTION_NAME);
    });

    it('should let you import from external sources', () => {
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.visit('/mydspace');

        // Open the New Import dropdown
        cy.get('#dropdownImport').click();
        // Click on the "Item" type in that dropdown
        cy.get('#importControlsDropdownMenu button[title="none"]').click();

        // New URL should include /import-external, as we've moved to the import page
        cy.url().should('include', '/import-external');

        // The external import searchbox should be visible
        cy.get('ds-submission-import-external-searchbar').should('be.visible');
    });

});
