import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CookieService } from '../services/cookie.service';
import { Observable } from 'rxjs/internal/Observable';
import { of as observableOf } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { cloneDeep } from 'lodash';
import { Metadata } from '../shared/metadata.utils';
import { EPersonDataService } from '../eperson/eperson-data.service';
import { getSucceededRemoteData } from '../shared/operators';

export const USER_AGREEMENT_COOKIE = 'hasAgreedEndUser';
export const USER_AGREEMENT_METADATA_FIELD = 'dspace.agreements.end-user';

/**
 * Service for checking and managing the status of the current end user agreement
 */
@Injectable()
export class UserAgreementService {

  constructor(protected cookie: CookieService,
              protected authService: AuthService,
              protected ePersonService: EPersonDataService) {
  }

  /**
   * Whether or not the current user has accepted the End User Agreement
   */
  hasCurrentUserAcceptedAgreement(): Observable<boolean> {
    if (this.cookie.get(USER_AGREEMENT_COOKIE) === true) {
      return observableOf(true);
    } else {
      return this.authService.isAuthenticated().pipe(
        switchMap((authenticated) => {
          if (authenticated) {
            return this.authService.getAuthenticatedUserFromStore().pipe(
              map((user) => hasValue(user) && user.hasMetadata(USER_AGREEMENT_METADATA_FIELD) && user.firstMetadata(USER_AGREEMENT_METADATA_FIELD).value === 'true')
            );
          } else {
            return observableOf(false);
          }
        })
      );
    }
  }

  /**
   * Set the current user's accepted agreement status
   * When a user is authenticated, set his/her metadata to the provided value
   * When no user is authenticated, set the cookie to the provided value
   * @param accepted
   */
  setUserAcceptedAgreement(accepted: boolean): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return this.authService.getAuthenticatedUserFromStore().pipe(
            switchMap((user) => {
              const updatedUser = cloneDeep(user);
              Metadata.setFirstValue(updatedUser.metadata, USER_AGREEMENT_METADATA_FIELD, String(accepted));
              return this.ePersonService.update(updatedUser);
            }),
            getSucceededRemoteData(),
            map((rd) => hasValue(rd.payload))
          );
        } else {
          this.cookie.set(USER_AGREEMENT_COOKIE, accepted);
          return observableOf(true);
        }
      }),
      take(1)
    );
  }

}
