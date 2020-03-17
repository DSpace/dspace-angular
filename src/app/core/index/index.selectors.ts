import { createSelector, MemoizedSelector } from '@ngrx/store';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { CoreState } from '../core.reducers';
import { coreSelector } from '../core.selectors';
import { URLCombiner } from '../url-combiner/url-combiner';
import { IndexName, IndexState, MetaIndexState } from './index.reducer';
import * as parse from 'url-parse';

/**
 * Return the given url without `embed` params.
 *
 * E.g. https://rest.api/resource?size=5&embed=subresource&rpp=3
 * becomes https://rest.api/resource?size=5&rpp=3
 *
 * When you index a request url you don't want to include
 * embed params because embedded data isn't relevant when
 * you want to know
 *
 * @param url The url to use
 */
export const getUrlWithoutEmbedParams = (url: string): string => {
  if (isNotEmpty(url)) {
    const parsed = parse(url);
    if (isNotEmpty(parsed.query)) {
      const parts = parsed.query.split(/[?|&]/)
        .filter((part: string) => isNotEmpty(part))
        .filter((part: string) => !part.startsWith('embed='));
      let args = '';
      if (isNotEmpty(parts)) {
        args = `?${parts.join('&')}`;
      }
      url = new URLCombiner(parsed.origin, parsed.pathname, args).toString();
      return url;
    }
  }

  return url;
};

/**
 * Return the MetaIndexState based on the CoreSate
 *
 * @returns
 *    a MemoizedSelector to select the MetaIndexState
 */
export const metaIndexSelector: MemoizedSelector<CoreState, MetaIndexState> = createSelector(
  coreSelector,
  (state: CoreState) => state.index
);

/**
 * Return the object index based on the MetaIndexState
 * It contains all objects in the object cache indexed by UUID
 *
 * @returns
 *    a MemoizedSelector to select the object index
 */
export const objectIndexSelector: MemoizedSelector<CoreState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[IndexName.OBJECT]
);

/**
 * Return the request index based on the MetaIndexState
 *
 * @returns
 *    a MemoizedSelector to select the request index
 */
export const requestIndexSelector: MemoizedSelector<CoreState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[IndexName.REQUEST]
);

/**
 * Return the request UUID mapping index based on the MetaIndexState
 *
 * @returns
 *    a MemoizedSelector to select the request UUID mapping
 */
export const requestUUIDIndexSelector: MemoizedSelector<CoreState, IndexState> = createSelector(
  metaIndexSelector,
  (state: MetaIndexState) => state[IndexName.UUID_MAPPING]
);

/**
 * Return the self link of an object in the object-cache based on its UUID
 *
 * @param uuid
 *    the UUID for which you want to find the matching self link
 * @returns
 *    a MemoizedSelector to select the self link
 */
export const selfLinkFromUuidSelector =
  (uuid: string): MemoizedSelector<CoreState, string> => createSelector(
    objectIndexSelector,
    (state: IndexState) => hasValue(state) ? state[uuid] : undefined
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
  (href: string): MemoizedSelector<CoreState, string> => createSelector(
    requestIndexSelector,
    (state: IndexState) => hasValue(state) ? state[getUrlWithoutEmbedParams(href)] : undefined
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
  (uuid: string): MemoizedSelector<CoreState, string> => createSelector(
    requestUUIDIndexSelector,
    (state: IndexState) => hasValue(state) ? state[uuid] : undefined
  );
