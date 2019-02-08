import {
  AddFieldUpdateAction,
  DiscardObjectUpdatesAction,
  FieldChangeType,
  InitializeFieldsAction,
  ObjectUpdatesAction,
  ObjectUpdatesActionTypes,
  ReinstateObjectUpdatesAction,
  RemoveFieldUpdateAction,
  RemoveObjectUpdatesAction, SetEditableFieldUpdateAction
} from './object-updates.actions';
import { hasNoValue, hasValue } from '../../../shared/empty.util';

export const OBJECT_UPDATES_TRASH_PATH = '/trash';

export interface FieldState {
  editable: boolean,
  isNew: boolean
}

export interface FieldStates {
  [uuid: string]: FieldState;
}

export interface Identifiable {
  uuid: string
}

export interface FieldUpdate {
  field: Identifiable,
  changeType: FieldChangeType
}

export interface FieldUpdates {
  [uuid: string]: FieldUpdate;
}

export interface ObjectUpdatesEntry {
  fieldStates: FieldStates;
  fieldUpdates: FieldUpdates
  lastModified: Date;
  // lastUpdate: Date;
}

export interface ObjectUpdatesState {
  [url: string]: ObjectUpdatesEntry;
}

const initialFieldState = { editable: false, isNew: false };
const initialNewFieldState = { editable: true, isNew: true };

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export function objectUpdatesReducer(state = initialState, action: ObjectUpdatesAction): ObjectUpdatesState {
  let newState = state;
  switch (action.type) {
    case ObjectUpdatesActionTypes.INITIALIZE_FIELDS: {
      newState = initializeFieldsUpdate(state, action as InitializeFieldsAction);
      break;
    }
    case ObjectUpdatesActionTypes.ADD_FIELD: {
      newState = addFieldUpdate(state, action as AddFieldUpdateAction);
      break;
    }
    case ObjectUpdatesActionTypes.DISCARD: {
      newState = discardObjectUpdates(state, action as DiscardObjectUpdatesAction);
      break;
    }
    case ObjectUpdatesActionTypes.REINSTATE: {
      newState = reinstateObjectUpdates(state, action as ReinstateObjectUpdatesAction);
      break;
    }
    case ObjectUpdatesActionTypes.REMOVE: {
      newState = removeObjectUpdates(state, action as RemoveObjectUpdatesAction);
      break;
    }
    case ObjectUpdatesActionTypes.REMOVE_FIELD: {
      newState = removeFieldUpdate(state, action as RemoveFieldUpdateAction);
      break;
    }
    case ObjectUpdatesActionTypes.SET_EDITABLE_FIELD: {
      // return directly, no need to change the lastModified date
      return setEditableFieldUpdate(state, action as SetEditableFieldUpdateAction);
    }
    default: {
      return state;
    }
  }
  // return setUpdated(newState, action.payload.url);
  return newState;
}

function initializeFieldsUpdate(state: any, action: InitializeFieldsAction) {
  const url: string = action.payload.url;
  const fields: Identifiable[] = action.payload.fields;
  const lastModifiedServer: Date = action.payload.lastModified;
  const fieldStates = createInitialFieldStates(fields);
  const newPageState = Object.assign(
    {},
    state[url],
    { fieldStates: fieldStates },
    { fieldUpdates: {} },
    { lastServerUpdate: lastModifiedServer }
  );
  return Object.assign({}, state, { [url]: newPageState });
}

function addFieldUpdate(state: any, action: AddFieldUpdateAction) {
  const url: string = action.payload.url;
  const field: Identifiable = action.payload.field;
  const changeType: FieldChangeType = action.payload.changeType;
  const pageState: ObjectUpdatesEntry = state[url] || {};

  let states = pageState.fieldStates;
  if (changeType === FieldChangeType.ADD) {
    states = Object.assign({}, { [field.uuid]: initialNewFieldState }, pageState.fieldStates)
  }

  let fieldUpdate: any = pageState.fieldUpdates[field.uuid] || {};
  const newChangeType = determineChangeType(fieldUpdate.changeType, changeType);

  fieldUpdate = Object.assign({}, { field, changeType: newChangeType });

  const fieldUpdates = Object.assign({}, pageState.fieldUpdates, { [field.uuid]: fieldUpdate });

  const newPageState = Object.assign({}, pageState,
    { fieldStates: states },
    { fieldUpdates: fieldUpdates });
  return Object.assign({}, state, { [url]: newPageState });
}

