/* eslint-disable max-classes-per-file */
import { type } from '@core/shared/ngrx/type';
import { Action } from '@ngrx/store';

/**
 * The list of HrefIndexAction type definitions
 */
export const RouterActionTypes = {
  ROUTE_UPDATE: type('dspace/core/router/ROUTE_UPDATE'),
};

/**
 * An ngrx action to be fired when the route is updated
 * Note that, contrary to the router-store.ROUTER_NAVIGATION action,
 * this action will only be fired when the path changes,
 * not when just the query parameters change
 */
export class RouteUpdateAction implements Action {
  type = RouterActionTypes.ROUTE_UPDATE;
}

