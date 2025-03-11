import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { hasNoValue } from '../shared/empty.util';
import { currentPathFromSnapshot } from '../shared/utils/route.utils';

/**
 * This class resolves a BreadcrumbConfig object with an i18n key string for a route
 * It adds the metadata field of the current explore page
 */
export const exploreI18nBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: I18nBreadcrumbsService = inject(I18nBreadcrumbsService),
): BreadcrumbConfig<string> => {
  const extendedBreadcrumbKey = route.data.breadcrumbKey + '.' + route.params.id;
  route.data = Object.assign({}, route.data, { breadcrumbKey: extendedBreadcrumbKey });

  const key = route.data.breadcrumbKey;
  if (hasNoValue(key)) {
    throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
  }
  const fullPath = currentPathFromSnapshot(route);
  return { provider: breadcrumbService, key: key, url: fullPath };
};
