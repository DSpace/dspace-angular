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
} from '@dspace/config/app-config.interface';

import { getPageNotFoundRoute } from '../core/router/core-routing-paths';

/**
 * Route guard that checks whether explore pages are enabled in the application config.
 * When `layout.enableExplorePages` is false, navigating to any explore route
 * will redirect to the 404 page.
 */
export const explorePagesEnabledGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  appConfig: AppConfig = inject(APP_CONFIG),
  router: Router = inject(Router),
): boolean | UrlTree => {
  if (appConfig.layout.enableExplorePages) {
    return true;
  }
  return router.parseUrl(getPageNotFoundRoute());
};
