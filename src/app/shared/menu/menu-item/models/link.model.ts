import { Params } from '@angular/router';

import { MenuItemType } from '@dspace/core';
import { MenuItemModel } from '@dspace/core';

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
