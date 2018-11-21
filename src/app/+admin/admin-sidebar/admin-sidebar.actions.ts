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
export const AdminSidebarActionTypes = {
  SECTION_COLLAPSE: type('dspace/admin-sidebar/SECTION_COLLAPSE'),
  SECTION_COLLAPSE_ALL: type('dspace/admin-sidebar/SECTION_COLLAPSE_ALL'),
  SECTION_EXPAND: type('dspace/admin-sidebar/SECTION_EXPAND'),
  SECTION_TOGGLE: type('dspace/admin-sidebar/SECTION_TOGGLE'),
  COLLAPSE: type('dspace/admin-sidebar/COLLAPSE'),
  EXPAND: type('dspace/admin-sidebar/EXPAND'),
  TOGGLE: type('dspace/admin-sidebar/TOGGLE'),
};

/* tslint:disable:max-classes-per-file */
export class AdminSidebarAction implements Action {

  /**
   * Type of action that will be performed
   */
  type;
}

export class AdminSidebarSectionAction extends AdminSidebarAction {
  /**
   * Name of the section the action is performed on, used to identify the section
   */
  sectionName: string;

  /**
   * Initialize with the section's name
   * @param {string} name of the section
   */
  constructor(name: string) {
    super();
    this.sectionName = name;
  }
}

/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse the sidebar
 */
export class AdminSidebarCollapseAction extends AdminSidebarAction {
  type = AdminSidebarActionTypes.COLLAPSE;
}

/**
 * Used to expand the sidebar
 */
export class AdminSidebarExpandAction extends AdminSidebarAction {
  type = AdminSidebarActionTypes.EXPAND;
}

/**
 * Used to collapse the sidebar when it's expanded and expand it when it's collapsed
 */
export class AdminSidebarToggleAction extends AdminSidebarAction {
  type = AdminSidebarActionTypes.TOGGLE;
}

/**
 * Used to collapse a section
 */
export class AdminSidebarSectionCollapseAction extends AdminSidebarSectionAction {
  type = AdminSidebarActionTypes.SECTION_COLLAPSE;
}

/**
 * Used to collapse a section
 */
export class AdminSidebarSectionCollapseAllAction extends AdminSidebarAction {
  type = AdminSidebarActionTypes.SECTION_COLLAPSE_ALL;
}

/**
 * Used to expand a section
 */
export class AdminSidebarSectionExpandAction extends AdminSidebarSectionAction {
  type = AdminSidebarActionTypes.SECTION_EXPAND;
}

/**
 * Used to collapse a section when it's expanded and expand it when it's collapsed
 */
export class AdminSidebarSectionToggleAction extends AdminSidebarSectionAction {
  type = AdminSidebarActionTypes.SECTION_TOGGLE;
}

/* tslint:enable:max-classes-per-file */
