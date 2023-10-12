import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { catchError, mergeMap, Observable, of, tap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { hasValue } from '../../shared/empty.util';

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
    if (route.params.token) {
      return this.epersonRegistrationService
        .searchRegistrationByToken(route.params.token)
        .pipe(
          getFirstCompletedRemoteData(),
          mergeMap(
            (data: RemoteData<Registration>) => {
              if (data.hasSucceeded && hasValue(data.payload)) {
                // is the registration type validation (account valid)
                if (hasValue(data.payload.registrationType) && data.payload.registrationType.includes(AuthRegistrationType.Validation)) {
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
