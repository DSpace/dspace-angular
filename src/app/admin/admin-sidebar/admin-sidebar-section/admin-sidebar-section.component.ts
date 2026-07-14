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
import { isEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { MenuService } from '../../../shared/menu/menu.service';
import { MenuID } from '../../../shared/menu/menu-id.model';
import { LinkMenuItemModel } from '../../../shared/menu/menu-item/models/link.model';
import { MenuSection } from '../../../shared/menu/menu-section.model';
import { AbstractMenuSectionComponent } from '../../../shared/menu/menu-section/abstract-menu-section.component';
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

  adminMenuSectionId(section: MenuSection) {
    return `admin-menu-section-${this.getAccessibilityHandle(section)}`;
  }

  adminMenuSectionTitleAccessibilityHandle(section: MenuSection) {
    return `admin-menu-section-${this.getAccessibilityHandle(section)}-title`;
  }

  /**
   * Returns the identifier to use when building translation keys and DOM ids for a menu section.
   * Falls back to the (often auto-generated, non-translatable) section id when no explicit
   * accessibilityHandle was provided by the section's menu provider.
   */
  getAccessibilityHandle(section: MenuSection): string {
    return section.accessibilityHandle ?? section.id;
  }
}
