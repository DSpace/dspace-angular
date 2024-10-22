import { first, map, skipWhile, startWith } from 'rxjs/operators';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { combineLatest as combineLatestObservable, Observable, of } from 'rxjs';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { MenuService } from '../shared/menu/menu.service';
import { HostWindowService } from '../shared/host-window.service';
import { ThemeConfig } from '../../config/theme.config';
import { environment } from '../../environments/environment';
import { slideSidebarPadding } from '../shared/animations/slide';
import { MenuID } from '../shared/menu/menu-id.model';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import { INotificationBoardOptions } from 'src/config/notifications-config.interfaces';

@Component({
  selector: 'ds-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [slideSidebarPadding],
})
export class RootComponent implements OnInit {
  theme: Observable<ThemeConfig> = of({} as any);
  isSidebarVisible$: Observable<boolean>;
  slideSidebarOver$: Observable<boolean>;
  collapsedSidebarWidth$: Observable<string>;
  expandedSidebarWidth$: Observable<string>;
  notificationOptions: INotificationBoardOptions;
  models: any;

  /**
   * Whether or not to show a full screen loader
   */
  @Input() shouldShowFullscreenLoader: boolean;

  /**
   * Whether or not to show a loader across the router outlet
   */
  @Input() shouldShowRouteLoader: boolean;

  constructor(
    private router: Router,
    private cssService: CSSVariableService,
    private menuService: MenuService,
    private windowService: HostWindowService,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.notificationOptions = environment.notifications;
  }

  ngOnInit() {
    this.isSidebarVisible$ = this.menuService.isMenuVisibleWithVisibleSections(MenuID.ADMIN);

    this.expandedSidebarWidth$ = this.cssService.getVariable('--ds-admin-sidebar-total-width').pipe(
      skipWhile((val) => !val),
      first(),
    );
    this.collapsedSidebarWidth$ = this.cssService.getVariable('--ds-admin-sidebar-fixed-element-width').pipe(
      skipWhile((val) => !val),
      first(),
    );

    const sidebarCollapsed = this.menuService.isMenuCollapsed(MenuID.ADMIN);
    this.slideSidebarOver$ = combineLatestObservable([sidebarCollapsed, this.windowService.isXsOrSm()])
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
