import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';
import { RestRequest } from './request.models';
import { RestResponse } from '../cache/response.models';

/**
 * The list of RequestAction type definitions
 */
export const RequestActionTypes = {
  CONFIGURE: type('dspace/core/data/request/CONFIGURE'),
  EXECUTE: type('dspace/core/data/request/EXECUTE'),
  COMPLETE: type('dspace/core/data/request/COMPLETE'),
  RESET_TIMESTAMPS: type('dspace/core/data/request/RESET_TIMESTAMPS'),
  REMOVE: type('dspace/core/data/request/REMOVE')
};

/* tslint:disable:max-classes-per-file */
export class RequestConfigureAction implements Action {
  type = RequestActionTypes.CONFIGURE;
  payload: RestRequest;

  constructor(
    request: RestRequest
  ) {
    this.payload = request;
  }
}

export class RequestExecuteAction implements Action {
  type = RequestActionTypes.EXECUTE;
  payload: string;

  /**
   * Create a new RequestExecuteAction
   *
   * @param uuid
   *    the request's uuid
   */
  constructor(uuid: string) {
    this.payload = uuid
  }
}

/**
 * An ngrx action to indicate a response was returned
 */
export class RequestCompleteAction implements Action {
  type = RequestActionTypes.COMPLETE;
  payload: {
    uuid: string,
    response: RestResponse
  };

  /**
   * Create a new RequestCompleteAction
   *
   * @param uuid
   *    the request's uuid
   */
  constructor(uuid: string, response: RestResponse) {
    this.payload = {
      uuid,
      response
    };
  }
}

/**
 * An ngrx action to reset the timeAdded property of all responses in the cached objects
 */
export class ResetResponseTimestampsAction implements Action {
  type = RequestActionTypes.RESET_TIMESTAMPS;
  payload: number;

  /**
   * Create a new ResetResponseTimestampsAction
   *
   * @param newTimestamp
   *    the new timeAdded all objects should get
   */
  constructor(newTimestamp: number) {
    this.payload = newTimestamp;
  }
}

/**
 * An ngrx action to remove a cached request
 */
export class RequestRemoveAction implements Action {
  type = RequestActionTypes.REMOVE;
  uuid: string;

  /**
   * Create a new RequestRemoveAction
   *
   * @param uuid
   *    the request's uuid
   */
  constructor(uuid: string) {
    this.uuid = uuid
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all RequestActions
 */
export type RequestAction
  = RequestConfigureAction
  | RequestExecuteAction
  | RequestCompleteAction
  | ResetResponseTimestampsAction
  | RequestRemoveAction;
