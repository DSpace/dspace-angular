import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Response } from './response-cache.models';

/**
 * The list of ResponseCacheAction type definitions
 */
export const ResponseCacheActionTypes = {
  ADD: type('dspace/core/cache/response/ADD'),
  REMOVE: type('dspace/core/cache/response/REMOVE'),
  RESET_TIMESTAMPS: type('dspace/core/cache/response/RESET_TIMESTAMPS')
};

/* tslint:disable:max-classes-per-file */
export class ResponseCacheAddAction implements Action {
  type = ResponseCacheActionTypes.ADD;
  payload: {
    key: string,
    response: Response
    timeAdded: number;
    msToLive: number;
  };

  constructor(key: string, response: Response, timeAdded: number, msToLive: number) {
    this.payload = { key, response, timeAdded, msToLive };
  }
}

/**
 * An ngrx action to remove a request from the cache
 */
export class ResponseCacheRemoveAction implements Action {
  type = ResponseCacheActionTypes.REMOVE;
  payload: string;

  /**
   * Create a new ResponseCacheRemoveAction
   * @param key
   *    The key of the request to remove
   */
  constructor(key: string) {
    this.payload = key;
  }
}

/**
 * An ngrx action to reset the timeAdded property of all cached objects
 */
export class ResetResponseCacheTimestampsAction implements Action {
  type = ResponseCacheActionTypes.RESET_TIMESTAMPS;
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
/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all ResponseCacheActions
 */
export type ResponseCacheAction
  = ResponseCacheAddAction
  | ResponseCacheRemoveAction
  | ResetResponseCacheTimestampsAction;
