import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';

import { GenericConstructor } from '../../core/shared/generic-constructor';

/**
 * Used to map Search Result classes to their matching DSpaceObject
 * @param {GenericConstructor<ListableObject>} domainConstructor The constructor of the DSpaceObject
 * @returns Decorator function that performs the actual mapping on initialization of the class
 *
 * Note: this file must not import the generated registry. The registry statically imports the
 * decorated classes, which in turn import this decorator — importing the registry here would
 * create a circular dependency. Use `getSearchResultFor` from `./search-result-element-decorator-sync` instead.
 */
export function searchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
  return function decorator(searchResult: any) {
  };
}
