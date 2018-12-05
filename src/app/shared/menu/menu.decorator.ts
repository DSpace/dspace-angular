import { MenuID } from './initial-menus-state';

const menuComponentMap = new Map();

export function rendersSectionForMenu(menuID: MenuID, expandable: boolean) {
  return function decorator(menuSectionWrapperComponent: any) {
    if (!menuSectionWrapperComponent) {
      return;
    }
    if (!menuComponentMap.get(menuID)) {
      menuComponentMap.set(menuID, new Map());
    }
    menuComponentMap.get(menuID).set(expandable, menuSectionWrapperComponent);
  };
}

export function getComponentForMenu(menuID: MenuID, expandable: boolean) {
  return menuComponentMap.get(menuID).get(expandable);
}
