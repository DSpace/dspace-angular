
import { FilterType } from '../../search-service/filter-type.model';

const filterTypeMap = new Map();

/**
 * Sets the mapping for a component in relation to a filter type
 * @param {FilterType} type The type for which the matching component is mapped
 * @returns Decorator function that performs the actual mapping on initialization of the component
 */
export function renderFacetFor(type: FilterType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    filterTypeMap.set(type, objectElement);
  };
}

/**
 * Requests the matching component based on a given filter type
 * @param {FilterType} type The filter type for which the component is requested
 * @returns The component's constructor that matches the given filter type
 */
export function renderFilterType(type: FilterType) {
  return filterTypeMap.get(type);
}
