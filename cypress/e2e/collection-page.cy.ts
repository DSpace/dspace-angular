import { testA11y } from 'cypress/support/utils';

describe('Collection Page', () => {

    it('should pass accessibility tests', () => {
        cy.visit('/collections/'.concat(Cypress.env('DSPACE_TEST_COLLECTION')));
        cy.intercept('GET','/server/api/dso/find?uuid='.concat(Cypress.env('DSPACE_TEST_COLLECTION'))).as('dso');
        cy.wait('@dso');
      // <ds-collection-page> tag must be loaded
        cy.get('ds-collection-page').should('be.visible');

        // Analyze <ds-collection-page> for accessibility issues
        testA11y('ds-collection-page');
    });
});
