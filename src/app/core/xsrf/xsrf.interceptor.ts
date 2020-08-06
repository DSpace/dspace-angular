import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap, filter } from 'rxjs/operators';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { CookieService } from '../services/cookie.service';

/**
 * Custom Http Interceptor intercepting Http Requests & Responses to
 * exchange XSRF/CSRF tokens with the backend.
 *
 * DSpace has a custom XSRF token process in order to support the UI and backend
 * running on entirely separate domains:
 *
 * 1. Backend generates XSRF token & stores in a *server-side* (only) cookie
 *    named DSPACE-XSRF-COOKIE. This cookie is not readable to Angular, but is
 *    returned (by user's browser) on every subsequent request to backend.
 * 2. Backend also sends XSRF token in a header named DSPACE-XSRF-TOKEN to
 *    Angular.
 * 3. This interceptor looks for DSPACE-XSRF-TOKEN header in a response. If
 *    found, its value is saved to a *client-side* (only) cookie named XSRF-TOKEN.
 * 4. Whenever Angular is making a mutating request (POST, PUT, DELETE, etc),
 *    this interceptor checks for that client-side XSRF-TOKEN cookie. If found,
 *    its value is sent to the backend in the X-XSRF-TOKEN header.
 * 5. On backend, the X-XSRF-TOKEN header is received & compared to the current
 *    value of the *server-side* cookie named DSPACE-XSRF-COOKIE. If tokens
 *    match, the request is accepted. If tokens don't match a 403 is returned.
 *
 * In summary, the XSRF token is ALWAYS sent to/from the Angular UI and backend
 * via *headers*. Both the Angular UI and backend have cookies which retain the
 * last known value of the XSRF token for verification purposes.
 */
@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

    constructor(private tokenExtractor: HttpXsrfTokenExtractor, private cookieService: CookieService) {
    }

    /**
     * Intercept http requests and add the XSRF/CSRF token to the X-Forwarded-For header
     * @param httpRequest
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Ensure EVERY request from Angular includes "withCredentials: true".
        // This allows Angular to receive & send cookies via a CORS request (to
        // the backend). ONLY requests with credentials will:
        // 1. Ensure a user's browser sends the server-side XSRF cookie back to
        //    the backend
        // 2. Ensure a user's browser saves changes to the server-side XSRF
        //    cookie (to ensure it is kept in sync with client side cookie)
        req = req.clone({ withCredentials: true });

        // Get request URL
        const reqUrl = req.url.toLowerCase();

        // Get root URL of configured REST API
        const restUrl = new RESTURLCombiner('/').toString().toLowerCase();

        // Skip any non-mutating request. This is because our REST API does NOT
        // require CSRF verification for read-only requests like GET or HEAD
        // Also skip any request which is NOT to our trusted/configured REST API
        if (req.method !== 'GET' && req.method !== 'HEAD' && reqUrl.startsWith(restUrl)) {
            // parse token from XSRF-TOKEN (client-side) cookie
            const token = this.tokenExtractor.getToken() as string;

            // send token in request's X-XSRF-TOKEN header (anti-CSRF security) to backend
            const headerName = 'X-XSRF-TOKEN';
            if (token !== null && !req.headers.has(headerName)) {
                req = req.clone({ headers: req.headers.set(headerName, token) });
            }
        }
        // Pass to next interceptor, but intercept EVERY response event as well
        return next.handle(req).pipe(
            // Check event that came back...is it an HttpResponse from backend?
            filter((event) => event instanceof HttpResponse),
                tap((response: HttpResponse<any>) => {
                    // For every response that comes back, check for the custom
                    // DSPACE-XSRF-TOKEN header sent from the backend.
                    if (response.headers.has('DSPACE-XSRF-TOKEN')) {
                        // value of header is a new XSRF token
                        const newToken = response.headers.get('DSPACE-XSRF-TOKEN');

                        // save token value as a *new* value of our client-side
                        // XSRF-TOKEN cookie. (This is the same cookie we use to
                        // send back the X-XSRF-TOKEN header. See request logic above)
                        this.cookieService.remove('XSRF-TOKEN');
                        this.cookieService.set('XSRF-TOKEN', newToken);
                    }
                })
        ) as any;
    }
}
