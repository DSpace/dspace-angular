import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { EpersonRegistrationService } from 'src/app/core/data/eperson-registration.service';
import { hasValue } from '../../empty.util';
import { Registration } from 'src/app/core/shared/registration.model';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { RemoteData } from 'src/app/core/data/remote-data';
import { RegistrationData } from '../models/registration-data.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Resolver for retrieving registration data based on a token.
 */
export class RegistrationDataResolver implements Resolve<RegistrationData> {

  /**
   * Constructor for RegistrationDataResolver.
   * @param epersonRegistrationService The EpersonRegistrationService used to retrieve registration data.
   */
  constructor(private epersonRegistrationService: EpersonRegistrationService) {}

  /**
   * Resolves registration data based on a token.
   * @param route The ActivatedRouteSnapshot containing the token parameter.
   * @param state The RouterStateSnapshot.
   * @returns An Observable of RegistrationData.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RegistrationData> {
    const token = route.params.token;
    if (hasValue(token)) {
     return this.epersonRegistrationService.searchByTokenAndUpdateData(token).pipe(
        getFirstCompletedRemoteData(),
        map((registrationRD: RemoteData<Registration>) => {
          if (registrationRD.hasSucceeded && hasValue(registrationRD.payload)) {
            return Object.assign(new RegistrationData(), registrationRD.payload);
          } else {
            return null;
          }
        })
      );
    }
  }
}
