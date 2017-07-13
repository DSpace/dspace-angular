import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';
import { CacheableObject } from '../cache/object-cache.reducer';
import { Request } from './request.models';

/**
 * The list of RequestAction type definitions
 */
export const RequestActionTypes = {
  CONFIGURE: type('dspace/core/data/request/CONFIGURE'),
  EXECUTE: type('dspace/core/data/request/EXECUTE'),
  COMPLETE: type('dspace/core/data/request/COMPLETE')
};

/* tslint:disable:max-classes-per-file */
export class RequestConfigureAction implements Action {
  type = RequestActionTypes.CONFIGURE;
  payload: Request<CacheableObject>;

  constructor(
    request: Request<CacheableObject>
  ) {
    this.payload = request;
  }
}

export class RequestExecuteAction implements Action {
  type = RequestActionTypes.EXECUTE;
  payload: string;

  constructor(key: string) {
    this.payload = key
  }
}

/**
 * An ngrx action to indicate a response was returned
 */
export class RequestCompleteAction implements Action {
  type = RequestActionTypes.COMPLETE;
  payload: string;

  /**
   * Create a new RequestCompleteAction
   *
   * @param key
   *    the key under which  this request is stored,
   */
  constructor(key: string) {
    this.payload = key;
  }
}
/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all RequestActions
 */
export type RequestAction
  = RequestConfigureAction
  | RequestExecuteAction
  | RequestCompleteAction;
