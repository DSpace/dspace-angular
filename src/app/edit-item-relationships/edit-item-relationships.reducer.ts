import { EditItemRelationshipsActionTypes, EditItemRelationshipsState } from './edit-item-relationships.actions';
import { createReducer, on } from '@ngrx/store';


export const editItemRelationshipsReducer = createReducer<EditItemRelationshipsState>(
  { pendingChanges: false },

  on(EditItemRelationshipsActionTypes.PENDING_CHANGES, (state, action): EditItemRelationshipsState => {
    return {
      ...state,
      pendingChanges: action.pendingChanges,
    };
  }),

);

export { EditItemRelationshipsState };
