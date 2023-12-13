import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { hasNoValue } from '../../shared/empty.util';
import { currentPathFromSnapshot } from '../../shared/utils/route.utils';
import {NavigationBreadcrumbsService} from "./navigation-breadcrumb.service";

/**
 * The class that resolves a BreadcrumbConfig object with an i18n key string for a route
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(protected breadcrumbService: NavigationBreadcrumbsService) {
  }


  private getUniqueParentRoutes(routes: Routes) : Routes {
    return [...new Set(routes.map(route => route.data.parentRoute))];
  }
  /**
   * Method for resolving an I18n breadcrumb configuration object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const path = route.routeConfig.path;
    const relatedRoutes = route.data.relatedRoutes.filter(relatedRoute => relatedRoute.path !== path);
    const uniqueParentRoutes = this.getUniqueParentRoutes(route.data.relatedRoutes);

   console.log(path, relatedRoutes, uniqueParentRoutes);
   return {provider: this.breadcrumbService, key: "combinedBredcrumbKeys", url: ""}
  }
}
