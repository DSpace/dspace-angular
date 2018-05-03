import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { AuthStatus } from './models/auth-status.model';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthService } from './auth.service';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { CheckAuthenticationTokenAction } from './auth.actions';

/**
 * The auth service.
 */
@Injectable()
export class ServerAuthService extends AuthService {

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

    // NB this could be use to avoid the problem with the authentication is case the UI is rendered by Angular Universal.
    const clientIp = this.req.connection.remoteAddress;

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
   * Checks if token is present into browser storage and is valid. (NB Check is done only on SSR)
   */
  public checksAuthenticationToken() {
    this.store.dispatch(new CheckAuthenticationTokenAction())
  }

  /**
   * Redirect to the route navigated before the login
   */
  public redirectToPreviousUrl() {
    this.getRedirectUrl()
      .first()
      .subscribe((redirectUrl) => {
        console.log('server side');
        if (isNotEmpty(redirectUrl)) {
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

}
