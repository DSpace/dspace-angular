import { SEARCH_RESULT_FOR_MAP } from '../../../decorator-registries/search-result-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ListableObject } from '../../core/shared/object-collection/listable-object.model';
import { hasNoValue } from '../../utils/empty.util';

/**
 * Requests the matching search-result class based on a given DSpaceObject's constructor.
 * Synchronous because `searchResultFor` is configured with `synchronous: true` in the decorator registry.
 *
 * Kept in a separate module from the `searchResultFor` marker so the registry can statically import
 * decorated classes without forming a circular dependency.
 *
 * @param domainConstructor The DSpaceObject's constructor for which the search result class is requested
 * @returns The search-result class constructor that matches the given DSpaceObject
 */
export function getSearchResultFor(domainConstructor: GenericConstructor<ListableObject>): GenericConstructor<ListableObject> {
  const searchResultConstructor = SEARCH_RESULT_FOR_MAP.get(domainConstructor);
  if (hasNoValue(searchResultConstructor)) {
    return undefined;
  }
  return searchResultConstructor as GenericConstructor<ListableObject>;
}
