import { delay, map, distinctUntilChanged, filter, take } from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowState } from './shared/search/host-window.reducer';
import { NativeWindowRef, NativeWindowService } from './core/services/window.service';
import { isAuthenticationBlocking } from './core/auth/selectors';
import { AuthService } from './core/auth/auth.service';
import { CSSVariableService } from './shared/sass-helper/sass-helper.service';
import { MenuService } from './shared/menu/menu.service';
import { HostWindowService } from './shared/host-window.service';
import { ThemeConfig } from '../config/theme.model';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';
import { environment } from '../environments/environment';
import { models } from './core/core.module';
import { LocaleService } from './core/locale/locale.service';
import { hasValue, isNotEmpty } from './shared/empty.util';
import { KlaroService } from './shared/cookies/klaro.service';
import { GoogleAnalyticsService } from './statistics/google-analytics.service';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './shared/theme-support/theme.service';
import { BASE_THEME_NAME } from './shared/theme-support/theme.constants';
import { DEFAULT_THEME_CONFIG } from './shared/theme-support/theme.effects';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  sidebarVisible: Observable<boolean>;
  slideSidebarOver: Observable<boolean>;
  collapsedSidebarWidth: Observable<string>;
  totalSidebarWidth: Observable<string>;
  theme: Observable<ThemeConfig> = of({} as any);
  notificationOptions = environment.notifications;
  models;

  /**
   * Whether or not the authentication is currently blocking the UI
   */
  isNotAuthBlocking$: Observable<boolean>;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
      @Inject(DOCUMENT) private document: any,
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
    @Optional() private cookiesService: KlaroService,
    @Optional() private googleAnalyticsService: GoogleAnalyticsService,
  ) {

    /* Use models object so all decorators are actually called */
    this.models = models;

    this.themeService.getThemeName$().subscribe((themeName: string) => {
      if (hasValue(themeName)) {
        this.setThemeCss(themeName);
      } else if (hasValue(DEFAULT_THEME_CONFIG)) {
        this.setThemeCss(DEFAULT_THEME_CONFIG.name);
      } else {
        this.setThemeCss(BASE_THEME_NAME);
      }
    });

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
    this.isNotAuthBlocking$ = this.store.pipe(select(isAuthenticationBlocking)).pipe(
      map((isBlocking: boolean) => isBlocking === false),
      distinctUntilChanged()
    );
    this.isNotAuthBlocking$
      .pipe(
        filter((notBlocking: boolean) => notBlocking),
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
    this.router.events.pipe(
      // This fixes an ExpressionChangedAfterItHasBeenCheckedError from being thrown while loading the component
      // More information on this bug-fix: https://blog.angular-university.io/angular-debugging/
      delay(0)
    ).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading$.next(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.isLoading$.next(false);
      }
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

  /**
   * Update the theme css file in <head>
   *
   * @param themeName The name of the new theme
   * @private
   */
  private setThemeCss(themeName: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    // Array.from to ensure we end up with an array, not an HTMLCollection, which would be
    // automatically updated if we add nodes later
    const currentThemeLinks = Array.from(this.document.getElementsByClassName('theme-css'));
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('class', 'theme-css');
    link.setAttribute('href', `/${encodeURIComponent(themeName)}-theme.css`);
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
    };
    head.appendChild(link);
  }
}
