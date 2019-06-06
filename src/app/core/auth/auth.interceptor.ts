import {Observable, of as observableOf, throwError as observableThrowError} from 'rxjs';

import {catchError, filter, map} from 'rxjs/operators';
import {Injectable, Injector} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase
} from '@angular/common/http';
import {find} from 'lodash';

import {AppState} from '../../app.reducer';
import {AuthService} from './auth.service';
import {AuthStatus} from './models/auth-status.model';
import {AuthTokenInfo} from './models/auth-token-info.model';
import {isNotEmpty, isUndefined, isNotNull} from '../../shared/empty.util';
import {RedirectWhenTokenExpiredAction, RefreshTokenAction} from './auth.actions';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {AuthError} from './models/auth-error.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Intercetor is called twice per request,
  // so to prevent RefreshTokenAction is dispatched twice
  // we're creating a refresh token request list
  protected refreshTokenRequestUrls = [];

  constructor(private inj: Injector, private router: Router, private store: Store<AppState>) {
  }

  private is405AuthResponse(response: HttpResponseBase): boolean {
    return response.status === 405;
  }

  private isUnauthorized(response: HttpResponseBase): boolean {
    // invalid_token The access token provided is expired, revoked, malformed, or invalid for other reasons
    return response.status === 401;
  }

  private isSuccess(response: HttpResponseBase): boolean {
    return (response.status === 200 || response.status === 204);
  }

  private isAuthRequest(http: HttpRequest<any> | HttpResponseBase): boolean {
    return http && http.url
      && (http.url.endsWith('/authn/login')
        || http.url.endsWith('/authn/logout')
        || http.url.endsWith('/authn/status'));
  }

  private isLoginResponse(http: HttpRequest<any> | HttpResponseBase): boolean {
    return http.url && http.url.endsWith('/authn/login');
  }

  private isLogoutResponse(http: HttpRequest<any> | HttpResponseBase): boolean {
    return http.url && http.url.endsWith('/authn/logout');
  }

  private makeAuthStatusObject(authenticated: boolean, accessToken?: string, error?: string, location?: string): AuthStatus {
    const authStatus = new AuthStatus();
    authStatus.id = null;
    authStatus.okay = true;
    authStatus.ssoLoginUrl = location; // this line was  added while developing shibboleth dev
    if (authenticated) {
      authStatus.authenticated = true;
      authStatus.token = new AuthTokenInfo(accessToken);
    } else {
      authStatus.authenticated = false;
      authStatus.error = isNotEmpty(error) ? ((typeof error === 'string') ? JSON.parse(error) : error) : null;
    }
    return authStatus;
  }

  private getSSOLocationfromHeader(header: HttpHeaders): string {
    console.log('HEADER www-authenticate: ', header.get('www-authenticate'));
    let location = '';
    if (header.get('www-authenticate').startsWith('shibboleth realm')) {
      const strings = header.get('www-authenticate').split(',');
      location = strings[1];
      location = location.replace('location=', '');
      console.log('This should be the location: ', location);
      return location = location.replace('"', '').trim();
    }
    return location;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authService = this.inj.get(AuthService);

    const token = authService.getToken();
    let newReq;

    if (authService.isTokenExpired()) {
      authService.setRedirectUrl(this.router.url);
      // The access token is expired
      // Redirect to the login route
      this.store.dispatch(new RedirectWhenTokenExpiredAction('auth.messages.expired'));
      return observableOf(null);
    } else if (!this.isAuthRequest(req) && isNotEmpty(token)) {
      // Intercept a request that is not to the authentication endpoint
      authService.isTokenExpiring().pipe(
        filter((isExpiring) => isExpiring))
        .subscribe(() => {
          // If the current request url is already in the refresh token request list, skip it
          if (isUndefined(find(this.refreshTokenRequestUrls, req.url))) {
            // When a token is about to expire, refresh it
            this.store.dispatch(new RefreshTokenAction(token));
            this.refreshTokenRequestUrls.push(req.url);
          }
        });
      // Get the auth header from the service.
      const Authorization = authService.buildAuthHeader(token);
      // Clone the request to add the new header.
      newReq = req.clone({headers: req.headers.set('authorization', Authorization)});
    } else {
      newReq = req;
    }

    // Pass on the new request instead of the original request.
    return next.handle(newReq).pipe(
      map((response) => {
        // Intercept a Login/Logout response
        if (response instanceof HttpResponse && this.isSuccess(response) && (this.isLoginResponse(response) || this.isLogoutResponse(response))) {
          // It's a success Login/Logout response
          let authRes: HttpResponse<any>;
          if (this.isLoginResponse(response)) {
            // login successfully
            const newToken = response.headers.get('authorization');
            authRes = response.clone({body: this.makeAuthStatusObject(true, newToken)});

            // clean eventually refresh Requests list
            this.refreshTokenRequestUrls = [];
          } else {
            // logout successfully
            authRes = response.clone({body: this.makeAuthStatusObject(false)});
          }
          return authRes;
        } else {
          return response;
        }
      }),
      catchError((error, caught) => {
        console.log('catchError operator in auth.interceptor was triggered');
        // Intercept an error response
        if (error instanceof HttpErrorResponse) {

          // Check for 405
          /*     if (this.is405AuthResponse(error)) {
                 console.log('the caught error is a 405');
               }*/

          // Checks if is a response from a request to an authentication endpoint
          if (this.isAuthRequest(error)) {
            console.log('catchError isAuthRequest=true');
            // clean eventually refresh Requests list
            this.refreshTokenRequestUrls = [];
            // console.log('error: ', error);
            let location = '';
            if (error.headers.get('www-authenticate') != null) {
              location = this.getSSOLocationfromHeader(error.headers);
            }
            // Create a new HttpResponse and return it, so it can be handle properly by AuthService.
            const authResponse = new HttpResponse({
              body: this.makeAuthStatusObject(false, null, error.error, location),
              headers: error.headers,
              status: error.status,
              statusText: error.statusText,
              url: error.url
            });
            return observableOf(authResponse);
          } else if (this.isUnauthorized(error) && isNotNull(token) && authService.isTokenExpired()) {
            // The access token provided is expired, revoked, malformed, or invalid for other reasons
            // Redirect to the login route
            this.store.dispatch(new RedirectWhenTokenExpiredAction('auth.messages.expired'));
          }
        }
        // Return error response as is.
        return observableThrowError(error);
      })) as any;
  }
}
