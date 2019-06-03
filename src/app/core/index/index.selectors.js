import { createSelector } from '@ngrx/store';
import { hasValue } from '../../shared/empty.util';
import { coreSelector } from '../core.selectors';
import { IndexName } from './index.reducer';
/**
 * Return the MetaIndexState based on the CoreSate
 *
 * @returns
 *    a MemoizedSelector to select the MetaIndexState
 */
export var metaIndexSelector = createSelector(coreSelector, function (state) { return state.index; });
/**
 * Return the object index based on the MetaIndexState
 * It contains all objects in the object cache indexed by UUID
 *
 * @returns
 *    a MemoizedSelector to select the object index
 */
export var objectIndexSelector = createSelector(metaIndexSelector, function (state) { return state[IndexName.OBJECT]; });
/**
 * Return the request index based on the MetaIndexState
 *
 * @returns
 *    a MemoizedSelector to select the request index
 */
export var requestIndexSelector = createSelector(metaIndexSelector, function (state) { return state[IndexName.REQUEST]; });
/**
 * Return the request UUID mapping index based on the MetaIndexState
 *
 * @returns
 *    a MemoizedSelector to select the request UUID mapping
 */
export var requestUUIDIndexSelector = createSelector(metaIndexSelector, function (state) { return state[IndexName.UUID_MAPPING]; });
/**
 * Return the self link of an object in the object-cache based on its UUID
 *
 * @param uuid
 *    the UUID for which you want to find the matching self link
 * @returns
 *    a MemoizedSelector to select the self link
 */
export var selfLinkFromUuidSelector = function (uuid) { return createSelector(objectIndexSelector, function (state) { return hasValue(state) ? state[uuid] : undefined; }); };
/**
 * Return the UUID of a GET request based on its href
 *
 * @param href
 *    the href of the GET request
 * @returns
 *    a MemoizedSelector to select the UUID
 */
export var uuidFromHrefSelector = function (href) { return createSelector(requestIndexSelector, function (state) { return hasValue(state) ? state[href] : undefined; }); };
/**
 * Return the UUID of a cached request based on the UUID of a request
 * that wasn't sent because the response was already cached
 *
 * @param uuid
 *    The UUID of the new request
 * @returns
 *    a MemoizedSelector to select the UUID of the cached request
 */
export var originalRequestUUIDFromRequestUUIDSelector = function (uuid) { return createSelector(requestUUIDIndexSelector, function (state) { return hasValue(state) ? state[uuid] : undefined; }); };
//# sourceMappingURL=index.selectors.js.map