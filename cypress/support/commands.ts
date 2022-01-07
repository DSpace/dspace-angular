// ***********************************************
// This File is for Custom Cypress commands.
// See docs at https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************
// Declare Cypress namespace to help with Intellisense & code completion in IDEs
// ALL custom commands MUST be listed here for code completion to work
// tslint:disable-next-line:no-namespace
declare namespace Cypress {
    interface Chainable<Subject = any> {
        login(email: string, password: string): typeof login;
        logout(): typeof logout;
    }
}

/**
 * Login from any page via DSpace's header menu
 * @param email email to login as
 * @param password password to login as
 */
function login(email: string, password: string): void {
    // Click the closed "Log In" dropdown menu (to open Login menu)
    cy.get('ds-themed-navbar [data-e2e="login-menu"]').click();
    // Enter email
    cy.get('ds-themed-navbar [data-e2e="email"]').type(email);
    // Enter password
    cy.get('ds-themed-navbar [data-e2e="password"]').type(password);
    // Click login button
    cy.get('ds-themed-navbar [data-e2e="login-button"]').click();
}
// Add as a Cypress command (i.e. assign to 'cy.login')
Cypress.Commands.add('login', login);


/**
 * Logout from any page via DSpace's header menu.
 * NOTE: Also waits until logout completes before next command will be run.
 */
 function logout(): void {
    // Click the closed User dropdown menu (to open user menu in header)
    cy.get('ds-themed-navbar [data-e2e="user-menu"]').click();
    // This is the POST command that will actually log us out
    cy.intercept('POST', '/server/api/authn/logout').as('logout');
    // Click logout button
    cy.get('ds-themed-navbar [data-e2e="logout-button"]').click();
    // Wait until above POST command responds before continuing
    cy.wait('@logout');
}
// Add as a Cypress command (i.e. assign to 'cy.logout')
Cypress.Commands.add('logout', logout);
