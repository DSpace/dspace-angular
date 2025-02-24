import {
  MenuItemModel,
  MenuItemType,
} from '@dspace/core';

/**
 * Model representing an Text Menu Section
 */
export class TextMenuItemModel implements MenuItemModel {
  type = MenuItemType.TEXT;
  disabled: boolean;
  text: string;
}
