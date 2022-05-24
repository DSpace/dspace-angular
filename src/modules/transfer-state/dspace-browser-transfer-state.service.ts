import { Injectable } from '@angular/core';
import { coreSelector } from 'src/app/core/core.selectors';
import { StoreAction, StoreActionTypes } from '../../app/store.actions';
import { DSpaceTransferState } from './dspace-transfer-state.service';
import { find, map } from 'rxjs/operators';
import { isNotEmpty } from '../../app/shared/empty.util';

@Injectable()
export class DSpaceBrowserTransferState extends DSpaceTransferState {
  transfer(): Promise<boolean> {
    const state = this.transferState.get<any>(DSpaceTransferState.NGRX_STATE, null);
    this.transferState.remove(DSpaceTransferState.NGRX_STATE);
    this.store.dispatch(new StoreAction(StoreActionTypes.REHYDRATE, state));
    return this.store.select(coreSelector).pipe(
      find((core: any) => isNotEmpty(core)),
      map(() => true)
    ).toPromise();
  }
}
