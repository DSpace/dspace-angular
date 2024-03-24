import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { RemoteData } from '../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { Registration } from '../core/shared/registration.model';

@Injectable({ providedIn: 'root' })
/**
 * Resolver to resolve a Registration object based on the provided token
 */
export class RegistrationResolver implements Resolve<RemoteData<Registration>> {

  constructor(private epersonRegistrationService: EpersonRegistrationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Registration>> {
    const token = route.params.token;
    return this.epersonRegistrationService.searchByToken(token).pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
