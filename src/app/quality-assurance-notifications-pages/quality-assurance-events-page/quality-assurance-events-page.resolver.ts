import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

/**
 * Interface for the route parameters.
 */
export interface AssuranceEventsPageParams {
  pageId?: string;
  pageSize?: number;
  currentPage?: number;
}

/**
 * Method for resolving the parameters in the current route.
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @returns AdminQualityAssuranceEventsPageParams Emits the route parameters
 */
export const qualityAssuranceEventsPageResolver: ResolveFn<AssuranceEventsPageParams> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): AssuranceEventsPageParams => {
  return {
    pageId: route.queryParams.pageId,
    pageSize: parseInt(route.queryParams.pageSize, 10),
    currentPage: parseInt(route.queryParams.page, 10),
  };
};
