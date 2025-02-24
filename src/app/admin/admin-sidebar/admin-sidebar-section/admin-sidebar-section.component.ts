import { NgClass } from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import {
  MenuID,
  MenuSection,
} from '@dspace/core';
import { isEmpty } from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';

import { MenuService } from '../../../shared/menu/menu.service';
import { LinkMenuItemModel } from '../../../shared/menu/menu-item/models/link.model';
import { MenuSectionComponent } from '../../../shared/menu/menu-section/menu-section.component';
import { BrowserOnlyPipe } from '../../../shared/utils/browser-only.pipe';

/**
 * Represents a non-expandable section in the admin sidebar
 */
@Component({
  selector: 'ds-admin-sidebar-section',
  templateUrl: './admin-sidebar-section.component.html',
  styleUrls: ['./admin-sidebar-section.component.scss'],
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule, BrowserOnlyPipe],

})
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
  ) {
    super(menuSection, menuService, injector);
    this.itemModel = menuSection.model as LinkMenuItemModel;
  }

  ngOnInit(): void {
    this.isDisabled = this.itemModel?.disabled || isEmpty(this.itemModel?.link);
    super.ngOnInit();
  }

  navigate(event: any): void {
    event.preventDefault();
    if (!this.isDisabled) {
      this.router.navigate(this.itemModel.link);
    }
  }

  adminMenuSectionId(sectionId: string) {
    return `admin-menu-section-${sectionId}`;
  }

  adminMenuSectionTitleId(sectionId: string) {
    return `admin-menu-section-${sectionId}-title`;
  }
}
