import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { hasNoValue } from '../../shared/empty.util';
import { DsoContextBreadcrumbService } from './dso-context-breadcrumb.service';


/**
 * Method for resolving a breadcrumb config object of any string
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @returns BreadcrumbConfig object
 */
export const dsoContextBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): BreadcrumbConfig<string> => {
  const breadcrumbService = inject(DsoContextBreadcrumbService);
  const uuid = route.params.id;
  const key = uuid + '::' + route.data.breadcrumbKey;

  if (hasNoValue(key)) {
    throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
  }

  const fullPath = state.url;
  const url = fullPath.substr(0, fullPath.indexOf(uuid)) + uuid;

  return { provider: breadcrumbService, key: key, url: url };
};
