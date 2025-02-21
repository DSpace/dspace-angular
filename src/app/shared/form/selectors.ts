import {
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { AppState } from '../../app.reducer';
import {
  FormEntry,
  FormState,
} from '@dspace/core';

export const formStateSelector = (state: AppState) => state.forms;

export function formObjectFromIdSelector(formId: string): MemoizedSelector<AppState, FormEntry> {
  return createSelector(formStateSelector, (forms: FormState) => forms[formId]);
}
