import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { hasValue } from './shared/empty.util';
import { UniversalState } from './universal.reducer';

const universalStateSelector = (state: AppState) => state.universal;
const isReplayingSelector = createSelector(universalStateSelector, (universal: UniversalState) => universal.isReplaying);

@Injectable()
export class UniversalService {
  constructor(private store: Store<AppState>) {
  }

  get isReplaying(): boolean {
    let result;
    this.store.select(isReplayingSelector)
      .take(1)
      .subscribe((isReplaying: boolean) => result = isReplaying);
    return hasValue(result) ? result : false;
  }
}
