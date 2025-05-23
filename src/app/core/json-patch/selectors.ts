import { MemoizedSelector } from '@ngrx/store';

import {
  keySelector,
  subStateSelector,
} from '../../submission/selectors';
import { coreSelector } from '../core.selectors';
import { CoreState } from '../core-state.model';
import {
  JsonPatchOperationsEntry,
  JsonPatchOperationsResourceEntry,
} from './json-patch-operations.reducer';

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
