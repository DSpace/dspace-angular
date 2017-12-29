import { createSelector, MemoizedSelector, Selector } from '@ngrx/store';

import { hasValue } from '../shared/empty.util';
import { submissionSelector, SubmissionState } from './submission.reducers';
import {
  SubmissionSectionEntry, SubmissionObjectEntry,
  SubmissionUploadFileEntry, SubmissionSectionObject
} from './objects/submission-objects.reducer';
import { SectionObjectEntry, SubmissionDefinitionEntry } from './definitions/submission-definitions.reducer';

// @TODO: Merge with keySelector function present in 'src/app/core/shared/selectors.ts'
export function keySelector<T, V>(parentSelector: Selector<any, any>, subState: string, key: string): MemoizedSelector<T, V> {
  return createSelector(parentSelector, (state: T) => {
    if (hasValue(state) && hasValue(state[subState])) {
      return state[subState][key];
    } else {
      return undefined;
    }
  });
}

export function subStateSelector<T, V>(parentSelector: Selector<any, any>, subState: string): MemoizedSelector<T, V> {
  return createSelector(parentSelector, (state: T) => {
    if (hasValue(state) && hasValue(state[subState])) {
      return state[subState];
    } else {
      return undefined;
    }
  });
}

export function submissionObjectFromIdSelector(submissionId: string): MemoizedSelector<SubmissionState, SubmissionObjectEntry> {
  return keySelector<SubmissionState, SubmissionObjectEntry>(submissionSelector, 'objects', submissionId);
}

export function submissionObjectSectionsFromIdSelector(submissionId: string): MemoizedSelector<SubmissionState, SubmissionObjectEntry> {
  const submissionObjectSelector = submissionObjectFromIdSelector(submissionId);
  return subStateSelector<SubmissionState, SubmissionObjectEntry>(submissionObjectSelector, 'sections');
}

export function submissionDefinitionFromIdSelector(definitionId: string): MemoizedSelector<SubmissionState, SubmissionDefinitionEntry> {
  return keySelector<SubmissionState, SubmissionDefinitionEntry>(submissionSelector, 'definitions', definitionId);
}

export function submissionUploadedFilesFromIdSelector(submissionId: string, sectionId: string): MemoizedSelector<SubmissionState, any> {
  const sectionDataSelector = submissionSectionDataFromIdSelector(submissionId, sectionId);
  return subStateSelector<SubmissionState, SubmissionObjectEntry>(sectionDataSelector, 'files');
}

export function submissionUploadedFileFromUuidSelector(submissionId: string, sectionId: string, uuid: string): MemoizedSelector<SubmissionState, any> {
  const filesSelector  = submissionSectionDataFromIdSelector(submissionId, sectionId);
  return keySelector<SubmissionState, any>(filesSelector, 'files', uuid);
}

export function sectionDefinitionFromIdSelector(definitionId: string, sectionId: string): MemoizedSelector<SubmissionState, any> {
  const definitionIdSelector  = submissionDefinitionFromIdSelector(definitionId);
  return keySelector<SubmissionState, SubmissionObjectEntry>(definitionIdSelector, 'sections', sectionId);
}

export function submissionSectionFromIdSelector(submissionId: string, sectionId: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector  = submissionObjectFromIdSelector(submissionId);
  return keySelector<SubmissionState, SubmissionObjectEntry>(submissionIdSelector, 'sections', sectionId);
}

export function submissionSectionDataFromIdSelector(submissionId: string, sectionId: string): MemoizedSelector<SubmissionState, any> {
  const submissionIdSelector  = submissionSectionFromIdSelector(submissionId, sectionId);
  return subStateSelector<SubmissionState, SubmissionSectionObject>(submissionIdSelector, 'data');
}
