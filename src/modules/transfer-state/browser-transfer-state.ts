import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducer';

import {
  UniversalRehydrateAction,
  UniversalReplayAction
} from '../../app/universal.actions';

import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

import { TransferState } from './transfer-state';

@Injectable()
export class BrowserTransferState extends TransferState {

  constructor(private store: Store<AppState>, @Inject(GLOBAL_CONFIG) private config: GlobalConfig) {
    super();
  }

  initialize() {
    // tslint:disable-next-line:no-string-literal
    const cache: any = window['TRANSFER_STATE'] || {};
    Object.keys(cache).forEach((key: string) => {
      if (key !== 'actions') {
        this.set(key, cache[key]);
      }
    });
    if (this.config.prerenderStrategy === 'replay') {
      if (cache.actions !== undefined) {
        if (this.config.debug) {
          console.info('Replay:', (cache.actions !== undefined && cache.actions !== null) ? cache.actions : []);
        }
        this.store.dispatch(new UniversalReplayAction(cache.actions));
      } else {
        console.info('No actions occured during prerender.');
      }
    } else if (this.config.prerenderStrategy === 'rehydrate') {
      if (this.config.debug) {
        console.info('Rehydrate:', (cache.state !== undefined && cache.state !== null) ? cache.state : []);
      }
      this.store.dispatch(new UniversalRehydrateAction(cache.state));
    } else {
      console.warn([this.config.prerenderStrategy, 'is not a valid prerender strategy!'].join(' '));
    }
  }

}
