import { hasValue, isNotEmpty, isNotNull, isUndefined } from '../../shared/empty.util';
import { differenceWith, findKey, isEqual, uniqWith } from 'lodash';
import { SubmissionObjectActionTypes } from './submission-objects.actions';
var initialState = Object.create({});
export function submissionObjectReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        // submission form actions
        case SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM: {
            return completeInit(state, action);
        }
        case SubmissionObjectActionTypes.INIT_SUBMISSION_FORM: {
            return initSubmission(state, action);
        }
        case SubmissionObjectActionTypes.RESET_SUBMISSION_FORM: {
            return resetSubmission(state, action);
        }
        case SubmissionObjectActionTypes.CANCEL_SUBMISSION_FORM: {
            return initialState;
        }
        case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM:
        case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM:
        case SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION:
        case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM: {
            return saveSubmission(state, action);
        }
        case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS:
        case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS:
        case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR:
        case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_ERROR:
        case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR: {
            return completeSave(state, action);
        }
        case SubmissionObjectActionTypes.CHANGE_SUBMISSION_COLLECTION: {
            return changeCollection(state, action);
        }
        case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION: {
            return startDeposit(state, action);
        }
        case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS: {
            return initialState;
        }
        case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR: {
            return endDeposit(state, action);
        }
        case SubmissionObjectActionTypes.DISCARD_SUBMISSION: {
            return state;
        }
        case SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS: {
            return initialState;
        }
        case SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR: {
            return state;
        }
        case SubmissionObjectActionTypes.SET_ACTIVE_SECTION: {
            return setActiveSection(state, action);
        }
        // Section actions
        case SubmissionObjectActionTypes.INIT_SECTION: {
            return initSection(state, action);
        }
        case SubmissionObjectActionTypes.ENABLE_SECTION: {
            return changeSectionState(state, action, true);
        }
        case SubmissionObjectActionTypes.UPLOAD_SECTION_DATA: {
            return updateSectionData(state, action);
        }
        case SubmissionObjectActionTypes.DISABLE_SECTION: {
            return changeSectionState(state, action, false);
        }
        case SubmissionObjectActionTypes.SECTION_STATUS_CHANGE: {
            return setIsValid(state, action);
        }
        // Files actions
        case SubmissionObjectActionTypes.NEW_FILE: {
            return newFile(state, action);
        }
        case SubmissionObjectActionTypes.EDIT_FILE_DATA: {
            return editFileData(state, action);
        }
        case SubmissionObjectActionTypes.DELETE_FILE: {
            return deleteFile(state, action);
        }
        // errors actions
        case SubmissionObjectActionTypes.ADD_SECTION_ERROR: {
            return addError(state, action);
        }
        case SubmissionObjectActionTypes.DELETE_SECTION_ERROR: {
            return removeError(state, action);
        }
        case SubmissionObjectActionTypes.REMOVE_SECTION_ERRORS: {
            return removeSectionErrors(state, action);
        }
        default: {
            return state;
        }
    }
}
// ------ Submission error functions ------ //
var removeError = function (state, action) {
    var _a, _b;
    var _c = action.payload, submissionId = _c.submissionId, sectionId = _c.sectionId, errors = _c.errors;
    if (hasValue(state[submissionId].sections[sectionId])) {
        var filteredErrors = void 0;
        if (Array.isArray(errors)) {
            filteredErrors = differenceWith(errors, errors, isEqual);
        }
        else {
            filteredErrors = state[submissionId].sections[sectionId].errors
                .filter(function (currentError) { return currentError.path !== errors.path || !isEqual(currentError, errors); });
        }
        return Object.assign({}, state, (_a = {},
            _a[submissionId] = Object.assign({}, state[submissionId], {
                sections: Object.assign({}, state[submissionId].sections, (_b = {},
                    _b[sectionId] = Object.assign({}, state[submissionId].sections[sectionId], {
                        errors: filteredErrors
                    }),
                    _b))
            }),
            _a));
    }
    else {
        return state;
    }
};
var addError = function (state, action) {
    var _a, _b;
    var _c = action.payload, submissionId = _c.submissionId, sectionId = _c.sectionId, error = _c.error;
    if (hasValue(state[submissionId].sections[sectionId])) {
        var errors = uniqWith(state[submissionId].sections[sectionId].errors.concat(error), isEqual);
        return Object.assign({}, state, (_a = {},
            _a[submissionId] = Object.assign({}, state[submissionId], {
                activeSection: state[action.payload.submissionId].activeSection, sections: Object.assign({}, state[submissionId].sections, (_b = {},
                    _b[sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                        errors: errors
                    }),
                    _b)),
            }),
            _a));
    }
    else {
        return state;
    }
};
/**
 * Remove all section's errors.
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveSectionErrorsAction
 * @return SubmissionObjectState
 *    the new state, with the section's errors updated.
 */
