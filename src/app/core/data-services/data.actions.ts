import { OpaqueToken } from "@angular/core";
import { Action } from "@ngrx/store";
import { type } from "../../shared/ngrx/type";
import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";

export const DataActionTypes = {
  FIND_BY_ID_REQUEST: type('dspace/core/data/FIND_BY_ID_REQUEST'),
  FIND_ALL_REQUEST: type('dspace/core/data/FIND_ALL_REQUEST'),
  SUCCESS: type('dspace/core/data/SUCCESS'),
  ERROR: type('dspace/core/data/ERROR')
};

export class DataFindAllRequestAction implements Action {
  type = DataActionTypes.FIND_ALL_REQUEST;
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

export class DataFindByIDRequestAction implements Action {
  type = DataActionTypes.FIND_BY_ID_REQUEST;
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

export class DataSuccessAction implements Action {
  type = DataActionTypes.SUCCESS;
  payload: {
    key: string,
    resourceUUIDs: Array<string>
  };

  constructor(key: string, resourceUUIDs: Array<string>) {
    this.payload = {
      key,
      resourceUUIDs
    };
  }
}

export class DataErrorAction implements Action {
  type = DataActionTypes.ERROR;
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

export type DataAction
  = DataFindAllRequestAction
  | DataFindByIDRequestAction
  | DataSuccessAction
  | DataErrorAction;
