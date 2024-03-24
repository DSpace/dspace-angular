import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
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
import { lazyService } from '../../../core/lazy-service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ResourceType } from '../../../core/shared/resource-type';
import { isEmpty } from '../../empty.util';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable({ providedIn: 'root' })
export class ResourcePolicyTargetResolver implements Resolve<RemoteData<DSpaceObject>> {

  constructor(
    private parentInjector: Injector,
    private router: Router,
    @Inject(APP_DATA_SERVICES_MAP) private dataServiceMap: InjectionToken<LazyDataServicesMap>) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<DSpaceObject>> {
    const targetType = route.queryParamMap.get('targetType');
    const policyTargetId = route.queryParamMap.get('policyTargetId');

    if (isEmpty(targetType) || isEmpty(policyTargetId)) {
      this.router.navigateByUrl('/404', { skipLocationChange: true });
    }

    const resourceType: ResourceType = new ResourceType(targetType);
    const lazyProvider$: Observable<IdentifiableDataService<DSpaceObject>> = lazyService(this.dataServiceMap[resourceType.value], this.parentInjector);

    return lazyProvider$.pipe(
      switchMap((dataService: IdentifiableDataService<DSpaceObject>) => {
        return dataService.findById(policyTargetId);
      }),
      getFirstCompletedRemoteData(),
    );
  }
}
