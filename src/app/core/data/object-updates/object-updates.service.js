import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { coreSelector } from '../../core.selectors';
import { OBJECT_UPDATES_TRASH_PATH } from './object-updates.reducer';
import { AddFieldUpdateAction, DiscardObjectUpdatesAction, FieldChangeType, InitializeFieldsAction, ReinstateObjectUpdatesAction, RemoveFieldUpdateAction, SetEditableFieldUpdateAction, SetValidFieldUpdateAction } from './object-updates.actions';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
function objectUpdatesStateSelector() {
    return createSelector(coreSelector, function (state) { return state['cache/object-updates']; });
}
function filterByUrlObjectUpdatesStateSelector(url) {
    return createSelector(objectUpdatesStateSelector(), function (state) { return state[url]; });
}
function filterByUrlAndUUIDFieldStateSelector(url, uuid) {
    return createSelector(filterByUrlObjectUpdatesStateSelector(url), function (state) { return state.fieldStates[uuid]; });
}
/**
 * Service that dispatches and reads from the ObjectUpdates' state in the store
 */
var ObjectUpdatesService = /** @class */ (function () {
    function ObjectUpdatesService(store) {
        this.store = store;
    }
    /**
     * Method to dispatch an InitializeFieldsAction to the store
     * @param url The page's URL for which the changes are being mapped
     * @param fields The initial fields for the page's object
     * @param lastModified The date the object was last modified
     */
    ObjectUpdatesService.prototype.initialize = function (url, fields, lastModified) {
        this.store.dispatch(new InitializeFieldsAction(url, fields, lastModified));
    };
    /**
     * Method to dispatch an AddFieldUpdateAction to the store
     * @param url The page's URL for which the changes are saved
     * @param field An updated field for the page's object
     * @param changeType The last type of change applied to this field
     */
    ObjectUpdatesService.prototype.saveFieldUpdate = function (url, field, changeType) {
        this.store.dispatch(new AddFieldUpdateAction(url, field, changeType));
    };
    /**
     * Request the ObjectUpdatesEntry state for a specific URL
     * @param url The URL to filter by
     */
    ObjectUpdatesService.prototype.getObjectEntry = function (url) {
        return this.store.pipe(select(filterByUrlObjectUpdatesStateSelector(url)));
    };
    /**
     * Request the getFieldState state for a specific URL and UUID
     * @param url The URL to filter by
     * @param uuid The field's UUID to filter by
     */
    ObjectUpdatesService.prototype.getFieldState = function (url, uuid) {
        return this.store.pipe(select(filterByUrlAndUUIDFieldStateSelector(url, uuid)));
    };
    /**
     * Method that combines the state's updates with the initial values (when there's no update) to create
     * a FieldUpdates object
     * @param url The URL of the page for which the FieldUpdates should be requested
     * @param initialFields The initial values of the fields
     */
    ObjectUpdatesService.prototype.getFieldUpdates = function (url, initialFields) {
        var objectUpdates = this.getObjectEntry(url);
        return objectUpdates.pipe(map(function (objectEntry) {
            var fieldUpdates = {};
            Object.keys(objectEntry.fieldStates).forEach(function (uuid) {
                var fieldUpdate = objectEntry.fieldUpdates[uuid];
                if (isEmpty(fieldUpdate)) {
                    var identifiable = initialFields.find(function (object) { return object.uuid === uuid; });
                    fieldUpdate = { field: identifiable, changeType: undefined };
                }
                fieldUpdates[uuid] = fieldUpdate;
            });
            return fieldUpdates;
        }));
    };
    /**
     * Method to check if a specific field is currently editable in the store
     * @param url The URL of the page on which the field resides
     * @param uuid The UUID of the field
     */
    ObjectUpdatesService.prototype.isEditable = function (url, uuid) {
        var fieldState$ = this.getFieldState(url, uuid);
        return fieldState$.pipe(filter(function (fieldState) { return hasValue(fieldState); }), map(function (fieldState) { return fieldState.editable; }), distinctUntilChanged());
    };
    /**
     * Method to check if a specific field is currently valid in the store
     * @param url The URL of the page on which the field resides
     * @param uuid The UUID of the field
     */
    ObjectUpdatesService.prototype.isValid = function (url, uuid) {
        var fieldState$ = this.getFieldState(url, uuid);
        return fieldState$.pipe(filter(function (fieldState) { return hasValue(fieldState); }), map(function (fieldState) { return fieldState.isValid; }), distinctUntilChanged());
    };
    /**
     * Method to check if a specific page is currently valid in the store
     * @param url The URL of the page
     */
    ObjectUpdatesService.prototype.isValidPage = function (url) {
        var objectUpdates = this.getObjectEntry(url);
        return objectUpdates.pipe(map(function (entry) {
            return Object.values(entry.fieldStates).findIndex(function (state) { return !state.isValid; }) < 0;
        }), distinctUntilChanged());
    };
    /**
     * Calls the saveFieldUpdate method with FieldChangeType.ADD
     * @param url The page's URL for which the changes are saved
     * @param field An updated field for the page's object
     */
    ObjectUpdatesService.prototype.saveAddFieldUpdate = function (url, field) {
        this.saveFieldUpdate(url, field, FieldChangeType.ADD);
    };
    /**
     * Calls the saveFieldUpdate method with FieldChangeType.REMOVE
     * @param url The page's URL for which the changes are saved
     * @param field An updated field for the page's object
     */
    ObjectUpdatesService.prototype.saveRemoveFieldUpdate = function (url, field) {
        this.saveFieldUpdate(url, field, FieldChangeType.REMOVE);
    };
    /**
     * Calls the saveFieldUpdate method with FieldChangeType.UPDATE
     * @param url The page's URL for which the changes are saved
     * @param field An updated field for the page's object
     */
    ObjectUpdatesService.prototype.saveChangeFieldUpdate = function (url, field) {
        this.saveFieldUpdate(url, field, FieldChangeType.UPDATE);
    };
    /**
     * Dispatches a SetEditableFieldUpdateAction to the store to set a field's editable state
     * @param url The URL of the page on which the field resides
     * @param uuid The UUID of the field that should be set
     * @param editable The new value of editable in the store for this field
     */
    ObjectUpdatesService.prototype.setEditableFieldUpdate = function (url, uuid, editable) {
        this.store.dispatch(new SetEditableFieldUpdateAction(url, uuid, editable));
    };
    /**
     * Dispatches a SetValidFieldUpdateAction to the store to set a field's isValid state
     * @param url The URL of the page on which the field resides
     * @param uuid The UUID of the field that should be set
     * @param valid The new value of isValid in the store for this field
     */
    ObjectUpdatesService.prototype.setValidFieldUpdate = function (url, uuid, valid) {
        this.store.dispatch(new SetValidFieldUpdateAction(url, uuid, valid));
    };
    /**
     * Method to dispatch an DiscardObjectUpdatesAction to the store
     * @param url The page's URL for which the changes should be discarded
     * @param undoNotification The notification which is should possibly be canceled
     */
    ObjectUpdatesService.prototype.discardFieldUpdates = function (url, undoNotification) {
        this.store.dispatch(new DiscardObjectUpdatesAction(url, undoNotification));
    };
    /**
     * Method to dispatch an ReinstateObjectUpdatesAction to the store
     * @param url The page's URL for which the changes should be reinstated
     */
    ObjectUpdatesService.prototype.reinstateFieldUpdates = function (url) {
        this.store.dispatch(new ReinstateObjectUpdatesAction(url));
    };
    /**
     * Method to dispatch an RemoveFieldUpdateAction to the store
     * @param url The page's URL for which the changes should be removed
     * @param uuid The UUID of the field that should be set
     */
    ObjectUpdatesService.prototype.removeSingleFieldUpdate = function (url, uuid) {
        this.store.dispatch(new RemoveFieldUpdateAction(url, uuid));
    };
    /**
     * Method that combines the state's updates with the initial values (when there's no update) to create
     * a list of updates fields
     * @param url The URL of the page for which the updated fields should be requested
     * @param initialFields The initial values of the fields
     */
    ObjectUpdatesService.prototype.getUpdatedFields = function (url, initialFields) {
        var objectUpdates = this.getObjectEntry(url);
        return objectUpdates.pipe(map(function (objectEntry) {
            var fields = [];
            Object.keys(objectEntry.fieldStates).forEach(function (uuid) {
                var fieldUpdate = objectEntry.fieldUpdates[uuid];
                if (hasNoValue(fieldUpdate) || fieldUpdate.changeType !== FieldChangeType.REMOVE) {
                    var field = void 0;
                    if (isNotEmpty(fieldUpdate)) {
                        field = fieldUpdate.field;
                    }
                    else {
                        field = initialFields.find(function (object) { return object.uuid === uuid; });
                    }
                    fields.push(field);
                }
            });
            return fields;
        }));
    };
    /**
     * Checks if the page currently has updates in the store or not
     * @param url The page's url to check for in the store
     */
    ObjectUpdatesService.prototype.hasUpdates = function (url) {
        return this.getObjectEntry(url).pipe(map(function (objectEntry) { return hasValue(objectEntry) && isNotEmpty(objectEntry.fieldUpdates); }));
    };
    /**
     * Checks if the page currently is reinstatable in the store or not
     * @param url The page's url to check for in the store
     */
    ObjectUpdatesService.prototype.isReinstatable = function (url) {
        return this.hasUpdates(url + OBJECT_UPDATES_TRASH_PATH);
    };
    /**
     * Request the current lastModified date stored for the updates in the store
     * @param url The page's url to check for in the store
     */
    ObjectUpdatesService.prototype.getLastModified = function (url) {
        return this.getObjectEntry(url).pipe(map(function (entry) { return entry.lastModified; }));
    };
    ObjectUpdatesService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], ObjectUpdatesService);
    return ObjectUpdatesService;
}());
export { ObjectUpdatesService };
//# sourceMappingURL=object-updates.service.js.map