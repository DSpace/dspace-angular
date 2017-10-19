import { createSelector, MemoizedSelector, Selector } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { FormEntry, FormState } from './form.reducers';

export const formStateSelector = (state: AppState) => state.forms;

export function formObjectFromIdSelector(formId: string): MemoizedSelector<AppState, FormEntry> {
  return createSelector(formStateSelector, (hostWindow: FormState) => hostWindow[formId]);
}
