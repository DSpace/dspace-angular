import { map, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { AuthStatus } from './models/auth-status.model';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthService } from './auth.service';
import { AuthTokenInfo } from './models/auth-token-info.model';
import { CheckAuthenticationTokenAction } from './auth.actions';
import { EPerson } from '../eperson/models/eperson.model';

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
      map((status) => this.rdbService.build(status)),
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
  public redirectToPreviousUrl() {
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
          this.router.navigate(['/']);
        }
      })

  }

}
