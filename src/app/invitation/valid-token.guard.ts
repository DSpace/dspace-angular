import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { map, tap } from 'rxjs/operators';
import { RemoteData } from '../core/data/remote-data';
import { Registration } from '../core/shared/registration.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { hasValue } from '../shared/empty.util';

@Injectable({
  providedIn: 'root'
})
export class ValidTokenGuard implements CanActivate {
  constructor(private router: Router,
              private epersonRegistrationService: EpersonRegistrationService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean | Observable<boolean> {
    // get the url
    if (route.params.registrationToken) {
      // search by token found
      return this.epersonRegistrationService.searchRegistrationByToken(route.params.registrationToken).pipe(
        getFirstCompletedRemoteData(),
        map((data: RemoteData<Registration>) => data.hasSucceeded && hasValue('groupNames') && data.payload.groupNames.length > 0),
        tap((isValid: boolean) => {
          if (!isValid) {
            this.router.navigate(['/404']);
          }
        })
      );
    } else {
      this.router.navigate(['/404']);
      return of(false);
    }
  }
}
