import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { submissionDefinitionReducer, SubmissionDefinitionState } from './definitions/submission-definitions.reducer';
import { submissionObjectReducer, SubmissionObjectState } from './objects/submission-objects.reducer';

export interface SubmissionState {
  'definitions': SubmissionDefinitionState,
  'objects': SubmissionObjectState
}

export const submissionReducers: ActionReducerMap<SubmissionState> = {
  definitions: submissionDefinitionReducer,
  objects: submissionObjectReducer,
};

export const submissionSelector = createFeatureSelector<SubmissionState>('submission');
