import { MenuItemType } from '@dspace/core';
import { MenuItemModel } from '@dspace/core';

/**
 * Model representing an OnClick Menu Section
 */
export class OnClickMenuItemModel implements MenuItemModel {
  type = MenuItemType.ONCLICK;
  disabled: boolean;
  text: string;
  function: () => void;
}
