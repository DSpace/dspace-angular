import { SEARCH_RESULT_FOR_MAP } from '../../../decorator-registries/search-result-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasNoValue } from '../empty.util';
import { ListableObject } from '../object-collection/shared/listable-object.model';

/**
 * Used to map Search Result components to their matching DSpaceObject
 * @param {GenericConstructor<ListableObject>} domainConstructor The constructor of the DSpaceObject
 * @returns Decorator function that performs the actual mapping on initialization of the component
 */
export function searchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
  return function decorator(searchResult: any) {
  };
}

/**
 * Requests the matching component based on a given DSpaceObject's constructor
 * @param {GenericConstructor<ListableObject>} domainConstructor The DSpaceObject's constructor for which the search result component is requested
 * @returns The component's constructor that matches the given DSpaceObject
 */
export function getSearchResultFor(domainConstructor: GenericConstructor<ListableObject>): Promise<GenericConstructor<ListableObject>> {
  const componentImport = SEARCH_RESULT_FOR_MAP.get(domainConstructor);
  if (hasNoValue(componentImport)) {
    return undefined;
  }
  return componentImport() as Promise<GenericConstructor<ListableObject>>;
}
