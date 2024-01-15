import { MenuItemType } from './menu-item-type.model';
import { defer } from 'rxjs';

const menuMenuItemComponentMap = new Map();

menuMenuItemComponentMap.set(MenuItemType.EXTERNAL, defer(() => import('./menu-item/external-link-menu-item.component').then(m => m.ExternalLinkMenuItemComponent)));
menuMenuItemComponentMap.set(MenuItemType.LINK, defer(() => import('./menu-item/link-menu-item.component').then(m => m.LinkMenuItemComponent)));
menuMenuItemComponentMap.set(MenuItemType.ONCLICK, defer(() => import('./menu-item/onclick-menu-item.component').then(m => m.OnClickMenuItemComponent)));
menuMenuItemComponentMap.set(MenuItemType.TEXT, defer(() => import('./menu-item/text-menu-item.component').then(m => m.TextMenuItemComponent)));

/**
 * Decorator function to link a MenuItemType to a Component
 * @param {MenuItemType} type The MenuItemType of the MenuSection's model
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
