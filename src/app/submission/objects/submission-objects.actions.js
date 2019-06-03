import { type } from '../../shared/ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var SubmissionObjectActionTypes = {
    // Section types
    INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
    RESET_SUBMISSION_FORM: type('dspace/submission/RESET_SUBMISSION_FORM'),
    CANCEL_SUBMISSION_FORM: type('dspace/submission/CANCEL_SUBMISSION_FORM'),
    COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
    SAVE_FOR_LATER_SUBMISSION_FORM: type('dspace/submission/SAVE_FOR_LATER_SUBMISSION_FORM'),
    SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS: type('dspace/submission/SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS'),
    SAVE_FOR_LATER_SUBMISSION_FORM_ERROR: type('dspace/submission/SAVE_FOR_LATER_SUBMISSION_FORM_ERROR'),
    SAVE_SUBMISSION_FORM: type('dspace/submission/SAVE_SUBMISSION_FORM'),
    SAVE_SUBMISSION_FORM_SUCCESS: type('dspace/submission/SAVE_SUBMISSION_FORM_SUCCESS'),
    SAVE_SUBMISSION_FORM_ERROR: type('dspace/submission/SAVE_SUBMISSION_FORM_ERROR'),
    SAVE_SUBMISSION_SECTION_FORM: type('dspace/submission/SAVE_SUBMISSION_SECTION_FORM'),
    SAVE_SUBMISSION_SECTION_FORM_SUCCESS: type('dspace/submission/SAVE_SUBMISSION_SECTION_FORM_SUCCESS'),
    SAVE_SUBMISSION_SECTION_FORM_ERROR: type('dspace/submission/SAVE_SUBMISSION_SECTION_FORM_ERROR'),
    CHANGE_SUBMISSION_COLLECTION: type('dspace/submission/CHANGE_SUBMISSION_COLLECTION'),
    SET_ACTIVE_SECTION: type('dspace/submission/SET_ACTIVE_SECTION'),
    INIT_SECTION: type('dspace/submission/INIT_SECTION'),
    ENABLE_SECTION: type('dspace/submission/ENABLE_SECTION'),
    DISABLE_SECTION: type('dspace/submission/DISABLE_SECTION'),
    SECTION_STATUS_CHANGE: type('dspace/submission/SECTION_STATUS_CHANGE'),
    SECTION_LOADING_STATUS_CHANGE: type('dspace/submission/SECTION_LOADING_STATUS_CHANGE'),
    UPLOAD_SECTION_DATA: type('dspace/submission/UPLOAD_SECTION_DATA'),
    SAVE_AND_DEPOSIT_SUBMISSION: type('dspace/submission/SAVE_AND_DEPOSIT_SUBMISSION'),
    DEPOSIT_SUBMISSION: type('dspace/submission/DEPOSIT_SUBMISSION'),
    DEPOSIT_SUBMISSION_SUCCESS: type('dspace/submission/DEPOSIT_SUBMISSION_SUCCESS'),
    DEPOSIT_SUBMISSION_ERROR: type('dspace/submission/DEPOSIT_SUBMISSION_ERROR'),
    DISCARD_SUBMISSION: type('dspace/submission/DISCARD_SUBMISSION'),
    DISCARD_SUBMISSION_SUCCESS: type('dspace/submission/DISCARD_SUBMISSION_SUCCESS'),
    DISCARD_SUBMISSION_ERROR: type('dspace/submission/DISCARD_SUBMISSION_ERROR'),
    // Upload file types
    NEW_FILE: type('dspace/submission/NEW_FILE'),
    EDIT_FILE_DATA: type('dspace/submission/EDIT_FILE_DATA'),
    DELETE_FILE: type('dspace/submission/DELETE_FILE'),
    // Errors
    ADD_SECTION_ERROR: type('dspace/submission/ADD_SECTION_ERROR'),
    DELETE_SECTION_ERROR: type('dspace/submission/DELETE_SECTION_ERROR'),
    REMOVE_SECTION_ERRORS: type('dspace/submission/REMOVE_SECTION_ERRORS'),
};
/* tslint:disable:max-classes-per-file */
/**
 * Insert a new error of type SubmissionSectionError into the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {SubmissionSectionError} error
 */
