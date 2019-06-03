import { createSelector } from '@ngrx/store';
import { hasValue } from '../shared/empty.util';
import { submissionSelector } from './submission.reducers';
/**
 * Export a function to return a subset of the state by key
 */
export function keySelector(parentSelector, subState, key) {
    return createSelector(parentSelector, function (state) {
        if (hasValue(state) && hasValue(state[subState])) {
            return state[subState][key];
        }
        else {
            return undefined;
        }
    });
}
/**
 * Export a function to return a subset of the state
 */
export function subStateSelector(parentSelector, subState) {
    return createSelector(parentSelector, function (state) {
        if (hasValue(state) && hasValue(state[subState])) {
            return state[subState];
        }
        else {
            return undefined;
        }
    });
}
export function submissionObjectFromIdSelector(submissionId) {
    return keySelector(submissionSelector, 'objects', submissionId);
}
export function submissionObjectSectionsFromIdSelector(submissionId) {
    var submissionObjectSelector = submissionObjectFromIdSelector(submissionId);
    return subStateSelector(submissionObjectSelector, 'sections');
}
export function submissionUploadedFilesFromIdSelector(submissionId, sectionId) {
    var sectionDataSelector = submissionSectionDataFromIdSelector(submissionId, sectionId);
    return subStateSelector(sectionDataSelector, 'files');
}
export function submissionUploadedFileFromUuidSelector(submissionId, sectionId, uuid) {
    var filesSelector = submissionSectionDataFromIdSelector(submissionId, sectionId);
    return keySelector(filesSelector, 'files', uuid);
}
export function submissionSectionFromIdSelector(submissionId, sectionId) {
    var submissionIdSelector = submissionObjectFromIdSelector(submissionId);
    return keySelector(submissionIdSelector, 'sections', sectionId);
}
export function submissionSectionDataFromIdSelector(submissionId, sectionId) {
    var submissionIdSelector = submissionSectionFromIdSelector(submissionId, sectionId);
    return subStateSelector(submissionIdSelector, 'data');
}
export function submissionSectionErrorsFromIdSelector(submissionId, sectionId) {
    var submissionIdSelector = submissionSectionFromIdSelector(submissionId, sectionId);
    return subStateSelector(submissionIdSelector, 'errors');
}
//# sourceMappingURL=selectors.js.map