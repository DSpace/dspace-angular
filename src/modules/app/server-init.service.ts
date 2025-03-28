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
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppState } from '../../app/app.reducer';
import { BreadcrumbsService } from '../../app/breadcrumbs/breadcrumbs.service';
import { LocaleService } from '../../app/core/locale/locale.service';
import { HeadTagService } from '../../app/core/metadata/head-tag.service';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';
import { InitService } from '../../app/init.service';
import {
  isEmpty,
  isNotEmpty,
} from '../../app/shared/empty.util';
import { MenuService } from '../../app/shared/menu/menu.service';
import { MenuProviderService } from '../../app/shared/menu/menu-provider.service';
import { ThemeService } from '../../app/shared/theme-support/theme.service';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import {
  APP_CONFIG,
  APP_CONFIG_STATE,
  AppConfig,
} from '../../config/app-config.interface';
import { BuildConfig } from '../../config/build-config.interface';
import { environment } from '../../environments/environment';

/**
 * Performs server-side initialization.
 */
@Injectable()
export class ServerInitService extends InitService {
  constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected transferState: TransferState,
    @Inject(APP_CONFIG) protected appConfig: BuildConfig,
    protected translate: TranslateService,
    protected localeService: LocaleService,
    protected angulartics2DSpace: Angulartics2DSpace,
    protected headTagService: HeadTagService,
    protected breadcrumbsService: BreadcrumbsService,
    protected themeService: ThemeService,
    protected menuService: MenuService,
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

  protected init(): () => Promise<boolean> {
    return async () => {
      this.checkAuthenticationToken();
      this.saveAppConfigForCSR();
      this.saveAppState();
      this.initCorrelationId();

      this.checkEnvironment();
      this.initI18n();
      this.initAngulartics();
      this.initRouteListeners();
      this.themeService.listenForThemeChanges(false);

      await lastValueFrom(this.authenticationReady$());
      this.menuProviderService.initPersistentMenus(true);

      return true;
    };
  }


  protected initRouteListeners(): void {
    super.initRouteListeners();
    this.menuProviderService.listenForRouteChanges(true);
  }

  // Server-only initialization steps

  /**
   * Set the {@link NGRX_STATE} key when state is serialized to be transferred
   * @private
   */
  private saveAppState() {
    if (this.appConfig.ssr.transferState && (isEmpty(this.appConfig.rest.ssrBaseUrl) || this.appConfig.ssr.replaceRestUrl)) {
      this.transferState.onSerialize(InitService.NGRX_STATE, () => {
        let state;
        this.store.pipe(take(1)).subscribe((saveState: any) => {
          state = saveState;
        });

        return state;
      });
    }
  }

  private saveAppConfigForCSR(): void {
    if (isNotEmpty(environment.rest.ssrBaseUrl) && environment.rest.baseUrl !== environment.rest.ssrBaseUrl) {
      // Avoid to transfer ssrBaseUrl in order to prevent security issues
      const config: AppConfig = Object.assign({}, environment as AppConfig, {
        rest: Object.assign({}, environment.rest, { ssrBaseUrl: '', hasSsrBaseUrl: true }),
      });
      this.transferState.set<AppConfig>(APP_CONFIG_STATE, config);
    } else {
      this.transferState.set<AppConfig>(APP_CONFIG_STATE, environment as AppConfig);
    }
  }
}
