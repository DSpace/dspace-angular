import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { CacheableObject } from './object-cache.reducer';
import { Operation } from 'fast-json-patch';

/**
 * The list of ObjectCacheAction type definitions
 */
export const ObjectCacheActionTypes = {
  ADD: type('dspace/core/cache/object/ADD'),
  REMOVE: type('dspace/core/cache/object/REMOVE'),
  RESET_TIMESTAMPS: type('dspace/core/cache/object/RESET_TIMESTAMPS'),
  ADD_PATCH: type('dspace/core/cache/object/ADD_PATCH'),
  APPLY_PATCH: type('dspace/core/cache/object/APPLY_PATCH')
};

/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to add an object to the cache
 */
export class AddToObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.ADD;
  payload: {
    objectToCache: CacheableObject;
    timeAdded: number;
    msToLive: number;
    requestUUID: string;
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
   * @param requestHref
   *    The href of the request that resulted in this object
   *    This isn't necessarily the same as the object's self
   *    link, it could have been part of a list for example
   */
  constructor(objectToCache: CacheableObject, timeAdded: number, msToLive: number, requestUUID: string) {
    this.payload = { objectToCache, timeAdded, msToLive, requestUUID };
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
   * @param href
   *    the unique href of the object to remove
   */
  constructor(href: string) {
    this.payload = href;
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
 * An ngrx action to add new operations to a specified cached object
 */
export class AddPatchObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.ADD_PATCH;
  payload: {
    href: string,
    operations: Operation[]
  };

  /**
   * Create a new AddPatchObjectCacheAction
   *
   * @param href
   *    the unique href of the object that should be updated
   * @param operations
   *    the list of operations to add
   */
  constructor(href: string, operations: Operation[]) {
    this.payload = { href, operations };
  }
}

/**
 * An ngrx action to apply all existing operations to a specified cached object
 */
export class ApplyPatchObjectCacheAction implements Action {
  type = ObjectCacheActionTypes.APPLY_PATCH;
  payload: string;

  /**
   * Create a new ApplyPatchObjectCacheAction
   *
   * @param href
   *    the unique href of the object that should be updated
   */
  constructor(href: string) {
    this.payload = href;
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all ObjectCacheActions
 */
export type ObjectCacheAction
  = AddToObjectCacheAction
  | RemoveFromObjectCacheAction
  | ResetObjectCacheTimestampsAction
  | AddPatchObjectCacheAction
  | ApplyPatchObjectCacheAction;
