
import { FilterType } from '../../search-service/filter-type.model';

const filterTypeMap = new Map();

export function renderFacetFor(type: FilterType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    filterTypeMap.set(type, objectElement);
  };
}

export function renderFilterType(type: FilterType) {
  return filterTypeMap.get(type);
}
