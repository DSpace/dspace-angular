import {
  AddToObjectUpdatesAction,
  ApplyObjectUpdatesAction,
  DiscardObjectUpdatesAction,
  ObjectUpdatesAction,
  ObjectUpdatesActionTypes,
  ReinstateObjectUpdatesAction,
  RemoveObjectUpdatesAction,
  RemoveSingleObjectUpdateAction
} from './object-updates.actions';
import { Operation } from 'fast-json-patch';
import { hasValue } from '../../../shared/empty.util';

export interface ObjectUpdates {
  [id: string]: Operation[]
}

export interface ObjectUpdatesEntry {
  updates: ObjectUpdates;
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
  switch (action.type) {
    case ObjectUpdatesActionTypes.ADD: {
      return addToObjectUpdates(state, action as AddToObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.APPLY: {
      /* For now do nothing, handle in effect */
      // return applyObjectUpdates(state, action as ApplyObjectUpdatesAction);
      return state;
    }
    case ObjectUpdatesActionTypes.DISCARD: {
      return discardObjectUpdates(state, action as DiscardObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.REINSTATE: {
      return reinstateObjectUpdates(state, action as ReinstateObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.REMOVE: {
      return removeObjectUpdates(state, action as RemoveObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.REMOVE_SINGLE: {
      return removeSingleObjectUpdates(state, action as RemoveSingleObjectUpdateAction);
    }
  }
}

function addToObjectUpdates(state: any, action: AddToObjectUpdatesAction) {
  const key: string = action.payload.url;
  const keyState = state[key] || {
    updates: {},
    lastServerUpdate: 0,
    lastModified: new Date(),
    discarded: false
  };
  const objectUpdates: Operation[] = keyState.updates[action.payload.fieldID] || [];
  const newUpdates = [...objectUpdates, action.payload.operation];
  const newKeyState = Object.assign(state[key], { updates: newUpdates });
  return Object.assign(state, newKeyState);
}

function discardObjectUpdates(state: any, action: DiscardObjectUpdatesAction) {
  const key: string = action.payload;
  const keyState = state[key];
  if (hasValue(keyState)) {
    const newKeyState = Object.assign(keyState, { discarded: true });
    return Object.assign(state, newKeyState);
  }
  return state;
}

function reinstateObjectUpdates(state: any, action: ReinstateObjectUpdatesAction) {
  const key: string = action.payload;
  const keyState = state[key];
  if (hasValue(keyState)) {
    const newKeyState = Object.assign(keyState, { discarded: false });
    return Object.assign(state, newKeyState);
  }
  return state;
}

function removeObjectUpdates(state: any, action: RemoveObjectUpdatesAction) {
  const key: string = action.payload;
  const keyState = state[key];
  const newState = Object.assign(state);
  if (hasValue(keyState)) {
    delete newState[key];
  }
  return newState;
}

function removeSingleObjectUpdates(state: any, action: RemoveSingleObjectUpdateAction) {
  const key: string = action.payload.url;
  let newKeyState = state[key];
  if (hasValue(newKeyState)) {
    const newUpdates: Operation[] = Object.assign(newKeyState.updates);
    if (hasValue(newUpdates[action.payload.fieldID])) {
      delete newUpdates[action.payload.fieldID];
    }
    newKeyState = Object.assign(state[key], { updates: newUpdates });
  }
  return Object.assign(state, newKeyState);
}
