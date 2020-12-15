import { MenuItemType } from './initial-menus-state';
import { LinkMenuItemComponent } from './menu-item/link-menu-item.component';
import { OnClickMenuItemComponent } from './menu-item/onclick-menu-item.component';
import { TextMenuItemComponent } from './menu-item/text-menu-item.component';

/**
 * Retrieves the Component matching a given MenuItemType
 * @param {MenuItemType} type The given MenuItemType
 * @returns {GenericConstructor} The constructor of the Component that matches the MenuItemType
 */
export function getComponentForMenuItemType(type: MenuItemType) {
  switch (type) {
    case MenuItemType.LINK:
      return LinkMenuItemComponent;
    case MenuItemType.ONCLICK:
      return OnClickMenuItemComponent;
    case MenuItemType.TEXT:
      return TextMenuItemComponent;
  }
}
