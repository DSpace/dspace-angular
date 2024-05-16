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
import { AuthService } from '../../app/core/auth/auth.service';
import { coreSelector } from '../../app/core/core.selectors';
import { RootDataService } from '../../app/core/data/root-data.service';
import { LocaleService } from '../../app/core/locale/locale.service';
import { HeadTagService } from '../../app/core/metadata/head-tag.service';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';
import { InitService } from '../../app/init.service';
import { KlaroService } from '../../app/shared/cookies/klaro.service';
import { isNotEmpty } from '../../app/shared/empty.util';
import { MenuService } from '../../app/shared/menu/menu.service';
import { ThemeService } from '../../app/shared/theme-support/theme.service';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import {
  StoreAction,
  StoreActionTypes,
} from '../../app/store.actions';
import {
  APP_CONFIG,
  APP_CONFIG_STATE,
  AppConfig,
} from '../../config/app-config.interface';
import { extendEnvironmentWithAppConfig } from '../../config/config.util';
import { DefaultAppConfig } from '../../config/default-app-config';
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
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected translate: TranslateService,
    protected localeService: LocaleService,
    protected angulartics2DSpace: Angulartics2DSpace,
    protected googleAnalyticsService: GoogleAnalyticsService,
    protected headTagService: HeadTagService,
    protected breadcrumbsService: BreadcrumbsService,
    protected klaroService: KlaroService,
    protected authService: AuthService,
    protected themeService: ThemeService,
    protected menuService: MenuService,
    private rootDataService: RootDataService,
    protected router: Router,
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
      this.initRouteListeners();
      this.themeService.listenForThemeChanges(true);
      this.trackAuthTokenExpiration();

      this.initKlaro();

      await lastValueFrom(this.authenticationReady$());

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
    const state = this.transferState.get<any>(InitService.NGRX_STATE, null);
    this.transferState.remove(InitService.NGRX_STATE);
    this.store.dispatch(new StoreAction(StoreActionTypes.REHYDRATE, state));
    return lastValueFrom(
      this.store.select(coreSelector).pipe(
        find((core: any) => isNotEmpty(core)),
        map(() => true),
      ),
    );
  }

  private trackAuthTokenExpiration(): void {
    this.authService.trackTokenExpiration();
  }

  /**
   * Initialize Klaro (once authentication is resolved)
   * @protected
   */
  protected initKlaro() {
    this.authenticationReady$().subscribe(() => {
      this.klaroService.initialize();
    });
  }

  protected initGoogleAnalytics() {
    this.googleAnalyticsService.addTrackingIdToPage();
  }

  /**
   * During an external authentication flow invalidate the SSR transferState
   * data in the cache. This allows the app to fetch fresh content.
   * @private
   */
  private externalAuthCheck() {

    this.sub = this.authService.isExternalAuthentication().pipe(
      filter((externalAuth: boolean) => externalAuth),
    ).subscribe(() => {
      // Clear the transferState data.
      this.rootDataService.invalidateRootCache();
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
