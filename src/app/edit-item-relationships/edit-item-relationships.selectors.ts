import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditItemRelationshipsState } from './edit-item-relationships.actions';

/**
 * Base selector to select the core state from the store
 */
export const editItemRelationshipsSelector = createFeatureSelector<EditItemRelationshipsState>('editItemRelationships');

/**
 * Returns the pending status.
 * @function _getPendingStatus
 * @param {EditItemRelationshipsState} state
 * @returns {boolean} reportId
 */
const _getPendingStatus = (state: EditItemRelationshipsState) => state.pendingChanges;

/**
 * Returns the pending status.
 * @function getPendingStatus
 * @param {EditItemRelationshipsState} state
 * @param {any} props
 * @return {boolean}
 */
export const getPendingStatus = createSelector(editItemRelationshipsSelector, _getPendingStatus);
