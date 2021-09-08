describe('Item  Page', () => {
    const ITEMPAGE = '/items/e98b0f27-5c19-49a0-960d-eb6ad5287067';
    const ENTITYPAGE = '/entities/publication/e98b0f27-5c19-49a0-960d-eb6ad5287067';

    it('should contain element ds-item-page when navigating to an item page', () => {
        cy.visit(ENTITYPAGE);
        cy.get('ds-item-page').should('exist');
    });

    // Test that entities will redirect to /entities/[type]/[uuid] when accessed via /items/[uuid]
    it('should redirect to the entity page when navigating to an item page', () => {
        cy.visit(ITEMPAGE);
        cy.location('pathname').should('eq', ENTITYPAGE);
    });
});
