import { MenusState } from './menu.reducer';

/**
 * Availavle Menu IDs
 */
export enum MenuID {
  ADMIN = 'admin-sidebar',
  PUBLIC = 'public',
  DSO_EDIT = 'dso-edit'
}

/**
 * List of possible MenuItemTypes
 */
export enum MenuItemType {
  TEXT, LINK, ALTMETRIC, SEARCH, ONCLICK
}

/**
 * The initial state of the menus
 */
export const initialMenusState: MenusState = {
  [MenuID.ADMIN]:
    {
      id: MenuID.ADMIN,
      collapsed: true,
      previewCollapsed: true,
      visible: false,
      sections: {},
      sectionToSubsectionIndex: {}
    },
  [MenuID.PUBLIC]:
    {
      id: MenuID.PUBLIC,
      collapsed: true,
      previewCollapsed: true,
      visible: true,
      sections: {},
      sectionToSubsectionIndex: {}
    },
  [MenuID.DSO_EDIT]:
    {
      id: MenuID.DSO_EDIT,
      collapsed: true,
      previewCollapsed: true,
      visible: false,
      sections: {},
      sectionToSubsectionIndex: {}
    },
};
