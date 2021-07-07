import { Injectable } from '@angular/core';
import { DsoContextBreadcrumbService } from './dso-context-breadcrumb.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { hasNoValue } from '../../shared/empty.util';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';

/**
 * The class that resolves the BreadcrumbConfig object for an Item
 */
@Injectable({
  providedIn: 'root'
})
export class DsoContextBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(
    protected breadcrumbService: DsoContextBreadcrumbService) {
    // super(breadcrumbService, dataService);
  }

  /**
   * Method for resolving a breadcrumb config object of any string
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const uuid = route.params.id;

    const key = uuid + '::' + route.data.breadcrumbKey;

    if (hasNoValue(key)) {
      throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
    }

    const fullPath = state.url;
    const url = fullPath.substr(0, fullPath.indexOf(uuid)) + uuid;

    return { provider: this.breadcrumbService, key: key, url: url };

  }

}
