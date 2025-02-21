import {
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { AppState } from '../../app.reducer';
import {
  FormEntry,
  FormState,
} from '../../../../modules/core/src/lib/core/states/form/form.reducer';

export const formStateSelector = (state: AppState) => state.forms;

export function formObjectFromIdSelector(formId: string): MemoizedSelector<AppState, FormEntry> {
  return createSelector(formStateSelector, (forms: FormState) => forms[formId]);
}
