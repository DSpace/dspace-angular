import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  NavigationExtras,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import { isEmpty } from '../shared/empty.util';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { MyDSpaceConfigurationValueType } from './my-dspace-configuration-value-type';
import { MYDSPACE_ROUTE } from './my-dspace-page.component';

/**
 * Prevent unauthorized activating and loading of mydspace configuration
 */
export const myDSpaceGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  configurationService: MyDSpaceConfigurationService = inject(MyDSpaceConfigurationService),
  router: Router = inject(Router),
): Observable<boolean> => {
  return configurationService.getAvailableConfigurationTypes().pipe(
    first(),
    map((configurationList) => validateConfigurationParam(router, route.queryParamMap.get('configuration'), configurationList)));
};

/**
 * Check if the given configuration is present in the list of those available
 *
 * @param router
 *    the service router
 * @param configuration
 *    the configuration to validate
 * @param configurationList
 *    the list of available configuration
 *
 */
function validateConfigurationParam(router: Router, configuration: string, configurationList: MyDSpaceConfigurationValueType[]): boolean {
  const configurationDefault: string = configurationList[0];
  if (isEmpty(configuration) || !configurationList.includes(configuration as MyDSpaceConfigurationValueType)) {
    // If configuration param is empty or is not included in available configurations redirect to a default configuration value
    const navigationExtras: NavigationExtras = {
      queryParams: { configuration: configurationDefault },
    };

    router.navigate([MYDSPACE_ROUTE], navigationExtras);
    return false;
  } else {
    return true;
  }
}
