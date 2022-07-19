/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Store } from '@ngrx/store';
import { CheckAuthenticationTokenAction } from './core/auth/auth.actions';
import { CorrelationIdService } from './correlation-id/correlation-id.service';
import { DSpaceTransferState } from '../modules/transfer-state/dspace-transfer-state.service';
import { APP_INITIALIZER, Provider, Type } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { APP_CONFIG } from '../config/app-config.interface';
import { environment } from '../environments/environment';
import { AppState } from './app.reducer';

/**
 * Performs the initialization of the app.
 * Should be extended to implement server- & browser-specific functionality.
 */
export abstract class InitService {
  protected constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected dspaceTransferState: DSpaceTransferState,
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

  protected checkAuthenticationToken(): void {
    this.store.dispatch(new CheckAuthenticationTokenAction());
  }

  protected initCorrelationId(): void {
    this.correlationIdService.initCorrelationId();
  }

  protected async transferAppState(): Promise<unknown> {
    return this.dspaceTransferState.transfer();
  }
}
