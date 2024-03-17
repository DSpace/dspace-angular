import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as combineLatestObservable,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { bgColor } from '../../../shared/animations/bgColor';
import { rotate } from '../../../shared/animations/rotate';
import { slide } from '../../../shared/animations/slide';
import { MenuService } from '../../../shared/menu/menu.service';
import { MenuID } from '../../../shared/menu/menu-id.model';
import { CSSVariableService } from '../../../shared/sass-helper/css-variable.service';
import { AdminSidebarSectionComponent } from '../admin-sidebar-section/admin-sidebar-section.component';

/**
 * Represents a expandable section in the sidebar
 */
@Component({
  selector: 'ds-expandable-admin-sidebar-section',
  templateUrl: './expandable-admin-sidebar-section.component.html',
  styleUrls: ['./expandable-admin-sidebar-section.component.scss'],
  animations: [rotate, slide, bgColor],
  standalone: true,
  imports: [NgClass, NgComponentOutlet, NgIf, NgFor, AsyncPipe, TranslateModule],
})

export class ExpandableAdminSidebarSectionComponent extends AdminSidebarSectionComponent implements OnInit {
  /**
   * This section resides in the Admin Sidebar
   */
  menuID = MenuID.ADMIN;

  /**
   * The background color of the section when it's active
   */
  sidebarActiveBg$: Observable<string>;

  /**
   * Emits true when the sidebar is currently collapsed, true when it's expanded
   */
  isSidebarCollapsed$: Observable<boolean>;

  /**
   * Emits true when the sidebar's preview is currently collapsed, true when it's expanded
   */
  isSidebarPreviewCollapsed$: Observable<boolean>;

  /**
   * Emits true when the menu section is expanded, else emits false
   * This is true when the section is active AND either the sidebar or it's preview is open
   */
  isExpanded$: Observable<boolean>;

  constructor(
    @Inject('sectionDataProvider') menuSection,
    protected menuService: MenuService,
    private variableService: CSSVariableService,
    protected injector: Injector,
    protected router: Router,
  ) {
    super(menuSection, menuService, injector, router);
  }

  /**
   * Set initial values for instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.sidebarActiveBg$ = this.variableService.getVariable('--ds-admin-sidebar-active-bg');
    this.isSidebarCollapsed$ = this.menuService.isMenuCollapsed(this.menuID);
    this.isSidebarPreviewCollapsed$ = this.menuService.isMenuPreviewCollapsed(this.menuID);
    this.isExpanded$ = combineLatestObservable([this.active, this.isSidebarCollapsed$, this.isSidebarPreviewCollapsed$]).pipe(
      map(([active, sidebarCollapsed, sidebarPreviewCollapsed]) => (active && (!sidebarCollapsed || !sidebarPreviewCollapsed))),
    );
  }

  toggleSection($event: Event) {
    this.menuService.expandMenuPreview(this.menuID); // fixes accessibility issue
    super.toggleSection($event);
  }

  adminMenuSubsectionId(sectionId: string, subsectionId: string) {
    return `admin-menu-section-${sectionId}-${subsectionId}`;
  }
}
