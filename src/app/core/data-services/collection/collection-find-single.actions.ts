import { Action } from "@ngrx/store";
import { type } from "../../../shared/ngrx/type";
import { Collection } from "../../shared/collection.model";

export const CollectionFindSingleActionTypes = {
  FIND_BY_ID_REQUEST: type('dspace/core/data/collection/FIND_BY_ID_REQUEST'),
  FIND_BY_ID_SUCCESS: type('dspace/core/data/collection/FIND_BY_ID_SUCCESS'),
  FIND_BY_ID_ERROR: type('dspace/core/data/collection/FIND_BY_ID_ERROR')
};

export class CollectionFindByIdRequestAction implements Action {
  type = CollectionFindSingleActionTypes.FIND_BY_ID_REQUEST;
  payload: string;

  constructor(id: string) {
    this.payload = id;
  }
}

export class CollectionFindByIdSuccessAction implements Action {
  type = CollectionFindSingleActionTypes.FIND_BY_ID_SUCCESS;
  payload: Collection;

  constructor(collection: Collection) {
    this.payload = collection;
  }
}

export class CollectionFindByIdErrorAction implements Action {
  type = CollectionFindSingleActionTypes.FIND_BY_ID_ERROR;
  payload: string;

  constructor(errorMessage: string) {
    this.payload = errorMessage;
  }
}

export type CollectionFindSingleAction
  = CollectionFindByIdRequestAction
  | CollectionFindByIdSuccessAction
  | CollectionFindByIdErrorAction;

