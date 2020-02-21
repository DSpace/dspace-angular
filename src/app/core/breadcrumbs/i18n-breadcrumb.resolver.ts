import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { I18nBreadcrumbsService } from './i18n-breadcrumbs.service';
import { hasNoValue } from '../../shared/empty.util';

/**
 * The class that resolve the BreadcrumbConfig object for a route
 */
@Injectable()
export class I18nBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(private breadcrumbService: I18nBreadcrumbsService) {
  }

  /**
   * Method for resolving a site object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const key = route.data.breadcrumbKey;
    if (hasNoValue(key)) {
      throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data')
    }
    const fullPath = route.url.join('');
    return { provider: this.breadcrumbService, key: key, url: fullPath };
  }
}
