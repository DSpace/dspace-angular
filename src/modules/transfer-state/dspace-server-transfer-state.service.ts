
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DSpaceTransferState } from './dspace-transfer-state.service';

@Injectable()
export class DSpaceServerTransferState extends DSpaceTransferState {
  transfer(): Promise<boolean> {
    this.transferState.onSerialize(DSpaceTransferState.NGRX_STATE, () => {
      let state;
      this.store.pipe(take(1)).subscribe((saveState: any) => {
        state = saveState;
      });

      return state;
    });

    return new Promise<boolean>(() => true);
  }
}
