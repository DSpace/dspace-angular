import { Options } from 'cypress-axe';
import { testA11y } from 'cypress/support/utils';

describe('Search Page', () => {
    // unique ID of the search form (for selecting specific elements below)
    const SEARCHFORM_ID = '#search-form';

    it('should contain query value when navigating to page with query parameter', () => {
        const queryString = 'test query';
        cy.visit('/search?query=' + queryString);
        cy.get(SEARCHFORM_ID + ' input[name="query"]').should('have.value', queryString);
    });

    it('should redirect to the correct url when query was set and submit button was triggered', () => {
        const queryString = 'Another interesting query string';
        cy.visit('/search');
        // Type query in searchbox & click search button
        cy.get(SEARCHFORM_ID + ' input[name="query"]').type(queryString);
        cy.get(SEARCHFORM_ID + ' button.search-button').click();
        cy.url().should('include', 'query=' + encodeURI(queryString));
    });

    it('should pass accessibility tests', () => {
        cy.visit('/search');

        // <ds-search-page> tag must be loaded
        cy.get('ds-search-page').should('exist');

        // Click each filter toggle to open *every* filter
        // (As we want to scan filter section for accessibility issues as well)
        cy.get('.filter-toggle').click({ multiple: true });

        // Analyze <ds-search-page> for accessibility issues
        testA11y(
            {
                include: ['ds-search-page'],
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

    it('should pass accessibility tests in Grid view', () => {
        cy.visit('/search');

        // Click to display grid view
        // TODO: These buttons should likely have an easier way to uniquely select
        cy.get('#search-sidebar-content > ds-view-mode-switch > .btn-group > [href="/search?spc.sf=score&spc.sd=DESC&view=grid"] > .fas').click();

        // <ds-search-page> tag must be loaded
        cy.get('ds-search-page').should('exist');

        // Analyze <ds-search-page> for accessibility issues
        testA11y('ds-search-page',
            {
                rules: {
                    // Search filters fail these two "moderate" impact rules
                    'heading-order': { enabled: false },
                    'landmark-unique': { enabled: false }
                }
            } as Options
        );
    });
});
