describe('PageNotFound', () => {
    it('should contain element ds-pagenotfound when navigating to page that doesnt exist', () => {
        cy.visit('/e9019a69-d4f1-4773-b6a3-bd362caa46f2');
        cy.get('ds-pagenotfound').should('exist');
    });

    it('should not contain element ds-pagenotfound when navigating to existing page', () => {
        cy.visit('/home');
        cy.get('ds-pagenotfound').should('not.exist');
    });

});
