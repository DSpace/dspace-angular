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
import { TranslateModule } from '@ngx-translate/core';

import { isEmpty } from '../../../shared/empty.util';
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
  standalone: true,
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
    const accessibilityHandle = section.accessibilityHandle ?? section.id;
    return `admin-menu-section-${accessibilityHandle}`;
  }

  adminMenuSectionTitleAccessibilityHandle(section: MenuSection) {
    const accessibilityHandle = section.accessibilityHandle ?? section.id;
    return `admin-menu-section-${accessibilityHandle}-title`;
  }
}
