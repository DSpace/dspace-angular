import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CookieService } from '../services/cookie.service';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { returnEndUserAgreementUrlTreeOnFalse } from '../shared/operators';

export const USER_AGREEMENT_COOKIE = 'hasAgreedEndUser';
export const USER_AGREEMENT_METADATA_FIELD = 'dspace.agreements.end-user';

/**
 * A guard redirecting users to the end agreement page when they haven't accepted the latest user agreement
 */
@Injectable()
export class UserAgreementGuard implements CanActivate {

  constructor(protected cookie: CookieService,
              protected authService: AuthService,
              protected router: Router) {
  }

  /**
   * True when the user has accepted the agreements
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
    if (this.cookie.get(USER_AGREEMENT_COOKIE) === true) {
      return true;
    } else {
      return this.authService.getAuthenticatedUserFromStore().pipe(
        map((user) => hasValue(user) && user.hasMetadata(USER_AGREEMENT_METADATA_FIELD) && user.firstMetadata(USER_AGREEMENT_METADATA_FIELD).value === 'true'),
        returnEndUserAgreementUrlTreeOnFalse(this.router)
      );
    }
  }
}