function removeSectionErrors(state, action) {
    var _a, _b;
    if (isNotEmpty(state[action.payload.submissionId])
        && isNotEmpty(state[action.payload.submissionId].sections[action.payload.sectionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                sections: Object.assign({}, state[action.payload.submissionId].sections, (_b = {},
                    _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                        errors: []
                    }),
                    _b))
            }),
            _a));
    }
    else {
        return state;
    }
}
// ------ Submission functions ------ //
/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSubmissionFormAction | ResetSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSubmission(state, action) {
    var newState = Object.assign({}, state);
    newState[action.payload.submissionId] = {
        collection: action.payload.collectionId,
        definition: action.payload.submissionDefinition.name,
        selfUrl: action.payload.selfUrl,
        activeSection: null,
        sections: Object.create(null),
        isLoading: true,
        savePending: false,
        depositPending: false,
    };
    return newState;
}
/**
 * Reset submission.
 *
 * @param state
 *    the current state
 * @param action
 *    an ResetSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function resetSubmission(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                sections: Object.create(null),
                isLoading: true
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set submission loading to false.
 *
 * @param state
 *    the current state
 * @param action
 *    an CompleteInitSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function completeInit(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                isLoading: false
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set submission save flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    an SaveSubmissionFormAction | SaveSubmissionSectionFormAction
 *    | SaveForLaterSubmissionFormAction | SaveAndDepositSubmissionAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to true.
 */
