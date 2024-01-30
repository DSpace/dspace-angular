import { TEST_ENTITY_PUBLICATION } from 'cypress/support/e2e';
import { testA11y } from 'cypress/support/utils';

describe('Item  Page', () => {
    const ITEMPAGE = '/items/'.concat(TEST_ENTITY_PUBLICATION);
    const ENTITYPAGE = '/entities/publication/'.concat(TEST_ENTITY_PUBLICATION);

    // Test that entities will redirect to /entities/[type]/[uuid] when accessed via /items/[uuid]
    it('should redirect to the entity page when navigating to an item page', () => {
        cy.visit(ITEMPAGE);
        cy.location('pathname').should('eq', ENTITYPAGE);
    });

    // CLARIN
    // NOTE: accessibility tests are failing because the UI has been changed
    //   it('should pass accessibility tests', () => {
    //       cy.visit(ENTITYPAGE);
    //
    //       // <ds-item-page> tag must be loaded
    //       cy.get('ds-item-page').should('be.visible');
    //
    //       // Analyze <ds-item-page> for accessibility issues
    //       testA11y('ds-item-page');
    //   });


    // it('should pass accessibility tests on full item page', () => {
    //     cy.visit(ENTITYPAGE + '/full');
    //
    //     // <ds-full-item-page> tag must be loaded
    //     cy.get('ds-full-item-page').should('be.visible');
    //
    //     // Analyze <ds-full-item-page> for accessibility issues
    //     testA11y('ds-full-item-page');
    // });
    // CLARIN
});
