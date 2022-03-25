/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../../ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SidebarFilterActionTypes = {
  INITIALIZE: type('dspace/sidebar-filter/INITIALIZE'),
  COLLAPSE: type('dspace/sidebar-filter/COLLAPSE'),
  EXPAND: type('dspace/sidebar-filter/EXPAND'),
  TOGGLE: type('dspace/sidebar-filter/TOGGLE'),
};

export class SidebarFilterAction implements Action {
  /**
   * Name of the filter the action is performed on, used to identify the filter
   */
  filterName: string;

  /**
   * Type of action that will be performed
   */
  type;

  /**
   * Initialize with the filter's name
   * @param {string} name of the filter
   */
  constructor(name: string) {
    this.filterName = name;
  }
}

/**
 * Used to initialize a filter
 */
export class FilterInitializeAction extends SidebarFilterAction {
  type = SidebarFilterActionTypes.INITIALIZE;
  initiallyExpanded;

  constructor(name: string, initiallyExpanded: boolean) {
    super(name);
    this.initiallyExpanded = initiallyExpanded;
  }
}

/**
 * Used to collapse a filter
 */
export class FilterCollapseAction extends SidebarFilterAction {
  type = SidebarFilterActionTypes.COLLAPSE;
}

/**
 * Used to expand a filter
 */
export class FilterExpandAction extends SidebarFilterAction {
  type = SidebarFilterActionTypes.EXPAND;
}

/**
 * Used to collapse a filter when it's expanded and expand it when it's collapsed
 */
export class FilterToggleAction extends SidebarFilterAction {
  type = SidebarFilterActionTypes.TOGGLE;
}
