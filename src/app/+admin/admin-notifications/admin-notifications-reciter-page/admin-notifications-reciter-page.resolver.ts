import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Interface for the route parameters.
 */
export interface AdminNotificationsReciterPageParams {
  pageSize?: string;
  currentPage?: string;
}

/**
 * This class represents a resolver that retrieve the route data before the route is activated.
 */
@Injectable()
export class AdminNotificationsReciterPageResolver implements Resolve<AdminNotificationsReciterPageParams> {

  /**
   * Method for resolving the parameters in the current route.
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns AdminNotificationsReciterPageParams Emits the route parameters
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AdminNotificationsReciterPageParams {
    return {
      pageSize: route.params.pageSize,
      currentPage: route.params.page
    }
  }
}
