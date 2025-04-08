import { testA11y } from 'cypress/support/utils';

xdescribe('Item  Page', () => {
    const ITEMPAGE = '/items/'.concat(Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION'));
    const ENTITYPAGE = '/entities/publication/'.concat(Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION'));

    // Test that entities will redirect to /entities/[type]/[uuid] when accessed via /items/[uuid]
    it('should redirect to the entity page when navigating to an item page', () => {
        cy.visit(ITEMPAGE);
        cy.wait(1000);
        cy.location('pathname').should('eq', ENTITYPAGE);
    });

    it('should pass accessibility tests', () => {
        cy.intercept('POST', '/server/api/statistics/viewevents').as('viewevent');

        cy.visit(ENTITYPAGE);

        // Wait for the "viewevent" to trigger on the Item page.
        // This ensures our <ds-item-page> tag  is fully loaded, as the <ds-view-event> tag is contained within it.
        cy.wait('@viewevent');

        // <ds-item-page> tag must be loaded
        cy.get('ds-item-page').should('be.visible');

        // Analyze <ds-item-page> for accessibility issues
        testA11y('ds-item-page');
    });

    it('should pass accessibility tests on full item page', () => {
        cy.intercept('POST', '/server/api/statistics/viewevents').as('viewevent');

        cy.visit(ENTITYPAGE + '/full');

        // Wait for the "viewevent" to trigger on the Item page.
        // This ensures our <ds-item-page> tag  is fully loaded, as the <ds-view-event> tag is contained within it.
        cy.wait('@viewevent');

        // <ds-full-item-page> tag must be loaded
        cy.get('ds-full-item-page').should('be.visible');

        // Analyze <ds-full-item-page> for accessibility issues
        testA11y('ds-full-item-page');
    });
});
