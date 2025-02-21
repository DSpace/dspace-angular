import { MenuItemType } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item-type.model';
import { MenuItemModel } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item.model';

/**
 * Model representing an Text Menu Section
 */
export class TextMenuItemModel implements MenuItemModel {
  type = MenuItemType.TEXT;
  disabled: boolean;
  text: string;
}
