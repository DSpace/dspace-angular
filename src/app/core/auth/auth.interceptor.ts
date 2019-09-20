import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';

import { catchError, filter, map } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase
} from '@angular/common/http';
import { find } from 'lodash';

import { AppState } from '../../app.reducer';
import { AuthService } from './auth.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { isNotEmpty, isNotNull, isUndefined } from '../../shared/empty.util';
import { RedirectWhenTokenExpiredAction, RefreshTokenAction } from './auth.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthMethodModel } from './models/auth-method.model';
import { AuthMethodType } from '../../shared/log-in/methods/authMethods-type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Intercetor is called twice per request,
  // so to prevent RefreshTokenAction is dispatched twice
  // we're creating a refresh token request list
  protected refreshTokenRequestUrls = [];

  constructor(private inj: Injector, private router: Router, private store: Store<AppState>) {
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
    return http.url && http.url.endsWith('/authn/login')
  }

  private isLogoutResponse(http: HttpRequest<any> | HttpResponseBase): boolean {
    return http.url && http.url.endsWith('/authn/logout');
  }

  private parseLocation(unparsedLocation: string): string {
    unparsedLocation = unparsedLocation.trim();
    unparsedLocation = unparsedLocation.replace('location="', '');
    unparsedLocation = unparsedLocation.replace('"', '');
    let re = /%3A%2F%2F/g;
    unparsedLocation = unparsedLocation.replace(re, '://');
    re = /%3A/g
    unparsedLocation = unparsedLocation.replace(re, ':')
    const parsedLocation = unparsedLocation.trim(); // + '/shibboleth';

    return parsedLocation;
  }

  private sortAuthMethods(authMethodModels: AuthMethodModel[]): AuthMethodModel[] {
    const sortedAuthMethodModels: AuthMethodModel[] = new Array<AuthMethodModel>();
    authMethodModels.forEach((method) => {
      if (method.authMethodType === AuthMethodType.Password) {
        sortedAuthMethodModels.push(method);
      }
    });

    authMethodModels.forEach((method) => {
      if (method.authMethodType !== AuthMethodType.Password) {
        sortedAuthMethodModels.push(method);
      }
    });

    return sortedAuthMethodModels;
  }

  private parseAuthMethodsfromHeaders(headers: HttpHeaders): AuthMethodModel[] {
    let authMethodModels: AuthMethodModel[] = [];
    const parts: string[] = headers.get('www-authenticate').split(',');
    // get the realms from the header -  a realm is a single auth method
    const completeWWWauthenticateHeader = headers.get('www-authenticate');
    const regex = /(\w+ (\w+=((".*?")|[^,]*)(, )?)*)/g;
    const realms = completeWWWauthenticateHeader.match(regex);

    // tslint:disable-next-line:forin
    for (const j in realms) {

      const splittedRealm = realms[j].split(', ');
      const methodName = splittedRealm[0].split(' ')[0].trim();

      let authMethodModel: AuthMethodModel;
      if (splittedRealm.length === 1) {
        authMethodModel = new AuthMethodModel(methodName);
        authMethodModels.push(authMethodModel);
      } else if (splittedRealm.length > 1) {
        let location = splittedRealm[1];
        location = this.parseLocation(location);
        authMethodModel = new AuthMethodModel(methodName, location);
        // console.log('location: ', location);
        authMethodModels.push(authMethodModel);
      }
    }

    // make sure the email + password login component gets rendered first
    authMethodModels = this.sortAuthMethods(authMethodModels);
    return authMethodModels;
  }

  private makeAuthStatusObject(authenticated: boolean, accessToken ?: string, error ?: string, httpHeaders ?: HttpHeaders): AuthStatus {
    const authStatus = new AuthStatus();
    // let authMethods: AuthMethodModel[];
    if (httpHeaders) {
      authStatus.authMethods = this.parseAuthMethodsfromHeaders(httpHeaders);
    }

    authStatus.id = null;

    authStatus.okay = true;
    // authStatus.authMethods = authMethods;

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
      // tap((response) => console.log('next.handle: ', response)),
      map((response) => {
        // Intercept a Login/Logout response
        if (response instanceof HttpResponse && this.isSuccess(response) && (this.isLoginResponse(response) || this.isLogoutResponse(response))) {
          // It's a success Login/Logout response
          let authRes: HttpResponse<any>;
          if (this.isLoginResponse(response)) {
            console.log('auth.interceptor passes success login response from backend with token: ', response.headers.get('authorization'));
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
        // Intercept an error response
        if (error instanceof HttpErrorResponse) {

          // Checks if is a response from a request to an authentication endpoint
          if (this.isAuthRequest(error)) {
            // clean eventually refresh Requests list
            this.refreshTokenRequestUrls = [];

            // Create a new HttpResponse and return it, so it can be handle properly by AuthService.
            const authResponse = new HttpResponse({
              body: this.makeAuthStatusObject(false, null, error.error, error.headers),
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
