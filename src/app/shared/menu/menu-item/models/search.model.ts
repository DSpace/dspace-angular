import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from '../../menu-item-type.model';

/**
 * Model representing an Search Bar Menu Section
 */
export class SearchMenuItemModel implements MenuItemModel {
  type = MenuItemType.SEARCH;
  placeholder: string;
  action: string;
}
