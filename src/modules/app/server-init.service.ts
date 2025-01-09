/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { InitService } from '../../app/init.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducer';
import { TransferState } from '@angular/platform-browser';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';
import { APP_CONFIG, APP_CONFIG_STATE, AppConfig } from '../../config/app-config.interface';
import { environment } from '../../environments/environment';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../../app/core/locale/locale.service';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { MetadataService } from '../../app/core/metadata/metadata.service';
import { BreadcrumbsService } from '../../app/breadcrumbs/breadcrumbs.service';
import { ThemeService } from '../../app/shared/theme-support/theme.service';
import { take } from 'rxjs/operators';
import { MenuService } from '../../app/shared/menu/menu.service';
import { isEmpty, isNotEmpty } from '../../app/shared/empty.util';
import { BuildConfig } from '../../config/build-config.interface';

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
    protected metadata: MetadataService,
    protected breadcrumbsService: BreadcrumbsService,
    protected themeService: ThemeService,
    protected menuService: MenuService
  ) {
    super(
      store,
      correlationIdService,
      appConfig,
      translate,
      localeService,
      angulartics2DSpace,
      metadata,
      breadcrumbsService,
      themeService,
      menuService,
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

      await this.authenticationReady$().toPromise();

      return true;
    };
  }

  // Server-only initialization steps

  /**
   * Set the {@link NGRX_STATE} key when state is serialized to be transfered
   * @private
   */
  private saveAppState() {
    if (this.appConfig.universal.transferState && (isEmpty(this.appConfig.rest.ssrBaseUrl) || this.appConfig.universal.replaceRestUrl)) {
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
