import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { MenuSectionComponent } from '../../../shared/menu/menu-section/menu-section.component';
import { MenuService } from '../../../shared/menu/menu.service';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';
import { LinkMenuItemModel } from '../../../shared/menu/menu-item/models/link.model';
import { MenuSection } from '../../../shared/menu/menu-section.model';
import { MenuID } from '../../../shared/menu/menu-id.model';
import { isEmpty } from '../../../shared/empty.util';
import { Router } from '@angular/router';
import { ExternalLinkMenuItemModel } from '../../../shared/menu/menu-item/models/external-link.model';
import { HardRedirectService } from '../../../core/services/hard-redirect.service';

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
  itemModel;

  /**
   * Boolean to indicate whether this section is disabled
   */
  isDisabled: boolean;

  constructor(
    @Inject('sectionDataProvider') menuSection: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    protected router: Router,
    protected hardRedirectService: HardRedirectService,
  ) {
    super(menuSection, menuService, injector);
    this.itemModel = menuSection.model as LinkMenuItemModel | ExternalLinkMenuItemModel;
  }

  ngOnInit(): void {
    if (this.itemModel instanceof LinkMenuItemModel) {
      this.isDisabled = this.itemModel?.disabled || isEmpty(this.itemModel?.link);
    } else if (this.itemModel instanceof ExternalLinkMenuItemModel) {
      this.isDisabled = this.itemModel?.disabled || isEmpty(this.itemModel?.href);
    } else {
      this.isDisabled = true;
    }

    super.ngOnInit();
  }

  navigate(event: any): void {
    event.preventDefault();
    if (!this.isDisabled) {

      if (this.itemModel instanceof LinkMenuItemModel) {
        this.router.navigate([this.itemModel.link]);
      } else if (this.itemModel instanceof ExternalLinkMenuItemModel) {
        this.hardRedirectService.redirect(this.itemModel.href);
      }
    }
  }
}
