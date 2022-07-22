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
import { DSpaceTransferState } from '../transfer-state/dspace-transfer-state.service';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';
import { APP_CONFIG, APP_CONFIG_STATE, AppConfig } from '../../config/app-config.interface';
import { environment } from '../../environments/environment';
import { Inject, Injectable, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../../app/core/locale/locale.service';
import { Angulartics2DSpace } from '../../app/statistics/angulartics/dspace-provider';
import { GoogleAnalyticsService } from '../../app/statistics/google-analytics.service';
import { MetadataService } from '../../app/core/metadata/metadata.service';
import { BreadcrumbsService } from '../../app/breadcrumbs/breadcrumbs.service';
import { CSSVariableService } from '../../app/shared/sass-helper/sass-helper.service';
import { KlaroService } from '../../app/shared/cookies/klaro.service';

/**
 * Performs server-side initialization.
 */
@Injectable()
export class ServerInitService extends InitService {
  constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected transferState: TransferState,
    protected dspaceTransferState: DSpaceTransferState,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected translate: TranslateService,
    protected localeService: LocaleService,
    protected angulartics2DSpace: Angulartics2DSpace,
    @Optional() protected googleAnalyticsService: GoogleAnalyticsService,
    protected metadata: MetadataService,
    protected breadcrumbsService: BreadcrumbsService,
    protected cssService: CSSVariableService,
    @Optional() protected klaroService: KlaroService,
  ) {
    super(
      store,
      correlationIdService,
      dspaceTransferState,
      appConfig,
      translate,
      localeService,
      angulartics2DSpace,
      googleAnalyticsService,
      metadata,
      breadcrumbsService,
      klaroService,
    );
  }

  protected init(): () => Promise<boolean> {
    return async () => {
      this.checkAuthenticationToken();
      this.saveAppConfigForCSR();
      this.transferAppState();  // todo: SSR breaks if we await this (why?)
      this.initCorrelationId();

      this.checkEnvironment();
      this.initI18n();
      this.initAnalytics();
      this.initRouteListeners();

      this.initKlaro();

      return true;
    };
  }

  // Server-only initialization steps

  private saveAppConfigForCSR(): void {
    this.transferState.set<AppConfig>(APP_CONFIG_STATE, environment as AppConfig);
  }
}
