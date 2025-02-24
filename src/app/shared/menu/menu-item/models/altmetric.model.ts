import {
  MenuItemModel,
  MenuItemType,
} from '@dspace/core';

/**
 * Model representing an Altmetric Menu Section
 */
export class AltmetricMenuItemModel implements MenuItemModel {
  type = MenuItemType.ALTMETRIC;
  disabled: boolean;
  url: string;
}
