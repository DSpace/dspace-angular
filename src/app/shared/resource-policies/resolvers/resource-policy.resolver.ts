import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { RemoteData } from '../../../core/data/remote-data';
import { ResourcePolicy } from '../../../core/resource-policy/models/resource-policy.model';
import { ResourcePolicyDataService } from '../../../core/resource-policy/resource-policy-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { isEmpty } from '../../empty.util';
import { followLink } from '../../utils/follow-link-config.model';

/**
 * Method for resolving an item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {Router} router
 * @param {ResourcePolicyDataService} resourcePolicyService
 * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const resourcePolicyResolver: ResolveFn<RemoteData<ResourcePolicy>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  router: Router = inject(Router),
  resourcePolicyService: ResourcePolicyDataService = inject(ResourcePolicyDataService),
): Observable<RemoteData<ResourcePolicy>> => {
  const policyId = route.queryParamMap.get('policyId');

  if (isEmpty(policyId)) {
    router.navigateByUrl('/404', { skipLocationChange: true });
  }

  return resourcePolicyService.findById(policyId, true, false, followLink('eperson'), followLink('group')).pipe(
    getFirstCompletedRemoteData(),
  );
};
