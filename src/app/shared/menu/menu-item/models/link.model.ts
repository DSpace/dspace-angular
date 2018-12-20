import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from '../../initial-menus-state';

/**
 * Model representing an Link Menu Section
 */
export class LinkMenuItemModel implements MenuItemModel {
  type = MenuItemType.LINK;
  text: string;
  link: string;
}
