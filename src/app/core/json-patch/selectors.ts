import { hasValue } from '@dspace/shared/utils';
import {
  createSelector,
  MemoizedSelector,
  Selector,
} from '@ngrx/store';

import { coreSelector } from '../core.selectors';
import { CoreState } from '../core-state.model';
import {
  JsonPatchOperationsEntry,
  JsonPatchOperationsResourceEntry,
} from './json-patch-operations.reducer';

/**
 * Export a function to return a subset of the state by key
 */
export function keySelector<T, V>(parentSelector: Selector<any, any>, subState: string, key: string): MemoizedSelector<T, V> {
  return createSelector<T,unknown[],V>(parentSelector, (state: T) => {
    if (hasValue(state) && hasValue(state[subState])) {
      return state[subState][key];
    } else {
      return undefined;
    }
  });
}

/**
 * Export a function to return a subset of the state
 */
export function subStateSelector<T, V>(parentSelector: Selector<any, any>, subState: string): MemoizedSelector<T, V> {
  return createSelector<T,unknown[],V>(parentSelector, (state: T) => {
    if (hasValue(state) && hasValue(state[subState])) {
      return state[subState];
    } else {
      return undefined;
    }
  });
}

/**
 * Return MemoizedSelector to select all jsonPatchOperations for a specified resource type, stored in the state
 *
 * @param resourceType
 *    the resource type
 * @return MemoizedSelector<CoreState, JsonPatchOperationsResourceEntry>
 *     MemoizedSelector
 */
export function jsonPatchOperationsByResourceType(resourceType: string): MemoizedSelector<CoreState, JsonPatchOperationsResourceEntry> {
  return keySelector<CoreState, JsonPatchOperationsResourceEntry>(coreSelector,'json/patch', resourceType);
}

/**
 * Return MemoizedSelector to select all jsonPatchOperations for a specified resource id, stored in the state
 *
 * @param resourceType
 *    the resource type
 * @param resourceId
 *    the resourceId type
 * @return MemoizedSelector<CoreState, JsonPatchOperationsResourceEntry>
 *     MemoizedSelector
 */
export function jsonPatchOperationsByResourceId(resourceType: string, resourceId: string): MemoizedSelector<CoreState, JsonPatchOperationsEntry> {
  const resourceTypeSelector  = jsonPatchOperationsByResourceType(resourceType);
  return subStateSelector<CoreState, JsonPatchOperationsEntry>(resourceTypeSelector, resourceId);
}
