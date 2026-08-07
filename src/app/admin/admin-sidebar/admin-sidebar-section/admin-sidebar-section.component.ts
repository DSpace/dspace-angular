import { NgClass } from '@angular/common';
import {
  Component,
  Injector,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { isEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { MenuService } from '../../../shared/menu/menu.service';
import { MenuID } from '../../../shared/menu/menu-id.model';
import { ExternalLinkMenuItemModel } from '../../../shared/menu/menu-item/models/external-link.model';
import { LinkMenuItemModel } from '../../../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../../../shared/menu/menu-item-type.model';
import { rendersSectionForMenu } from '../../../shared/menu/menu-section.decorator';
import { MenuSection } from '../../../shared/menu/menu-section.model';
import { AbstractMenuSectionComponent } from '../../../shared/menu/menu-section/abstract-menu-section.component';
import { ThemeService } from '../../../shared/theme-support/theme.service';
import { BrowserOnlyPipe } from '../../../shared/utils/browser-only.pipe';

/**
 * Represents a non-expandable section in the admin sidebar
 */
@Component({
  selector: 'ds-admin-sidebar-section',
  templateUrl: './admin-sidebar-section.component.html',
  styleUrls: ['./admin-sidebar-section.component.scss'],
  imports: [
    BrowserOnlyPipe,
    NgClass,
    RouterLink,
    TranslateModule,
  ],

})
@rendersSectionForMenu(MenuID.ADMIN, false)
export class AdminSidebarSectionComponent extends AbstractMenuSectionComponent implements OnInit, OnChanges {

  /**
   * This section resides in the Admin Sidebar
   */
  menuID: MenuID = MenuID.ADMIN;

  /**
   * Boolean to indicate whether this section is disabled
   */
  isDisabled: boolean;

  /**
   * Whether this section links to an external URL
   */
  isExternalLink: boolean;

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
    protected router: Router,
  ) {
    super(
      menuService,
      injector,
      themeService,
    );
    this.isExternalLink = this.section.model.type === MenuItemType.EXTERNAL;
    if (this.isExternalLink) {
      this.itemModel = this.section.model as ExternalLinkMenuItemModel;
    } else {
      this.itemModel = this.section.model as LinkMenuItemModel;
    }
  }

  ngOnInit(): void {
    if (this.isExternalLink) {
      this.isDisabled = this.itemModel?.disabled || isEmpty((this.itemModel as ExternalLinkMenuItemModel)?.href);
    } else {
      this.isDisabled = this.itemModel?.disabled || isEmpty(this.itemModel?.link);
    }
    super.ngOnInit();
  }

  navigate(event: any): void {
    event.preventDefault();
    if (!this.isDisabled) {
      if (this.isExternalLink) {
        window.open((this.itemModel as ExternalLinkMenuItemModel).href, '_blank');
      } else {
        this.router.navigate(this.itemModel.link);
      }
    }
  }

  adminMenuSectionId(section: MenuSection) {
    const accessibilityHandle = section.accessibilityHandle ?? section.id;
    return `admin-menu-section-${accessibilityHandle}`;
  }

  adminMenuSectionTitleAccessibilityHandle(section: MenuSection) {
    const accessibilityHandle = section.accessibilityHandle ?? section.id;
    return `admin-menu-section-${accessibilityHandle}-title`;
  }
}
