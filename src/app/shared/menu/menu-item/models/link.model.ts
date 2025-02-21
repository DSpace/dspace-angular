import { Params } from '@angular/router';

import { MenuItemType } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item-type.model';
import { MenuItemModel } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item.model';

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
