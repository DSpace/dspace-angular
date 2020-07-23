import { HALLink } from '../shared/hal-link.model';
import { HALResource } from '../shared/hal-resource.model';
import {
  ObjectCacheAction,
  ObjectCacheActionTypes,
  AddToObjectCacheAction,
  RemoveFromObjectCacheAction,
  ResetObjectCacheTimestampsAction,
  AddPatchObjectCacheAction, ApplyPatchObjectCacheAction
} from './object-cache.actions';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { CacheEntry } from './cache-entry';
import { ResourceType } from '../shared/resource-type';
import { applyPatch, Operation } from 'fast-json-patch';

/**
 * An interface to represent a JsonPatch
 */
export interface Patch {
  /**
   * The identifier for this Patch
   */
  uuid?: string;

  /**
   * the list of operations this Patch is composed of
   */
  operations: Operation[];
}

export abstract class TypedObject {
  static type: ResourceType;
  type: ResourceType;
}

/* tslint:disable:max-classes-per-file */
/**
 * An interface to represent objects that can be cached
 *
 * A cacheable object should have a self link
 */
export class CacheableObject extends TypedObject implements HALResource {
  uuid?: string;
  handle?: string;

  _links: {
    self: HALLink;
  }
  // isNew: boolean;
  // dirtyType: DirtyType;
  // hasDirtyAttributes: boolean;
  // changedAttributes: AttributeDiffh;
  // save(): void;
}

/**
 * An entry in the ObjectCache
 */
export class ObjectCacheEntry implements CacheEntry {
  data: CacheableObject;
  timeAdded: number;
  msToLive: number;
  requestUUID: string;
  patches: Patch[] = [];
  isDirty: boolean;
}

/* tslint:enable:max-classes-per-file */

/**
 * The ObjectCache State
 *
 * Consists of a map with self links as keys,
 * and ObjectCacheEntries as values
 */
export interface ObjectCacheState {
  [href: string]: ObjectCacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: ObjectCacheState = Object.create(null);

/**
 * The ObjectCache Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ObjectCacheState
 *    the new state
 */
export function objectCacheReducer(state = initialState, action: ObjectCacheAction): ObjectCacheState {
  switch (action.type) {

    case ObjectCacheActionTypes.ADD: {
      return addToObjectCache(state, action as AddToObjectCacheAction);
    }

    case ObjectCacheActionTypes.REMOVE: {
      return removeFromObjectCache(state, action as RemoveFromObjectCacheAction)
    }

    case ObjectCacheActionTypes.RESET_TIMESTAMPS: {
      return resetObjectCacheTimestamps(state, action as ResetObjectCacheTimestampsAction)
    }

    case ObjectCacheActionTypes.ADD_PATCH: {
      return addPatchObjectCache(state, action as AddPatchObjectCacheAction);
    }

    case ObjectCacheActionTypes.APPLY_PATCH: {
      return applyPatchObjectCache(state, action as ApplyPatchObjectCacheAction);
    }

    default: {
      return state;
    }
  }
}

/**
 * Add an object to the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an AddToObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the object added, or overwritten.
 */
function addToObjectCache(state: ObjectCacheState, action: AddToObjectCacheAction): ObjectCacheState {
  const existing = state[action.payload.objectToCache._links.self.href];
  return Object.assign({}, state, {
    [action.payload.objectToCache._links.self.href]: {
      data: action.payload.objectToCache,
      timeAdded: action.payload.timeAdded,
      msToLive: action.payload.msToLive,
      requestUUID: action.payload.requestUUID,
      isDirty: (hasValue(existing) ? isNotEmpty(existing.patches) : false),
      patches: (hasValue(existing) ? existing.patches : [])
    }
  });
}

/**
 * Remove an object from the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveFromObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the object removed if it existed.
 */
function removeFromObjectCache(state: ObjectCacheState, action: RemoveFromObjectCacheAction): ObjectCacheState {
  if (hasValue(state[action.payload])) {
    const newObjectCache = Object.assign({}, state);
    delete newObjectCache[action.payload];

    return newObjectCache;
  } else {
    return state;
  }
}

/**
 * Set the timeAdded timestamp of every cached object to the specified value
 *
 * @param state
 *    the current state
 * @param action
 *    a ResetObjectCacheTimestampsAction
 * @return ObjectCacheState
 *    the new state, with all timeAdded timestamps set to the specified value
 */
function resetObjectCacheTimestamps(state: ObjectCacheState, action: ResetObjectCacheTimestampsAction): ObjectCacheState {
  const newState = Object.create(null);
  Object.keys(state).forEach((key) => {
    newState[key] = Object.assign({}, state[key], {
      timeAdded: action.payload
    });
  });
  return newState;
}

/**
 * Add the list of patch operations to a cached object
 *
 * @param state
 *    the current state
 * @param action
 *    an AddPatchObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the new operations added to the state of the specified ObjectCacheEntry
 */
function addPatchObjectCache(state: ObjectCacheState, action: AddPatchObjectCacheAction): ObjectCacheState {
  const uuid = action.payload.href;
  const operations = action.payload.operations;
  const newState = Object.assign({}, state);
  if (hasValue(newState[uuid])) {
    const patches = newState[uuid].patches;
    newState[uuid] = Object.assign({}, newState[uuid], {
      patches: [...patches, { operations } as Patch],
      isDirty: true
    });
  }
  return newState;
}

/**
 * Apply the list of patch operations to a cached object
 *
 * @param state
 *    the current state
 * @param action
 *    an ApplyPatchObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the new operations applied to the state of the specified ObjectCacheEntry
 */
function applyPatchObjectCache(state: ObjectCacheState, action: ApplyPatchObjectCacheAction): ObjectCacheState {
  const uuid = action.payload;
  const newState = Object.assign({}, state);
  if (hasValue(newState[uuid])) {
    // flatten two dimensional array
    const flatPatch: Operation[] = [].concat(...newState[uuid].patches.map((patch) => patch.operations));
    const newData = applyPatch(newState[uuid].data, flatPatch, undefined, false);
    newState[uuid] = Object.assign({}, newState[uuid], { data: newData.newDocument, patches: [] });
  }
  return newState;
}
