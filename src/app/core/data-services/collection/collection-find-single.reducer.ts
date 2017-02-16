import { Collection } from "../../shared/collection.model";
import {
  CollectionFindSingleAction,
  CollectionFindSingleActionTypes
} from "./collection-find-single.actions";

export interface CollectionFindSingleState {
  isLoading: boolean;
  errorMessage: string;
  requestedID: string;
  collectionUUID: string;
}

const initialState: CollectionFindSingleState = {
  isLoading: false,
  errorMessage: undefined,
  requestedID: undefined,
  collectionUUID: undefined
};

export const findSingleReducer = (state = initialState, action: CollectionFindSingleAction): CollectionFindSingleState => {
  switch (action.type) {

    case CollectionFindSingleActionTypes.FIND_BY_ID_REQUEST: {
      return Object.assign({}, state, {
        isLoading: true,
        errorMessage: undefined,
        requestedID: action.payload
      });
    }

    case CollectionFindSingleActionTypes.FIND_BY_ID_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        errorMessage: undefined,
        collectionUUID: action.payload
      });
    }

    case CollectionFindSingleActionTypes.FIND_BY_ID_ERROR: {
      return Object.assign({}, state, {
        isLoading: false,
        errorMessage: action.payload
      });
    }

    default: {
      return state;
    }
  }
};
