import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  createSelector,
  MemoizedSelector,
  Selector,
} from '@ngrx/store';

/**
 * Export a function to return a subset of the state by key
 */
export function keySelector<T, V>(parentSelector: Selector<any, any>, subState: string, key: string): MemoizedSelector<T, V> {
  return createSelector<T, unknown[], V>(parentSelector, (state: T) => {
    if (hasValue(state) && hasValue(state[subState])) {
      return state[subState][key];
    } else {
      return undefined;
    }
  });
}

/**
 * Export a function to return a subset of the state
 */
export function subStateSelector<T, V>(parentSelector: Selector<any, any>, subState: string): MemoizedSelector<T, V> {
  return createSelector<T, unknown[], V>(parentSelector, (state: T) => {
    if (hasValue(state) && hasValue(state[subState])) {
      return state[subState];
    } else {
      return undefined;
    }
  });
}
