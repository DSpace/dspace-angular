import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from '../../initial-menus-state';

/**
 * Model representing an OnClick Menu Section
 */
export class OnClickMenuItemModel implements MenuItemModel {
  type = MenuItemType.ONCLICK;
  text: string;
  function: () => {};
}
