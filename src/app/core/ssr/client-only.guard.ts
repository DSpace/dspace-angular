import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  CanActivateChildFn,
  RouterStateSnapshot,
} from '@angular/router';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { BuildConfig } from '../../../config/build-config.interface';
import {
  getSsrExcludeStrategy,
  isExcludedFromSsr,
} from './ssr-exclude.util';

/**
 * Placed as `canActivateChild` on the root of the router, prevents routes whose path matches one of the `ssr.excludePathPatterns`
 * from being activated (and therefore their components, resolvers and children from being rendered) during
 * server side rendering. In the browser every route is always allowed.
 *
 * Only active when `ssr.excludePathStrategy` is 'router'. With the 'server' strategy, excluded paths are already
 * served as CSR by server.ts and never reach the Angular router on the server.
 */
export const clientOnlyGuard: CanActivateChildFn = (childRoute, state: RouterStateSnapshot): boolean => {
  if (isPlatformBrowser(inject(PLATFORM_ID)) || (childRoute.routeConfig?.path === '**')) {
    return true;
  }
  const appConfig = inject(APP_CONFIG) as AppConfig & Partial<BuildConfig>;
  if (getSsrExcludeStrategy(appConfig.ssr?.excludePathStrategy) !== 'router') {
    return true;
  }
  const path = state.url.split(/[?#]/)[0];
  return !isExcludedFromSsr(path, appConfig.ssr?.excludePathPatterns);
};
