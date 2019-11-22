import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SearchSidebarActionTypes = {
  COLLAPSE: type('dspace/search-sidebar/COLLAPSE'),
  EXPAND: type('dspace/search-sidebar/EXPAND'),
  TOGGLE: type('dspace/search-sidebar/TOGGLE')
};

/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse the sidebar
 */
export class SearchSidebarCollapseAction implements Action {
  type = SearchSidebarActionTypes.COLLAPSE;
}

/**
 * Used to expand the sidebar
 */
export class SearchSidebarExpandAction implements Action {
  type = SearchSidebarActionTypes.EXPAND;
}

/**
 * Used to collapse the sidebar when it's expanded and expand it when it's collapsed
 */
export class SearchSidebarToggleAction implements Action {
  type = SearchSidebarActionTypes.TOGGLE;
}
/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type SearchSidebarAction
  = SearchSidebarCollapseAction
  | SearchSidebarExpandAction
  | SearchSidebarToggleAction
