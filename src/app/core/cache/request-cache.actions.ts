import { OpaqueToken } from "@angular/core";
import { Action } from "@ngrx/store";
import { type } from "../../shared/ngrx/type";
import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";

export const RequestCacheActionTypes = {
  FIND_BY_ID: type('dspace/core/cache/request/FIND_BY_ID'),
  FIND_ALL: type('dspace/core/cache/request/FIND_ALL'),
  SUCCESS: type('dspace/core/cache/request/SUCCESS'),
  ERROR: type('dspace/core/cache/request/ERROR'),
  REMOVE: type('dspace/core/cache/request/REMOVE')
};

export class RequestCacheFindAllAction implements Action {
  type = RequestCacheActionTypes.FIND_ALL;
  payload: {
    key: string,
    service: OpaqueToken,
    scopeID: string,
    paginationOptions: PaginationOptions,
    sortOptions: SortOptions
  };

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

export class RequestCacheFindByIDAction implements Action {
  type = RequestCacheActionTypes.FIND_BY_ID;
  payload: {
    key: string,
    service: OpaqueToken,
    resourceID: string
  };

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

export class RequestCacheSuccessAction implements Action {
  type = RequestCacheActionTypes.SUCCESS;
  payload: {
    key: string,
    resourceUUIDs: Array<string>,
    timeAdded: number,
    msToLive: number
  };

  constructor(key: string, resourceUUIDs: Array<string>, timeAdded, msToLive: number) {
    this.payload = {
      key,
      resourceUUIDs,
      timeAdded,
      msToLive
    };
  }
}

export class RequestCacheErrorAction implements Action {
  type = RequestCacheActionTypes.ERROR;
  payload: {
    key: string,
    errorMessage: string
  };

  constructor(key: string, errorMessage: string) {
    this.payload = {
      key,
      errorMessage
    };
  }
}

export class RequestCacheRemoveAction implements Action {
  type = RequestCacheActionTypes.REMOVE;
  payload: string;

  constructor(key: string) {
    this.payload = key;
  }
}

export type RequestCacheAction
  = RequestCacheFindAllAction
  | RequestCacheFindByIDAction
  | RequestCacheSuccessAction
  | RequestCacheErrorAction
  | RequestCacheRemoveAction;
