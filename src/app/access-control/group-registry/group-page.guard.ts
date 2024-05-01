import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import {
  StringGuardParamFn, someFeatureAuthorizationGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/some-feature-authorization.guard';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';

const defaultGroupPageGetObjectUrl: StringGuardParamFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<string> => {
  const halEndpointService = inject(HALEndpointService);
  const groupsEndpoint = 'groups';

  return halEndpointService.getEndpoint(groupsEndpoint).pipe(
    map(groupsUrl => `${groupsUrl}/${route?.params?.groupId}`)
  );
};

export const groupPageGuard = (
  getObjectUrl = defaultGroupPageGetObjectUrl,
  getEPersonUuid?: StringGuardParamFn,
): CanActivateFn => someFeatureAuthorizationGuard(
  () => observableOf([FeatureID.CanManageGroup]),
  getObjectUrl,
  getEPersonUuid);
