import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, PRIMARY_OUTLET, Router, UrlSegmentGroup, UrlTree } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map, withLatestFrom } from 'rxjs/operators';

import { Eperson } from '../eperson/models/eperson.model';
import { AuthRequestService } from './auth-request.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo, TOKENITEM } from './models/auth-token-info.model';
import { isEmpty, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { CookieService } from '../../shared/services/cookie.service';
import { getAuthenticationToken, getRedirectUrl, isAuthenticated, isTokenRefreshing } from './selectors';
import { AppState, routerStateSelector } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { ResetAuthenticationMessagesAction, SetRedirectUrlAction } from './auth.actions';
import { RouterReducerState } from '@ngrx/router-store';
import { CookieAttributes } from 'js-cookie';
import { NativeWindowRef, NativeWindowService } from '../../shared/services/window.service';
import { PlatformService } from '../../shared/services/platform.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';

export const LOGIN_ROUTE = '/login';

export const REDIRECT_COOKIE = 'dsRedirectUrl';

/**
 * The auth service.
 */
@Injectable()
export class AuthService {

  /**
   * True if authenticated
   * @type boolean
   */
  private _authenticated: boolean;

  constructor(@Inject(NativeWindowService) private _window: NativeWindowRef,
              @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
              private authRequestService: AuthRequestService,
              private platform: PlatformService,
              private router: Router,
              private storage: CookieService,
              private store: Store<AppState>) {
    this.store.select(isAuthenticated)
      .startWith(false)
      .subscribe((authenticated: boolean) => this._authenticated = authenticated);

    // If current route is different from the one setted in authentication guard
    // and is not the login route, clear redirect url and messages
    const routeUrlObs = this.store.select(routerStateSelector)
      .filter((routerState: RouterReducerState) => isNotUndefined(routerState) && isNotUndefined(routerState.state))
      .filter((routerState: RouterReducerState) => !this.isLoginRoute(routerState.state.url))
      .map((routerState: RouterReducerState) => routerState.state.url);
    const redirectUrlObs = this.getRedirectUrl();
    routeUrlObs.pipe(
      withLatestFrom(redirectUrlObs),
      map(([routeUrl, redirectUrl]) => [routeUrl, redirectUrl])
    ).filter(([routeUrl, redirectUrl]) => isNotEmpty(redirectUrl) && (routeUrl !== redirectUrl))
      .subscribe(() => {
        this.clearRedirectUrl();
      });
  }

  /**
   * Check if is a login page route
   *
   * @param {string} url
   * @returns {Boolean}.
   */
  protected isLoginRoute(url: string) {
    const urlTree: UrlTree = this.router.parseUrl(url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    const segment = '/' + g.toString();
    return segment === LOGIN_ROUTE;
  }

  /**
   * Authenticate the user
   *
   * @param {string} user The user name
   * @param {string} password The user's password
   * @returns {Observable<User>} The authenticated user observable.
   */
  public authenticate(user: string, password: string): Observable<AuthStatus> {
    // Attempt authenticating the user using the supplied credentials.
    const body = encodeURI(`password=${password}&user=${user}`);
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    return this.authRequestService.postToEndpoint('login', body, options)
      .map((status: AuthStatus) => {
        if (status.authenticated) {
          return status;
        } else {
          throw(new Error('Invalid email or password'));
        }
      })

  }

  /**
   * Determines if the user is authenticated
   * @returns {Observable<boolean>}
   */
  public isAuthenticated(): Observable<boolean> {
    return this.store.select(isAuthenticated);
  }

  /**
   * Returns the authenticated user
   * @returns {User}
   */
  public authenticatedUser(token: AuthTokenInfo): Observable<Eperson> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);
    options.headers = headers;
    return this.authRequestService.getRequest('status', options)
      .map((status: AuthStatus) => {
        if (status.authenticated) {
          return status.eperson[0];
        } else {
          throw(new Error('Not authenticated'));
        }
      });
  }

  /**
   * Checks if token is present into storage and is not expired
   */
  public checkAuthenticationToken(): Observable<AuthTokenInfo> {
    return this.store.select(getAuthenticationToken)
      .take(1)
      .map((authTokenInfo: AuthTokenInfo) => {
        let token: AuthTokenInfo;
        // Retrieve authentication token info and check if is valid
        token = isNotEmpty(authTokenInfo) ? authTokenInfo : this.storage.get(TOKENITEM);
        if (isNotEmpty(token) && token.hasOwnProperty('accessToken') && isNotEmpty(token.accessToken) && !this.isTokenExpired(token)) {
          return token;
        } else {
          throw false;
        }
      });
  }

  /**
   * Checks if token is present into storage
   */
  public refreshAuthenticationToken(token: AuthTokenInfo): Observable<AuthTokenInfo> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);
    options.headers = headers;
    return this.authRequestService.postToEndpoint('login', {}, options)
      .map((status: AuthStatus) => {
        if (status.authenticated) {
          return status.token;
        } else {
          throw(new Error('Not authenticated'));
        }
      });
  }

  /**
   * Clear authentication errors
   */
  public resetAuthenticationError(): void {
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }

  /**
   * Retrieve authentication methods available
   * @returns {User}
   */
  public retrieveAuthMethods(): Observable<string> {
    return this.authRequestService.getRequest('login')
      .map((status: AuthStatus) => {
        let url = '';
        if (isNotEmpty(status.ssoLoginUrl)) {
          url = this.parseSSOLocation(status.ssoLoginUrl);
        }
        return url;
      });
  }

  private parseSSOLocation(url: string): string {
    const parseUrl = decodeURIComponent(url);
    // const urlTree: UrlTree = this.router.parseUrl(url);
    // this.router.parseUrl(url);
    // if (url.endsWith('/')) {
    //   url += 'login';
    // } else {
    //   url = url.replace('/?target=http(.+)/g', 'https://hasselt-dspace.dev01.4science.it/dspace-spring-rest/shib.html');
    // }
    // console.log(url);
    const target = `?target=${this.config.auth.target.host}${this.config.auth.target.page}`;
    return parseUrl.replace(/\?target=http.+/g, target);
  }

  /**
   * Create a new user
   * @returns {User}
   */
  public create(user: Eperson): Observable<Eperson> {
    // Normally you would do an HTTP request to POST the user
    // details and then return the new user object
    // but, let's just return the new user for this example.
    // this._authenticated = true;
    return Observable.of(user);
  }

  /**
   * End session
   * @returns {Observable<boolean>}
   */
  public logout(): Observable<boolean> {
    // Send a request that sign end the session
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const options: HttpOptions = Object.create({headers, responseType: 'text'});
    return this.authRequestService.getRequest('logout', options)
      .map((status: AuthStatus) => {
        if (!status.authenticated) {
          return true;
        } else {
          throw(new Error('auth.errors.invalid-user'));
        }
      })

  }

  /**
   * Retrieve authentication token info and make authorization header
   * @returns {string}
   */
  public buildAuthHeader(token?: AuthTokenInfo): string {
    if (isEmpty(token)) {
      token = this.getToken();
    }
    return (this._authenticated && isNotNull(token)) ? `Bearer ${token.accessToken}` : '';
  }

  /**
   * Get authentication token info
   * @returns {AuthTokenInfo}
   */
  public getToken(): AuthTokenInfo {
    let token: AuthTokenInfo;
    this.store.select(getAuthenticationToken)
      .subscribe((authTokenInfo: AuthTokenInfo) => {
        // Retrieve authentication token info and check if is valid
        token = authTokenInfo || null;
      });
    return token;
  }

  /**
   * Check if a token is next to be expired
   * @returns {boolean}
   */
  public isTokenExpiring(): Observable<boolean> {
    return this.store.select(isTokenRefreshing)
      .take(1)
      .map((isRefreshing: boolean) => {
        if (this.isTokenExpired() || isRefreshing) {
          return false;
        } else {
          const token = this.getToken();
          return token.expires - (60 * 5 * 1000) < Date.now();
        }
      })
  }

  /**
   * Check if a token is expired
   * @returns {boolean}
   */
  public isTokenExpired(token?: AuthTokenInfo): boolean {
    token = token || this.getToken();
    return token && token.expires < Date.now();
  }

  /**
   * Save authentication token info
   *
   * @param {AuthTokenInfo} token The token to save
   * @returns {AuthTokenInfo}
   */
  public storeToken(token: AuthTokenInfo) {
    console.log(token);
    // Add 1 day to the current date
    const expireDate = Date.now() + (1000 * 60 * 60 * 24 * 1);

    // Set the cookie expire date
    const expires = new Date(expireDate);
    const options: CookieAttributes = {expires: expires};

    // Save cookie with the token
    return this.storage.set(TOKENITEM, token, options);
  }

  /**
   * Remove authentication token info
   */
  public removeToken() {
    return this.storage.remove(TOKENITEM);
  }

  /**
   * Replace authentication token info with a new one
   */
  public replaceToken(token: AuthTokenInfo) {
    this.removeToken();
    return this.storeToken(token);
  }

  /**
   * Redirect to the login route
   */
  public redirectToLogin() {
    this.router.navigate([LOGIN_ROUTE]);
  }

  /**
   * Redirect to the login route when token has expired
   */
  public redirectToLoginWhenTokenExpired() {
    const redirectUrl = LOGIN_ROUTE + '?expired=true';
    if (this._window.nativeWindow.location) {
      // Hard redirect to login page, so that all state is definitely lost
      this._window.nativeWindow.location.href = redirectUrl;
    } else {
      this.router.navigateByUrl(redirectUrl);
    }
  }

  /**
   * Redirect to the route navigated before the login
   */
  public redirectToPreviousUrl() {
    this.getRedirectUrl()
      .take(1)
      .subscribe((redirectUrl) => {
        if (isNotEmpty(redirectUrl)) {
          if (this.platform.isBrowser) {
            this.clearRedirectUrl();
          }

          // override the route reuse strategy
          this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
          };
          this.router.navigated = false;
          const url = decodeURIComponent(redirectUrl);
          this.router.navigateByUrl(url);
        } else {
          this.router.navigate(['/']);
        }
      })

  }

  /**
   * Refresh route navigated
   */
  public refreshAfterLogout() {
    this.router.navigate(['/home']);
    // Hard redirect to home page, so that all state is definitely lost
    this._window.nativeWindow.location.href = '/home';
  }

  /**
   * Get redirect url
   */
  getRedirectUrl(): Observable<string> {
    const redirectUrl = this.storage.get(REDIRECT_COOKIE);
    if (isNotEmpty(redirectUrl)) {
      return Observable.of(redirectUrl);
    } else {
      return this.store.select(getRedirectUrl);
    }
  }

  /**
   * Set redirect url
   */
  setRedirectUrl(url: string) {
    // Add 1 day to the current date
    const expireDate = Date.now() + (1000 * 60 * 60 * 24 * 1);

    // Set the cookie expire date
    const expires = new Date(expireDate);
    const options: CookieAttributes = {expires: expires};
    this.storage.set(REDIRECT_COOKIE, url, options);
    this.store.dispatch(new SetRedirectUrlAction(isNotUndefined(url) ? url : ''));
  }

  /**
   * Clear redirect url
   */
  clearRedirectUrl() {
    this.store.dispatch(new SetRedirectUrlAction(''));
    this.storage.remove(REDIRECT_COOKIE);
  }
}
