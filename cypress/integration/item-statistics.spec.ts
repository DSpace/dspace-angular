describe('Item Statistics Page', () => {
    const ITEMUUID = 'e98b0f27-5c19-49a0-960d-eb6ad5287067';
    const ITEMSTATISTICSPAGE = '/statistics/items/' + ITEMUUID;

    it('should contain element ds-item-statistics-page when navigating to an item statistics page', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        cy.get('ds-item-statistics-page').should('exist');
        cy.get('ds-item-page').should('not.exist');
    });

    it('should contain the item statistics page url when navigating to an item statistics page', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        cy.location('pathname').should('eq', ITEMSTATISTICSPAGE);
    });

    it('should contain a "Total visits" section', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        cy.get('.' + ITEMUUID + '_TotalVisits').should('exist');
    });

    it('should contain a "Total visits per month" section', () => {
        cy.visit(ITEMSTATISTICSPAGE);
        cy.get('.' + ITEMUUID + '_TotalVisitsPerMonth').should('exist');
    });
});
