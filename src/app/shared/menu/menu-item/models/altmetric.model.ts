import { MenuItemType } from '../../initial-menus-state';
import { MenuItemModel } from './menu-item.model';

/**
 * Model representing an Altmetric Menu Section
 */
export class AltmetricMenuItemModel implements MenuItemModel {
  type = MenuItemType.ALTMETRIC;
  url: string;
}
