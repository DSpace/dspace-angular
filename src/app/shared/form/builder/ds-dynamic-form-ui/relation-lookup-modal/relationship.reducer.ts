/**
 * Represents the state of all lists containing relationships in the store
 */
import { RelationshipActionTypes, RelationshipListAction, SetNameVariantAction } from './relationship.actions';

export type RelationshipListsState = {
  [listID: string]: RelationshipListState;
}

/**
 * Represents the state of a single list containing relationships in the store
 */
export type RelationshipListState = {
  [itemID: string]: RelationshipState;
}

/**
 * Represents the state of a relationship in a list in the store
 */
export type RelationshipState = {
  nameVariant: string;
}

/**
 * Reducer that handles RelationshipListAction to update the RelationshipListsState
 * @param {RelationshipListsState} state The initial RelationshipListsState
 * @param {RelationshipListAction} action The Action to be performed on the state
 * @returns {RelationshipListsState} The new, reduced RelationshipListsState
 */
export function relationshipListReducer(state: RelationshipListsState = {}, action: RelationshipListAction): RelationshipListsState {
  switch (action.type) {
    case RelationshipActionTypes.SET_NAME_VARIANT: {
      const listState: RelationshipListState = state[action.payload.listID] || {};
      const nameVariant = (action as SetNameVariantAction).payload.nameVariant;
      const newListState = setNameVariant(listState, action.payload.itemID, nameVariant);
      return Object.assign({}, state, { [action.payload.listID]: newListState });
    }
    case RelationshipActionTypes.REMOVE_NAME_VARIANT: {
      const listState: RelationshipListState = state[action.payload.listID] || {};
      const newListState = setNameVariant(listState, action.payload.itemID, undefined);
      return Object.assign({}, state, { [action.payload.listID]: newListState });
    }
    default: {
      return state;
    }
  }
}

function setNameVariant(state: RelationshipListState, itemID: string, nameVariant: string) {
  return Object.assign({}, state, { [itemID]: { nameVariant } });
}
