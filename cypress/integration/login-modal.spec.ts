import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER, TEST_ENTITY_PUBLICATION } from 'cypress/support';

const page = {
    openLoginMenu() {
        // Click the "Log In" dropdown menu in header
        cy.get('ds-themed-navbar [data-e2e="login-menu"]').click();
    },
    openUserMenu() {
        // Once logged in, click the User menu in header
        cy.get('ds-themed-navbar [data-e2e="user-menu"]').click();
    },
    submitLoginAndPasswordByPressingEnter(email, password) {
        // In opened Login modal, fill out email & password, then click Enter
        cy.get('ds-themed-navbar [data-e2e="email"]').type(email);
        cy.get('ds-themed-navbar [data-e2e="password"]').type(password);
        cy.get('ds-themed-navbar [data-e2e="password"]').type('{enter}');
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

        // Open user menu, verify user menu & logout button now available
        page.openUserMenu();
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

        //  Open user menu, verify user menu & logout button now available
        page.openUserMenu();
        cy.get('ds-user-menu').should('be.visible');
        cy.get('ds-log-out').should('be.visible');
    });

    it('should stay on same page after login', () => {
        const ENTITYPAGE = '/entities/publication/' + TEST_ENTITY_PUBLICATION;
        cy.visit(ENTITYPAGE);

        // Login, and the <ds-log-in> tag should no longer exist
        cy.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
        cy.get('ds-log-in').should('not.exist');

        // Verify we are still on the same page
        cy.url().should('include', ENTITYPAGE);
    });

    it('should support logout', () => {
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

    it('should allow new user registration', () => {
        cy.visit('/');

        page.openLoginMenu();

        // Registration link should be visible
        cy.get('ds-themed-navbar [data-e2e="register"]').should('be.visible');

        // Click registration link & you should go to registration page
        cy.get('ds-themed-navbar [data-e2e="register"]').click();
        cy.location('pathname').should('eq', '/register');
        cy.get('ds-register-email').should('exist');
    });

    it('should allow forgot password', () => {
        cy.visit('/');

        page.openLoginMenu();

        // Forgot password link should be visible
        cy.get('ds-themed-navbar [data-e2e="forgot"]').should('be.visible');

        // Click link & you should go to Forgot Password page
        cy.get('ds-themed-navbar [data-e2e="forgot"]').click();
        cy.location('pathname').should('eq', '/forgot');
        cy.get('ds-forgot-email').should('exist');
    });
});