function saveSubmission(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                activeSection: state[action.payload.submissionId].activeSection,
                sections: state[action.payload.submissionId].sections,
                isLoading: state[action.payload.submissionId].isLoading,
                savePending: true,
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set submission save flag to false.
 *
 * @param state
 *    the current state
 * @param action
 *    an SaveSubmissionFormSuccessAction | SaveForLaterSubmissionFormSuccessAction
 *    | SaveSubmissionSectionFormSuccessAction | SaveSubmissionFormErrorAction
 *    | SaveForLaterSubmissionFormErrorAction | SaveSubmissionSectionFormErrorAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to false.
 */
function completeSave(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                savePending: false,
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set deposit flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    an DepositSubmissionAction
 * @return SubmissionObjectState
 *    the new state, with the deposit flag changed.
 */
function startDeposit(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                savePending: false,
                depositPending: true,
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set deposit flag to false
 *
 * @param state
 *    the current state
 * @param action
 *    an DepositSubmissionSuccessAction or DepositSubmissionErrorAction
 * @return SubmissionObjectState
 *    the new state, with the deposit flag changed.
 */
function endDeposit(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                depositPending: false,
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeCollection(state, action) {
    var _a;
    return Object.assign({}, state, (_a = {},
        _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
            collection: action.payload.collectionId
        }),
        _a));
}
// ------ Section functions ------ //
/**
 * Set submission active section.
 *
 * @param state
 *    the current state
 * @param action
 *    an SetActiveSectionAction
 * @return SubmissionObjectState
 *    the new state, with the active section.
 */
function setActiveSection(state, action) {
    var _a;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                activeSection: action.payload.sectionId,
                sections: state[action.payload.submissionId].sections,
                isLoading: state[action.payload.submissionId].isLoading,
                savePending: state[action.payload.submissionId].savePending,
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set a section enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSectionAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSection(state, action) {
    var _a, _b;
    if (hasValue(state[action.payload.submissionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                sections: Object.assign({}, state[action.payload.submissionId].sections, (_b = {},
                    _b[action.payload.sectionId] = {
                        header: action.payload.header,
                        config: action.payload.config,
                        mandatory: action.payload.mandatory,
                        sectionType: action.payload.sectionType,
                        visibility: action.payload.visibility,
                        collapsed: false,
                        enabled: action.payload.enabled,
                        data: action.payload.data,
                        errors: action.payload.errors || [],
                        isLoading: false,
                        isValid: false
                    },
                    _b))
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Update section's data.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateSectionDataAction
 * @return SubmissionObjectState
 *    the new state, with the section's data updated.
 */
function updateSectionData(state, action) {
    var _a, _b;
    if (isNotEmpty(state[action.payload.submissionId])
        && isNotEmpty(state[action.payload.submissionId].sections[action.payload.sectionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                sections: Object.assign({}, state[action.payload.submissionId].sections, (_b = {},
                    _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                        enabled: true,
                        data: action.payload.data,
                        errors: action.payload.errors
                    }),
                    _b))
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set a section state.
 *
 * @param state
 *    the current state
 * @param action
 *    an DisableSectionAction
 * @param enabled
 *    enabled or disabled section.
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeSectionState(state, action, enabled) {
    var _a, _b;
    if (hasValue(state[action.payload.submissionId].sections[action.payload.sectionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                // sections: deleteProperty(state[ action.payload.submissionId ].sections, action.payload.sectionId),
                sections: Object.assign({}, state[action.payload.submissionId].sections, (_b = {},
                    _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                        enabled: enabled
                    }),
                    _b))
            }),
            _a));
    }
    else {
        return state;
    }
}
/**
 * Set the section validity.
 *
 * @param state
 *    the current state
 * @param action
 *    an SectionStatusChangeAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function setIsValid(state, action) {
    var _a, _b;
    if (isNotEmpty(state[action.payload.submissionId]) && hasValue(state[action.payload.submissionId].sections[action.payload.sectionId])) {
        return Object.assign({}, state, (_a = {},
            _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                sections: Object.assign({}, state[action.payload.submissionId].sections, Object.assign({}, (_b = {},
                    _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                        isValid: action.payload.status
                    }),
                    _b)))
            }),
            _a));
    }
    else {
        return state;
    }
}
// ------ Upload file functions ------ //
/**
 * Set a new file.
 *
 * @param state
 *    the current state
 * @param action
 *    a NewUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the new file.
 */
function newFile(state, action) {
    var _a, _b;
    var filesData = state[action.payload.submissionId].sections[action.payload.sectionId].data;
    var newData;
    if (isUndefined(filesData.files)) {
        newData = {
            files: [action.payload.data]
        };
    }
    else {
        newData = filesData;
        newData.files.push(action.payload.data);
    }
    return Object.assign({}, state, (_a = {},
        _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
            sections: Object.assign({}, state[action.payload.submissionId].sections, (_b = {},
                _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                    enabled: true,
                    data: newData
                }),
                _b))
        }),
        _a));
}
/**
 * Edit a file.
 *
 * @param state
 *    the current state
 * @param action
 *    a EditFileDataAction action
 * @return SubmissionObjectState
 *    the new state, with the edited file.
 */
function editFileData(state, action) {
    var _a, _b;
    var filesData = state[action.payload.submissionId].sections[action.payload.sectionId].data;
    if (hasValue(filesData.files)) {
        var fileIndex = findKey(filesData.files, { uuid: action.payload.fileId });
        if (isNotNull(fileIndex)) {
            var newData = Array.from(filesData.files);
            newData[fileIndex] = action.payload.data;
            return Object.assign({}, state, (_a = {},
                _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                    activeSection: state[action.payload.submissionId].activeSection,
                    sections: Object.assign({}, state[action.payload.submissionId].sections, Object.assign({}, (_b = {},
                        _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                            data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                                files: newData
                            })
                        }),
                        _b))),
                    isLoading: state[action.payload.submissionId].isLoading,
                    savePending: state[action.payload.submissionId].savePending,
                }),
                _a));
        }
    }
    return state;
}
/**
 * Delete a file.
 *
 * @param state
 *    the current state
 * @param action
 *    a DeleteUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the file removed.
 */
function deleteFile(state, action) {
    var _a, _b;
    var filesData = state[action.payload.submissionId].sections[action.payload.sectionId].data;
    if (hasValue(filesData.files)) {
        var fileIndex = findKey(filesData.files, { uuid: action.payload.fileId });
        if (isNotNull(fileIndex)) {
            var newData = Array.from(filesData.files);
            newData.splice(fileIndex, 1);
            return Object.assign({}, state, (_a = {},
                _a[action.payload.submissionId] = Object.assign({}, state[action.payload.submissionId], {
                    sections: Object.assign({}, state[action.payload.submissionId].sections, Object.assign({}, (_b = {},
                        _b[action.payload.sectionId] = Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId], {
                            data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                                files: newData
                            })
                        }),
                        _b)))
                }),
                _a));
        }
    }
    return state;
}
//# sourceMappingURL=submission-objects.reducer.js.map