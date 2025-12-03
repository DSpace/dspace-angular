import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {
  someFeatureAuthorizationGuard,
  StringGuardParamFn,
} from '@dspace/core/data/feature-authorization/feature-authorization-guard/some-feature-authorization.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import {
  Observable,
  of,
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
  () => of([FeatureID.CanManageGroup]),
  getObjectUrl,
  getEPersonUuid);
