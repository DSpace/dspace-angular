import {
  MenuItemModel,
  MenuItemType,
} from '@dspace/core';

/**
 * Model representing an Search Bar Menu Section
 */
export class SearchMenuItemModel implements MenuItemModel {
  type = MenuItemType.SEARCH;
  disabled: boolean;
  placeholder: string;
  action: string;
}
