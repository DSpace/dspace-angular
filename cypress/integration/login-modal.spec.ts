import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER, TEST_ENTITY_PUBLICATION } from 'cypress/support';

const page = {
    openLoginMenu() {
        // Click the closed "Log In" dropdown menu (to open Login menu)
        cy.get('ds-auth-nav-menu.navbar-collapsed').click();
    },
    submitLoginAndPasswordByPressingEnter(email, password) {
        // In opened Login modal, fill out email & password, then click Enter
        cy.get('ds-themed-navbar ds-log-in-password input[type = "email"]').type(email);
        cy.get('ds-themed-navbar ds-log-in-password input[type = "password"]').type(password);
        cy.get('ds-themed-navbar ds-log-in-password input[type = "password"]').type('{enter}');
    }
};

describe('Login Modal', () => {
    it('should login when clicking button', () => {
        cy.visit('/');

        // Login menu should exist
        cy.get('ds-log-in').should('exist');

        // Login, and the <ds-log-in> tag should no longer exist
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.get('ds-log-in').should('not.exist');

        // Open login menu again, verify user menu & logout button now available
        page.openLoginMenu();
        cy.get('ds-user-menu').should('be.visible');
        cy.get('ds-log-out').should('be.visible');
    });

    it('should login when clicking enter key', () => {
        cy.visit('/');

        // Open login menu in header & verify <ds-log-in> tag is visible
        page.openLoginMenu();
        cy.get('.form-login').should('be.visible');

        // Login, and the <ds-log-in> tag should no longer exist
        page.submitLoginAndPasswordByPressingEnter(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.get('.form-login').should('not.exist');

        // Open login menu again, verify user menu & logout button now available
        page.openLoginMenu();
        cy.get('ds-user-menu').should('be.visible');
        cy.get('ds-log-out').should('be.visible');
    });

    it('should stay on same page after login', () => {
        const ENTITYPAGE = '/entities/publication/' + TEST_ENTITY_PUBLICATION;
        cy.visit(ENTITYPAGE);

        // Login menu should exist
        cy.get('ds-log-in').should('exist');

        // Login, and the <ds-log-in> tag should no longer exist
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.get('ds-log-in').should('not.exist');

        // Verify we are still on the same page
        cy.url().should('include', ENTITYPAGE);

        // Open login menu again, verify user menu & logout button now available
        page.openLoginMenu();
        cy.get('ds-user-menu').should('be.visible');
        cy.get('ds-log-out').should('be.visible');
    });

    it('logout should work', () => {
        cy.visit('/');

        cy.get('ds-log-in').should('exist');
        cy.get('ds-log-out').should('not.exist');

        // Click login
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);

        cy.get('ds-log-in').should('not.exist');
        cy.get('ds-log-out').should('exist');

        // Click logout
        cy.logout();

        cy.get('ds-log-in').should('exist');
        cy.get('ds-log-out').should('not.exist');
    });
});
