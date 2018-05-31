// @TODO: Merge with keySelector function present in 'src/app/core/shared/selectors.ts'
import { createSelector, MemoizedSelector, Selector } from '@ngrx/store';
import { hasValue } from '../../shared/empty.util';
import { coreSelector, CoreState } from '../core.reducers';
import { JsonPatchOperationsEntry, JsonPatchOperationsResourceEntry } from './json-patch-operations.reducer';

export function keySelector<T, V>(parentSelector: Selector<any, any>, subState: string, key: string): MemoizedSelector<T, V> {
  return createSelector(parentSelector, (state: T) => {
    if (hasValue(state[subState])) {
      return state[subState][key];
    } else {
      return undefined;
    }
  });
}

export function subStateSelector<T, V>(parentSelector: Selector<any, any>, subState: string): MemoizedSelector<T, V> {
  return createSelector(parentSelector, (state: T) => {
    if (hasValue(state[subState])) {
      return state[subState];
    } else {
      return undefined;
    }
  });
}

export function jsonPatchOperationsByResourceType(resourceType: string): MemoizedSelector<CoreState, JsonPatchOperationsResourceEntry> {
  return keySelector<CoreState, JsonPatchOperationsResourceEntry>(coreSelector,'json/patch', resourceType);
}

export function jsonPatchOperationsByResourcId(resourceType: string, resourceId: string): MemoizedSelector<CoreState, JsonPatchOperationsEntry> {
  const resourceTypeSelector  = jsonPatchOperationsByResourceType(resourceType);
  return subStateSelector<CoreState, JsonPatchOperationsEntry>(resourceTypeSelector, resourceId);
}
