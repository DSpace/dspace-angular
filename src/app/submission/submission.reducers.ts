import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import {
  submissionDefinitionReducer,
  SubmissionDefinitionState
} from './definitions/submission-definitions.reducer';
import {
  submissionObjectReducer,
  SubmissionObjectState
} from './objects/submission-objects.reducer';

export interface SubmissionState {
  'objects': SubmissionObjectState
}

export const submissionReducers: ActionReducerMap<SubmissionState> = {
  objects: submissionObjectReducer,
};

export const submissionSelector = createFeatureSelector<SubmissionState>('submission');
