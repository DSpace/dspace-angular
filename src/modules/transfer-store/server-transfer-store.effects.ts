import { Inject, Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { types } from '../../app/shared/ngrx/type';

import { TransferStoreEffects } from './transfer-store.effects';

import { TransferState } from '../transfer-state/transfer-state';

import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

@Injectable()
export class ServerTransferStoreEffects extends TransferStoreEffects {

  @Effect({ dispatch: false }) track = this.actions.ofType(...types()).switchMap((action: Action) => {
    this.cacheAction(action);
    return Observable.of({});
  });

  constructor(private actions: Actions, private cache: TransferState, @Inject(GLOBAL_CONFIG) public config: GlobalConfig) {
    super();
    this.cache.set('actions', new Array<Action>());
  }

  private cacheAction(action: Action): void {
    if (this.config.debug) {
      console.info('Cache:', action);
    }
    this.cache.get('actions').push(action);
  }

}
