import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { hasValue } from '../../shared/empty.util';
import { AuthRegistrationType } from 'src/app/core/auth/models/auth.registration-type';

@Injectable({
  providedIn: 'root',
})
export class RegistrationTokenGuard implements CanActivate {
  constructor(
    private router: Router,
    private epersonRegistrationService: EpersonRegistrationService
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
  ): Observable<boolean> {
    if (route.params.token) {
      return this.epersonRegistrationService
        .searchRegistrationByToken(route.params.token)
        .pipe(
          getFirstCompletedRemoteData(),
          map(
            (data: RemoteData<Registration>) => {
              if (data.hasSucceeded && hasValue(data.payload) && !data.payload.registrationType.includes(AuthRegistrationType.Validation)) {
                return true;
              } else {
                this.router.navigate(['/404']);
              }
            }
          )
        );
    } else {
      this.router.navigate(['/404']);
      return of(false);
    }
  }
}
