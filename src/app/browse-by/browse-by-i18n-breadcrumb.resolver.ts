import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { i18nBreadcrumbResolver, BreadcrumbConfig } from '@dspace/core'

/**
 * Method for resolving a browse-by i18n breadcrumb configuration object
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @returns BreadcrumbConfig object for a browse-by page
 */
export const browseByI18nBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): BreadcrumbConfig<string> => {
  const extendedBreadcrumbKey = route.data.breadcrumbKey + '.' + route.params.id;
  route.data = Object.assign({}, route.data, { breadcrumbKey: extendedBreadcrumbKey });
  return i18nBreadcrumbResolver(route, state) as BreadcrumbConfig<string>;
};
