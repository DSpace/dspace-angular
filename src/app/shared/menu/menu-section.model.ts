import { AltmetricMenuItemModel } from './menu-item/models/altmetric.model';
import { ExternalLinkMenuItemModel } from './menu-item/models/external-link.model';
import { LinkMenuItemModel } from './menu-item/models/link.model';
import { OnClickMenuItemModel } from './menu-item/models/onclick.model';
import { SearchMenuItemModel } from './menu-item/models/search.model';
import { TextMenuItemModel } from './menu-item/models/text.model';

export type MenuItemModels =
  LinkMenuItemModel
  | AltmetricMenuItemModel
  | ExternalLinkMenuItemModel
  | OnClickMenuItemModel
  | SearchMenuItemModel
  | TextMenuItemModel;

export interface MenuSection {
  /**
   * The identifier for this section
   */
  id: string;

  /**
   * Accessibility handle that can be used to find a specific menu in the html
   */
  accessibilityHandle?: string;

  /**
   * Whether this section should be visible.
   */
  visible: boolean;

  /**
   *
   */
  model: MenuItemModels;

  /**
   * The identifier of this section's parent section (optional).
   */
  parentID?: string;

  /**
   * The index of this section in its menu.
   */
  index?: number;

  /**
   * Whether this section is currently active.
   * Newly created sections are inactive until toggled.
   */
  active?: boolean;

  /**
   * Whether this section is independent of the route (default: true).
   * This value should be set explicitly for route-dependent sections.
   */
  shouldPersistOnRouteChange?: boolean;


  /**
   * An optional icon for this section.
   * Must correspond to a FontAwesome icon class save for the `.fa-` prefix.
   * Note that not all menus may render icons.
   */
  icon?: string;

  /**
   * When true, the current section will be assumed to be a parent section with children
   * This section will not be rendered when it has no visible children
   */
  alwaysRenderExpandable?: boolean;
}
