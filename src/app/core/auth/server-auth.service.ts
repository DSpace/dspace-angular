import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { EPerson } from '../eperson/models/eperson.model';
import { CheckAuthenticationTokenAction } from './auth.actions';
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
  public authenticatedUser(token: AuthTokenInfo): Observable<EPerson> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();

    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);
    // NB this is used to pass server client IP check.
    const clientIp = this.req.get('x-forwarded-for') || this.req.connection.remoteAddress;
    headers = headers.append('X-Forwarded-For', clientIp);

    options.headers = headers;
    return this.authRequestService.getRequest('status', options).pipe(
      map((status) => this.linkService.resolveLinks(status, followLink<AuthStatus>('eperson'))),
      switchMap((status: AuthStatus) => {
        if (status.authenticated) {
          return status.eperson.pipe(map((eperson) => eperson.payload));
        } else {
          throw(new Error('Not authenticated'));
        }
      }));
  }

  /**
   * Checks if token is present into browser storage and is valid. (NB Check is done only on SSR)
   */
  public checkAuthenticationToken() {
    this.store.dispatch(new CheckAuthenticationTokenAction())
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
