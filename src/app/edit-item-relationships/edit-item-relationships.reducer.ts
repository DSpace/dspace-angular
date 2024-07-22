import {
  createReducer,
  on,
} from '@ngrx/store';

import {
  EditItemRelationshipsActionTypes,
  EditItemRelationshipsState,
} from './edit-item-relationships.actions';


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
