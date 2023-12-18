import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { NavigationBreadcrumbsService } from './navigation-breadcrumb.service';

/**
 * The class that resolves a BreadcrumbConfig object with an i18n key string for a route and related parents
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {

  private parentRoutes: ActivatedRouteSnapshot[] = [];
  constructor(protected breadcrumbService: NavigationBreadcrumbsService) {
  }

  /**
   * Method to collect all parent routes snapshot from current route snapshot
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   */
  private getParentRoutes(route: ActivatedRouteSnapshot): void {
    if (route.parent) {
      this.parentRoutes.push(route.parent);
      this.getParentRoutes(route.parent);
    }
  }
  /**
   * Method for resolving an I18n breadcrumb configuration object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    this.getParentRoutes(route);
    const relatedRoutes = route.data.relatedRoutes;
    const parentPaths = this.parentRoutes.map(parent => parent.routeConfig?.path);
    const relatedParentRoutes = relatedRoutes.filter(relatedRoute => parentPaths.includes(relatedRoute.path));
    const baseUrlSegmentPath = route.parent.url[route.parent.url.length - 1].path;
    const baseUrl = state.url.substring(0, state.url.lastIndexOf(baseUrlSegmentPath) + baseUrlSegmentPath.length);


    const combinedParentBreadcrumbKeys = relatedParentRoutes.reduce((previous, current) => {
      return `${previous}:${current.data.breadcrumbKey}`;
    }, route.data.breadcrumbKey);
    const combinedUrls = relatedParentRoutes.reduce((previous, current) => {
      return `${previous}:${baseUrl}${current.path}`;
    }, state.url);

    return {provider: this.breadcrumbService, key: combinedParentBreadcrumbKeys, url: combinedUrls};
  }
}
