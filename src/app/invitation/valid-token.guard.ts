import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import {Observable, } from 'rxjs';
import {EpersonRegistrationService} from '../core/data/eperson-registration.service';
import {map, tap} from 'rxjs/operators';
import {RemoteData} from '../core/data/remote-data';
import {Registration} from '../core/shared/registration.model';
import {getFirstCompletedRemoteData} from '../core/shared/operators';
import {hasValue} from '../shared/empty.util';

@Injectable({
  providedIn: 'root'
})
export class ValidTokenGuard implements CanActivate {
  constructor(private router: Router,
              private epersonRegistrationService: EpersonRegistrationService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean | Observable<boolean> {
    // get the url
    if (state.root.queryParams.token) {
      // search by token found
      return this.epersonRegistrationService.searchByTokenAndHandleError(state.root.queryParams.token).pipe(
        tap((rd: RemoteData<Registration>) => {
          // if 404
          if (rd.isError) {
            this.router.navigate(['/404']);
          }
        }),
        getFirstCompletedRemoteData())
        .pipe(
          map((data: RemoteData<Registration>) => hasValue('groupNames') && data.payload.groupNames.length > 0),
        );
    } else {
      this.router.navigate(['/404']);
      return false;
    }
  }
}
