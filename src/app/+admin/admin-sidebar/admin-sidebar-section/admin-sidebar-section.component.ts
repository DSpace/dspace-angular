import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { MenuSectionComponent } from '../../../shared/menu/menu-section/menu-section.component';
import { MenuID } from '../../../shared/menu/initial-menus-state';
import { rendersSectionForMenu } from '../../../shared/menu/menu.decorator';
import { MenuService } from '../../../shared/menu/menu.service';

@Component({
  selector: 'ds-admin-sidebar-section',
  templateUrl: './admin-sidebar-section.component.html',
  styleUrls: ['./admin-sidebar-section.component.scss'],

})
@rendersSectionForMenu(MenuID.ADMIN, false)
export class AdminSidebarSectionComponent extends MenuSectionComponent implements OnInit {
  menuID: MenuID = MenuID.ADMIN;

  constructor(@Inject('sectionDataProvider') menuSection, protected menuService: MenuService, protected injector: Injector,) {
    super(menuSection, menuService, injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
