import { Action } from '@ngrx/store';

import { type } from '../../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SearchFilterActionTypes = {
  COLLAPSE: type('dspace/search-filter/COLLAPSE'),
  INITIAL_COLLAPSE: type('dspace/search-filter/INITIAL_COLLAPSE'),
  EXPAND: type('dspace/search-filter/EXPAND'),
  INITIAL_EXPAND: type('dspace/search-filter/INITIAL_EXPAND'),
  TOGGLE: type('dspace/search-filter/TOGGLE'),
  DECREASE_PAGE: type('dspace/search-filter/DECREASE_PAGE'),
  INCREASE_PAGE: type('dspace/search-filter/INCREASE_PAGE')
};

export class SearchFilterAction implements Action {
  filterName: string;
  type;
  constructor(name: string) {
    this.filterName = name;
  }
}

/* tslint:disable:max-classes-per-file */
export class SearchFilterCollapseAction extends SearchFilterAction {
  type = SearchFilterActionTypes.COLLAPSE;
}

export class SearchFilterExpandAction extends SearchFilterAction {
  type = SearchFilterActionTypes.EXPAND;
}

export class SearchFilterToggleAction extends SearchFilterAction {
  type = SearchFilterActionTypes.TOGGLE;
}

export class SearchFilterInitialCollapseAction extends SearchFilterAction {
  type = SearchFilterActionTypes.INITIAL_COLLAPSE;
}

export class SearchFilterInitialExpandAction extends SearchFilterAction {
  type = SearchFilterActionTypes.INITIAL_EXPAND;
}
export class SearchFilterDecreasePageAction extends SearchFilterAction {
  type = SearchFilterActionTypes.DECREASE_PAGE;
}

export class SearchFilterIncreasePageAction extends SearchFilterAction {
  type = SearchFilterActionTypes.INCREASE_PAGE;
}
/* tslint:enable:max-classes-per-file */
