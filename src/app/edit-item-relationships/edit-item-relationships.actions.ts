import { createAction, props } from '@ngrx/store';

export interface EditItemRelationshipsState {
  pendingChanges: boolean;
}

export const EditItemRelationshipsActionTypes = {
  PENDING_CHANGES: createAction(
    'dspace/edit-item-relations-page/PENDING_CHANGES',
    props<{ pendingChanges: boolean }>()
  ),
};

