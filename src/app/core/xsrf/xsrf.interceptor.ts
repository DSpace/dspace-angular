import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';

/**
 * Custom Http Interceptor intercepting Http Requests, adding the XSRF/CSRF
 * token (if found in a cookie named XSRF-TOKEN) to their X-XSRF-TOKEN header.
 *
 * This custom interceptor is required as Angular's HttpXsrfInterceptor doesn't
 * support absolute URLs, see: https://github.com/angular/angular/issues/1885
 * Based on HttpXsrfInterceptor:
 * https://github.com/angular/angular/blob/8.2.x/packages/common/http/src/xsrf.ts
 *
 * This custom interceptor accepts absolute URLs, but checks that the URL
 * is trusted (i.e. it must be a request to our configured REST API).
 */
@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
    }

    /**
     * Intercept http requests and add the XSRF/CSRF token to the X-Forwarded-For header
     * @param httpRequest
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get request URL
        const reqUrl = req.url.toLowerCase();

        // Get root URL of configured REST API
        const restUrl = new RESTURLCombiner('/').toString().toLowerCase();

        // Skip any non-mutating request. This is because our REST API does NOT
        // require CSRF verification for read-only requests.
        // Also skip any request which is NOT to the configured REST API
        if (req.method === 'GET' || req.method === 'HEAD' || !reqUrl.startsWith(restUrl)) {
            return next.handle(req);
        }

        // Send request with credential options in order to be able to read cross-origin cookies
        // Without this, Angular isn't able to read the XSRF-TOKEN cookie if it comes from
        // a different origin. See https://stackoverflow.com/a/62364743
        req = req.clone({ withCredentials: true });

        // parse token from XSRF-TOKEN cookie sent by REST API
        const token = this.tokenExtractor.getToken() as string;

        // return token in request's X-XSRF-TOKEN header (anti-CSRF security)
        const headerName = 'X-XSRF-TOKEN';
        if (token !== null && !req.headers.has(headerName)) {
            req = req.clone({ headers: req.headers.set(headerName, token) });
        }
        return next.handle(req);
    }
}
