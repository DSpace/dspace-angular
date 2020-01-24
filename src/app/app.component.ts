import { delay, filter, map, take } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { TranslateService } from '@ngx-translate/core';

import { GLOBAL_CONFIG, GlobalConfig } from '../config';

import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowState } from './shared/search/host-window.reducer';
import { NativeWindowRef, NativeWindowService } from './core/services/window.service';
import { isAuthenticated } from './core/auth/selectors';
import { AuthService } from './core/auth/auth.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import variables from '../styles/_exposed_variables.scss';
import { CSSVariableService } from './shared/sass-helper/sass-helper.service';
import { MenuService } from './shared/menu/menu.service';
import { MenuID } from './shared/menu/initial-menus-state';
import { combineLatest as combineLatestObservable, Observable, of } from 'rxjs';
import { slideSidebarPadding } from './shared/animations/slide';
import { HostWindowService } from './shared/host-window.service';
import { Theme } from '../config/theme.inferface';
import { isNotEmpty } from './shared/empty.util';
import { CookieService } from './core/services/cookie.service';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';

export const LANG_COOKIE = 'language_cookie';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideSidebarPadding]
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoading = true;
  sidebarVisible: Observable<boolean>;
  slideSidebarOver: Observable<boolean>;
  collapsedSidebarWidth: Observable<string>;
  totalSidebarWidth: Observable<string>;
  theme: Observable<Theme> = of({} as any);

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private translate: TranslateService,
    private store: Store<HostWindowState>,
    private metadata: MetadataService,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2DSpace: Angulartics2DSpace,
    private authService: AuthService,
    private router: Router,
    private cssService: CSSVariableService,
    private menuService: MenuService,
    private windowService: HostWindowService,
    private cookie: CookieService
  ) {
    // Load all the languages that are defined as active from the config file
    translate.addLangs(config.languages.filter((LangConfig) => LangConfig.active === true).map((a) => a.code));

    // Load the default language from the config file
    translate.setDefaultLang(config.defaultLanguage);

    // Attempt to get the language from a cookie
    const lang = cookie.get(LANG_COOKIE);
    if (isNotEmpty(lang)) {
      // Cookie found
      // Use the language from the cookie
      translate.use(lang);
    } else {
      // Cookie not found
      // Attempt to get the browser language from the user
      if (translate.getLangs().includes(translate.getBrowserLang())) {
        translate.use(translate.getBrowserLang());
      } else {
        translate.use(config.defaultLanguage);
      }
    }

    angulartics2GoogleAnalytics.startTracking();
    angulartics2DSpace.startTracking();

    metadata.listenForRouteChange();

    if (config.debug) {
      console.info(config);
    }
    this.storeCSSVariables();
  }

  ngOnInit() {

    const env: string = this.config.production ? 'Production' : 'Development';
    const color: string = this.config.production ? 'red' : 'green';
    console.info(`Environment: %c${env}`, `color: ${color}; font-weight: bold;`);
    this.dispatchWindowSize(this._window.nativeWindow.innerWidth, this._window.nativeWindow.innerHeight);

    // Whether is not authenticathed try to retrieve a possible stored auth token
    this.store.pipe(select(isAuthenticated),
      take(1),
      filter((authenticated) => !authenticated)
    ).subscribe((authenticated) => this.authService.checkAuthenticationToken());
    this.sidebarVisible = this.menuService.isMenuVisible(MenuID.ADMIN);

    this.collapsedSidebarWidth = this.cssService.getVariable('collapsedSidebarWidth');
    this.totalSidebarWidth = this.cssService.getVariable('totalSidebarWidth');

    const sidebarCollapsed = this.menuService.isMenuCollapsed(MenuID.ADMIN);
    this.slideSidebarOver = combineLatestObservable(sidebarCollapsed, this.windowService.isXsOrSm())
      .pipe(
        map(([collapsed, mobile]) => collapsed || mobile)
      );
  }

  private storeCSSVariables() {
    const vars = variables.locals || {};
    Object.keys(vars).forEach((name: string) => {
      this.cssService.addCSSVariable(name, vars[name]);
    })
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      // This fixes an ExpressionChangedAfterItHasBeenCheckedError from being thrown while loading the component
      // More information on this bug-fix: https://blog.angular-university.io/angular-debugging/
      delay(0)
    ).subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.isLoading = false;
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.dispatchWindowSize(event.target.innerWidth, event.target.innerHeight);
  }

  private dispatchWindowSize(width, height): void {
    this.store.dispatch(
      new HostWindowResizeAction(width, height)
    );
  }

}
