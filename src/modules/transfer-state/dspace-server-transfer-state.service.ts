import { Injectable } from '@angular/core';
import { DSpaceTransferState } from './dspace-transfer-state.service';

@Injectable()
export class DSpaceServerTransferState extends DSpaceTransferState {
  transfer() {
    this.transferState.onSerialize(DSpaceTransferState.NGRX_STATE, () => {
      let state;
      this.store.take(1).subscribe((saveState: any) => {
        state = saveState;
      });

      return state;
    });
  }
}
