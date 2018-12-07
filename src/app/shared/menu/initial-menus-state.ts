import { MenusState } from './menu.reducer';

export enum MenuID {
  ADMIN = 'admin-sidebar',
  PUBLIC = 'public'
}

export enum SectionType {
  TEXT, LINK, ALTMETRIC, SEARCH
}

export const initialMenusState: MenusState = {
  [MenuID.ADMIN]:
    {
      id: MenuID.ADMIN,
      collapsed: true,
      visible: false,
      sections: {},
      sectionToSubsectionIndex: {}
    },
  [MenuID.PUBLIC]:
    {
      id: MenuID.PUBLIC,
      collapsed: true,
      visible: true,
      sections: {},
      sectionToSubsectionIndex: {}
    }
};
