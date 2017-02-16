import { PaginationOptions } from "../../shared/pagination-options.model";
import { SortOptions } from "../../shared/sort-options.model";
import {
  CollectionFindMultipleAction,
  CollectionFindMultipleActionTypes
} from "./collection-find-multiple.actions";

export interface CollectionFindMultipleState {
  scopeID: string;
  collectionUUIDs: Array<String>;
  isLoading: boolean;
  errorMessage: string;
  paginationOptions: PaginationOptions;
  sortOptions: SortOptions;
}

const initialState: CollectionFindMultipleState = {
  scopeID: undefined,
  collectionUUIDs: [],
  isLoading: false,
  errorMessage: undefined,
  paginationOptions: undefined,
  sortOptions: undefined
};

export const findMultipleReducer = (state = initialState, action: CollectionFindMultipleAction): CollectionFindMultipleState => {
  switch (action.type) {

    case CollectionFindMultipleActionTypes.FIND_MULTI_REQUEST: {
      return Object.assign({}, state, {
        scopeID: action.payload.scopeID,
        collectionUUIDs: [],
        isLoading: true,
        errorMessage: undefined,
        paginationOptions: action.payload.paginationOptions,
        sortOptions: action.payload.sortOptions
      });
    }

    case CollectionFindMultipleActionTypes.FIND_MULTI_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        collectionUUIDs: action.payload,
        errorMessage: undefined
      });
    }

    case CollectionFindMultipleActionTypes.FIND_MULTI_ERROR: {
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
