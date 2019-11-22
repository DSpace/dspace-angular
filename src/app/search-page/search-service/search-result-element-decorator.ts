import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { hasNoValue, isNull } from '../../shared/empty.util';

/**
 * Contains the mapping between a search result component and a DSpaceObject
 */
const searchResultMap = new Map();

/**
 * Used to map Search Result components to their matching DSpaceObject
 * @param {GenericConstructor<ListableObject>} domainConstructor The constructor of the DSpaceObject
 * @returns Decorator function that performs the actual mapping on initialization of the component
 */
export function searchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
  return function decorator(searchResult: any) {
    if (!searchResult) {
      return;
    }
    searchResultMap.set(domainConstructor, searchResult);
  };
}

/**
 * Requests the matching component based on a given DSpaceObject's constructor
 * @param {GenericConstructor<ListableObject>} domainConstructor The DSpaceObject's constructor for which the search result component is requested
 * @returns The component's constructor that matches the given DSpaceObject
 */
export function getSearchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
    return searchResultMap.get(domainConstructor);
}
