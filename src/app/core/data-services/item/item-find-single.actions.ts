import { Action } from "@ngrx/store";
import { type } from "../../../shared/ngrx/type";
import { Item } from "../../shared/item.model";

export const ItemFindSingleActionTypes = {
  FIND_BY_ID_REQUEST: type('dspace/core/data/item/FIND_BY_ID_REQUEST'),
  FIND_BY_ID_SUCCESS: type('dspace/core/data/item/FIND_BY_ID_SUCCESS'),
  FIND_BY_ID_ERROR: type('dspace/core/data/item/FIND_BY_ID_ERROR')
};

export class ItemFindByIdRequestAction implements Action {
  type = ItemFindSingleActionTypes.FIND_BY_ID_REQUEST;
  payload: string;

  constructor(requestID: string) {
    this.payload = requestID;
  }
}

export class ItemFindByIdSuccessAction implements Action {
  type = ItemFindSingleActionTypes.FIND_BY_ID_SUCCESS;
  payload: string;

  constructor(itemUUID: string) {
    this.payload = itemUUID;
  }
}

export class ItemFindByIdErrorAction implements Action {
  type = ItemFindSingleActionTypes.FIND_BY_ID_ERROR;
  payload: string;

  constructor(errorMessage: string) {
    this.payload = errorMessage;
  }
}

export type ItemFindSingleAction
  = ItemFindByIdRequestAction
  | ItemFindByIdSuccessAction
  | ItemFindByIdErrorAction;

