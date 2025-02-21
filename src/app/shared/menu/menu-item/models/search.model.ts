import { MenuItemType } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item-type.model';
import { MenuItemModel } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item.model';

/**
 * Model representing an Search Bar Menu Section
 */
export class SearchMenuItemModel implements MenuItemModel {
  type = MenuItemType.SEARCH;
  disabled: boolean;
  placeholder: string;
  action: string;
}
