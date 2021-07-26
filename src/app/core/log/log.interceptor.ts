import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { CookieService } from '../services/cookie.service';
import { hasValue } from '../../shared/empty.util';

/**
 * Log Interceptor intercepting Http Requests & Responses to
 * exchange add headers of the user using the application utilizing unique id in cookies.
 * Add header for users current page path.
 */
@Injectable()
export class LogInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Get Unique id of the user from the cookies
    const correlationId = this.cookieService.get('CORRELATION-ID');

    // Add headers from the intercepted request
    let headers = request.headers;
    if (hasValue(correlationId)) {
      headers = headers.append('X-CORRELATION-ID', correlationId);
    }
    headers = headers.append('X-REFERRER', this.router.url);

    // Add new headers to the intercepted request
    request = request.clone({ withCredentials: true, headers: headers });
    return next.handle(request);
  }
}
