import { MenuItemType } from './menu-item-type.model';
import { defer } from 'rxjs';

const menuMenuItemComponentMap = {
  [MenuItemType.EXTERNAL]: defer(() => import('./menu-item/external-link-menu-item.component').then(m => m.ExternalLinkMenuItemComponent)),
  [MenuItemType.LINK]: defer(() => import('./menu-item/link-menu-item.component').then(m => m.LinkMenuItemComponent)),
  [MenuItemType.ONCLICK]: defer(() => import('./menu-item/onclick-menu-item.component').then(m => m.OnClickMenuItemComponent)),
  [MenuItemType.TEXT]: defer(() => import('./menu-item/text-menu-item.component').then(m => m.TextMenuItemComponent))
};

/**
 * Retrieves the Component matching a given MenuItemType
 * @param {MenuItemType} type The given MenuItemType
 * @returns {GenericConstructor} The constructor of the Component that matches the MenuItemType
 */
export function getComponentForMenuItemType(type: MenuItemType) {
  return menuMenuItemComponentMap[type];
}
