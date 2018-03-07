import { Injectable } from '@angular/core';
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
import { getRedirectUrl, isAuthenticated, isTokenRefreshing } from './selectors';
import { AppState, routerStateSelector } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { ResetAuthenticationMessagesAction, SetRedirectUrlAction } from './auth.actions';
import { RouterReducerState } from '@ngrx/router-store';
import { CookieAttributes } from 'js-cookie';

export const LOGIN_ROUTE = '/login';

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

  constructor(private authRequestService: AuthRequestService,
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
      .filter((routerState: RouterReducerState) => (routerState.state.url !== LOGIN_ROUTE))
      .map((routerState: RouterReducerState) => routerState.state.url);
    const redirectUrlObs = this.getRedirectUrl();
    routeUrlObs.pipe(
      withLatestFrom(redirectUrlObs),
      map(([routeUrl, redirectUrl]) => [routeUrl, redirectUrl])
    ).filter(([routeUrl, redirectUrl]) => isNotEmpty(redirectUrl) && (routeUrl !== redirectUrl))
      .subscribe(() => {
        this.setRedirectUrl(undefined);
      });
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
    const token = this.getToken();
    return isNotEmpty(token) && !this.isTokenExpired() ? Observable.of(token) : Observable.throw(false);
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
          throw(new Error('Invalid email or password'));
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
    // Retrieve authentication token info and check if is valid
    const token = this.storage.get(TOKENITEM);
    if (isNotEmpty(token) && token.hasOwnProperty('accessToken') && isNotEmpty(token.accessToken)) {
      return token;
    } else {
      return null;
    }
  }

  /**
   * Check if a token is next to be expired
   * @returns {boolean}
   */
  public isTokenExpiring(): Observable<boolean> {
    return this.store.select(isTokenRefreshing)
      .first()
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
  public isTokenExpired(): boolean {
    const token = this.getToken();
    return token && token.expires < Date.now();
  }

  /**
   * Save authentication token info
   *
   * @param {AuthTokenInfo} token The token to save
   * @returns {AuthTokenInfo}
   */
  public storeToken(token: AuthTokenInfo) {
    const expires = new Date(token.expires);
    const options: CookieAttributes = {expires: expires};
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
    this.router.navigate(['/login']);
  }

  /**
   * Redirect to the route navigated before the login
   */
  public redirectToPreviousUrl() {
    this.getRedirectUrl()
      .first()
      .subscribe((redirectUrl) => {
        if (isNotEmpty(redirectUrl)) {
          // Clear url
          this.setRedirectUrl(undefined);
          const urlTree: UrlTree = this.router.parseUrl(redirectUrl);
          const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
          const segment = '/' + g.toString();
          const navigationExtras: NavigationExtras = {
            queryParams: urlTree.queryParams,
            queryParamsHandling: 'merge'
          };
          this.router.navigate([segment], navigationExtras);
        } else {
          this.router.navigate(['/']);
        }
      })

  }

  /**
   * Refresh route navigated
   */
  public refreshPage() {
    this.store.select(routerStateSelector)
      .take(1)
      .subscribe((router) => {
        // TODO Check a way to hard refresh the same route
        // this.router.navigate([router.state.url],  { replaceUrl: true });
        this.router.navigate(['/']);
      })
  }

  /**
   * Get redirect url
   */
  getRedirectUrl(): Observable<string> {
    return this.store.select(getRedirectUrl);
  }

  /**
   * Set redirect url
   */
  setRedirectUrl(url: string) {
    this.store.dispatch(new SetRedirectUrlAction(isNotUndefined(url) ? url : ''));
  }
}