var InertSectionErrorsAction = /** @class */ (function () {
    function InertSectionErrorsAction(submissionId, sectionId, error) {
        this.type = SubmissionObjectActionTypes.ADD_SECTION_ERROR;
        this.payload = { submissionId: submissionId, sectionId: sectionId, error: error };
    }
    return InertSectionErrorsAction;
}());
export { InertSectionErrorsAction };
/**
 * Delete a SubmissionSectionError from the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {string | SubmissionSectionError} error
 */
var DeleteSectionErrorsAction = /** @class */ (function () {
    function DeleteSectionErrorsAction(submissionId, sectionId, errors) {
        this.type = SubmissionObjectActionTypes.DELETE_SECTION_ERROR;
        this.payload = { submissionId: submissionId, sectionId: sectionId, errors: errors };
    }
    return DeleteSectionErrorsAction;
}());
export { DeleteSectionErrorsAction };
// Section actions
var InitSectionAction = /** @class */ (function () {
    /**
     * Create a new InitSectionAction
     *
     * @param submissionId
     *    the submission's ID to remove
     * @param sectionId
     *    the section's ID to add
     * @param header
     *    the section's header
     * @param config
     *    the section's config
     * @param mandatory
     *    the section's mandatory
     * @param sectionType
     *    the section's type
     * @param visibility
     *    the section's visibility
     * @param enabled
     *    the section's enabled state
     * @param data
     *    the section's data
     * @param errors
     *    the section's errors
     */
    function InitSectionAction(submissionId, sectionId, header, config, mandatory, sectionType, visibility, enabled, data, errors) {
        this.type = SubmissionObjectActionTypes.INIT_SECTION;
        this.payload = { submissionId: submissionId, sectionId: sectionId, header: header, config: config, mandatory: mandatory, sectionType: sectionType, visibility: visibility, enabled: enabled, data: data, errors: errors };
    }
    return InitSectionAction;
}());
export { InitSectionAction };
var EnableSectionAction = /** @class */ (function () {
    /**
     * Create a new EnableSectionAction
     *
     * @param submissionId
     *    the submission's ID to remove
     * @param sectionId
     *    the section's ID to add
     */
    function EnableSectionAction(submissionId, sectionId) {
        this.type = SubmissionObjectActionTypes.ENABLE_SECTION;
        this.payload = { submissionId: submissionId, sectionId: sectionId };
    }
    return EnableSectionAction;
}());
export { EnableSectionAction };
var DisableSectionAction = /** @class */ (function () {
    /**
     * Create a new DisableSectionAction
     *
     * @param submissionId
     *    the submission's ID to remove
     * @param sectionId
     *    the section's ID to remove
     */
    function DisableSectionAction(submissionId, sectionId) {
        this.type = SubmissionObjectActionTypes.DISABLE_SECTION;
        this.payload = { submissionId: submissionId, sectionId: sectionId };
    }
    return DisableSectionAction;
}());
export { DisableSectionAction };
var UpdateSectionDataAction = /** @class */ (function () {
    /**
     * Create a new EnableSectionAction
     *
     * @param submissionId
     *    the submission's ID to remove
     * @param sectionId
     *    the section's ID to add
     * @param data
     *    the section's data
     * @param errors
     *    the section's errors
     */
    function UpdateSectionDataAction(submissionId, sectionId, data, errors) {
        this.type = SubmissionObjectActionTypes.UPLOAD_SECTION_DATA;
        this.payload = { submissionId: submissionId, sectionId: sectionId, data: data, errors: errors };
    }
    return UpdateSectionDataAction;
}());
export { UpdateSectionDataAction };
var RemoveSectionErrorsAction = /** @class */ (function () {
    /**
     * Create a new RemoveSectionErrorsAction
     *
     * @param submissionId
     *    the submission's ID to remove
     * @param sectionId
     *    the section's ID to add
     */
    function RemoveSectionErrorsAction(submissionId, sectionId) {
        this.type = SubmissionObjectActionTypes.REMOVE_SECTION_ERRORS;
        this.payload = { submissionId: submissionId, sectionId: sectionId };
    }
    return RemoveSectionErrorsAction;
}());
export { RemoveSectionErrorsAction };
// Submission actions
var CompleteInitSubmissionFormAction = /** @class */ (function () {
    /**
     * Create a new CompleteInitSubmissionFormAction
     *
     * @param submissionId
     *    the submission's ID
     */
    function CompleteInitSubmissionFormAction(submissionId) {
        this.type = SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM;
        this.payload = { submissionId: submissionId };
    }
    return CompleteInitSubmissionFormAction;
}());
export { CompleteInitSubmissionFormAction };
var InitSubmissionFormAction = /** @class */ (function () {
    /**
     * Create a new InitSubmissionFormAction
     *
     * @param collectionId
     *    the collection's Id where to deposit
     * @param submissionId
     *    the submission's ID
     * @param selfUrl
     *    the submission object url
     * @param submissionDefinition
     *    the submission's sections definition
     * @param sections
     *    the submission's sections
     * @param errors
     *    the submission's sections errors
     */
    function InitSubmissionFormAction(collectionId, submissionId, selfUrl, submissionDefinition, sections, errors) {
        this.type = SubmissionObjectActionTypes.INIT_SUBMISSION_FORM;
        this.payload = { collectionId: collectionId, submissionId: submissionId, selfUrl: selfUrl, submissionDefinition: submissionDefinition, sections: sections, errors: errors };
    }
    return InitSubmissionFormAction;
}());
export { InitSubmissionFormAction };
var SaveForLaterSubmissionFormAction = /** @class */ (function () {
    /**
     * Create a new SaveForLaterSubmissionFormAction
     *
     * @param submissionId
     *    the submission's ID
     */
    function SaveForLaterSubmissionFormAction(submissionId) {
        this.type = SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM;
        this.payload = { submissionId: submissionId };
    }
    return SaveForLaterSubmissionFormAction;
}());
export { SaveForLaterSubmissionFormAction };
var SaveForLaterSubmissionFormSuccessAction = /** @class */ (function () {
    /**
     * Create a new SaveForLaterSubmissionFormSuccessAction
     *
     * @param submissionId
     *    the submission's ID
     * @param submissionObject
     *    the submission's Object
     */
    function SaveForLaterSubmissionFormSuccessAction(submissionId, submissionObject) {
        this.type = SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS;
        this.payload = { submissionId: submissionId, submissionObject: submissionObject };
    }
    return SaveForLaterSubmissionFormSuccessAction;
}());
export { SaveForLaterSubmissionFormSuccessAction };
var SaveForLaterSubmissionFormErrorAction = /** @class */ (function () {
    /**
     * Create a new SaveForLaterSubmissionFormErrorAction
     *
     * @param submissionId
     *    the submission's ID
     */
    function SaveForLaterSubmissionFormErrorAction(submissionId) {
        this.type = SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_ERROR;
        this.payload = { submissionId: submissionId };
    }
    return SaveForLaterSubmissionFormErrorAction;
}());
export { SaveForLaterSubmissionFormErrorAction };
var SaveSubmissionFormAction = /** @class */ (function () {
    /**
     * Create a new SaveSubmissionFormAction
     *
     * @param submissionId
     *    the submission's ID
     */
    function SaveSubmissionFormAction(submissionId) {
        this.type = SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM;
        this.payload = { submissionId: submissionId };
    }
    return SaveSubmissionFormAction;
}());
export { SaveSubmissionFormAction };
var SaveSubmissionFormSuccessAction = /** @class */ (function () {
    /**
     * Create a new SaveSubmissionFormSuccessAction
     *
     * @param submissionId
     *    the submission's ID
     * @param submissionObject
     *    the submission's Object
     */
    function SaveSubmissionFormSuccessAction(submissionId, submissionObject) {
        this.type = SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS;
        this.payload = { submissionId: submissionId, submissionObject: submissionObject };
    }
    return SaveSubmissionFormSuccessAction;
}());
export { SaveSubmissionFormSuccessAction };
var SaveSubmissionFormErrorAction = /** @class */ (function () {
    /**
     * Create a new SaveSubmissionFormErrorAction
     *
     * @param submissionId
     *    the submission's ID
     */
    function SaveSubmissionFormErrorAction(submissionId) {
        this.type = SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR;
        this.payload = { submissionId: submissionId };
    }
    return SaveSubmissionFormErrorAction;
}());
export { SaveSubmissionFormErrorAction };
var SaveSubmissionSectionFormAction = /** @class */ (function () {
    /**
     * Create a new SaveSubmissionSectionFormAction
     *
     * @param submissionId
     *    the submission's ID
     * @param sectionId
     *    the section's ID
     */
    function SaveSubmissionSectionFormAction(submissionId, sectionId) {
        this.type = SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM;
        this.payload = { submissionId: submissionId, sectionId: sectionId };
    }
    return SaveSubmissionSectionFormAction;
}());
export { SaveSubmissionSectionFormAction };
var SaveSubmissionSectionFormSuccessAction = /** @class */ (function () {
    /**
     * Create a new SaveSubmissionSectionFormSuccessAction
     *
     * @param submissionId
     *    the submission's ID
     * @param submissionObject
     *    the submission's Object
     */
    function SaveSubmissionSectionFormSuccessAction(submissionId, submissionObject) {
        this.type = SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS;
        this.payload = { submissionId: submissionId, submissionObject: submissionObject };
    }
    return SaveSubmissionSectionFormSuccessAction;
}());
export { SaveSubmissionSectionFormSuccessAction };
var SaveSubmissionSectionFormErrorAction = /** @class */ (function () {
    /**
     * Create a new SaveSubmissionFormErrorAction
     *
     * @param submissionId
     *    the submission's ID
     */
    function SaveSubmissionSectionFormErrorAction(submissionId) {
        this.type = SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR;
        this.payload = { submissionId: submissionId };
    }
    return SaveSubmissionSectionFormErrorAction;
}());
export { SaveSubmissionSectionFormErrorAction };
var ResetSubmissionFormAction = /** @class */ (function () {
    /**
     * Create a new ResetSubmissionFormAction
     *
     * @param collectionId
     *    the collection's Id where to deposit
     * @param submissionId
     *    the submission's ID
     * @param selfUrl
     *    the submission object url
     * @param sections
     *    the submission's sections
     * @param submissionDefinition
     *    the submission's form definition
     */
    function ResetSubmissionFormAction(collectionId, submissionId, selfUrl, sections, submissionDefinition) {
        this.type = SubmissionObjectActionTypes.RESET_SUBMISSION_FORM;
        this.payload = { collectionId: collectionId, submissionId: submissionId, selfUrl: selfUrl, sections: sections, submissionDefinition: submissionDefinition };
    }
    return ResetSubmissionFormAction;
}());
export { ResetSubmissionFormAction };
var CancelSubmissionFormAction = /** @class */ (function () {
    function CancelSubmissionFormAction() {
        this.type = SubmissionObjectActionTypes.CANCEL_SUBMISSION_FORM;
    }
    return CancelSubmissionFormAction;
}());
export { CancelSubmissionFormAction };
var ChangeSubmissionCollectionAction = /** @class */ (function () {
    /**
     * Create a new ChangeSubmissionCollectionAction
     *
     * @param submissionId
     *    the submission's ID
     * @param collectionId
     *    the new collection's ID
     */
    function ChangeSubmissionCollectionAction(submissionId, collectionId) {
        this.type = SubmissionObjectActionTypes.CHANGE_SUBMISSION_COLLECTION;
        this.payload = { submissionId: submissionId, collectionId: collectionId };
    }
    return ChangeSubmissionCollectionAction;
}());
export { ChangeSubmissionCollectionAction };
var SaveAndDepositSubmissionAction = /** @class */ (function () {
    /**
     * Create a new SaveAndDepositSubmissionAction
     *
     * @param submissionId
     *    the submission's ID to deposit
     */
    function SaveAndDepositSubmissionAction(submissionId) {
        this.type = SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION;
        this.payload = { submissionId: submissionId };
    }
    return SaveAndDepositSubmissionAction;
}());
export { SaveAndDepositSubmissionAction };
var DepositSubmissionAction = /** @class */ (function () {
    /**
     * Create a new DepositSubmissionAction
     *
     * @param submissionId
     *    the submission's ID to deposit
     */
    function DepositSubmissionAction(submissionId) {
        this.type = SubmissionObjectActionTypes.DEPOSIT_SUBMISSION;
        this.payload = { submissionId: submissionId };
    }
    return DepositSubmissionAction;
}());
export { DepositSubmissionAction };
var DepositSubmissionSuccessAction = /** @class */ (function () {
    /**
     * Create a new DepositSubmissionSuccessAction
     *
     * @param submissionId
     *    the submission's ID to deposit
     */
    function DepositSubmissionSuccessAction(submissionId) {
        this.type = SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS;
        this.payload = { submissionId: submissionId };
    }
    return DepositSubmissionSuccessAction;
}());
export { DepositSubmissionSuccessAction };
var DepositSubmissionErrorAction = /** @class */ (function () {
    /**
     * Create a new DepositSubmissionErrorAction
     *
     * @param submissionId
     *    the submission's ID to deposit
     */
    function DepositSubmissionErrorAction(submissionId) {
        this.type = SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR;
        this.payload = { submissionId: submissionId };
    }
    return DepositSubmissionErrorAction;
}());
export { DepositSubmissionErrorAction };
var DiscardSubmissionAction = /** @class */ (function () {
    /**
     * Create a new DiscardSubmissionAction
     *
     * @param submissionId
     *    the submission's ID to discard
     */
    function DiscardSubmissionAction(submissionId) {
        this.type = SubmissionObjectActionTypes.DISCARD_SUBMISSION;
        this.payload = { submissionId: submissionId };
    }
    return DiscardSubmissionAction;
}());
export { DiscardSubmissionAction };
var DiscardSubmissionSuccessAction = /** @class */ (function () {
    /**
     * Create a new DiscardSubmissionSuccessAction
     *
     * @param submissionId
     *    the submission's ID to discard
     */
    function DiscardSubmissionSuccessAction(submissionId) {
        this.type = SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS;
        this.payload = { submissionId: submissionId };
    }
    return DiscardSubmissionSuccessAction;
}());
export { DiscardSubmissionSuccessAction };
var DiscardSubmissionErrorAction = /** @class */ (function () {
    /**
     * Create a new DiscardSubmissionErrorAction
     *
     * @param submissionId
     *    the submission's ID to discard
     */
    function DiscardSubmissionErrorAction(submissionId) {
        this.type = SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR;
        this.payload = { submissionId: submissionId };
    }
    return DiscardSubmissionErrorAction;
}());
export { DiscardSubmissionErrorAction };
var SectionStatusChangeAction = /** @class */ (function () {
    /**
     * Change the section validity status
     *
     * @param submissionId
     *    the submission's ID
     * @param sectionId
     *    the section's ID to change
     * @param status
     *    the section validity status (true if is valid)
     */
    function SectionStatusChangeAction(submissionId, sectionId, status) {
        this.type = SubmissionObjectActionTypes.SECTION_STATUS_CHANGE;
        this.payload = { submissionId: submissionId, sectionId: sectionId, status: status };
    }
    return SectionStatusChangeAction;
}());
export { SectionStatusChangeAction };
var SetActiveSectionAction = /** @class */ (function () {
    /**
     * Create a new SetActiveSectionAction
     *
     * @param submissionId
     *    the submission's ID
     * @param sectionId
     *    the section's ID to active
     */
    function SetActiveSectionAction(submissionId, sectionId) {
        this.type = SubmissionObjectActionTypes.SET_ACTIVE_SECTION;
        this.payload = { submissionId: submissionId, sectionId: sectionId };
    }
    return SetActiveSectionAction;
}());
export { SetActiveSectionAction };
// Upload file actions
var NewUploadedFileAction = /** @class */ (function () {
    /**
     * Add a new uploaded file
     *
     * @param submissionId
     *    the submission's ID
     * @param sectionId
     *    the section's ID
     * @param fileId
     *    the file's ID
     * @param data
     *    the metadata of the new bitstream
     */
    function NewUploadedFileAction(submissionId, sectionId, fileId, data) {
        this.type = SubmissionObjectActionTypes.NEW_FILE;
        this.payload = { submissionId: submissionId, sectionId: sectionId, fileId: fileId, data: data };
    }
    return NewUploadedFileAction;
}());
export { NewUploadedFileAction };
var EditFileDataAction = /** @class */ (function () {
    /**
     * Edit a file data
     *
     * @param submissionId
     *    the submission's ID
     * @param sectionId
     *    the section's ID
     * @param fileId
     *    the file's ID
     * @param data
     *    the metadata of the new bitstream
     */
    function EditFileDataAction(submissionId, sectionId, fileId, data) {
        this.type = SubmissionObjectActionTypes.EDIT_FILE_DATA;
        this.payload = { submissionId: submissionId, sectionId: sectionId, fileId: fileId, data: data };
    }
    return EditFileDataAction;
}());
export { EditFileDataAction };
var DeleteUploadedFileAction = /** @class */ (function () {
    /**
     * Delete a uploaded file
     *
     * @param submissionId
     *    the submission's ID
     * @param sectionId
     *    the section's ID
     * @param fileId
     *    the file's ID
     */
    function DeleteUploadedFileAction(submissionId, sectionId, fileId) {
        this.type = SubmissionObjectActionTypes.DELETE_FILE;
        this.payload = { submissionId: submissionId, sectionId: sectionId, fileId: fileId };
    }
    return DeleteUploadedFileAction;
}());
export { DeleteUploadedFileAction };
//# sourceMappingURL=submission-objects.actions.js.map