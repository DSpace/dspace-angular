// ***********************************************
// This File is for Custom Cypress commands.
// See docs at https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

import { AuthTokenInfo, TOKENITEM } from 'src/app/core/auth/models/auth-token-info.model';
import { DSPACE_XSRF_COOKIE, XSRF_REQUEST_HEADER } from 'src/app/core/xsrf/xsrf.constants';

// NOTE: FALLBACK_TEST_REST_BASE_URL is only used if Cypress cannot read the REST API BaseURL
// from the Angular UI's config.json. See 'login()'.
export const FALLBACK_TEST_REST_BASE_URL = 'http://localhost:8080/server';
export const FALLBACK_TEST_REST_DOMAIN = 'localhost';

// Declare Cypress namespace to help with Intellisense & code completion in IDEs
// ALL custom commands MUST be listed here for code completion to work
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable<Subject = any> {
            /**
             * Login to backend before accessing the next page. Ensures that the next
             * call to "cy.visit()" will be authenticated as this user.
             * @param email email to login as
             * @param password password to login as
             */
            login(email: string, password: string): typeof login;

            /**
             * Login via form before accessing the next page. Useful to fill out login
             * form when a cy.visit() call is to an a page which requires authentication.
             * @param email email to login as
             * @param password password to login as
             */
             loginViaForm(email: string, password: string): typeof loginViaForm;

            /**
             * Generate view event for given object. Useful for testing statistics pages with
             * pre-generated statistics. This just generates a single "hit", but can be called multiple times to
             * generate multiple hits.
             * @param uuid  UUID of object
             * @param dsoType type of DSpace Object (e.g. "item", "collection", "community")
             */
            generateViewEvent(uuid: string, dsoType: string): typeof generateViewEvent;
        }
    }
}

/**
 * Login user via REST API directly, and pass authentication token to UI via
 * the UI's dsAuthInfo cookie.
 * WARNING: WHILE THIS METHOD WORKS, OCCASIONALLY RANDOM AUTHENTICATION ERRORS OCCUR.
 * At this time "loginViaForm()" seems more consistent/stable.
 * @param email email to login as
 * @param password password to login as
 */
function login(email: string, password: string): void {
    // Cypress doesn't have access to the running application in Node.js.
    // So, it's not possible to inject or load the AppConfig or environment of the Angular UI.
    // Instead, we'll read our running application's config.json, which contains the configs &
    // is regenerated at runtime each time the Angular UI application starts up.
    cy.task('readUIConfig').then((str: string) => {
        // Parse config into a JSON object
        const config = JSON.parse(str);

        // Find the URL of our REST API. Have a fallback ready, just in case 'rest.baseUrl' cannot be found.
        let baseRestUrl = FALLBACK_TEST_REST_BASE_URL;
        if (!config.rest.baseUrl) {
            console.warn("Could not load 'rest.baseUrl' from config.json. Falling back to " + FALLBACK_TEST_REST_BASE_URL);
        } else {
            //console.log("Found 'rest.baseUrl' in config.json. Using this REST API for login: ".concat(config.rest.baseUrl));
            baseRestUrl = config.rest.baseUrl;
        }

        // Now find domain of our REST API, again with a fallback.
        let baseDomain = FALLBACK_TEST_REST_DOMAIN;
        if (!config.rest.host) {
            console.warn("Could not load 'rest.host' from config.json. Falling back to " + FALLBACK_TEST_REST_DOMAIN);
        } else {
            baseDomain = config.rest.host;
        }

        // Create a fake CSRF Token.  Set it in the required server-side cookie
        const csrfToken = 'fakeLoginCSRFToken';
        cy.setCookie(DSPACE_XSRF_COOKIE, csrfToken, { 'domain': baseDomain });

        // Now, send login POST request including that CSRF token
        cy.request({
            method: 'POST',
            url: baseRestUrl + '/api/authn/login',
            headers: { [XSRF_REQUEST_HEADER]: csrfToken},
            form: true, // indicates the body should be form urlencoded
            body: { user: email, password: password }
        }).then((resp) => {
            // We expect a successful login
            expect(resp.status).to.eq(200);
            // We expect to have a valid authorization header returned (with our auth token)
            expect(resp.headers).to.have.property('authorization');

            // Initialize our AuthTokenInfo object from the authorization header.
            const authheader = resp.headers.authorization as string;
            const authinfo: AuthTokenInfo = new AuthTokenInfo(authheader);

            // Save our AuthTokenInfo object to our dsAuthInfo UI cookie
            // This ensures the UI will recognize we are logged in on next "visit()"
            cy.setCookie(TOKENITEM, JSON.stringify(authinfo));
        });

        // Remove cookie with fake CSRF token, as it's no longer needed
        cy.clearCookie(DSPACE_XSRF_COOKIE);
    });
}
// Add as a Cypress command (i.e. assign to 'cy.login')
Cypress.Commands.add('login', login);

