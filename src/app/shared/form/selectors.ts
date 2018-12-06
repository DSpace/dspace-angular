import { createSelector, MemoizedSelector } from '@ngrx/store';

import { FormEntry, FormState } from './form.reducer';
import { AppState } from '../../app.reducer';

export const formStateSelector = (state: AppState) => state.forms;

export function formObjectFromIdSelector(formId: string): MemoizedSelector<AppState, FormEntry> {
  return createSelector(formStateSelector, (forms: FormState) => forms[formId]);
}
