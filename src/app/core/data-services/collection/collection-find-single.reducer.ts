import { Collection } from "../../shared/collection.model";
import {
  CollectionFindSingleAction,
  CollectionFindSingleActionTypes
} from "./collection-find-single.actions";

export interface CollectionFindSingleState {
  collection: Collection;
  isLoading: boolean;
  errorMessage: string;
  id: string;
}

const initialState: CollectionFindSingleState = {
  collection: undefined,
  isLoading: false,
  errorMessage: undefined,
  id: undefined,
};

export const findSingleReducer = (state = initialState, action: CollectionFindSingleAction): CollectionFindSingleState => {
  switch (action.type) {

    case CollectionFindSingleActionTypes.FIND_BY_ID_REQUEST: {
      return Object.assign({}, state, {
        isLoading: true,
        id: action.payload,
        collections: undefined,
        errorMessage: undefined,
      });
    }

    case CollectionFindSingleActionTypes.FIND_BY_ID_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        collection: action.payload,
        errorMessage: undefined
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
