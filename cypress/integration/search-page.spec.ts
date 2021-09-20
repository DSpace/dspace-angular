describe('Search Page', () => {
    // unique ID of the search form (for selecting specific elements below)
    const SEARCHFORM_ID = '#search-form';

    it('should contain query value when navigating to page with query parameter', () => {
        const queryString = 'test query';
        cy.visit('/search?query=' + queryString);
        cy.get(SEARCHFORM_ID + ' input[name="query"]').should('have.value', queryString);
    });


    it('should have right scope selected when navigating to page with scope parameter', () => {
        // First, visit search with no params just to get the set of the scope options
        cy.visit('/search');
        cy.get(SEARCHFORM_ID + ' select[name="scope"] > option').as('options');

        // Find length of scope options, select a random index
        cy.get('@options').its('length')
            .then(len => Math.floor(Math.random() * Math.floor(len)))
            .then((index) => {
                // return the option at that (randomly selected) index
                return cy.get('@options').eq(index);
            })
            .then((option) => {
                const randomScope: any = option.val();
                // Visit the search page with the randomly selected option as a pararmeter
                cy.visit('/search?scope=' + randomScope);
                // Verify that scope is selected when the page reloads
                cy.get(SEARCHFORM_ID + ' select[name="scope"]').find('option:selected').should('have.value', randomScope);
            });
    });


    it('should redirect to the correct url when scope was set and submit button was triggered', () => {
        // First, visit search with no params just to get the set of scope options
        cy.visit('/search');
        cy.get(SEARCHFORM_ID + ' select[name="scope"] > option').as('options');

        // Find length of scope options, select a random index (i.e. a random option in selectbox)
        cy.get('@options').its('length')
            .then(len => Math.floor(Math.random() * Math.floor(len)))
            .then((index) => {
                // return the option at that (randomly selected) index
                return cy.get('@options').eq(index);
            })
            .then((option) => {
                const randomScope: any = option.val();
                // Select the option at our random index & click the search button
                cy.get(SEARCHFORM_ID + ' select[name="scope"]').select(randomScope);
                cy.get(SEARCHFORM_ID + ' button.search-button').click();
                // Result should be the page URL should include that scope & page will reload with scope selected
                cy.url().should('include', 'scope=' + randomScope);
                cy.get(SEARCHFORM_ID + ' select[name="scope"]').find('option:selected').should('have.value', randomScope);
            });
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
