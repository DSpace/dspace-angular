import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as combineLatestObservable,
  Observable,
  of,
} from 'rxjs';
import {
  first,
  map,
  skipWhile,
  startWith,
} from 'rxjs/operators';
import { INotificationBoardOptions } from 'src/config/notifications-config.interfaces';

import { ThemeConfig } from '../../config/theme.config';
import { environment } from '../../environments/environment';
import { ThemedAdminSidebarComponent } from '../admin/admin-sidebar/themed-admin-sidebar.component';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import { ThemedBreadcrumbsComponent } from '../breadcrumbs/themed-breadcrumbs.component';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../core/services/window.service';
import { ThemedFooterComponent } from '../footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../header-nav-wrapper/themed-header-navbar-wrapper.component';
import { slideSidebarPadding } from '../shared/animations/slide';
import { HostWindowService } from '../shared/host-window.service';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';
import { NotificationsBoardComponent } from '../shared/notifications/notifications-board/notifications-board.component';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { SystemWideAlertBannerComponent } from '../system-wide-alert/alert-banner/system-wide-alert-banner.component';

@Component({
  selector: 'ds-base-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [slideSidebarPadding],
  standalone: true,
  imports: [
    TranslateModule,
    ThemedAdminSidebarComponent,
    SystemWideAlertBannerComponent,
    ThemedHeaderNavbarWrapperComponent,
    ThemedBreadcrumbsComponent,
    NgIf,
    NgClass,
    ThemedLoadingComponent,
    RouterOutlet,
    ThemedFooterComponent,
    NotificationsBoardComponent,
    AsyncPipe,
  ],
})
export class RootComponent implements OnInit {
  theme: Observable<ThemeConfig> = of({} as any);
  isSidebarVisible$: Observable<boolean>;
  slideSidebarOver$: Observable<boolean>;
  collapsedSidebarWidth$: Observable<string>;
  expandedSidebarWidth$: Observable<string>;
  notificationOptions: INotificationBoardOptions;
  models: any;

  browserOsClasses = new BehaviorSubject<string[]>([]);

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
    @Inject(NativeWindowService) private _window: NativeWindowRef,
  ) {
    this.notificationOptions = environment.notifications;
  }

  ngOnInit() {
    const browserName = this.getBrowserName();
    if (browserName) {
      const browserOsClasses = new Array<string>();
      browserOsClasses.push(`browser-${browserName}`);
      const osName = this.getOSName();
      if (osName) {
        browserOsClasses.push(`browser-${browserName}-${osName}`);
      }
      this.browserOsClasses.next(browserOsClasses);
    }

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

  getBrowserName(): string {
    const userAgent = this._window.nativeWindow.navigator?.userAgent;
    if (/Firefox/.test(userAgent)) {
      return 'firefox';
    }
    if (/Safari/.test(userAgent)) {
      return 'safari';
    }
    return undefined;
  }

  getOSName(): string {
    const userAgent = this._window.nativeWindow.navigator?.userAgent;
    if (/Windows/.test(userAgent)) {
      return 'windows';
    }
    return undefined;
  }
}
