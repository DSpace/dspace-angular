import { ExternalLinkMenuItemComponent } from './menu-item/external-link-menu-item.component';
import { LinkMenuItemComponent } from './menu-item/link-menu-item.component';
import { OnClickMenuItemComponent } from './menu-item/onclick-menu-item.component';
import { TextMenuItemComponent } from './menu-item/text-menu-item.component';
import { MenuItemType } from './menu-item-type.model';

const menuMenuItemComponentMap = new Map();

menuMenuItemComponentMap.set(MenuItemType.EXTERNAL, ExternalLinkMenuItemComponent);
menuMenuItemComponentMap.set(MenuItemType.LINK, LinkMenuItemComponent);
menuMenuItemComponentMap.set(MenuItemType.ONCLICK, OnClickMenuItemComponent);
menuMenuItemComponentMap.set(MenuItemType.TEXT, TextMenuItemComponent);

/**
 * Decorator function to link a MenuItemType to a Component
 * @param {MenuItemType} type The MenuItemType of the MenuSection's model
 * @deprecated
 * @returns {(sectionComponent: GenericContructor) => void}
 */
export function rendersMenuItemForType(type: MenuItemType) {
  return function decorator(sectionComponent: any) {
    if (!sectionComponent) {
      return;
    }
    menuMenuItemComponentMap.set(type, sectionComponent);
  };
}

/**
 * Retrieves the Component matching a given MenuItemType
 * @param {MenuItemType} type The given MenuItemType
 * @returns {GenericConstructor} The constructor of the Component that matches the MenuItemType
 */
export function getComponentForMenuItemType(type: MenuItemType) {
  return menuMenuItemComponentMap.get(type);
}
