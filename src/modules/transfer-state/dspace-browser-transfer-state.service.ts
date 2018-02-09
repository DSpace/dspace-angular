import { Injectable } from '@angular/core';
import { StoreAction, StoreActionTypes } from '../../app/store.actions';
import { DSpaceTransferState } from './dspace-transfer-state.service';

@Injectable()
export class DSpaceBrowserTransferState extends DSpaceTransferState {
  transfer() {
    const state = this.transferState.get<any>(DSpaceTransferState.NGRX_STATE, null);
    this.transferState.remove(DSpaceTransferState.NGRX_STATE);
    this.store.dispatch(new StoreAction(StoreActionTypes.REHYDRATE, state));
  }
}
