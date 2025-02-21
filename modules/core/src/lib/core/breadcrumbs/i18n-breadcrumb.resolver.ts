import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { hasNoValue } from '@dspace/shared/utils';

import { currentPathFromSnapshot } from '../utilities/route.utils';
import { BreadcrumbConfig } from './breadcrumb-config.model';
import { I18nBreadcrumbsService } from './i18n-breadcrumbs.service';

/**
 * Method for resolving an I18n breadcrumb configuration object
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {I18nBreadcrumbsService} breadcrumbService
 * @returns BreadcrumbConfig object
 */
export const i18nBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: I18nBreadcrumbsService = inject(I18nBreadcrumbsService),
): BreadcrumbConfig<string> => {
  const key = route.data.breadcrumbKey;
  if (hasNoValue(key)) {
    throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
  }
  const fullPath = currentPathFromSnapshot(route);
  return { provider: breadcrumbService, key: key, url: fullPath };
};
