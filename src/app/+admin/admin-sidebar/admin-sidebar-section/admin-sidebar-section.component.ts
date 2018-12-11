import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MenuSectionComponent } from '../../../shared/menu/menu-section/menu-section.component';
import { MenuID } from '../../../shared/menu/initial-menus-state';
import { MenuService } from '../../../shared/menu/menu.service';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';

/**
 * Represents a non-expandable section in the admin sidebar
 */
@Component({
  selector: 'ds-admin-sidebar-section',
  templateUrl: './admin-sidebar-section.component.html',
  styleUrls: ['./admin-sidebar-section.component.scss'],

})
@rendersSectionForMenu(MenuID.ADMIN, false)
export class AdminSidebarSectionComponent extends MenuSectionComponent implements OnInit {
  /**
   * This section resides in the Admin Sidebar
   */
  menuID: MenuID = MenuID.ADMIN;

  constructor(@Inject('sectionDataProvider') menuSection, protected menuService: MenuService, protected injector: Injector,) {
    super(menuSection, menuService, injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
