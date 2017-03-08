import { OpaqueToken } from "@angular/core";
import { Action } from "@ngrx/store";
import { type } from "../../shared/ngrx/type";
import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";

/**
 * The list of RequestCacheAction type definitions
 */
export const RequestCacheActionTypes = {
  FIND_BY_ID: type('dspace/core/cache/request/FIND_BY_ID'),
  FIND_ALL: type('dspace/core/cache/request/FIND_ALL'),
  SUCCESS: type('dspace/core/cache/request/SUCCESS'),
  ERROR: type('dspace/core/cache/request/ERROR'),
  REMOVE: type('dspace/core/cache/request/REMOVE'),
  RESET_TIMESTAMPS: type('dspace/core/cache/request/RESET_TIMESTAMPS')
};

/**
 * An ngrx action to find all objects of a certain type
 */
export class RequestCacheFindAllAction implements Action {
  type = RequestCacheActionTypes.FIND_ALL;
  payload: {
    key: string,
    service: OpaqueToken,
    scopeID: string,
    paginationOptions: PaginationOptions,
    sortOptions: SortOptions
  };

  /**
   * Create a new RequestCacheFindAllAction
   *
   * @param key
   *    the key under which to cache this request, should be unique
   * @param service
   *    the name of the service that initiated the action
   * @param scopeID
   *    the id of an optional scope object
   * @param paginationOptions
   *    the pagination options
   * @param sortOptions
   *    the sort options
   */
  constructor(
    key: string,
    service: OpaqueToken,
    scopeID?: string,
    paginationOptions: PaginationOptions = new PaginationOptions(),
    sortOptions: SortOptions = new SortOptions()
  ) {
    this.payload = {
      key,
      service,
      scopeID,
      paginationOptions,
      sortOptions
    }
  }
}

/**
 * An ngrx action to find objects by id
 */
export class RequestCacheFindByIDAction implements Action {
  type = RequestCacheActionTypes.FIND_BY_ID;
  payload: {
    key: string,
    service: OpaqueToken,
    resourceID: string
  };

  /**
   * Create a new RequestCacheFindByIDAction
   *
   * @param key
   *    the key under which to cache this request, should be unique
   * @param service
   *    the name of the service that initiated the action
   * @param resourceID
   *    the ID of the resource to find
   */
  constructor(
    key: string,
    service: OpaqueToken,
    resourceID: string
  ) {
    this.payload = {
      key,
      service,
      resourceID
    }
  }
}

/**
 * An ngrx action to indicate a request was returned successful
 */
export class RequestCacheSuccessAction implements Action {
  type = RequestCacheActionTypes.SUCCESS;
  payload: {
    key: string,
    resourceUUIDs: Array<string>,
    timeAdded: number,
    msToLive: number
  };

  /**
   * Create a new RequestCacheSuccessAction
   *
   * @param key
   *    the key under which cache this request is cached,
   *    should be identical to the one used in the corresponding
   *    find action
   * @param resourceUUIDs
   *    the UUIDs returned from the backend
   * @param timeAdded
   *    the time it was returned
   * @param msToLive
   *    the amount of milliseconds before it should expire
   */
  constructor(key: string, resourceUUIDs: Array<string>, timeAdded, msToLive: number) {
    this.payload = {
      key,
      resourceUUIDs,
      timeAdded,
      msToLive
    };
  }
}

/**
 * An ngrx action to indicate a request failed
 */
export class RequestCacheErrorAction implements Action {
  type = RequestCacheActionTypes.ERROR;
  payload: {
    key: string,
    errorMessage: string
  };

  /**
   * Create a new RequestCacheErrorAction
   *
   * @param key
   *    the key under which cache this request is cached,
   *    should be identical to the one used in the corresponding
   *    find action
   * @param errorMessage
   *    A message describing the reason the request failed
   */
  constructor(key: string, errorMessage: string) {
    this.payload = {
      key,
      errorMessage
    };
  }
}

/**
 * An ngrx action to remove a request from the cache
 */
export class RequestCacheRemoveAction implements Action {
  type = RequestCacheActionTypes.REMOVE;
  payload: string;

  /**
   * Create a new RequestCacheRemoveAction
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
export class ResetRequestCacheTimestampsAction implements Action {
  type = RequestCacheActionTypes.RESET_TIMESTAMPS;
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
 * A type to encompass all RequestCacheActions
 */
export type RequestCacheAction
  = RequestCacheFindAllAction
  | RequestCacheFindByIDAction
  | RequestCacheSuccessAction
  | RequestCacheErrorAction
  | RequestCacheRemoveAction
  | ResetRequestCacheTimestampsAction;
