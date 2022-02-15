import { FilterType } from '../models/filter-type.model';

/**
 * Contains the mapping between a chart component and a FilterType
 */
const filterTypeMap = new Map();

/**
 * Sets the mapping for a chart component in relation to a filter type
 * @param {FilterType} type The type for which the matching component is mapped
 * @returns Decorator function that performs the actual mapping on initialization of the chart component
 */
export function renderChartFor(type: FilterType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    filterTypeMap.set(type, objectElement);
  };
}

/**
 * Requests the matching chart component based on a given filter type
 * @param {FilterType} type The filter type for which the chart component is requested
 * @returns The chart component's constructor that matches the given filter type
 */
export function renderChartFilterType(type: FilterType) {
  return filterTypeMap.get(type);
}
