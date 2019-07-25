import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';
import { Params } from '@angular/router';

/**
 * The list of HrefIndexAction type definitions
 */
export const RouterActionTypes = {
  ROUTE_UPDATE: type('dspace/core/router/ROUTE_UPDATE'),
};

/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to be fired when the route is updated
 * Note that, contrary to the router-store.ROUTER_NAVIGATION action,
 * this action will only be fired when the path changes,
 * not when just the query parameters change
 */
export class RouteUpdateAction implements Action {
  type = RouterActionTypes.ROUTE_UPDATE;

  /**
   * Create a new RouteUpdateAction
   */
  constructor() {
  }
}

/* tslint:enable:max-classes-per-file */
