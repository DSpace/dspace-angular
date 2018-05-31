import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { isNull } from '../../shared/empty.util';

const searchResultMap = new Map();

export function searchResultFor(domainConstructor: GenericConstructor<ListableObject>, configuration: string = null) {
  return function decorator(searchResult: any) {
    if (!searchResult) {
      return;
    }
    if (isNull(configuration)) {
      searchResultMap.set(domainConstructor, searchResult);
    } else {
      if (!searchResultMap.get(configuration)) {
        searchResultMap.set(configuration, new Map());
      }
      searchResultMap.get(configuration).set(domainConstructor, searchResult);
    }
  };
}

export function getSearchResultFor(domainConstructor: GenericConstructor<ListableObject>, configuration: string = null) {
  if (isNull(configuration) || configuration === 'default') {
    return searchResultMap.get(domainConstructor);
  } else {
    return searchResultMap.get(configuration).get(domainConstructor);
  }
}
