import { MenuItemType } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item-type.model';
import { MenuItemModel } from '../../../../../../modules/core/src/lib/core/states/menu/menu-item.model';

/**
 * Model representing a Link Menu Section for an external link
 */
export class ExternalLinkMenuItemModel implements MenuItemModel {
  type = MenuItemType.EXTERNAL;
  disabled: boolean;
  text: string;
  href: string;
}
