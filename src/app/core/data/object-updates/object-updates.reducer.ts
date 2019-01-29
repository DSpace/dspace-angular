import {
  AddToObjectUpdatesAction,
  ApplyObjectUpdatesAction,
  DiscardObjectUpdatesAction,
  ObjectUpdatesAction,
  ObjectUpdatesActionTypes,
  ReinstateObjectUpdatesAction,
  RemoveObjectUpdatesAction,
  RemoveSingleObjectUpdateAction, ReplaceObjectUpdatesAction
} from './object-updates.actions';
import { Operation } from 'fast-json-patch';
import { hasValue } from '../../../shared/empty.util';

export interface ObjectUpdatesEntry {
  updates: Operation[];
  lastServerUpdate: number;
  lastModified: number;
  discarded: boolean;
}

export interface ObjectUpdatesState {
  [url: string]: ObjectUpdatesEntry;
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export function objectUpdatesReducer(state = initialState, action: ObjectUpdatesAction): ObjectUpdatesState {
  let newState = state;
  switch (action.type) {
    case ObjectUpdatesActionTypes.REPLACE: {
      newState = replaceObjectUpdates(state, action as ReplaceObjectUpdatesAction);
      break;
    }
    case ObjectUpdatesActionTypes.ADD: {
      newState = addToObjectUpdates(state, action as AddToObjectUpdatesAction);
      break;
    }
    case ObjectUpdatesActionTypes.APPLY: {
      /* For now do nothing, handle in effect */
      // return applyObjectUpdates(state, action as ApplyObjectUpdatesAction);
      newState = state;
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
    case ObjectUpdatesActionTypes.REMOVE_SINGLE: {
      newState = removeSingleObjectUpdates(state, action as RemoveSingleObjectUpdateAction);
      break;
    }
    default: {
      return state;
    }
  }
  return setLastModified(newState, action.payload.url);
}

function replaceObjectUpdates(state: any, action: ReplaceObjectUpdatesAction) {
  const key: string = action.payload.url;
  const operations: Operation[] = action.payload.operations;
  const newUpdateEntry = Object.assign({}, state[key] || {}, { updates: operations });
  return Object.assign({}, state, { [key]: newUpdateEntry });
}

function addToObjectUpdates(state: any, action: AddToObjectUpdatesAction) {
  const key: string = action.payload.url;
  const operation: Operation = action.payload.operation;
  const keyState = state[key] || {
    updates: {},
    lastServerUpdate: 0,
    discarded: false
  };
  const objectUpdates: Operation[] = keyState.updates || [];
  const newUpdates = [...objectUpdates, operation];
  const newKeyState = Object.assign({}, state[key], { updates: newUpdates });
  return Object.assign({}, state, newKeyState);
}

function discardObjectUpdates(state: any, action: DiscardObjectUpdatesAction) {
  const key: string = action.payload.url;
  const keyState = state[key];
  if (hasValue(keyState)) {
    const newKeyState = Object.assign({}, keyState, { discarded: true });
    return Object.assign({}, state, newKeyState);
  }
  return state;
}

function reinstateObjectUpdates(state: any, action: ReinstateObjectUpdatesAction) {
  const key: string = action.payload.url;
  const keyState = state[key];
  if (hasValue(keyState)) {
    const newKeyState = Object.assign({}, keyState, { discarded: false });
    return Object.assign({}, state, newKeyState);
  }
  return state;
}

function removeObjectUpdates(state: any, action: RemoveObjectUpdatesAction) {
  const key: string = action.payload.url;
  return removeObjectUpdatesByURL(state, key);
}

function removeObjectUpdatesByURL(state: any, url: string) {
  const keyState = state[url];
  const newState = Object.assign({}, state);
  if (hasValue(keyState)) {
    delete newState[url];
  }
  return newState;
}

function removeSingleObjectUpdates(state: any, action: RemoveSingleObjectUpdateAction) {
  const key: string = action.payload.url;
  let newKeyState = state[key];
  if (hasValue(newKeyState)) {
    const newUpdates: Operation[] = Object.assign({}, newKeyState.updates);
    if (hasValue(newUpdates[action.payload.fieldID])) {
      delete newUpdates[action.payload.fieldID];
    }
    newKeyState = Object.assign({}, state[key], { updates: newUpdates });
  }
  return Object.assign({}, state, newKeyState);
}

function setLastModified(state: any, url: string) {
  const newKeyState = Object.assign({}, state[url] || {}, { lastModified: Date.now() });
  return Object.assign({}, state, newKeyState);
}
