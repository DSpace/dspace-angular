import { map, startWith } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { combineLatest as combineLatestObservable, Observable, of } from 'rxjs';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { MenuService } from '../shared/menu/menu.service';
import { HostWindowService } from '../shared/host-window.service';
import { ThemeConfig } from '../../config/theme.model';
import { environment } from '../../environments/environment';
import { slideSidebarPadding } from '../shared/animations/slide';
import { MenuID } from '../shared/menu/menu-id.model';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import { hasValueOperator } from '../shared/empty.util';

@Component({
  selector: 'ds-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [slideSidebarPadding],
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
}
