import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

const searchResultMap = new Map();

export function searchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
  return function decorator(searchResult: any) {
    if (!searchResult) {
      return;
    }
    searchResultMap.set(domainConstructor, searchResult);
  };
}

export function getSearchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
  return searchResultMap.get(domainConstructor);
}
