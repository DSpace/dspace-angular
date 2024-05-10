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
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  APP_DATA_SERVICES_MAP,
  LazyDataServicesMap,
} from '../../../../config/app-config.interface';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { lazyDataService } from '../../../core/lazy-data-service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ResourceType } from '../../../core/shared/resource-type';
import { isEmpty } from '../../empty.util';

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
