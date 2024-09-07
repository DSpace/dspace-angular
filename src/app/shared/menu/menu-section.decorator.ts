import { AdminSidebarSectionComponent } from '../../admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';
import { ExpandableAdminSidebarSectionComponent } from '../../admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { ThemedExpandableNavbarSectionComponent } from '../../navbar/expandable-navbar-section/themed-expandable-navbar-section.component';
import { NavbarSectionComponent } from '../../navbar/navbar-section/navbar-section.component';
import { DsoEditMenuExpandableSectionComponent } from '../dso-page/dso-edit-menu/dso-edit-expandable-menu-section/dso-edit-menu-expandable-section.component';
import { DsoEditMenuSectionComponent } from '../dso-page/dso-edit-menu/dso-edit-menu-section/dso-edit-menu-section.component';
import { hasValue } from '../empty.util';
import { DEFAULT_THEME } from '../object-collection/shared/listable-object/listable-object.decorator';
import { MenuID } from './menu-id.model';

const menuComponentMap = new Map();

menuComponentMap.set(MenuID.ADMIN, new Map());
menuComponentMap.get(MenuID.ADMIN).set(false, new Map());
menuComponentMap.get(MenuID.ADMIN).get(false).set(DEFAULT_THEME, AdminSidebarSectionComponent);
menuComponentMap.get(MenuID.ADMIN).set(true, new Map());
menuComponentMap.get(MenuID.ADMIN).get(true).set(DEFAULT_THEME, ExpandableAdminSidebarSectionComponent);
menuComponentMap.set(MenuID.PUBLIC, new Map());
menuComponentMap.get(MenuID.PUBLIC).set(false, new Map());
menuComponentMap.get(MenuID.PUBLIC).get(false).set(DEFAULT_THEME, NavbarSectionComponent);
menuComponentMap.get(MenuID.PUBLIC).set(true, new Map());
menuComponentMap.get(MenuID.PUBLIC).get(true).set(DEFAULT_THEME, ThemedExpandableNavbarSectionComponent);
menuComponentMap.set(MenuID.DSO_EDIT, new Map());
menuComponentMap.get(MenuID.DSO_EDIT).set(false, new Map());
menuComponentMap.get(MenuID.DSO_EDIT).get(false).set(DEFAULT_THEME, DsoEditMenuSectionComponent);
menuComponentMap.get(MenuID.DSO_EDIT).set(true, new Map());
menuComponentMap.get(MenuID.DSO_EDIT).get(true).set(DEFAULT_THEME, DsoEditMenuExpandableSectionComponent);

/**
 * Decorator function to render a MenuSection for a menu
 * @param {MenuID} menuID The ID of the Menu in which the section is rendered
 * @param {boolean} expandable True when the section should be expandable, false when if should not
 * @deprecated
 * @returns {(menuSectionWrapperComponent: GenericConstructor) => void}
 */
export function rendersSectionForMenu(menuID: MenuID, expandable: boolean, theme = DEFAULT_THEME) {
  return function decorator(menuSectionWrapperComponent: any) {
    if (!menuSectionWrapperComponent) {
      return;
    }
    if (!menuComponentMap.get(menuID)) {
      menuComponentMap.set(menuID, new Map());
    }
    if (!menuComponentMap.get(menuID).get(expandable)) {
      menuComponentMap.get(menuID).set(expandable, new Map());
    }
    menuComponentMap.get(menuID).get(expandable).set(theme, menuSectionWrapperComponent);
  };
}

/**
 * Retrieves the component matching the given MenuID and whether or not it should be expandable
 * @param {MenuID} menuID The ID of the Menu in which the section is rendered
 * @param {boolean} expandable True when the section should be expandable, false when if should not
 * @returns {GenericConstructor} The constructor of the matching Component
 */
export function getComponentForMenu(menuID: MenuID, expandable: boolean, theme: string) {
  const comp = menuComponentMap.get(menuID).get(expandable).get(theme);
  if (hasValue(comp)) {
    return comp;
  } else {
    return menuComponentMap.get(menuID).get(expandable).get(DEFAULT_THEME);
  }
}
