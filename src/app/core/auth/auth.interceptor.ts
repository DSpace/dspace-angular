import {Observable, of as observableOf, throwError as observableThrowError} from 'rxjs';

import {catchError, filter, map, tap} from 'rxjs/operators';
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
import {AuthMethodModel} from './models/auth-method.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Intercetor is called twice per request,
  // so to prevent RefreshTokenAction is dispatched twice
  // we're creating a refresh token request list
  protected refreshTokenRequestUrls = [];

  private

  constructor(private inj: Injector, private router: Router, private store: Store<AppState>) {
  }

  private is302Response(response: HttpResponseBase): boolean {
    return response.status === 302;
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

  private parseShibbolethLocation(unparsedLocation: string): string {
    let parsedLocation = '';
    unparsedLocation = unparsedLocation.trim();
    unparsedLocation = unparsedLocation.replace('location="', '');
    unparsedLocation = unparsedLocation.replace('"', '');
    let re = /%3A%2F%2F/g;
    unparsedLocation = unparsedLocation.replace(re, '://');
    re = /%3A/g
    unparsedLocation = unparsedLocation.replace(re, ':')
    parsedLocation = unparsedLocation + '/shibboleth';

    return parsedLocation;
  }

  private parseAuthMethodsfromHeaders(headers: HttpHeaders): AuthMethodModel[] {
    // console.log('parseAuthMethodsfromHeaders(): ', headers);
    const authMethodModels: AuthMethodModel[] = [];
    const parts: string[] = headers.get('www-authenticate').split(',');
    console.log('parts: ', parts);
    // get the login methods names
    // tslint:disable-next-line:forin
    for (const i in parts) {
      const part: string = parts[i].trim();
      if (part.includes('realm')) {
        const methodName = part.split(' ')[0];
        const authMethod: AuthMethodModel = new AuthMethodModel(methodName);
        // check if the authentication method is  shibboleth
        // if so the next part is the shibboleth location
        // e.g part i: shibboleth realm="DSpace REST API", part i+1:  location="/Shibboleth.sso/Login?target=https%3A%2F%2Flocalhost%3A8080"
        if (methodName.includes('shibboleth')) {
          console.log('Index 2: ', parts[2]);
          const location: string = this.parseShibbolethLocation(parts[+i + 1]); // +1:  unaray + operator is necessaray because i is a string, the operator works like parseInt()
          // console.log('shib location: ', location);
          authMethod.location = location;
        }
        authMethodModels.push(authMethod);
      }
    }
    console.log('Array of AuthMethodModels: ', authMethodModels);
    return authMethodModels;
  }

  private makeAuthStatusObject(authenticated: boolean, accessToken?: string, error?: string, location?: string, httpHeaders?: HttpHeaders,): AuthStatus {
    const authStatus = new AuthStatus();

    const authMethods: AuthMethodModel[] = this.parseAuthMethodsfromHeaders(httpHeaders);
    authStatus.authMethods = authMethods;
    authStatus.id = null;

    authStatus.okay = true;
    authStatus.authMethods = authMethods;

    authStatus.ssoLoginUrl = location; // this line was  added while developing shibboleth login 1.0 - remove it
    if (authenticated) {
      authStatus.authenticated = true;
      authStatus.token = new AuthTokenInfo(accessToken);
    } else {
      authStatus.authenticated = false;
      authStatus.error = isNotEmpty(error) ? ((typeof error === 'string') ? JSON.parse(error) : error) : null;
    }
    return authStatus;
  }

  private getShibbUrlFromHeader(header: HttpHeaders): string {
    // console.log('HEADER www-authenticate: ', header.get('www-authenticate'));
    let shibbolethUrl = '';

    if (header.get('www-authenticate').startsWith('shibboleth realm')) {
      let urlParts: string[] = header.get('www-authenticate').split(',');
      let location = urlParts[1];
      let re = /"/g;
      location = location.replace(re, '').trim();
      location = location.replace('location=', '');
      // console.log('location: ', location);
      urlParts = location.split('?');
      const host = urlParts[1].replace('target=', '');
      console.log('host: ', host);
      shibbolethUrl = host + location + '/shibboleth';
      re = /%3A%2F%2F/g;
      shibbolethUrl = shibbolethUrl.replace(re, '://');
      // console.log('shibbolethUrl: ', shibbolethUrl);
      return shibbolethUrl;
    }
    return shibbolethUrl;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authService = this.inj.get(AuthService);

    const token = authService.getToken();
    let newReq;

    // console.log('intercept() request: ', req);

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
        console.log('catchError operator in auth.interceptor was triggered');
        // Intercept an error response
        if (error instanceof HttpErrorResponse) {

          // Checks if is a response from a request to an authentication endpoint
          if (this.isAuthRequest(error)) {
            console.log('catchError isAuthRequest=true');
            // clean eventually refresh Requests list
            this.refreshTokenRequestUrls = [];
            // console.log('error: ', error);
            let location = '';
            if (error.headers.get('www-authenticate') != null && error.headers.get('www-authenticate').includes('shibboleth realm')) {

              location = this.getShibbUrlFromHeader(error.headers);
              console.log('shibb url from header: ', location);
            }
            // Create a new HttpResponse and return it, so it can be handle properly by AuthService.
            const authResponse = new HttpResponse({
              body: this.makeAuthStatusObject(false, null, error.error, location, error.headers),
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
