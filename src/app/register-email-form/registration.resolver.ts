import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { EpersonRegistrationService } from '@dspace/core/data/eperson-registration.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Registration } from '@dspace/core/shared/registration.model';
import { Observable } from 'rxjs';

export const registrationResolver: ResolveFn<RemoteData<Registration>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  epersonRegistrationService: EpersonRegistrationService = inject(EpersonRegistrationService),
): Observable<RemoteData<Registration>> => {
  const token = route.params.token;
  return epersonRegistrationService.searchByTokenAndUpdateData(token).pipe(
    getFirstCompletedRemoteData(),
  );
};
