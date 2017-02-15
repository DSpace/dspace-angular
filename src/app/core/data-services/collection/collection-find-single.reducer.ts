import { Collection } from "../../shared/collection.model";
import {
  CollectionFindSingleAction,
  CollectionFindSingleActionTypes
} from "./collection-find-single.actions";

export interface CollectionFindSingleState {
  isLoading: boolean;
  errorMessage: string;
  collectionID: string;
}

const initialState: CollectionFindSingleState = {
  isLoading: false,
  errorMessage: undefined,
  collectionID: undefined
};

export const findSingleReducer = (state = initialState, action: CollectionFindSingleAction): CollectionFindSingleState => {
  switch (action.type) {

    case CollectionFindSingleActionTypes.FIND_BY_ID_REQUEST: {
      return Object.assign({}, state, {
        isLoading: true,
        errorMessage: undefined,
        collectionID: action.payload
      });
    }

    case CollectionFindSingleActionTypes.FIND_BY_ID_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        errorMessage: undefined,
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
