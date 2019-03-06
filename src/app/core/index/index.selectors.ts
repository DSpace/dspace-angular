import { createSelector, MemoizedSelector } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { hasValue } from '../../shared/empty.util';
import { CoreState } from '../core.reducers';
import { coreSelector } from '../core.selectors';
import { IndexName, IndexState, MetaIndexState } from './index.reducer';

export const metaIndexSelector: MemoizedSelector<AppState, MetaIndexState> = createSelector(
  coreSelector,
  (state: CoreState) => state.index
);
export const objectIndexSelector: MemoizedSelector<AppState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[IndexName.OBJECT]
);
export const requestIndexSelector: MemoizedSelector<AppState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[IndexName.REQUEST]
);
export const requestUUIDIndexSelector: MemoizedSelector<AppState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[IndexName.UUID_MAPPING]
);
export const selfLinkFromUuidSelector =
  (uuid: string): MemoizedSelector<AppState, string> => createSelector(
    objectIndexSelector,
    (state: IndexState) => hasValue(state) ? state[uuid] : undefined
  );
export const uuidFromHrefSelector =
  (href: string): MemoizedSelector<AppState, string> => createSelector(
    requestIndexSelector,
    (state: IndexState) => hasValue(state) ? state[href] : undefined
  );
/**
 * If a request wasn't sent to the server because the result was already cached,
 * this selector allows you to find the UUID of the cached request based on the
 * UUID of the new request
 *
 * @param uuid    The uuid of the new request
 */
export const originalRequestUUIDFromRequestUUIDSelector =
  (uuid: string): MemoizedSelector<AppState, string> => createSelector(
    requestUUIDIndexSelector,
    (state: IndexState) => hasValue(state) ? state[uuid] : undefined
  );
