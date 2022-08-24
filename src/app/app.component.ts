import { distinctUntilChanged, filter, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationCancel,
  NavigationEnd,
  NavigationStart, ResolveEnd,
  Router,
} from '@angular/router';

import { isEqual } from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowState } from './shared/search/host-window.reducer';
import { NativeWindowRef, NativeWindowService } from './core/services/window.service';
import { isAuthenticationBlocking } from './core/auth/selectors';
import { AuthService } from './core/auth/auth.service';
import { CSSVariableService } from './shared/sass-helper/sass-helper.service';
import { MenuService } from './shared/menu/menu.service';
import { HostWindowService } from './shared/host-window.service';
import { HeadTagConfig, ThemeConfig } from '../config/theme.model';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';
import { environment } from '../environments/environment';
import { models } from './core/core.module';
import { LocaleService } from './core/locale/locale.service';
import { hasNoValue, hasValue, isNotEmpty } from './shared/empty.util';
import { KlaroService } from './shared/cookies/klaro.service';
import { GoogleAnalyticsService } from './statistics/google-analytics.service';
import { ThemeService } from './shared/theme-support/theme.service';
import { BASE_THEME_NAME } from './shared/theme-support/theme.constants';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { IdleModalComponent } from './shared/idle-modal/idle-modal.component';
import { getDefaultThemeConfig } from '../config/config.util';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { ModalBeforeDismiss } from './shared/interfaces/modal-before-dismiss.interface';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  sidebarVisible: Observable<boolean>;
  slideSidebarOver: Observable<boolean>;
  collapsedSidebarWidth: Observable<string>;
  totalSidebarWidth: Observable<string>;
  theme: Observable<ThemeConfig> = of({} as any);
  notificationOptions;
  models;

  /**
   * Whether or not the authentication is currently blocking the UI
   */
  isAuthBlocking$: Observable<boolean>;

  /**
   * Whether or not the app is in the process of rerouting
   */
  isRouteLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Whether or not the theme is in the process of being swapped
   */
  isThemeLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isThemeCSSLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Whether or not the idle modal is is currently open
   */
  idleModalOpen: boolean;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private themeService: ThemeService,
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
    private localeService: LocaleService,
    private breadcrumbsService: BreadcrumbsService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    @Optional() private cookiesService: KlaroService,
    @Optional() private googleAnalyticsService: GoogleAnalyticsService,
  ) {

    if (!isEqual(environment, this.appConfig)) {
      throw new Error('environment does not match app config!');
    }

    this.notificationOptions = environment.notifications;

    /* Use models object so all decorators are actually called */
    this.models = models;

    this.themeService.getThemeName$().subscribe((themeName: string) => {
      if (isPlatformBrowser(this.platformId)) {
        // the theme css will never download server side, so this should only happen on the browser
        this.distinctNext(this.isThemeCSSLoading$, true);
      }
      if (hasValue(themeName)) {
        this.loadGlobalThemeConfig(themeName);
      } else {
        const defaultThemeConfig = getDefaultThemeConfig();
        if (hasValue(defaultThemeConfig)) {
          this.loadGlobalThemeConfig(defaultThemeConfig.name);
        } else {
          this.loadGlobalThemeConfig(BASE_THEME_NAME);
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.authService.trackTokenExpiration();
      this.trackIdleModal();
    }

    // Load all the languages that are defined as active from the config file
    translate.addLangs(environment.languages.filter((LangConfig) => LangConfig.active === true).map((a) => a.code));

    // Load the default language from the config file
    // translate.setDefaultLang(environment.defaultLanguage);

    // set the current language code
    this.localeService.setCurrentLanguageCode();

    // analytics
    if (hasValue(googleAnalyticsService)) {
      googleAnalyticsService.addTrackingIdToPage();
    }
    angulartics2DSpace.startTracking();

    metadata.listenForRouteChange();
    breadcrumbsService.listenForRouteChanges();

    if (environment.debug) {
      console.info(environment);
    }
    this.storeCSSVariables();
  }

  ngOnInit() {
    /** Implement behavior for interface {@link ModalBeforeDismiss} */
    this.modalConfig.beforeDismiss = async function () {
      if (typeof this?.componentInstance?.beforeDismiss === 'function') {
        return this.componentInstance.beforeDismiss();
      }

      // fall back to default behavior
      return true;
    };

    this.isAuthBlocking$ = this.store.pipe(select(isAuthenticationBlocking)).pipe(
      distinctUntilChanged()
    );
    this.isAuthBlocking$
      .pipe(
        filter((isBlocking: boolean) => isBlocking === false),
        take(1)
      ).subscribe(() => this.initializeKlaro());

    const env: string = environment.production ? 'Production' : 'Development';
    const color: string = environment.production ? 'red' : 'green';
    console.info(`Environment: %c${env}`, `color: ${color}; font-weight: bold;`);
    this.dispatchWindowSize(this._window.nativeWindow.innerWidth, this._window.nativeWindow.innerHeight);
  }

  private storeCSSVariables() {
    this.cssService.addCSSVariable('xlMin', '1200px');
    this.cssService.addCSSVariable('mdMin', '768px');
    this.cssService.addCSSVariable('lgMin', '576px');
    this.cssService.addCSSVariable('smMin', '0');
    this.cssService.addCSSVariable('adminSidebarActiveBg', '#0f1b28');
    this.cssService.addCSSVariable('sidebarItemsWidth', '250px');
    this.cssService.addCSSVariable('collapsedSidebarWidth', '53.234px');
    this.cssService.addCSSVariable('totalSidebarWidth', '303.234px');
    // const vars = variables.locals || {};
    // Object.keys(vars).forEach((name: string) => {
    //   this.cssService.addCSSVariable(name, vars[name]);
    // })
  }

  ngAfterViewInit() {
    let updatingTheme = false;
    let snapshot: ActivatedRouteSnapshot;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        updatingTheme = false;
        this.distinctNext(this.isRouteLoading$, true);
      } else if (event instanceof ResolveEnd) {
        // this is the earliest point where we have all the information we need
        // to update the theme, but this event is not emitted on first load
        this.updateTheme(event.urlAfterRedirects, event.state.root);
        updatingTheme = true;
      } else if (!updatingTheme && event instanceof ActivationEnd) {
        // if there was no ResolveEnd, keep track of the snapshot...
        snapshot = event.snapshot;
      } else if (event instanceof NavigationEnd) {
        if (!updatingTheme) {
          // ...and use it to update the theme on NavigationEnd instead
          this.updateTheme(event.urlAfterRedirects, snapshot);
          updatingTheme = true;
        }
        this.distinctNext(this.isRouteLoading$, false);
      } else if (event instanceof NavigationCancel) {
        if (!updatingTheme) {
          this.distinctNext(this.isThemeLoading$, false);
        }
        this.distinctNext(this.isRouteLoading$, false);
      }
    });
  }

  /**
   * Update the theme according to the current route, if applicable.
   * @param urlAfterRedirects the current URL after redirects
   * @param snapshot          the current route snapshot
   * @private
   */
  private updateTheme(urlAfterRedirects: string, snapshot: ActivatedRouteSnapshot): void {
    this.themeService.updateThemeOnRouteChange$(urlAfterRedirects, snapshot).pipe(
      switchMap((changed) => {
        if (changed) {
          return this.isThemeCSSLoading$;
        } else {
          return [false];
        }
      })
    ).subscribe((changed) => {
      this.distinctNext(this.isThemeLoading$, changed);
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.dispatchWindowSize(event.target.innerWidth, event.target.innerHeight);
  }

  private dispatchWindowSize(width, height): void {
    this.store.dispatch(
      new HostWindowResizeAction(width, height)
    );
  }

  private initializeKlaro() {
    if (hasValue(this.cookiesService)) {
      this.cookiesService.initialize();
    }
  }

  private loadGlobalThemeConfig(themeName: string): void {
    this.setThemeCss(themeName);
    this.setHeadTags(themeName);
  }

  /**
   * Update the theme css file in <head>
   *
   * @param themeName The name of the new theme
   * @private
   */
  private setThemeCss(themeName: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    if (hasNoValue(head)) {
      return;
    }

    // Array.from to ensure we end up with an array, not an HTMLCollection, which would be
    // automatically updated if we add nodes later
    const currentThemeLinks = Array.from(head.getElementsByClassName('theme-css'));
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('class', 'theme-css');
    link.setAttribute('href', `${encodeURIComponent(themeName)}-theme.css`);
    // wait for the new css to download before removing the old one to prevent a
    // flash of unstyled content
    link.onload = () => {
      if (isNotEmpty(currentThemeLinks)) {
        currentThemeLinks.forEach((currentThemeLink: any) => {
          if (hasValue(currentThemeLink)) {
            currentThemeLink.remove();
          }
        });
      }
      // the fact that this callback is used, proves we're on the browser.
      this.distinctNext(this.isThemeCSSLoading$, false);
    };
    head.appendChild(link);
  }

  private setHeadTags(themeName: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    if (hasNoValue(head)) {
      return;
    }

    // clear head tags
    const currentHeadTags = Array.from(head.getElementsByClassName('theme-head-tag'));
    if (hasValue(currentHeadTags)) {
      currentHeadTags.forEach((currentHeadTag: any) => currentHeadTag.remove());
    }

    // create new head tags (not yet added to DOM)
    const headTagFragment = this.document.createDocumentFragment();
    this.createHeadTags(themeName)
      .forEach(newHeadTag => headTagFragment.appendChild(newHeadTag));

    // add new head tags to DOM
    head.appendChild(headTagFragment);
  }

  private createHeadTags(themeName: string): HTMLElement[] {
    const themeConfig = this.themeService.getThemeConfigFor(themeName);
    const headTagConfigs = themeConfig?.headTags;

    if (hasNoValue(headTagConfigs)) {
      const parentThemeName = themeConfig?.extends;
      if (hasValue(parentThemeName)) {
        // inherit the head tags of the parent theme
        return this.createHeadTags(parentThemeName);
      }
      const defaultThemeConfig = getDefaultThemeConfig();
      const defaultThemeName = defaultThemeConfig.name;
      if (
        hasNoValue(defaultThemeName) ||
        themeName === defaultThemeName ||
        themeName === BASE_THEME_NAME
      ) {
        // last resort, use fallback favicon.ico
        return [
          this.createHeadTag({
            'tagName': 'link',
            'attributes': {
              'rel': 'icon',
              'href': 'assets/images/favicon.ico',
              'sizes': 'any',
            }
          })
        ];
      }

      // inherit the head tags of the default theme
      return this.createHeadTags(defaultThemeConfig.name);
    }

    return headTagConfigs.map(this.createHeadTag.bind(this));
  }

  private createHeadTag(headTagConfig: HeadTagConfig): HTMLElement {
    const tag = this.document.createElement(headTagConfig.tagName);

    if (hasValue(headTagConfig.attributes)) {
      Object.entries(headTagConfig.attributes)
        .forEach(([key, value]) => tag.setAttribute(key, value));
    }

    // 'class' attribute should always be 'theme-head-tag' for removal
    tag.setAttribute('class', 'theme-head-tag');

    return tag;
  }

  private trackIdleModal() {
    const isIdle$ = this.authService.isUserIdle();
    const isAuthenticated$ = this.authService.isAuthenticated();
    isIdle$.pipe(withLatestFrom(isAuthenticated$))
      .subscribe(([userIdle, authenticated]) => {
        if (userIdle && authenticated) {
          if (!this.idleModalOpen) {
            const modalRef = this.modalService.open(IdleModalComponent, { ariaLabelledBy: 'idle-modal.header' });
            this.idleModalOpen = true;
            modalRef.componentInstance.response.pipe(take(1)).subscribe((closed: boolean) => {
              if (closed) {
                this.idleModalOpen = false;
              }
            });
          }
        }
      });
  }

  /**
   * Use nextValue to update a given BehaviorSubject, only if it differs from its current value
   *
   * @param bs a BehaviorSubject
   * @param nextValue the next value for that BehaviorSubject
   * @protected
   */
  protected distinctNext<T>(bs: BehaviorSubject<T>, nextValue: T): void {
    if (bs.getValue() !== nextValue) {
      bs.next(nextValue);
    }
  }
}
