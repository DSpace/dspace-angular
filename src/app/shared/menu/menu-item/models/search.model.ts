import { MenuItemType } from '../../initial-menus-state';
import { MenuItemModel } from './menu-item.model';

/**
 * Model representing an Search Bar Menu Section
 */
export class SearchMenuItemModel implements MenuItemModel {
  type = MenuItemType.SEARCH;
  disabled: boolean;
  placeholder: string;
  action: string;
}
