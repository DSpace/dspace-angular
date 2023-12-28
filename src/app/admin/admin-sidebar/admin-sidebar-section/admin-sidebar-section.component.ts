import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AbstractMenuSectionComponent } from '../../../shared/menu/menu-section/abstract-menu-section.component';
import { MenuService } from '../../../shared/menu/menu.service';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';
import { LinkMenuItemModel } from '../../../shared/menu/menu-item/models/link.model';
import { MenuSection } from '../../../shared/menu/menu-section.model';
import { MenuID } from '../../../shared/menu/menu-id.model';
import { isEmpty } from '../../../shared/empty.util';
import { Router } from '@angular/router';

/**
 * Represents a non-expandable section in the admin sidebar
 */
@Component({
  /* eslint-disable @angular-eslint/component-selector */
  selector: 'li[ds-admin-sidebar-section]',
  templateUrl: './admin-sidebar-section.component.html',
  styleUrls: ['./admin-sidebar-section.component.scss'],

})
@rendersSectionForMenu(MenuID.ADMIN, false)
export class AdminSidebarSectionComponent extends AbstractMenuSectionComponent implements OnInit {

  /**
   * This section resides in the Admin Sidebar
   */
  menuID: MenuID = MenuID.ADMIN;
  itemModel;

  /**
   * Boolean to indicate whether this section is disabled
   */
  isDisabled: boolean;

  constructor(
    @Inject('sectionDataProvider') protected section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    protected router: Router,
  ) {
    super(menuService, injector);
    this.itemModel = section.model as LinkMenuItemModel;
  }

  ngOnInit(): void {
    // todo: should support all menu entries?
    this.isDisabled = this.itemModel?.disabled || isEmpty(this.itemModel?.link);
    super.ngOnInit();
  }

  navigate(event: any): void {
    event.preventDefault();
    if (!this.isDisabled) {
      this.router.navigate(this.itemModel.link);
    }
  }
}
