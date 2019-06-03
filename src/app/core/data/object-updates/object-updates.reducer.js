import { FieldChangeType, ObjectUpdatesActionTypes } from './object-updates.actions';
import { hasNoValue, hasValue } from '../../../shared/empty.util';
/**
 * Path where discarded objects are saved
 */
export var OBJECT_UPDATES_TRASH_PATH = '/trash';
/**
 * Initial state for an existing initialized field
 */
var initialFieldState = { editable: false, isNew: false, isValid: true };
/**
 * Initial state for a newly added field
 */
var initialNewFieldState = { editable: true, isNew: true, isValid: undefined };
// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
var initialState = Object.create(null);
/**
 * Reducer method to calculate the next ObjectUpdates state, based on the current state and the ObjectUpdatesAction
 * @param state The current state
 * @param action The action to perform on the current state
 */
export function objectUpdatesReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case ObjectUpdatesActionTypes.INITIALIZE_FIELDS: {
            return initializeFieldsUpdate(state, action);
        }
        case ObjectUpdatesActionTypes.ADD_FIELD: {
            return addFieldUpdate(state, action);
        }
        case ObjectUpdatesActionTypes.DISCARD: {
            return discardObjectUpdates(state, action);
        }
        case ObjectUpdatesActionTypes.REINSTATE: {
            return reinstateObjectUpdates(state, action);
        }
        case ObjectUpdatesActionTypes.REMOVE: {
            return removeObjectUpdates(state, action);
        }
        case ObjectUpdatesActionTypes.REMOVE_FIELD: {
            return removeFieldUpdate(state, action);
        }
        case ObjectUpdatesActionTypes.SET_EDITABLE_FIELD: {
            return setEditableFieldUpdate(state, action);
        }
        case ObjectUpdatesActionTypes.SET_VALID_FIELD: {
            return setValidFieldUpdate(state, action);
        }
        default: {
            return state;
        }
    }
}
/**
 * Initialize the state for a specific url and store all its fields in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function initializeFieldsUpdate(state, action) {
    var _a;
    var url = action.payload.url;
    var fields = action.payload.fields;
    var lastModifiedServer = action.payload.lastModified;
    var fieldStates = createInitialFieldStates(fields);
    var newPageState = Object.assign({}, state[url], { fieldStates: fieldStates }, { fieldUpdates: {} }, { lastModified: lastModifiedServer });
    return Object.assign({}, state, (_a = {}, _a[url] = newPageState, _a));
}
/**
 * Add a new update for a specific field to the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function addFieldUpdate(state, action) {
    var _a, _b, _c;
    var url = action.payload.url;
    var field = action.payload.field;
    var changeType = action.payload.changeType;
    var pageState = state[url] || {};
    var states = pageState.fieldStates;
    if (changeType === FieldChangeType.ADD) {
        states = Object.assign({}, (_a = {}, _a[field.uuid] = initialNewFieldState, _a), pageState.fieldStates);
    }
    var fieldUpdate = pageState.fieldUpdates[field.uuid] || {};
    var newChangeType = determineChangeType(fieldUpdate.changeType, changeType);
    fieldUpdate = Object.assign({}, { field: field, changeType: newChangeType });
    var fieldUpdates = Object.assign({}, pageState.fieldUpdates, (_b = {}, _b[field.uuid] = fieldUpdate, _b));
    var newPageState = Object.assign({}, pageState, { fieldStates: states }, { fieldUpdates: fieldUpdates });
    return Object.assign({}, state, (_c = {}, _c[url] = newPageState, _c));
}
/**
 * Discard all updates for a specific action's url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function discardObjectUpdates(state, action) {
    var _a, _b;
    var url = action.payload.url;
    var pageState = state[url];
    var newFieldStates = {};
    Object.keys(pageState.fieldStates).forEach(function (uuid) {
        var fieldState = pageState.fieldStates[uuid];
        if (!fieldState.isNew) {
            /* After discarding we don't want the reset fields to stay editable or invalid */
            newFieldStates[uuid] = Object.assign({}, fieldState, { editable: false, isValid: true });
        }
    });
    var discardedPageState = Object.assign({}, pageState, {
        fieldUpdates: {},
        fieldStates: newFieldStates
    });
    return Object.assign({}, state, (_a = {}, _a[url] = discardedPageState, _a), (_b = {}, _b[url + OBJECT_UPDATES_TRASH_PATH] = pageState, _b));
}
/**
 * Reinstate all updates for a specific action's url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function reinstateObjectUpdates(state, action) {
    var _a;
    var url = action.payload.url;
    var trashState = state[url + OBJECT_UPDATES_TRASH_PATH];
    var newState = Object.assign({}, state, (_a = {}, _a[url] = trashState, _a));
    delete newState[url + OBJECT_UPDATES_TRASH_PATH];
    return newState;
}
/**
 * Remove all updates for a specific action's url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function removeObjectUpdates(state, action) {
    var url = action.payload.url;
    return removeObjectUpdatesByURL(state, url);
}
/**
 * Remove all updates for a specific url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function removeObjectUpdatesByURL(state, url) {
    var newState = Object.assign({}, state);
    delete newState[url + OBJECT_UPDATES_TRASH_PATH];
    return newState;
}
/**
 * Discard the update for a specific action's url and field UUID in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function removeFieldUpdate(state, action) {
    var _a;
    var url = action.payload.url;
    var uuid = action.payload.uuid;
    var newPageState = state[url];
    if (hasValue(newPageState)) {
        var newUpdates = Object.assign({}, newPageState.fieldUpdates);
        if (hasValue(newUpdates[uuid])) {
            delete newUpdates[uuid];
        }
        var newFieldStates = Object.assign({}, newPageState.fieldStates);
        if (hasValue(newFieldStates[uuid])) {
            /* When resetting, make field not editable */
            if (newFieldStates[uuid].isNew) {
                /* If this field was added, just throw it away */
                delete newFieldStates[uuid];
            }
            else {
                newFieldStates[uuid] = Object.assign({}, newFieldStates[uuid], { editable: false, isValid: true });
            }
        }
        newPageState = Object.assign({}, state[url], {
            fieldUpdates: newUpdates,
            fieldStates: newFieldStates
        });
    }
    return Object.assign({}, state, (_a = {}, _a[url] = newPageState, _a));
}
/**
 * Determine the most prominent FieldChangeType, ordered as follows:
 * undefined < UPDATE < ADD < REMOVE
 * @param oldType The current type
 * @param newType The new type that should possibly override the new type
 */
