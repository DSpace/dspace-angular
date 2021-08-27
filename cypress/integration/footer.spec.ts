describe('Footer', () => {
    it('should pass accessibility tests', () => {
        cy.visit('/');
        cy.injectAxe();

        // Footer must first be visible
        cy.get('ds-footer').should('be.visible');

        // Analyze <ds-footer> for accessibility
        cy.checkA11y('ds-footer');
    });
});