/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { CheckAuthenticationTokenAction } from './core/auth/auth.actions';
import { CorrelationIdService } from './correlation-id/correlation-id.service';
import { DSpaceTransferState } from '../modules/transfer-state/dspace-transfer-state.service';

/**
 * Performs the initialization of the app.
 *
 * Should have distinct extensions for server & browser for the specifics.
 * Should be provided in AppModule as follows
 * ```
 * {
 *   provide: APP_INITIALIZER
 *   useFactory: (initService: InitService) => initService.init(),
 *   deps: [ InitService ],
 *   multi: true,
 * }
 * ```
 *
 * In order to be injected in the common APP_INITIALIZER,
 * concrete subclasses should be provided in their respective app modules as
 * ```
 * { provide: InitService, useClass: SpecificInitService }
 * ```
 */
export abstract class InitService {
  protected constructor(
    protected store: Store<AppState>,
    protected correlationIdService: CorrelationIdService,
    protected dspaceTransferState: DSpaceTransferState,
  ) {
  }

  /**
   * Main initialization method, to be used as the APP_INITIALIZER factory.
   *
   * Note that the body of this method and the callback it returns are called
   * at different times.
   * This is important to take into account when other providers depend on the
   * initialization logic (e.g. APP_BASE_HREF)
   */
  abstract init(): () => Promise<boolean>;

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
