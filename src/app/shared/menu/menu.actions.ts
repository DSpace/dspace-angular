import { Action } from '@ngrx/store';
import { MenuID } from './initial-menus-state';
import { type } from '../ngrx/type';
import { MenuSection } from './menu.reducer';

export const MenuActionTypes = {
  COLLAPSE_MENU: type('dspace/menu/COLLAPSE_MENU'),
  TOGGLE_MENU: type('dspace/menu/TOGGLE_MENU'),
  EXPAND_MENU: type('dspace/menu/EXPAND_MENU'),
  SHOW_MENU: type('dspace/menu/SHOW_MENU'),
  HIDE_MENU: type('dspace/menu/HIDE_MENU'),
  COLLAPSE_MENU_PREVIEW: type('dspace/menu/COLLAPSE_MENU_PREVIEW'),
  EXPAND_MENU_PREVIEW: type('dspace/menu/EXPAND_MENU_PREVIEW'),
  ADD_SECTION: type('dspace/menu-section/ADD_SECTION'),
  REMOVE_SECTION: type('dspace/menu-section/REMOVE_SECTION'),
  SHOW_SECTION: type('dspace/menu-section/SHOW_SECTION'),
  HIDE_SECTION: type('dspace/menu-section/HIDE_SECTION'),
  ACTIVATE_SECTION: type('dspace/menu-section/ACTIVATE_SECTION'),
  DEACTIVATE_SECTION: type('dspace/menu-section/DEACTIVATE_SECTION'),
  TOGGLE_ACTIVE_SECTION: type('dspace/menu-section/TOGGLE_ACTIVE_SECTION'),
};

/* tslint:disable:max-classes-per-file */

// MENU STATE ACTIONS
export class CollapseMenuAction implements Action {
  type = MenuActionTypes.COLLAPSE_MENU;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}

export class ExpandMenuAction implements Action {
  type = MenuActionTypes.EXPAND_MENU;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}

export class ToggleMenuAction implements Action {
  type = MenuActionTypes.TOGGLE_MENU;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}

export class ShowMenuAction implements Action {
  type = MenuActionTypes.SHOW_MENU;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}

export class HideMenuAction implements Action {
  type = MenuActionTypes.HIDE_MENU;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}

export class CollapseMenuPreviewAction implements Action {
  type = MenuActionTypes.COLLAPSE_MENU_PREVIEW;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}

export class ExpandMenuPreviewAction implements Action {
  type = MenuActionTypes.EXPAND_MENU_PREVIEW;
  menuID: MenuID;

  constructor(menuID: MenuID) {
    this.menuID = menuID;
  }
}


// MENU STRUCTURING ACTIONS
export abstract class MenuSectionAction implements Action {
  type;
  menuID: MenuID;
  id: string;

  constructor(menuID: MenuID, id: string) {
    this.menuID = menuID;
    this.id = id;
  }
}

export class AddMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.ADD_SECTION;
  section: MenuSection;

  constructor(menuID: MenuID, section: MenuSection) {
    super(menuID, section.id);
    this.section = section;
  }
}

export class RemoveMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.REMOVE_SECTION;

  constructor(menuID: MenuID, id: string) {
    super(menuID, id);

  }
}

export class HideMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.HIDE_SECTION;

  constructor(menuID: MenuID, id: string) {
    super(menuID, id);
  }
}

/**
 * Used to expand a section
 */
export class ShowMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.SHOW_SECTION;

  constructor(menuID: MenuID, id: string) {
    super(menuID, id);
  }
}

export class ActivateMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.ACTIVATE_SECTION;

  constructor(menuID: MenuID, id: string) {
    super(menuID, id);
  }
}

/**
 * Used to expand a section
 */
export class DeactivateMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.DEACTIVATE_SECTION;

  constructor(menuID: MenuID, id: string) {
    super(menuID, id);
  }
}

export class ToggleActiveMenuSectionAction extends MenuSectionAction {
  type = MenuActionTypes.TOGGLE_ACTIVE_SECTION;

  constructor(menuID: MenuID, id: string) {
    super(menuID, id);
  }
}

export type MenuAction =
  CollapseMenuAction
  | ExpandMenuAction
  | ToggleMenuAction
  | ShowMenuAction
  | HideMenuAction
  | AddMenuSectionAction
  | RemoveMenuSectionAction
  | ShowMenuSectionAction
  | HideMenuSectionAction
  | ActivateMenuSectionAction
  | DeactivateMenuSectionAction
  | ToggleActiveMenuSectionAction
/* tslint:enable:max-classes-per-file */
