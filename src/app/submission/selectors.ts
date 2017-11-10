import { createSelector, MemoizedSelector, Selector } from '@ngrx/store';

import { hasValue } from '../shared/empty.util';
import { submissionSelector, SubmissionState } from './submission.reducers';
import {
  SubmissionSectionEntry, SubmissionObjectEntry,
  SubmissionBitstreamEntry
} from './objects/submission-objects.reducer';
import { SectionObjectEntry, SubmissionDefinitionEntry } from './definitions/submission-definitions.reducer';

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

export function subStateSelector<T, V>(parentSelector: Selector<any, any>, subState: string): MemoizedSelector<T, V> {
  return createSelector(parentSelector, (state: T) => {
    if (hasValue(state[subState])) {
      return state[subState];
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

export function submissionBitstreamsFromIdSelector(submissionId: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector = submissionObjectFromIdSelector(submissionId);
  return subStateSelector<SubmissionState, SubmissionObjectEntry>(submissionIdSelector, 'bitstreams');
}

export function submissionBitstreamFromUuidSelector(submissionId: string, uuid: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector  = submissionObjectFromIdSelector(submissionId);
  return keySelector<SubmissionState, any>(submissionIdSelector, 'bitstreams', uuid);
}

export function sectionDefinitionFromIdSelector(definitionId: string, sectionId: string): MemoizedSelector<SubmissionState, any> {
  const definitionIdSelector  = submissionDefinitionFromIdSelector(definitionId);
  return keySelector<SubmissionState, SubmissionObjectEntry>(definitionIdSelector, 'sections', sectionId);
}

export function submissionSectionFromIdSelector(submissionId: string, sectionId: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector  = submissionObjectFromIdSelector(submissionId);
  return keySelector<SubmissionState, SubmissionObjectEntry>(submissionIdSelector, 'sections', sectionId);
}
