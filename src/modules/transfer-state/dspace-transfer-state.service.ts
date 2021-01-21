import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducer';

@Injectable()
export abstract class DSpaceTransferState {

  protected static NGRX_STATE = makeStateKey('NGRX_STATE');

  constructor(
    protected transferState: TransferState,
    protected store: Store<AppState>
  ) {
  }

  abstract transfer(): void;
}
