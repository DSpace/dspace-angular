import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';
import { RestRequest } from './request.models';

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
  payload: string;

  /**
   * Create a new RequestCompleteAction
   *
   * @param uuid
   *    the request's uuid
   */
  constructor(uuid: string) {
    this.payload = uuid;
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
