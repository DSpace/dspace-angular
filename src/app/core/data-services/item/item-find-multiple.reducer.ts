import { PaginationOptions } from "../../shared/pagination-options.model";
import { SortOptions } from "../../shared/sort-options.model";
import {
  ItemFindMultipleAction,
  ItemFindMultipleActionTypes
} from "./item-find-multiple.actions";

export interface ItemFindMultipleState {
  scopeID: string;
  itemsIDs: Array<String>;
  isLoading: boolean;
  errorMessage: string;
  paginationOptions: PaginationOptions;
  sortOptions: SortOptions;
}

const initialState: ItemFindMultipleState = {
  scopeID: undefined,
  itemsIDs: [],
  isLoading: false,
  errorMessage: undefined,
  paginationOptions: undefined,
  sortOptions: undefined
};

export const findMultipleReducer = (state = initialState, action: ItemFindMultipleAction): ItemFindMultipleState => {
  switch (action.type) {

    case ItemFindMultipleActionTypes.FIND_MULTI_REQUEST: {
      return Object.assign({}, state, {
        scopeID: action.payload.scopeID,
        itemsIDs: [],
        isLoading: true,
        errorMessage: undefined,
        paginationOptions: action.payload.paginationOptions,
        sortOptions: action.payload.sortOptions
      });
    }

    case ItemFindMultipleActionTypes.FIND_MULTI_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        itemsIDs: action.payload,
        errorMessage: undefined
      });
    }

    case ItemFindMultipleActionTypes.FIND_MULTI_ERROR: {
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
