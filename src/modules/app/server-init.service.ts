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
import { APP_CONFIG_STATE, AppConfig } from '../../config/app-config.interface';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

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
  ) {
    super(store, correlationIdService, dspaceTransferState);
  }

  protected init(): () => Promise<boolean> {
    return async () => {
      this.checkAuthenticationToken();
      this.saveAppConfigForCSR();
      this.transferAppState();  // todo: SSR breaks if we await this (why?)
      this.initCorrelationId();

      return true;
    };
  }

  private saveAppConfigForCSR(): void {
    this.transferState.set<AppConfig>(APP_CONFIG_STATE, environment as AppConfig);
  }
}
