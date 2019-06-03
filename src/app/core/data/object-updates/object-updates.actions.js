import { type } from '../../../shared/ngrx/type';
/**
 * The list of ObjectUpdatesAction type definitions
 */
export var ObjectUpdatesActionTypes = {
    INITIALIZE_FIELDS: type('dspace/core/cache/object-updates/INITIALIZE_FIELDS'),
    SET_EDITABLE_FIELD: type('dspace/core/cache/object-updates/SET_EDITABLE_FIELD'),
    SET_VALID_FIELD: type('dspace/core/cache/object-updates/SET_VALID_FIELD'),
    ADD_FIELD: type('dspace/core/cache/object-updates/ADD_FIELD'),
    DISCARD: type('dspace/core/cache/object-updates/DISCARD'),
    REINSTATE: type('dspace/core/cache/object-updates/REINSTATE'),
    REMOVE: type('dspace/core/cache/object-updates/REMOVE'),
    REMOVE_FIELD: type('dspace/core/cache/object-updates/REMOVE_FIELD'),
};
/* tslint:disable:max-classes-per-file */
/**
 * Enum that represents the different types of updates that can be performed on a field in the ObjectUpdates store
 */
export var FieldChangeType;
(function (FieldChangeType) {
    FieldChangeType[FieldChangeType["UPDATE"] = 0] = "UPDATE";
    FieldChangeType[FieldChangeType["ADD"] = 1] = "ADD";
    FieldChangeType[FieldChangeType["REMOVE"] = 2] = "REMOVE";
})(FieldChangeType || (FieldChangeType = {}));
/**
 * An ngrx action to initialize a new page's fields in the ObjectUpdates state
 */
var InitializeFieldsAction = /** @class */ (function () {
    /**
     * Create a new InitializeFieldsAction
     *
     * @param url
     *    the unique url of the page for which the fields are being initialized
     * @param fields The identifiable fields of which the updates are kept track of
     * @param lastModified The last modified date of the object that belongs to the page
     */
    function InitializeFieldsAction(url, fields, lastModified) {
        this.type = ObjectUpdatesActionTypes.INITIALIZE_FIELDS;
        this.payload = { url: url, fields: fields, lastModified: lastModified };
    }
    return InitializeFieldsAction;
}());
export { InitializeFieldsAction };
/**
 * An ngrx action to add a new field update in the ObjectUpdates state for a certain page url
 */
var AddFieldUpdateAction = /** @class */ (function () {
    /**
     * Create a new AddFieldUpdateAction
     *
     * @param url
     *    the unique url of the page for which a field update is added
     * @param field The identifiable field of which a new update is added
     * @param changeType The update's change type
     */
    function AddFieldUpdateAction(url, field, changeType) {
        this.type = ObjectUpdatesActionTypes.ADD_FIELD;
        this.payload = { url: url, field: field, changeType: changeType };
    }
    return AddFieldUpdateAction;
}());
export { AddFieldUpdateAction };
/**
 * An ngrx action to set the editable state of an existing field in the ObjectUpdates state for a certain page url
 */
var SetEditableFieldUpdateAction = /** @class */ (function () {
    /**
     * Create a new SetEditableFieldUpdateAction
     *
     * @param url
     *    the unique url of the page
     * @param fieldUUID The UUID of the field of which
     * @param editable The new editable value for the field
     */
    function SetEditableFieldUpdateAction(url, fieldUUID, editable) {
        this.type = ObjectUpdatesActionTypes.SET_EDITABLE_FIELD;
        this.payload = { url: url, uuid: fieldUUID, editable: editable };
    }
    return SetEditableFieldUpdateAction;
}());
export { SetEditableFieldUpdateAction };
/**
 * An ngrx action to set the isValid state of an existing field in the ObjectUpdates state for a certain page url
 */
var SetValidFieldUpdateAction = /** @class */ (function () {
    /**
     * Create a new SetValidFieldUpdateAction
     *
     * @param url
     *    the unique url of the page
     * @param fieldUUID The UUID of the field of which
     * @param isValid The new isValid value for the field
     */
    function SetValidFieldUpdateAction(url, fieldUUID, isValid) {
        this.type = ObjectUpdatesActionTypes.SET_VALID_FIELD;
        this.payload = { url: url, uuid: fieldUUID, isValid: isValid };
    }
    return SetValidFieldUpdateAction;
}());
export { SetValidFieldUpdateAction };
/**
 * An ngrx action to discard all existing updates in the ObjectUpdates state for a certain page url
 */
var DiscardObjectUpdatesAction = /** @class */ (function () {
    /**
     * Create a new DiscardObjectUpdatesAction
     *
     * @param url
     *    the unique url of the page for which the changes should be discarded
     * @param notification The notification that is raised when changes are discarded
     */
    function DiscardObjectUpdatesAction(url, notification) {
        this.type = ObjectUpdatesActionTypes.DISCARD;
        this.payload = { url: url, notification: notification };
    }
    return DiscardObjectUpdatesAction;
}());
export { DiscardObjectUpdatesAction };
/**
 * An ngrx action to reinstate all previously discarded updates in the ObjectUpdates state for a certain page url
 */
var ReinstateObjectUpdatesAction = /** @class */ (function () {
    /**
     * Create a new ReinstateObjectUpdatesAction
     *
     * @param url
     *    the unique url of the page for which the changes should be reinstated
     */
    function ReinstateObjectUpdatesAction(url) {
        this.type = ObjectUpdatesActionTypes.REINSTATE;
        this.payload = { url: url };
    }
    return ReinstateObjectUpdatesAction;
}());
export { ReinstateObjectUpdatesAction };
/**
 * An ngrx action to remove all previously discarded updates in the ObjectUpdates state for a certain page url
 */
var RemoveObjectUpdatesAction = /** @class */ (function () {
    /**
     * Create a new RemoveObjectUpdatesAction
     *
     * @param url
     *    the unique url of the page for which the changes should be removed
     */
    function RemoveObjectUpdatesAction(url) {
        this.type = ObjectUpdatesActionTypes.REMOVE;
        this.payload = { url: url };
    }
    return RemoveObjectUpdatesAction;
}());
export { RemoveObjectUpdatesAction };
/**
 * An ngrx action to remove a single field update in the ObjectUpdates state for a certain page url and field uuid
 */
var RemoveFieldUpdateAction = /** @class */ (function () {
    /**
     * Create a new RemoveObjectUpdatesAction
     *
     * @param url
     *    the unique url of the page for which a field's change should be removed
     * @param uuid The UUID of the field for which the change should be removed
     */
    function RemoveFieldUpdateAction(url, uuid) {
        this.type = ObjectUpdatesActionTypes.REMOVE_FIELD;
        this.payload = { url: url, uuid: uuid };
    }
    return RemoveFieldUpdateAction;
}());
export { RemoveFieldUpdateAction };
//# sourceMappingURL=object-updates.actions.js.map