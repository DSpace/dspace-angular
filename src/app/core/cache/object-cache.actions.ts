import { Action } from "@ngrx/store";
import { type } from "../../shared/ngrx/type";
import { CacheableObject } from "./object-cache.reducer";

/**
 * The list of ObjectCacheAction type definitions
 */
export const ObjectCacheActionTypes = {
  ADD: type('dspace/core/cache/object/ADD'),
  REMOVE: type('dspace/core/cache/object/REMOVE'),
  RESET_TIMESTAMPS: type('dspace/core/cache/object/RESET_TIMESTAMPS')
};

/**
 * An ngrx action to add an object to the cache
 */
export class AddToObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.ADD;
  payload: {
    objectToCache: CacheableObject;
    timeAdded: number;
    msToLive: number;
  };

  /**
   * Create a new AddToObjectCacheAction
   *
   * @param objectToCache
   *    the object to add
   * @param timeAdded
   *    the time it was added
   * @param msToLive
   *    the amount of milliseconds before it should expire
   */
  constructor(objectToCache: CacheableObject, timeAdded: number, msToLive: number) {
    this.payload = { objectToCache, timeAdded, msToLive };
  }
}

/**
 * An ngrx action to remove an object from the cache
 */
export class RemoveFromObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.REMOVE;
  payload: string;

  /**
   * Create a new RemoveFromObjectCacheAction
   *
   * @param uuid
   *    the UUID of the object to remove
   */
  constructor(uuid: string) {
    this.payload = uuid;
  }
}

/**
 * An ngrx action to reset the timeAdded property of all cached objects
 */
export class ResetObjectCacheTimestampsAction implements Action {
  type = ObjectCacheActionTypes.RESET_TIMESTAMPS;
  payload: number;

  /**
   * Create a new ResetObjectCacheTimestampsAction
   *
   * @param newTimestamp
   *    the new timeAdded all objects should get
   */
  constructor(newTimestamp: number) {
    this.payload = newTimestamp;
  }
}

/**
 * A type to encompass all ObjectCacheActions
 */
export type ObjectCacheAction
  = AddToObjectCacheAction
  | RemoveFromObjectCacheAction
  | ResetObjectCacheTimestampsAction;
