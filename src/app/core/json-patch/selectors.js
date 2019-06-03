import { coreSelector } from '../core.selectors';
import { keySelector, subStateSelector } from '../../submission/selectors';
/**
 * Return MemoizedSelector to select all jsonPatchOperations for a specified resource type, stored in the state
 *
 * @param resourceType
 *    the resource type
 * @return MemoizedSelector<CoreState, JsonPatchOperationsResourceEntry>
 *     MemoizedSelector
 */
export function jsonPatchOperationsByResourceType(resourceType) {
    return keySelector(coreSelector, 'json/patch', resourceType);
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
export function jsonPatchOperationsByResourceId(resourceType, resourceId) {
    var resourceTypeSelector = jsonPatchOperationsByResourceType(resourceType);
    return subStateSelector(resourceTypeSelector, resourceId);
}
//# sourceMappingURL=selectors.js.map