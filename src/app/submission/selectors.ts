import { createSelector, MemoizedSelector, Selector } from '@ngrx/store';

import { hasValue } from '../shared/empty.util';
import { submissionSelector, SubmissionState } from './submission.reducers';
import {
  SubmissionPanelEntry, SubmissionObjectEntry,
  SubmissionBitstreamEntry
} from './objects/submission-objects.reducer';
import { PanelObjectEntry, SubmissionDefinitionEntry } from './definitions/submission-definitions.reducer';

// @TODO: Merge with keySelector function present in 'src/app/core/shared/selectors.ts'
export function keySelector<T, V>(parentSelector: Selector<any, any>, subState: string, key: string): MemoizedSelector<T, V> {
  return createSelector(parentSelector, (state: T) => {
    if (hasValue(state[subState])) {
      return state[subState][key];
    } else {
      return undefined;
    }
  });
}

export function submissionObjectFromIdSelector(submissionId: string): MemoizedSelector<SubmissionState, SubmissionObjectEntry> {
  return keySelector<SubmissionState, SubmissionObjectEntry>(submissionSelector, 'objects', submissionId);
}

export function submissionDefinitionFromIdSelector(definitionId: string): MemoizedSelector<SubmissionState, SubmissionDefinitionEntry> {
  return keySelector<SubmissionState, SubmissionDefinitionEntry>(submissionSelector, 'definitions', definitionId);
}

export function submissionBitstreamFromUuidSelector(submissionId: string, uuid: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector  = submissionObjectFromIdSelector(submissionId);
  return keySelector<SubmissionState, any>(submissionIdSelector, 'bitstreams', uuid);
}

export function panelDefinitionFromIdSelector(definitionId: string, panelId: string): MemoizedSelector<SubmissionState, any> {
  const definitionIdSelector  = submissionDefinitionFromIdSelector(definitionId);
  return keySelector<SubmissionState, SubmissionObjectEntry>(definitionIdSelector, 'panels', panelId);
}

export function submissionPanelFromIdSelector(submissionId: string, panelId: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector  = submissionObjectFromIdSelector(submissionId);
  return keySelector<SubmissionState, SubmissionObjectEntry>(submissionIdSelector, 'panels', panelId);
}
