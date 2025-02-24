import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {
  FeatureID,
  HALEndpointService,
  someFeatureAuthorizationGuard,
  StringGuardParamFn,
} from '@dspace/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import { map } from 'rxjs/operators';

const defaultGroupPageGetObjectUrl: StringGuardParamFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<string> => {
  const halEndpointService = inject(HALEndpointService);
  const groupsEndpoint = 'groups';

  return halEndpointService.getEndpoint(groupsEndpoint).pipe(
    map(groupsUrl => `${groupsUrl}/${route?.params?.groupId}`),
  );
};

export const groupPageGuard = (
  getObjectUrl = defaultGroupPageGetObjectUrl,
  getEPersonUuid?: StringGuardParamFn,
): CanActivateFn => someFeatureAuthorizationGuard(
  () => observableOf([FeatureID.CanManageGroup]),
  getObjectUrl,
  getEPersonUuid);
