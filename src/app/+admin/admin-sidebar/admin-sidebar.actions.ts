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
export const AdminSidebarSectionActionTypes = {
  COLLAPSE: type('dspace/admin-sidebar-section/COLLAPSE'),
  EXPAND: type('dspace/admin-sidebar-sectio/EXPAND'),
  TOGGLE: type('dspace/admin-sidebar-sectio/TOGGLE'),
};

export class AdminSidebarSectionAction implements Action {
  /**
   * Name of the section the action is performed on, used to identify the section
   */
  sectionName: string;

  /**
   * Type of action that will be performed
   */
  type;

  /**
   * Initialize with the section's name
   * @param {string} name of the section
   */
  constructor(name: string) {
    this.sectionName = name;
  }
}

/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse a section
 */
export class AdminSidebarSectionCollapseAction extends AdminSidebarSectionAction {
  type = AdminSidebarSectionActionTypes.COLLAPSE;
}

/**
 * Used to expand a section
 */
export class AdminSidebarSectionExpandAction extends AdminSidebarSectionAction {
  type = AdminSidebarSectionActionTypes.EXPAND;
}

/**
 * Used to collapse a section when it's expanded and expand it when it's collapsed
 */
export class AdminSidebarSectionToggleAction extends AdminSidebarSectionAction {
  type = AdminSidebarSectionActionTypes.TOGGLE;
}

/* tslint:enable:max-classes-per-file */
