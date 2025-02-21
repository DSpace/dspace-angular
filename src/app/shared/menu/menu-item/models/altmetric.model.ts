import { MenuItemType } from '@dspace/core';
import { MenuItemModel } from '@dspace/core';

/**
 * Model representing an Altmetric Menu Section
 */
export class AltmetricMenuItemModel implements MenuItemModel {
  type = MenuItemType.ALTMETRIC;
  disabled: boolean;
  url: string;
}
