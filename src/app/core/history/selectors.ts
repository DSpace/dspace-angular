import { CoreState } from '../core.reducers';
import { createSelector } from '@ngrx/store';
import { coreSelector } from '../core.selectors';

export const historySelector = createSelector(
  coreSelector,
  (state: CoreState) => state.history
);
