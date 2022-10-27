import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from '../../menu-item-type.model';

/**
 * Model representing an Text Menu Section
 */
export class TextMenuItemModel implements MenuItemModel {
  type = MenuItemType.TEXT;
  text: string;
}
