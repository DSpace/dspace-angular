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
import { SsrExcludePatterns } from '../../../config/ssr-config.interface';

/**
 * Check whether the given path matches any of the configured SSR exclude patterns.
 */
function isExcludedFromSsr(path: string, excludePatterns: SsrExcludePatterns[] = []): boolean {
  return excludePatterns.some((p) => new RegExp(p.pattern, p.flag || '').test(path));
}

/**
 * Placed as `canActivateChild` on the root of the router, prevents routes whose path matches one of the `ssr.excludePathPatterns`
 * from being activated (and therefore their components, resolvers and children from being rendered) during
 * server side rendering. In the browser every route is always allowed.
 */
export const clientOnlyGuard: CanActivateChildFn = (childRoute, state: RouterStateSnapshot): boolean => {
  if (isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  if (childRoute.routeConfig?.path === '**') {
    return true;
  }
  const appConfig = inject(APP_CONFIG) as AppConfig & Partial<BuildConfig>;
  const path = state.url.split(/[?#]/)[0];
  return !isExcludedFromSsr(path, appConfig.ssr?.excludePathPatterns);
};
