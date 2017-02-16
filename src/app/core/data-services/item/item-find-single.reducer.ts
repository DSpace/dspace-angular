import { Item } from "../../shared/item.model";
import {
  ItemFindSingleAction,
  ItemFindSingleActionTypes
} from "./item-find-single.actions";

export interface ItemFindSingleState {
  isLoading: boolean;
  errorMessage: string;
  requestedID: string;
  itemUUID: string;
}

const initialState: ItemFindSingleState = {
  isLoading: false,
  errorMessage: undefined,
  requestedID: undefined,
  itemUUID: undefined
};

export const findSingleReducer = (state = initialState, action: ItemFindSingleAction): ItemFindSingleState => {
  switch (action.type) {

    case ItemFindSingleActionTypes.FIND_BY_ID_REQUEST: {
      return Object.assign({}, state, {
        isLoading: true,
        errorMessage: undefined,
        requestedID: action.payload
      });
    }

    case ItemFindSingleActionTypes.FIND_BY_ID_SUCCESS: {
      return Object.assign({}, state, {
        isLoading: false,
        errorMessage: undefined,
        itemUUID: action.payload
      });
    }

    case ItemFindSingleActionTypes.FIND_BY_ID_ERROR: {
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
