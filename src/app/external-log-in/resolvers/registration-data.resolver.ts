import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {
  EpersonRegistrationService,
  RemoteData,
  getFirstCompletedRemoteData,
  Registration,
} from '@dspace/core'
import { hasValue } from '@dspace/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Resolver for retrieving registration data based on a token.
 */
export class RegistrationDataResolver implements Resolve<RemoteData<Registration>> {

  /**
   * Constructor for RegistrationDataResolver.
   * @param epersonRegistrationService The EpersonRegistrationService used to retrieve registration data.
   */
  constructor(private epersonRegistrationService: EpersonRegistrationService) {}

  /**
   * Resolves registration data based on a token.
   * @param route The ActivatedRouteSnapshot containing the token parameter.
   * @param state The RouterStateSnapshot.
   * @returns An Observable of Registration.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Registration>> {
    const token = route.params.token;
    if (hasValue(token)) {
      return this.epersonRegistrationService.searchByTokenAndHandleError(token).pipe(
        getFirstCompletedRemoteData(),
      );
    }
  }
}
