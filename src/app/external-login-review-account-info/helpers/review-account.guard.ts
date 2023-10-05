import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import isEqual from 'lodash/isEqual';
import { Observable, catchError, mergeMap, of, tap } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthMethodType } from 'src/app/core/auth/models/auth.method-type';
import { EpersonRegistrationService } from 'src/app/core/data/eperson-registration.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { Registration } from 'src/app/core/shared/registration.model';
import { hasValue } from 'src/app/shared/empty.util';
import { RegistrationData } from 'src/app/shared/external-log-in-complete/models/registration-data.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewAccountGuard implements CanActivate {
  constructor(
    private router: Router,
    private epersonRegistrationService: EpersonRegistrationService,
    private authService: AuthService
  ) { }

  /**
   * Determines if a user can activate a route based on the registration token.
   * @param route - The activated route snapshot.
   * @param state - The router state snapshot.
   * @returns A value indicating if the user can activate the route.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean | Observable<boolean> {
    if (route.queryParams.token) {
      return this.epersonRegistrationService
        .searchRegistrationByToken(route.queryParams.token)
        .pipe(
          getFirstCompletedRemoteData(),
          mergeMap(
            (data: RemoteData<Registration>) => {
              if (data.hasSucceeded && hasValue(data)) {
                const registrationData = Object.assign(new RegistrationData(), data.payload);
                // is the registration type validation (account valid)
                if (isEqual(registrationData.registrationType, AuthMethodType.Validation)) {
                  return of(true);
                } else {
                  return this.authService.isAuthenticated();
                }
              }
              return of(false);
            }
          ),
          tap((isValid: boolean) => {
            if (!isValid) {
              this.router.navigate(['/404']);
            }
          }),
          catchError(() => {
            this.router.navigate(['/404']);
            return of(false);
          })
        );
    } else {
      this.router.navigate(['/404']);
      return of(false);
    }
  }
}
