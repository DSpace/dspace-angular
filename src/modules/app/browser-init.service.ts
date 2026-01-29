/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  Inject,
  Injectable,
  TransferState,
} from '@angular/core';
import {
  NavigationStart,
  Router,
} from '@angular/router';
import {
  APP_CONFIG,
  APP_CONFIG_STATE,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { BuildConfig } from '@dspace/config/build-config.interface';
import { extendEnvironmentWithAppConfig } from '@dspace/config/config.util';
import { DefaultAppConfig } from '@dspace/config/default-app-config';
import { AuthService } from '@dspace/core/auth/auth.service';
import { OrejimeService } from '@dspace/core/cookies/orejime.service';
import { coreSelector } from '@dspace/core/core.selectors';
import { CorrelationIdService } from '@dspace/core/correlation-id/correlation-id.service';
import { RequestService } from '@dspace/core/data/request.service';
import { RootDataService } from '@dspace/core/data/root-data.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { HeadTagService } from '@dspace/core/metadata/head-tag.service';
import { StoreActionTypes } from '@dspace/core/ngrx/type';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  firstValueFrom,
  lastValueFrom,
  Subscription,
} from 'rxjs';
import {
  filter,
  find,
  map,
} from 'rxjs/operators';

import { logStartupMessage } from '../../../startup-message';
import { AppState } from '../../app/app.reducer';
import { BreadcrumbsService } from '../../app/breadcrumbs/breadcrumbs.service';
import { InitService } from '../../app/init.service';
import { MenuService } from '../../app/shared/menu/menu.service';
import { MenuProviderService } from '../../app/shared/menu/menu-provider.service';
import { ThemeService } from '../../app/shared/theme-support/theme.service';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import { MatomoService } from '../../app/statistics/matomo.service';
import { StoreAction } from '../../app/store.actions';
import { environment } from '../../environments/environment';

/**
 * Performs client-side initialization.
 */
@Injectable()
export class BrowserInitService extends InitService {

  sub: Subscription;

  constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected transferState: TransferState,
    @Inject(APP_CONFIG) protected appConfig: BuildConfig,
    protected translate: TranslateService,
    protected localeService: LocaleService,
    protected angulartics2DSpace: Angulartics2DSpace,
    protected googleAnalyticsService: GoogleAnalyticsService,
    protected headTagService: HeadTagService,
    protected breadcrumbsService: BreadcrumbsService,
    protected orejimeService: OrejimeService,
    protected authService: AuthService,
    protected themeService: ThemeService,
    protected menuService: MenuService,
    private rootDataService: RootDataService,
    protected router: Router,
    private requestService: RequestService,
    private halService: HALEndpointService,
    private matomoService: MatomoService,
    protected menuProviderService: MenuProviderService,
  ) {
    super(
      store,
      correlationIdService,
      appConfig,
      translate,
      localeService,
      angulartics2DSpace,
      headTagService,
      breadcrumbsService,
      themeService,
      menuService,
      menuProviderService,
    );
  }

  protected static resolveAppConfig(
    transferState: TransferState,
  ) {
    if (transferState.hasKey<AppConfig>(APP_CONFIG_STATE)) {
      const appConfig = transferState.get<AppConfig>(APP_CONFIG_STATE, new DefaultAppConfig());
      // extend environment with app config for browser
      extendEnvironmentWithAppConfig(environment, appConfig);
    }
  }

  protected init(): () => Promise<boolean> {
    return async () => {
      await this.loadAppState();
      this.checkAuthenticationToken();
      this.externalAuthCheck();
      this.initCorrelationId();

      this.checkEnvironment();
      logStartupMessage(environment);

      this.initI18n();
      this.initAngulartics();
      this.initGoogleAnalytics();
      this.initMatomo();
      this.initRouteListeners();
      this.themeService.listenForThemeChanges(true);
      this.trackAuthTokenExpiration();

      this.initOrejime();

      await lastValueFrom(this.authenticationReady$());
      this.menuProviderService.initPersistentMenus(false);

      return true;
    };
  }

  // Browser-only initialization steps

  /**
   * Retrieve server-side application state from the {@link NGRX_STATE} key and rehydrate the store.
   * Resolves once the store is no longer empty.
   * @private
   */
  private async loadAppState(): Promise<boolean> {
    // The app state can be transferred only when SSR and CSR are using the same base url for the REST API
    if (this.appConfig.ssr.transferState) {
      const state = this.transferState.get<any>(InitService.NGRX_STATE, null);
      this.transferState.remove(InitService.NGRX_STATE);
      this.store.dispatch(new StoreAction(StoreActionTypes.REHYDRATE, state));
      return lastValueFrom(
        this.store.select(coreSelector).pipe(
          find((core: any) => isNotEmpty(core)),
          map(() => true),
        ),
      );
    } else {
      return Promise.resolve(true);
    }
  }

  private trackAuthTokenExpiration(): void {
    this.authService.trackTokenExpiration();
  }

  /**
   * Initialize Orejime (once authentication is resolved)
   * @protected
   */
  protected initOrejime() {
    this.authenticationReady$().subscribe(() => {
      this.orejimeService.initialize();
    });
  }

  protected initGoogleAnalytics() {
    this.googleAnalyticsService.addTrackingIdToPage();
  }

  protected initMatomo(): void {
    this.matomoService.init();
  }

  /**
   * During an external authentication flow invalidate the
   * data in the cache. This allows the app to fetch fresh content.
   * @private
   */
  private externalAuthCheck() {
    this.sub = this.authService.isExternalAuthentication().pipe(
      filter((externalAuth: boolean) => externalAuth),
    ).subscribe(() => {
      this.requestService.setStaleByHrefSubstring(this.halService.getRootHref());
      this.authService.setExternalAuthStatus(false);
    },
    );

    this.closeAuthCheckSubscription();
  }

  /**
   * Unsubscribe the external authentication subscription
   * when authentication is no longer blocking.
   * @private
   */
  private closeAuthCheckSubscription() {
    void firstValueFrom(this.authenticationReady$()).then(() => {
      this.sub.unsubscribe();
    });
  }

  /**
   * Start route-listening subscriptions
   * @protected
   */
  protected initRouteListeners(): void {
    super.initRouteListeners();
    this.listenForRouteChanges();
    this.menuProviderService.listenForRouteChanges(false);
  }

  /**
   * Listen to all router events. Every time a new navigation starts, invalidate the cache
   * for the root endpoint. That way we retrieve it once per routing operation to ensure the
   * backend is not down. But if the guard is called multiple times during the same routing
   * operation, the cached version is used.
   */
  protected listenForRouteChanges(): void {
    // we'll always be too late for the first NavigationStart event with the router subscribe below,
    // so this statement is for the very first route operation.
    this.rootDataService.invalidateRootCache();

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe(() => {
      this.rootDataService.invalidateRootCache();
    });
  }

}
