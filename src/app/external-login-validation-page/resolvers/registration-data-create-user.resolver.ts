import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { hasValue, hasNoValue } from '../../shared/empty.util';
import { RegistrationData } from '../../shared/external-log-in-complete/models/registration-data.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationDataCreateUserResolver implements Resolve<boolean> {
  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private epersonDataService: EPersonDataService
  ) {}

  /**
   * Resolves the registration data and creates a new user account from the given token.
   * The account will be created only when the registration data does NOT contain a user (uuid).
   * @param route The activated route snapshot.
   * @param state The router state snapshot.
   * @returns An observable of a boolean indicating whether the user was created successfully or not.
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = route.params.token;
    return this.epersonRegistrationService
      .searchByTokenAndUpdateData(token)
      .pipe(
        getFirstCompletedRemoteData(),
        switchMap((rd) => {
          if (
            rd.hasSucceeded &&
            hasValue(rd.payload) &&
            hasNoValue(rd.payload.user)
          ) {
            const registrationData = Object.assign(
              new RegistrationData(),
              rd.payload
            );
            return this.createUserFromToken(token, registrationData);
          }
          if (rd.hasFailed) {
            return of(false);
          }
        })
      );
  }

  /**
   * Creates a new user from a given token and registration data.
   * Based on the registration data, the user will be created with the following properties:
   * - email: the email address from the registration data
   * - metadata: all metadata values from the registration data, except for the email metadata key (ePerson object does not have an email metadata field)
   * - canLogIn: true
   * - requireCertificate: false
   * @param token The token used to create the user.
   * @param registrationData The registration data used to create the user.
   * @returns An Observable that emits a boolean indicating whether the user creation was successful.
   */
  createUserFromToken(
    token: string,
    registrationData: RegistrationData
  ): Observable<boolean> {
    const metadataValues = {};
    for (const [key, value] of Object.entries(registrationData.registrationMetadata)) {
      if (hasValue(value[0]?.value) && key !== 'email') {
        metadataValues[key] = value[0]?.value;
      }
    }
    const eperson = new EPerson();
    eperson.email = registrationData.email;
    eperson.metadata = metadataValues;
    eperson.canLogIn = true;
    eperson.requireCertificate = false;
    return this.epersonDataService.createEPersonForToken(eperson, token).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<EPerson>) => {
        return rd.hasSucceeded;
      })
    );
  }
}
