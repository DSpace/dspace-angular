import { createSelector, MemoizedSelector } from '@ngrx/store';
import { coreSelector, CoreState } from '../core.reducers';
import { hasValue } from '../../shared/empty.util';

export function keySelector<T>(subState: string, key: string): MemoizedSelector<CoreState, T> {
  return createSelector(coreSelector, (state: CoreState) => {
    if (hasValue(state[subState])) {
      return state[subState][key];
    } else {
      return undefined;
    }
  });
}
