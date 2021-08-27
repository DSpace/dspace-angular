describe('Header', () => {
    it('should pass accessibility tests', () => {
        cy.visit('/');
        cy.injectAxe();

        // Header must first be visible
        cy.get('ds-header').should('be.visible');

        // Analyze <ds-header> for accessibility
        cy.checkA11y({
            include: ['ds-header'],
            exclude: [
                ['#search-navbar-container'], // search in navbar has duplicative ID. Will be fixed in #1174
                ['.dropdownLogin']            // "Log in" link has color contrast issues. Will be fixed in #1149
            ],
        });
    });
});