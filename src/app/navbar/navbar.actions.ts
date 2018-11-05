import { Action } from '@ngrx/store';

import { type } from '../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const NavbarActionTypes = {
  COLLAPSE: type('dspace/navbar/COLLAPSE'),
  EXPAND: type('dspace/navbar/EXPAND'),
  TOGGLE: type('dspace/navbar/TOGGLE')
};

/* tslint:disable:max-classes-per-file */
export class NavbarCollapseAction implements Action {
  type = NavbarActionTypes.COLLAPSE;
}

export class NavbarExpandAction implements Action {
  type = NavbarActionTypes.EXPAND;
}

export class NavbarToggleAction implements Action {
  type = NavbarActionTypes.TOGGLE;
}
/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type NavbarAction
  = NavbarCollapseAction
  | NavbarExpandAction
  | NavbarToggleAction
