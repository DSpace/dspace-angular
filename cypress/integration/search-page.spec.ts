describe('Search Page', () => {
    // unique ID of the search form (for selecting specific elements below)
    const SEARCHFORM_ID = '#search-form';

    it('should contain query value when navigating to page with query parameter', () => {
        const queryString = 'test query';
        cy.visit('/search?query=' + queryString);
        cy.get(SEARCHFORM_ID + ' input[name="query"]').should('have.value', queryString);
    });

    it('should redirect to the correct url when query was set and submit button was triggered', () => {
        const queryString = 'Another interesting query string';
        cy.visit('/search');
        // Type query in searchbox & click search button
        cy.get(SEARCHFORM_ID + ' input[name="query"]').type(queryString);
        cy.get(SEARCHFORM_ID + ' button.search-button').click();
        cy.url().should('include', 'query=' + encodeURI(queryString));
    });
});
