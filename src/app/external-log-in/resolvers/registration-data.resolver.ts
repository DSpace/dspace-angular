import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EpersonRegistrationService } from '@dspace/core/data/eperson-registration.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Registration } from '@dspace/core/shared/registration.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
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
