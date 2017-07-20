import { Inject, Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { types } from '../../app/shared/ngrx/type';

import { TransferStoreEffects } from './transfer-store.effects';

import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

@Injectable()
export class BrowserTransferStoreEffects extends TransferStoreEffects {

  @Effect({ dispatch: false }) log = this.actions.ofType(...types()).switchMap((action: Action) => {
    if (this.config.debug) {
      console.info(action);
    }
    return Observable.of({});
  });

  constructor(private actions: Actions, @Inject(GLOBAL_CONFIG) public config: GlobalConfig) {
    super();
  }

}
