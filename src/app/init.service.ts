/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { select, Store } from '@ngrx/store';
import { CheckAuthenticationTokenAction } from './core/auth/auth.actions';
import { CorrelationIdService } from './correlation-id/correlation-id.service';
import { DSpaceTransferState } from '../modules/transfer-state/dspace-transfer-state.service';
import { APP_INITIALIZER, Inject, Optional, Provider, Type } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from '../config/app-config.interface';
import { environment } from '../environments/environment';
import { AppState } from './app.reducer';
import { isEqual } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from './core/locale/locale.service';
import { hasValue } from './shared/empty.util';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';
import { GoogleAnalyticsService } from './statistics/google-analytics.service';
import { MetadataService } from './core/metadata/metadata.service';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { distinctUntilChanged, filter, take, tap } from 'rxjs/operators';
import { isAuthenticationBlocking } from './core/auth/selectors';
import { KlaroService } from './shared/cookies/klaro.service';
import { ThemeService } from './shared/theme-support/theme.service';

/**
 * Performs the initialization of the app.
 *
 * Should be extended to implement server- & browser-specific functionality.
 * Initialization steps shared between the server and brower implementations
 * can be included in this class.
 *
 * Note that the service cannot (indirectly) depend on injection tokens that are only available _after_ APP_INITIALIZER.
 * For example, NgbModal depends on ApplicationRef and can therefore not be used during initialization.
 */
export abstract class InitService {
  protected constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected dspaceTransferState: DSpaceTransferState,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected translate: TranslateService,
    protected localeService: LocaleService,
    protected angulartics2DSpace: Angulartics2DSpace,
    @Optional() protected googleAnalyticsService: GoogleAnalyticsService,
    protected metadata: MetadataService,
    protected breadcrumbsService: BreadcrumbsService,
    @Optional() protected klaroService: KlaroService,
    protected themeService: ThemeService,
  ) {
  }

  /**
   * The initialization providers to use in `*AppModule`
   * - this concrete {@link InitService}
   * - {@link APP_CONFIG} with optional pre-initialization hook
   * - {@link APP_INITIALIZER}
   * <br>
   * Should only be called on concrete subclasses of InitService for the initialization hooks to work
   */
  public static providers(): Provider[] {
    if (!InitService.isPrototypeOf(this)) {
      throw new Error(
        'Initalization providers should only be generated from concrete subclasses of InitService'
      );
    }
    return [
      {
        provide: InitService,
        useClass: this as unknown as Type<InitService>,
      },
      {
        provide: APP_CONFIG,
        useFactory: (transferState: TransferState) => {
          this.resolveAppConfig(transferState);
          return environment;
        },
        deps: [ TransferState ]
      },
      {
        provide: APP_INITIALIZER,
        useFactory: (initService: InitService) => initService.init(),
        deps: [ InitService ],
        multi: true,
      },
    ];
  }

  /**
   * Optional pre-initialization method to ensure that {@link APP_CONFIG} is fully resolved before {@link init} is called.
   *
   * For example, Router depends on APP_BASE_HREF, which in turn depends on APP_CONFIG.
   * In production mode, APP_CONFIG is resolved from the TransferState when the app is initialized.
   * If we want to use Router within APP_INITIALIZER, we have to make sure APP_BASE_HREF is resolved beforehand.
   * In this case that means that we must transfer the configuration from the SSR state during pre-initialization.
   * @protected
   */
  protected static resolveAppConfig(
    transferState: TransferState
  ): void {
    // overriden in subclasses if applicable
  }

  /**
   * Main initialization method.
   * @protected
   */
  protected abstract init(): () => Promise<boolean>;

  // Common initialization steps

  /**
   * Dispatch a {@link CheckAuthenticationTokenAction} to start off the chain of
   * actions used to determine whether a user is already logged in.
   * @protected
   */
  protected checkAuthenticationToken(): void {
    this.store.dispatch(new CheckAuthenticationTokenAction());
  }

  /**
   * Initialize the correlation ID (from cookie, NgRx store or random)
   * @protected
   */
  protected initCorrelationId(): void {
    this.correlationIdService.initCorrelationId();
  }

  /**
   * Transfer the application's NgRx state between server-side and client-side
   * @protected
   */
  protected async transferAppState(): Promise<unknown> {
    return this.dspaceTransferState.transfer();
  }

  /**
   * Make sure the {@link environment} matches {@link APP_CONFIG} and print
   * some information about it to the console
   * @protected
   */
  protected checkEnvironment(): void {
    if (!isEqual(environment, this.appConfig)) {
      throw new Error('environment does not match app config!');
    }

    if (environment.debug) {
      console.info(environment);
    }

    const env: string = environment.production ? 'Production' : 'Development';
    const color: string = environment.production ? 'red' : 'green';
    console.info(`Environment: %c${env}`, `color: ${color}; font-weight: bold;`);
  }

  /**
   * Initialize internationalization services
   * - Specify the active languages
   * - Set the current locale
   * @protected
   */
  protected initI18n(): void {
    // Load all the languages that are defined as active from the config file
    this.translate.addLangs(
      environment.languages
                 .filter((LangConfig) => LangConfig.active === true)
                 .map((a) => a.code)
    );

    // Load the default language from the config file
    // translate.setDefaultLang(environment.defaultLanguage);

    this.localeService.setCurrentLanguageCode();
  }

  /**
   * Initialize analytics services
   * - Angulartics
   * - Google Analytics (if enabled)
   * @protected
   */
  protected initAnalytics(): void {
    if (hasValue(this.googleAnalyticsService)) {
      this.googleAnalyticsService.addTrackingIdToPage();
    }
    this.angulartics2DSpace.startTracking();
  }

  /**
   * Start route-listening subscriptions
   * - {@link MetadataService.listenForRouteChange}
   * - {@link BreadcrumbsService.listenForRouteChanges}
   * - {@link ThemeService.listenForRouteChanges}
   * @protected
   */
  protected initRouteListeners(): void {
    this.metadata.listenForRouteChange();
    this.breadcrumbsService.listenForRouteChanges();
    this.themeService.listenForRouteChanges();
  }

  /**
   * Initialize Klaro (if enabled)
   * @protected
   */
  protected initKlaro() {
    if (hasValue(this.klaroService)) {
      this.store.pipe(
        select(isAuthenticationBlocking),
        distinctUntilChanged(),
        filter((isBlocking: boolean) => isBlocking === false),
        take(1)
      ).subscribe(() => {
        this.klaroService.initialize();
      });
    }
  }
}
