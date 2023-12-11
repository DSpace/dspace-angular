import { map, startWith } from 'rxjs/operators';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { combineLatest as combineLatestObservable, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MetadataService } from '../core/metadata/metadata.service';
import { HostWindowState } from '../shared/search/host-window.reducer';
import { NativeWindowRef, NativeWindowService } from '../core/services/window.service';
import { AuthService } from '../core/auth/auth.service';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { MenuService } from '../shared/menu/menu.service';
import { HostWindowService } from '../shared/host-window.service';
import { ThemeConfig } from '../../config/theme.config';
import { Angulartics2DSpace } from '../statistics/angulartics/dspace-provider';
import { environment } from '../../environments/environment';
import { slideSidebarPadding } from '../shared/animations/slide';
import { MenuID } from '../shared/menu/menu-id.model';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import { hasValueOperator } from '../shared/empty.util';
import { NotificationsBoardComponent } from '../shared/notifications/notifications-board/notifications-board.component';
import { ThemedFooterComponent } from '../footer/themed-footer.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { ThemedBreadcrumbsComponent } from '../breadcrumbs/themed-breadcrumbs.component';
import { ThemedHeaderNavbarWrapperComponent } from '../header-nav-wrapper/themed-header-navbar-wrapper.component';
import { SystemWideAlertBannerComponent } from '../system-wide-alert/alert-banner/system-wide-alert-banner.component';
import { ThemedAdminSidebarComponent } from '../admin/admin-sidebar/themed-admin-sidebar.component';

@Component({
    selector: 'ds-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    animations: [slideSidebarPadding],
    standalone: true,
    imports: [TranslateModule, ThemedAdminSidebarComponent, SystemWideAlertBannerComponent, ThemedHeaderNavbarWrapperComponent, ThemedBreadcrumbsComponent, NgIf, ThemedLoadingComponent, RouterOutlet, ThemedFooterComponent, NotificationsBoardComponent, AsyncPipe]
})
export class RootComponent implements OnInit {
  sidebarVisible: Observable<boolean>;
  slideSidebarOver: Observable<boolean>;
  collapsedSidebarWidth: Observable<string>;
  totalSidebarWidth: Observable<string>;
  theme: Observable<ThemeConfig> = of({} as any);
  notificationOptions;
  models;

  /**
   * Whether or not to show a full screen loader
   */
  @Input() shouldShowFullscreenLoader: boolean;

  /**
   * Whether or not to show a loader across the router outlet
   */
  @Input() shouldShowRouteLoader: boolean;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private translate: TranslateService,
    private store: Store<HostWindowState>,
    private metadata: MetadataService,
    private angulartics2DSpace: Angulartics2DSpace,
    private authService: AuthService,
    private router: Router,
    private cssService: CSSVariableService,
    private menuService: MenuService,
    private windowService: HostWindowService
  ) {
    this.notificationOptions = environment.notifications;
  }

  ngOnInit() {
    this.sidebarVisible = this.menuService.isMenuVisibleWithVisibleSections(MenuID.ADMIN);

    this.collapsedSidebarWidth = this.cssService.getVariable('--ds-collapsed-sidebar-width').pipe(hasValueOperator());
    this.totalSidebarWidth = this.cssService.getVariable('--ds-total-sidebar-width').pipe(hasValueOperator());

    const sidebarCollapsed = this.menuService.isMenuCollapsed(MenuID.ADMIN);
    this.slideSidebarOver = combineLatestObservable([sidebarCollapsed, this.windowService.isXsOrSm()])
      .pipe(
        map(([collapsed, mobile]) => collapsed || mobile),
        startWith(true),
      );

    if (this.router.url === getPageInternalServerErrorRoute()) {
      this.shouldShowRouteLoader = false;
    }
  }

  skipToMainContent() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
    }
  }
}
