import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { HOME_PAGE_PATH } from '../../app-routing-paths';
import { isNotEmpty } from '../../shared/empty.util';

/**
 * A guard redirecting the user to the URL provided in the route's query params
 * When no redirect url is found, the user is redirected to the homepage
 */
export const reloadGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  appConfig: AppConfig = inject(APP_CONFIG),
  router: Router = inject(Router),
): UrlTree => {
  if (isNotEmpty(route.queryParams.redirect)) {
    const url = route.queryParams.redirect.startsWith(appConfig.ui.nameSpace)
      ? route.queryParams.redirect.substring(appConfig.ui.nameSpace.length)
      : route.queryParams.redirect;
    return router.parseUrl(url);
  } else {
    return router.createUrlTree([HOME_PAGE_PATH]);
  }
};
