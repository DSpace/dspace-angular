import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
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

import { ThemedAdminSidebarComponent } from '../../../../app/admin/admin-sidebar/themed-admin-sidebar.component';
import { ThemedBreadcrumbsComponent } from '../../../../app/breadcrumbs/themed-breadcrumbs.component';
import { getPageInternalServerErrorRoute } from '../../../../app/core/router/core-routing-paths';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../../app/core/services/window.service';
import { ThemedFooterComponent } from '../../../../app/footer/themed-footer.component';
import { ThemedHeaderNavbarWrapperComponent } from '../../../../app/header-nav-wrapper/themed-header-navbar-wrapper.component';
import { slideSidebarPadding } from '../../../../app/shared/animations/slide';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { LiveRegionComponent } from '../../../../app/shared/live-region/live-region.component';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { MenuService } from '../../../../app/shared/menu/menu.service';
import { MenuID } from '../../../../app/shared/menu/menu-id.model';
import { CSSVariableService } from '../../../../app/shared/sass-helper/css-variable.service';
import { SystemWideAlertBannerComponent } from '../../../../app/system-wide-alert/alert-banner/system-wide-alert-banner.component';
import { ThemeConfig } from '../../../../config/theme.config';
import { environment } from '../../../../environments/environment';
import { NotificationsBoardComponent } from '../notification-system/notifications-board/notifications-board.component';
import { attachCharCounter } from '../shared/form/char-counter';
import { attachTypingChange } from '../shared/form/typing-change';
import { ScrollToTopComponent } from '../shared/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'ds-themed-root',
  templateUrl: './root.component.html',
  animations: [slideSidebarPadding],
  imports: [
    AsyncPipe,
    LiveRegionComponent,
    NgClass,
    NotificationsBoardComponent,
    RouterOutlet,
    ScrollToTopComponent,
    SystemWideAlertBannerComponent,
    ThemedAdminSidebarComponent,
    ThemedBreadcrumbsComponent,
    ThemedFooterComponent,
    ThemedHeaderNavbarWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class RootComponent implements OnInit, OnDestroy {
  theme: Observable<ThemeConfig> = of({} as any);
  isSidebarVisible$: Observable<boolean>;
  slideSidebarOver$: Observable<boolean>;
  collapsedSidebarWidth$: Observable<string>;
  expandedSidebarWidth$: Observable<string>;
  notificationOptions: INotificationBoardOptions;
  models: any;

  browserOsClasses = new BehaviorSubject<string[]>([]);

  /** Desligam os ouvintes do formulário de submissão: texto em digitação na fila e contador de caracteres. */
  private detachFormListeners: (() => void)[] = [];

  @Input() shouldShowFullscreenLoader: boolean;
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
    // O texto digitado só entra na fila de alterações do formulário quando o campo perde o foco. O primeiro ouvinte o
    // enfileira na pausa da digitação, e o segundo mostra o contador de caracteres dos campos com limite.
    if (typeof document !== 'undefined') {
      this.detachFormListeners = [attachTypingChange(document), attachCharCounter(document)];
    }

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

  ngOnDestroy(): void {
    this.detachFormListeners.forEach((detach) => detach());
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
