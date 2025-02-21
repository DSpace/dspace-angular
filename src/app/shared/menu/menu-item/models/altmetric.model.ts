import { MenuItemType } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item-type.model';
import { MenuItemModel } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item.model';

/**
 * Model representing an Altmetric Menu Section
 */
export class AltmetricMenuItemModel implements MenuItemModel {
  type = MenuItemType.ALTMETRIC;
  disabled: boolean;
  url: string;
}
