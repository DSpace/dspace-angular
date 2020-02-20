import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

/**
 * The class that resolve the BreadcrumbConfig object for a route
 */
@Injectable()
export class DSOBreadcrumbResolver implements Resolve<BreadcrumbConfig> {
  constructor(private breadcrumbService: DSOBreadcrumbsService) {
  }

  /**
   * Method for resolving a site object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig {
    const uuid = route.params.id;
    const fullPath = route.url.join('');
    const url = fullPath.substr(0, fullPath.indexOf(uuid)) + uuid;
    return { provider: this.breadcrumbService, key: uuid, url: url };
  }
}
