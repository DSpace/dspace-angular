import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { hasNoValue } from '../../shared/empty.util';
import { currentPathFromSnapshot } from '../../shared/utils/route.utils';

/**
 * The class that resolves a BreadcrumbConfig object with an i18n key string for a route
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor() {
  }

  /**
   * Method for resolving an I18n breadcrumb configuration object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
   console.log(route, state);
   return null
  }
}
