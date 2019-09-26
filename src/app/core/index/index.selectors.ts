import { createSelector, MemoizedSelector } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { hasValue } from '../../shared/empty.util';
import { CoreState } from '../core.reducers';
import { coreSelector } from '../core.selectors';
import {
  getIdentiferByIndexName,
  IdentifierType,
  IndexState,
  MetaIndexState,
  REQUEST,
  UUID_MAPPING
} from './index.reducer';

/**
 * Return the MetaIndexState based on the CoreSate
 *
 * @returns
 *    a MemoizedSelector to select the MetaIndexState
 */
export const metaIndexSelector: MemoizedSelector<AppState, MetaIndexState> = createSelector(
  coreSelector,
  (state: CoreState) => state.index
);

/**
 * Return the object index based on the MetaIndexState
 * It contains all objects in the object cache indexed by UUID
 *
 * @param identifierType the type of index, used to select index from state
 *
 * @returns
 *    a MemoizedSelector to select the object index
 */
export const objectIndexSelector = (identifierType: IdentifierType = IdentifierType.UUID): MemoizedSelector<AppState, IndexState> => {
  return createSelector(
    metaIndexSelector,
    (state: MetaIndexState) => state[getIdentiferByIndexName(identifierType)]
  );
}

/**
 * Return the request index based on the MetaIndexState
 *
 * @returns
 *    a MemoizedSelector to select the request index
 */
export const requestIndexSelector: MemoizedSelector<AppState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[REQUEST]
);

/**
 * Return the request UUID mapping index based on the MetaIndexState
 *
 * @returns
 *    a MemoizedSelector to select the request UUID mapping
 */
export const requestUUIDIndexSelector: MemoizedSelector<AppState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[UUID_MAPPING]
);

/**
 * Return the self link of an object in the object-cache based on its UUID
 *
 * @param id
 *    the UUID for which you want to find the matching self link
 * @param identifierType the type of index, used to select index from state
 * @returns
 *    a MemoizedSelector to select the self link
 */
export const selfLinkFromUuidSelector =
  (id: string, identifierType: IdentifierType = IdentifierType.UUID): MemoizedSelector<AppState, string> => createSelector(
    objectIndexSelector(identifierType),
    (state: IndexState) => hasValue(state) ? state[id] : undefined
  );

/**
 * Return the UUID of a GET request based on its href
 *
 * @param href
 *    the href of the GET request
 * @returns
 *    a MemoizedSelector to select the UUID
 */
export const uuidFromHrefSelector =
  (href: string): MemoizedSelector<AppState, string> => createSelector(
    requestIndexSelector,
    (state: IndexState) => hasValue(state) ? state[href] : undefined
  );

/**
 * Return the UUID of a cached request based on the UUID of a request
 * that wasn't sent because the response was already cached
 *
 * @param uuid
 *    The UUID of the new request
 * @returns
 *    a MemoizedSelector to select the UUID of the cached request
 */
export const originalRequestUUIDFromRequestUUIDSelector =
  (uuid: string): MemoizedSelector<AppState, string> => createSelector(
    requestUUIDIndexSelector,
    (state: IndexState) => hasValue(state) ? state[uuid] : undefined
  );