function determineChangeType(oldType, newType) {
    if (hasNoValue(newType)) {
        return oldType;
    }
    if (hasNoValue(oldType)) {
        return newType;
    }
    return oldType.valueOf() > newType.valueOf() ? oldType : newType;
}
/**
 * Set the editable state of a specific action's url and uuid to false or true
 * @param state The current state
 * @param action The action to perform on the current state
 */
function setEditableFieldUpdate(state, action) {
    var _a, _b;
    var url = action.payload.url;
    var uuid = action.payload.uuid;
    var editable = action.payload.editable;
    var pageState = state[url];
    var fieldState = pageState.fieldStates[uuid];
    var newFieldState = Object.assign({}, fieldState, { editable: editable });
    var newFieldStates = Object.assign({}, pageState.fieldStates, (_a = {}, _a[uuid] = newFieldState, _a));
    var newPageState = Object.assign({}, pageState, { fieldStates: newFieldStates });
    return Object.assign({}, state, (_b = {}, _b[url] = newPageState, _b));
}
/**
 * Set the isValid state of a specific action's url and uuid to false or true
 * @param state The current state
 * @param action The action to perform on the current state
 */
function setValidFieldUpdate(state, action) {
    var _a, _b;
    var url = action.payload.url;
    var uuid = action.payload.uuid;
    var isValid = action.payload.isValid;
    var pageState = state[url];
    var fieldState = pageState.fieldStates[uuid];
    var newFieldState = Object.assign({}, fieldState, { isValid: isValid });
    var newFieldStates = Object.assign({}, pageState.fieldStates, (_a = {}, _a[uuid] = newFieldState, _a));
    var newPageState = Object.assign({}, pageState, { fieldStates: newFieldStates });
    return Object.assign({}, state, (_b = {}, _b[url] = newPageState, _b));
}
/**
 * Method to create an initial FieldStates object based on a list of Identifiable objects
 * @param fields Identifiable objects
 */
function createInitialFieldStates(fields) {
    var uuids = fields.map(function (field) { return field.uuid; });
    var fieldStates = {};
    uuids.forEach(function (uuid) { return fieldStates[uuid] = initialFieldState; });
    return fieldStates;
}
//# sourceMappingURL=object-updates.reducer.js.map