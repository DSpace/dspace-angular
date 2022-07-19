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
import { DSpaceTransferState } from '../transfer-state/dspace-transfer-state.service';
import { TransferState } from '@angular/platform-browser';
import { APP_CONFIG_STATE, AppConfig } from '../../config/app-config.interface';
import { DefaultAppConfig } from '../../config/default-app-config';
import { extendEnvironmentWithAppConfig } from '../../config/config.util';
import { environment } from '../../environments/environment';
import { CorrelationIdService } from '../../app/correlation-id/correlation-id.service';
import { Injectable } from '@angular/core';

/**
 * Performs client-side initialization.
 */
@Injectable()
export class BrowserInitService extends InitService {
  constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected transferState: TransferState,
    protected dspaceTransferState: DSpaceTransferState,
  ) {
    super(store, correlationIdService, dspaceTransferState);
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
      await this.transferAppState();
      this.checkAuthenticationToken();
      this.initCorrelationId();

      return true;
    };
  }
}
