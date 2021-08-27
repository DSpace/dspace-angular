const page = {
    fillOutQueryInNavBar(query) {
        // Click the magnifying glass
        cy.get('.navbar-container #search-navbar-container form a').click();
        // Fill out a query in input that appears
        cy.get('.navbar-container #search-navbar-container form input[name = "query"]').type(query);
    },
    submitQueryByPressingEnter() {
        cy.get('.navbar-container #search-navbar-container form input[name = "query"]').type('{enter}');
    },
    submitQueryByPressingIcon() {
        cy.get('.navbar-container #search-navbar-container form .submit-icon').click();
    }
};

describe('Search from Navigation Bar', () => {
    // NOTE: these tests currently assume this query will return results!
    const query = 'test';

    it('should go to search page with correct query if submitted (from home)', () => {
        cy.visit('/');
        page.fillOutQueryInNavBar(query);
        page.submitQueryByPressingEnter();
        // New URL should include query param
        cy.url().should('include', 'query=' + query);
        // At least one search result should be displayed
        cy.get('ds-item-search-result-list-element').should('be.visible');
    });

    it('should go to search page with correct query if submitted (from search)', () => {
        cy.visit('/search');
        page.fillOutQueryInNavBar(query);
        page.submitQueryByPressingEnter();
        // New URL should include query param
        cy.url().should('include', 'query=' + query);
        // At least one search result should be displayed
        cy.get('ds-item-search-result-list-element').should('be.visible');
    });

    it('should allow user to also submit query by clicking icon', () => {
        cy.visit('/');
        page.fillOutQueryInNavBar(query);
        page.submitQueryByPressingIcon();
        // New URL should include query param
        cy.url().should('include', 'query=' + query);
        // At least one search result should be displayed
        cy.get('ds-item-search-result-list-element').should('be.visible');
    });
});
