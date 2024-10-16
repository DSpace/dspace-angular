import { testA11y } from 'cypress/support/utils';

describe('Collection Page', () => {

  it('should pass accessibility tests', () => {
    cy.intercept('POST', '/server/api/statistics/viewevents').as('viewevent');

    // Visit Collections page
    cy.visit('/collections/'.concat(Cypress.env('DSPACE_TEST_COLLECTION')));

    // Wait for the "viewevent" to trigger on the Collection page.
    // This ensures our <ds-collection-page> tag  is fully loaded, as the <ds-view-event> tag is contained within it.
    cy.wait('@viewevent');

    // <ds-collection-page> tag must be loaded
    cy.get('ds-collection-page').should('be.visible');

    // Analyze <ds-collection-page> for accessibility issues
    testA11y('ds-collection-page');
  });
});
