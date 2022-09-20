import { MenuItemType } from '../../initial-menus-state';
import { MenuItemModel } from './menu-item.model';

/**
 * Model representing an Text Menu Section
 */
export class TextMenuItemModel implements MenuItemModel {
  type = MenuItemType.TEXT;
  disabled: boolean;
  text: string;
}
