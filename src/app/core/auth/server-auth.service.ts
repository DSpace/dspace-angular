import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { isNotEmpty } from '../../shared/empty.util';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { AuthService } from './auth.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo } from './models/auth-token-info.model';

/**
 * The auth service.
 */
@Injectable()
export class ServerAuthService extends AuthService {

  /**
   * Returns the authenticated user
   * @returns {User}
   */
  public authenticatedUser(token: AuthTokenInfo): Observable<string> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();

    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);

    options.headers = headers;
    return this.authRequestService.getRequest('status', options).pipe(
      map((status: AuthStatus) => {
        if (status.authenticated) {
          return status._links.eperson.href;
        } else {
          throw(new Error('Not authenticated'));
        }
      }));
  }

  /**
   * Checks if token is present into the request cookie
   */
  public checkAuthenticationCookie(): Observable<AuthStatus> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    if (isNotEmpty(this.req.protocol) && isNotEmpty(this.req.header('host'))) {
      const referer = this.req.protocol + '://' + this.req.header('host') + this.req.path;
      // use to allow the rest server to identify the real origin on SSR
      headers = headers.append('X-Requested-With', referer);
    }
    options.headers = headers;
    options.withCredentials = true;
    return this.authRequestService.getRequest('status', options).pipe(
      map((status: AuthStatus) => Object.assign(new AuthStatus(), status))
    );
  }

  /**
   * Redirect to the route navigated before the login
   */
  public redirectAfterLoginSuccess(isStandalonePage: boolean) {
    this.getRedirectUrl().pipe(
      take(1))
      .subscribe((redirectUrl) => {
        if (isNotEmpty(redirectUrl)) {
          // override the route reuse strategy
          this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
          };
          this.router.navigated = false;
          const url = decodeURIComponent(redirectUrl);
          this.router.navigateByUrl(url);
        } else {
          // If redirectUrl is empty use history. For ssr the history array should contain the requested url.
          this.routeService.getHistory().pipe(
            filter((history) => history.length > 0),
            take(1)
          ).subscribe((history) => {
            this.navigateToRedirectUrl(history[history.length - 1] || '');
          });
        }
      })
  }

}
