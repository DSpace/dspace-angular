import {
  inject,
  Injector,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { isEmpty } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { APP_DATA_SERVICES_MAP } from '../../../../../modules/core/src/lib/core/config/app-config.interface';
import { IdentifiableDataService } from '../../../../../modules/core/src/lib/core/data/base/identifiable-data.service';
import { RemoteData } from '../../../../../modules/core/src/lib/core/data/remote-data';
import { LazyDataServicesMap } from '../../../../../modules/core/src/lib/core/data-services-map';
import { lazyDataService } from '../../../../../modules/core/src/lib/core/lazy-data-service';
import { DSpaceObject } from '../../../../../modules/core/src/lib/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../../../modules/core/src/lib/core/shared/operators';
import { ResourceType } from '../../../../../modules/core/src/lib/core/shared/resource-type';

/**
 * Method for resolving an item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param dataServiceMap
 * @param parentInjector
 * @param router
 * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const resourcePolicyTargetResolver: ResolveFn<RemoteData<DSpaceObject>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  dataServiceMap: LazyDataServicesMap = inject(APP_DATA_SERVICES_MAP),
  parentInjector: Injector = inject(Injector),
  router: Router = inject(Router),
): Observable<RemoteData<DSpaceObject>> => {
  const targetType = route.queryParamMap.get('targetType');
  const policyTargetId = route.queryParamMap.get('policyTargetId');

  if (isEmpty(targetType) || isEmpty(policyTargetId)) {
    router.navigateByUrl('/404', { skipLocationChange: true });
  }

  const resourceType: ResourceType = new ResourceType(targetType);
  const lazyProvider$: Observable<IdentifiableDataService<DSpaceObject>> = lazyDataService(dataServiceMap, resourceType.value, parentInjector);

  return lazyProvider$.pipe(
    switchMap((dataService: IdentifiableDataService<DSpaceObject>) => {
      return dataService.findById(policyTargetId);
    }),
    getFirstCompletedRemoteData(),
  );
};
