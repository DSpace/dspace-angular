import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';

/**
 * Log Interceptor intercepting Http Requests & Responses to
 * exchange add headers of the user using the application utilizing unique id in cookies.
 * Add header for users current page path.
 */
@Injectable()
export class LogInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Get Unique id of the user from the cookies
    const correlationId = this.cookieService.get('CORRELATION-ID');

    // Add headers from the intercepted request
    let headers = request.headers;
    headers = headers.set('X-CORRELATION-ID', correlationId);
    headers = headers.set('X-REFERRER', this.router.url);

    // Add new headers to the intercepted request
    request = request.clone({ withCredentials: true, headers: headers });
    return next.handle(request);
  }
}
