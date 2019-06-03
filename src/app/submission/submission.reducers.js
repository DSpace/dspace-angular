import { createFeatureSelector } from '@ngrx/store';
import { submissionObjectReducer } from './objects/submission-objects.reducer';
export var submissionReducers = {
    objects: submissionObjectReducer,
};
export var submissionSelector = createFeatureSelector('submission');
//# sourceMappingURL=submission.reducers.js.map