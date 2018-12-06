import { createSelector, MemoizedSelector } from '@ngrx/store';

import { hasNoValue, isEmpty } from '../../shared/empty.util';

export function pathSelector<From, To>(selector: MemoizedSelector<any, From>, ...path: string[]): MemoizedSelector<any, To> {
  return createSelector(selector, (state: any) => getSubState(state, path));
}

function getSubState(state: any, path: string[]) {
  const current = path[0];
  const remainingPath = path.slice(1);
  const subState = state[current];
  if (hasNoValue(subState) || isEmpty(remainingPath)) {
    return subState;
  } else {
    return getSubState(subState, remainingPath);
  }
}
