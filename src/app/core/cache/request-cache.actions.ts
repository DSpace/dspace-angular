import { OpaqueToken } from "@angular/core";
import { Action } from "@ngrx/store";
import { type } from "../../shared/ngrx/type";
import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";

export const RequestCacheActionTypes = {
  FIND_BY_ID_REQUEST: type('dspace/core/cache/request/FIND_BY_ID_REQUEST'),
  FIND_ALL_REQUEST: type('dspace/core/cache/request/FIND_ALL_REQUEST'),
  SUCCESS: type('dspace/core/cache/request/SUCCESS'),
  ERROR: type('dspace/core/cache/request/ERROR')
};

export class FindAllRequestCacheAction implements Action {
  type = RequestCacheActionTypes.FIND_ALL_REQUEST;
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

export class FindByIDRequestCacheAction implements Action {
  type = RequestCacheActionTypes.FIND_BY_ID_REQUEST;
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
    msToLive: number
  };

  constructor(key: string, resourceUUIDs: Array<string>, msToLive: number) {
    this.payload = {
      key,
      resourceUUIDs,
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

export type RequestCacheAction
  = FindAllRequestCacheAction
  | FindByIDRequestCacheAction
  | RequestCacheSuccessAction
  | RequestCacheErrorAction;
