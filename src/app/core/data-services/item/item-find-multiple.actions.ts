import { Action } from "@ngrx/store";
import { type } from "../../../shared/ngrx/type";
import { PaginationOptions } from "../../shared/pagination-options.model";
import { SortOptions } from "../../shared/sort-options.model";

export const ItemFindMultipleActionTypes = {
  FIND_MULTI_REQUEST: type('dspace/core/data/item/FIND_MULTI_REQUEST'),
  FIND_MULTI_SUCCESS: type('dspace/core/data/item/FIND_MULTI_SUCCESS'),
  FIND_MULTI_ERROR: type('dspace/core/data/item/FIND_MULTI_ERROR')
};

export class ItemFindMultipleRequestAction implements Action {
  type = ItemFindMultipleActionTypes.FIND_MULTI_REQUEST;
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

export class ItemFindMultipleSuccessAction implements Action {
  type = ItemFindMultipleActionTypes.FIND_MULTI_SUCCESS;
  payload: Array<string>;

  constructor(itemIDs: Array<string>) {
    this.payload = itemIDs;
  }
}

export class ItemFindMultipleErrorAction implements Action {
  type = ItemFindMultipleActionTypes.FIND_MULTI_ERROR;
  payload: string;

  constructor(errorMessage: string) {
    this.payload = errorMessage;
  }
}

export type ItemFindMultipleAction
  = ItemFindMultipleRequestAction
  | ItemFindMultipleSuccessAction
  | ItemFindMultipleErrorAction;
