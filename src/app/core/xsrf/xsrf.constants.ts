/**
 * XSRF / CSRF related constants
 */

/**
 * Name of CSRF/XSRF header we (client) may SEND in requests to backend.
 * (This is a standard header name for XSRF/CSRF defined by Angular)
 */
export const XSRF_REQUEST_HEADER = 'X-XSRF-TOKEN';

/**
 * Name of CSRF/XSRF header we (client) may RECEIVE in responses from backend
 * This header is defined by DSpace backend, see https://github.com/DSpace/RestContract/blob/main/csrf-tokens.md
 */
export const XSRF_RESPONSE_HEADER = 'DSPACE-XSRF-TOKEN';

/**
 * Name of client-side Cookie where we store the CSRF/XSRF token between requests.
 * This cookie is only available to client, and should be updated whenever a new XSRF_RESPONSE_HEADER
 * is found in a response from the backend.
 */
export const XSRF_COOKIE = 'XSRF-TOKEN';

/**
 * Name of server-side cookie the backend expects the XSRF token to be in.
 * When the backend receives a modifying request, it will validate the CSRF/XSRF token by looking
 * for a match between the XSRF_REQUEST_HEADER and this Cookie. For more details see
 * https://github.com/DSpace/RestContract/blob/main/csrf-tokens.md
 *
 * NOTE: This Cookie is NOT readable to the client/UI. It is only readable to the backend and will
 * be sent along automatically by the user's browser.
 */
export const DSPACE_XSRF_COOKIE = 'DSPACE-XSRF-COOKIE';
