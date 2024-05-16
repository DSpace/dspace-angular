import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { NavigationBreadcrumbsService } from './navigation-breadcrumb.service';

/**
 * Method for resolving an I18n breadcrumb configuration object
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {NavigationBreadcrumbsService} breadcrumbService
 * @returns BreadcrumbConfig object
 */
export const navigationBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: NavigationBreadcrumbsService = inject(NavigationBreadcrumbsService),
): BreadcrumbConfig<string> => {
  const parentRoutes: ActivatedRouteSnapshot[] = [];
  getParentRoutes(route, parentRoutes);
  const relatedRoutes = route.data.relatedRoutes;
  const parentPaths = parentRoutes.map(parent => parent.routeConfig?.path);
  const relatedParentRoutes = relatedRoutes.filter(relatedRoute => parentPaths.includes(relatedRoute.path));
  const baseUrlSegmentPath = route.parent.url[route.parent.url.length - 1].path;
  const baseUrl = state.url.substring(0, state.url.lastIndexOf(baseUrlSegmentPath) + baseUrlSegmentPath.length);


  const combinedParentBreadcrumbKeys = relatedParentRoutes.reduce((previous, current) => {
    return `${previous}:${current.data.breadcrumbKey}`;
  }, route.data.breadcrumbKey);
  const combinedUrls = relatedParentRoutes.reduce((previous, current) => {
    return `${previous}:${baseUrl}${current.path}`;
  }, state.url);

  return { provider: breadcrumbService, key: combinedParentBreadcrumbKeys, url: combinedUrls };
};

/**
 * Method to collect all parent routes snapshot from current route snapshot
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {ActivatedRouteSnapshot[]} parentRoutes
 */
function getParentRoutes(route: ActivatedRouteSnapshot, parentRoutes: ActivatedRouteSnapshot[]): void {
  if (route.parent) {
    parentRoutes.push(route.parent);
    getParentRoutes(route.parent, parentRoutes);
  }
}