/**
 * Login user via displayed login form
 * @param email email to login as
 * @param password password to login as
 */
function loginViaForm(email: string, password: string): void {
    // Enter email
    cy.get('ds-log-in [data-test="email"]').type(email);
    // Enter password
    cy.get('ds-log-in [data-test="password"]').type(password);
    // Click login button
    cy.get('ds-log-in [data-test="login-button"]').click();
}
// Add as a Cypress command (i.e. assign to 'cy.loginViaForm')
Cypress.Commands.add('loginViaForm', loginViaForm);


/**
 * Generate statistic view event for given object. Useful for testing statistics pages with
 * pre-generated statistics. This just generates a single "hit", but can be called multiple times to
 * generate multiple hits.
 *
 * NOTE: This requires that "solr-statistics.autoCommit=false" be set on the DSpace backend
 * (as it is in our docker-compose-ci.yml used in CI).
 * Otherwise, by default, new statistical events won't be saved until Solr's autocommit next triggers.
 * @param uuid UUID of object
 * @param dsoType type of DSpace Object (e.g. "item", "collection", "community")
 */
function generateViewEvent(uuid: string, dsoType: string): void {
    // Cypress doesn't have access to the running application in Node.js.
    // So, it's not possible to inject or load the AppConfig or environment of the Angular UI.
    // Instead, we'll read our running application's config.json, which contains the configs &
    // is regenerated at runtime each time the Angular UI application starts up.
    cy.task('readUIConfig').then((str: string) => {
        // Parse config into a JSON object
        const config = JSON.parse(str);

        // Find the URL of our REST API. Have a fallback ready, just in case 'rest.baseUrl' cannot be found.
        let baseRestUrl = FALLBACK_TEST_REST_BASE_URL;
        if (!config.rest.baseUrl) {
            console.warn("Could not load 'rest.baseUrl' from config.json. Falling back to " + FALLBACK_TEST_REST_BASE_URL);
        } else {
            baseRestUrl = config.rest.baseUrl;
        }

        // Now find domain of our REST API, again with a fallback.
        let baseDomain = FALLBACK_TEST_REST_DOMAIN;
        if (!config.rest.host) {
            console.warn("Could not load 'rest.host' from config.json. Falling back to " + FALLBACK_TEST_REST_DOMAIN);
        } else {
            baseDomain = config.rest.host;
        }

        // Create a fake CSRF Token.  Set it in the required server-side cookie
        const csrfToken = 'fakeGenerateViewEventCSRFToken';
        cy.setCookie(DSPACE_XSRF_COOKIE, csrfToken, { 'domain': baseDomain });

        // Now, send 'statistics/viewevents' POST request including that fake CSRF token in required header
        cy.request({
            method: 'POST',
            url: baseRestUrl + '/api/statistics/viewevents',
            headers: {
                [XSRF_REQUEST_HEADER] : csrfToken,
                // use a known public IP address to avoid being seen as a "bot"
                'X-Forwarded-For': '1.1.1.1',
            },
            //form: true, // indicates the body should be form urlencoded
            body: { targetId: uuid, targetType: dsoType },
        }).then((resp) => {
            // We expect a 201 (which means statistics event was created)
            expect(resp.status).to.eq(201);
        });

        // Remove cookie with fake CSRF token, as it's no longer needed
        cy.clearCookie(DSPACE_XSRF_COOKIE);
    });
}
// Add as a Cypress command (i.e. assign to 'cy.generateViewEvent')
Cypress.Commands.add('generateViewEvent', generateViewEvent);