function discardObjectUpdates(state: any, action: DiscardObjectUpdatesAction) {
  const url: string = action.payload.url;
  const pageState: ObjectUpdatesEntry = state[url];
  const newFieldStates = {};
  Object.keys(pageState.fieldStates).forEach((uuid: string) => {
    const fieldState: FieldState = pageState.fieldStates[uuid];
    if (!fieldState.isNew) {
      /* After discarding we don't want the reset fields to stay editable */
      newFieldStates[uuid] = Object.assign({}, fieldState, { editable: false });
    }
  });

  const discardedPageState = Object.assign({}, pageState, {
    fieldUpdates: {},
    fieldStates: newFieldStates
  });
  return Object.assign({}, state, { [url]: discardedPageState }, { [url + OBJECT_UPDATES_TRASH_PATH]: pageState });
}

function reinstateObjectUpdates(state: any, action: ReinstateObjectUpdatesAction) {
  const url: string = action.payload.url;
  const trashState = state[url + OBJECT_UPDATES_TRASH_PATH];

  const newState = Object.assign({}, state, { [url]: trashState });
  delete newState[url + OBJECT_UPDATES_TRASH_PATH];
  return newState;
}

function removeObjectUpdates(state: any, action: RemoveObjectUpdatesAction) {
  const url: string = action.payload.url;
  return removeObjectUpdatesByURL(state, url);
}

function removeObjectUpdatesByURL(state: any, url: string) {
  const newState = Object.assign({}, state);
  delete newState[url + OBJECT_UPDATES_TRASH_PATH];
  return newState;
}

function removeFieldUpdate(state: any, action: RemoveFieldUpdateAction) {
  const url: string = action.payload.url;
  const uuid: string = action.payload.uuid;
  let newPageState: ObjectUpdatesEntry = state[url];
  if (hasValue(newPageState)) {
    const newUpdates: FieldUpdates = Object.assign({}, newPageState.fieldUpdates);
    if (hasValue(newUpdates[uuid])) {
      delete newUpdates[uuid];
    }
    const newFieldStates: FieldStates = Object.assign({}, newPageState.fieldStates);
    if (hasValue(newFieldStates[uuid])) {
      /* When resetting, make field not editable */
      if (newFieldStates[uuid].isNew) {
        /* If this field was added, just throw it away */
        delete newFieldStates[uuid];
      } else {
        newFieldStates[uuid] = Object.assign({}, newFieldStates[uuid], { editable: false });
      }
    }
    newPageState = Object.assign({}, state[url], {
      fieldUpdates: newUpdates,
      fieldStates: newFieldStates
    });
  }
  return Object.assign({}, state, { [url]: newPageState });
}

function setUpdated(state: any, url: string) {
  const newPageState = Object.assign({}, state[url] || {}, { lastUpdated: Date.now() });
  return Object.assign({}, state, { [url]: newPageState });
}

function determineChangeType(oldType: FieldChangeType, newType: FieldChangeType): FieldChangeType {
  if (hasNoValue(newType)) {
    return oldType;
  }
  if (hasNoValue(oldType)) {
    return newType;
  }
  return oldType.valueOf() > newType.valueOf() ? oldType : newType;
}

function setEditableFieldUpdate(state: any, action: SetEditableFieldUpdateAction) {
  const url: string = action.payload.url;
  const uuid: string = action.payload.uuid;
  const editable: boolean = action.payload.editable;

  const pageState: ObjectUpdatesEntry = state[url];

  const fieldState = pageState.fieldStates[uuid];
  const newFieldState = Object.assign({}, fieldState, { editable });

  const newFieldStates = Object.assign({}, pageState.fieldStates, { [uuid]: newFieldState });

  const newPageState = Object.assign({}, pageState, { fieldStates: newFieldStates });

  return Object.assign({}, state, { [url]: newPageState });
}

function createInitialFieldStates(fields: Identifiable[]) {
  const uuids = fields.map((field: Identifiable) => field.uuid);
  const fieldStates = {};
  uuids.forEach((uuid: string) => fieldStates[uuid] = initialFieldState);
  return fieldStates;
}
