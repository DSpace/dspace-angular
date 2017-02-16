import { Action } from "@ngrx/store";
import { type } from "../../../shared/ngrx/type";
import { PaginationOptions } from "../../shared/pagination-options.model";
import { SortOptions } from "../../shared/sort-options.model";

export const CollectionFindMultipleActionTypes = {
  FIND_MULTI_REQUEST: type('dspace/core/data/collection/FIND_MULTI_REQUEST'),
  FIND_MULTI_SUCCESS: type('dspace/core/data/collection/FIND_MULTI_SUCCESS'),
  FIND_MULTI_ERROR: type('dspace/core/data/collection/FIND_MULTI_ERROR')
};

export class CollectionFindMultipleRequestAction implements Action {
  type = CollectionFindMultipleActionTypes.FIND_MULTI_REQUEST;
  payload: {
    scopeID: string,
    paginationOptions: PaginationOptions,
    sortOptions: SortOptions
  };

  constructor(
    scopeID?: string,
    paginationOptions: PaginationOptions = new PaginationOptions(),
    sortOptions: SortOptions = new SortOptions()
  ) {
    this.payload = {
      scopeID,
      paginationOptions,
      sortOptions
    }
  }
}

export class CollectionFindMultipleSuccessAction implements Action {
  type = CollectionFindMultipleActionTypes.FIND_MULTI_SUCCESS;
  payload: Array<string>;

  constructor(collectionUUIDs: Array<string>) {
    this.payload = collectionUUIDs;
  }
}

export class CollectionFindMultipleErrorAction implements Action {
  type = CollectionFindMultipleActionTypes.FIND_MULTI_ERROR;
  payload: string;

  constructor(errorMessage: string) {
    this.payload = errorMessage;
  }
}

export type CollectionFindMultipleAction
  = CollectionFindMultipleRequestAction
  | CollectionFindMultipleSuccessAction
  | CollectionFindMultipleErrorAction;
