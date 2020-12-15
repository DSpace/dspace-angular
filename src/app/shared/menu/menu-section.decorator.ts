import { MenuID } from './initial-menus-state';
import { NavbarSectionComponent } from '../../navbar/navbar-section/navbar-section.component';
import { ExpandableNavbarSectionComponent } from '../../navbar/expandable-navbar-section/expandable-navbar-section.component';
import { ExpandableAdminSidebarSectionComponent } from '../../+admin/admin-sidebar/expandable-admin-sidebar-section/expandable-admin-sidebar-section.component';
import { AdminSidebarSectionComponent } from '../../+admin/admin-sidebar/admin-sidebar-section/admin-sidebar-section.component';

/**
 * Retrieves the component matching the given MenuID and whether or not it should be expandable
 * @param {MenuID} menuID The ID of the Menu in which the section is rendered
 * @param {boolean} expandable True when the section should be expandable, false when if should not
 * @returns {GenericConstructor} The constructor of the matching Component
 */
export function getComponentForMenu(menuID: MenuID, expandable: boolean) {
  if (menuID === MenuID.PUBLIC && expandable === true) {
    return ExpandableNavbarSectionComponent;
  } else if (menuID === MenuID.PUBLIC && expandable === false) {
    return NavbarSectionComponent;
  } else if (menuID === MenuID.ADMIN && expandable === true) {
    return ExpandableAdminSidebarSectionComponent;
  } else if (menuID === MenuID.ADMIN && expandable === false) {
    return AdminSidebarSectionComponent;
  }
}
