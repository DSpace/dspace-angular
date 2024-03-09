import { Params } from '@angular/router';

import { MenuItemType } from '../../menu-item-type.model';
import { MenuItemModel } from './menu-item.model';

/**
 * Model representing an Link Menu Section
 */
export class LinkMenuItemModel implements MenuItemModel {
  type = MenuItemType.LINK;
  disabled: boolean;
  text: string;
  link: string;
  queryParams?: Params | null;
}
