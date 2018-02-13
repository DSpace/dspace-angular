import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';

import { AppState } from '../../app.reducer';
import { AuthError } from './models/auth-error.model';
import { AuthService } from './auth.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { isNotEmpty } from '../../shared/empty.util';
import { RedirectWhenTokenExpiredAction } from './auth.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector, private store: Store<AppState>) { }

  private isUnauthorized(status: number): boolean {
    return status === 401 || status === 403;
  }

  private isAuthRequest(url: string): boolean {
    return url.endsWith('/authn/login') || url.endsWith('/authn/logout') || url.endsWith('/authn/status');
  }

  private isLoginResponse(url: string): boolean {
    return url.endsWith('/authn/login');
  }

  private isLogoutResponse(url: string): boolean {
    return url.endsWith('/authn/logout');
  }

  private makeAuthStatusObject(authenticated:boolean, accessToken?: string, error?: string): AuthStatus {
    const authStatus = new AuthStatus();
    authStatus.id = null;
    authStatus.okay = true;
    if (authenticated) {
      authStatus.authenticated = true;
      authStatus.token = new AuthTokenInfo(accessToken);
    } else {
      authStatus.authenticated = false;
      authStatus.error = isNotEmpty(error) ? ((typeof error === 'string') ? JSON.parse(error) : error) : null;
    }
    return authStatus;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authService = this.inj.get(AuthService);

    // Get the auth header from the service.
    const Authorization = authService.getAuthHeader();

    let authReq;
    if (!this.isAuthRequest(req.url) && isNotEmpty(Authorization)) {
      // Clone the request to add the new header.
       authReq = req.clone({headers: req.headers.set('authorization', Authorization)});
    } else {
       authReq = req;
    }

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq)
      .map((response) => {
        if (response instanceof HttpResponse && response.status === 200 && (this.isLoginResponse(response.url) || this.isLogoutResponse(response.url))) {
          let authRes: HttpResponse<any>;
          if (this.isLoginResponse(response.url)) {
            const token = response.headers.get('authorization');
            const expires = response.headers.get('expires');
            authRes = response.clone({body: this.makeAuthStatusObject(true, token)});
          } else {
            authRes = response.clone({body: this.makeAuthStatusObject(false)});
          }
          return authRes;
        } else {
          return response;
        }
      })
      .catch((error, caught) => {
        // Intercept an unauthorized error response
        if (error instanceof HttpErrorResponse && this.isUnauthorized(error.status)) {
          // Checks if is a response from a request to an authentication endpoint
          if (this.isAuthRequest(error.url)) {
            // Create a new HttpResponse and return it, so it can be handle properly by AuthService.
            const authResponse = new HttpResponse({
              body: this.makeAuthStatusObject(false, null, error.error),
              headers: error.headers,
              status: error.status,
              statusText: error.statusText,
              url: error.url
            });
            return Observable.of(authResponse);
          } else {
            // Redirect to the login route
            this.store.dispatch(new RedirectWhenTokenExpiredAction('Your session has expired. Please log in again.'));
          }
        } else {
          // Return error response as is.
          return Observable.throw(error);
        }
      }) as any;
  }
}
