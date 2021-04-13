import { StatisticsType } from './statistics-type.model';

/**
 * Contains the mapping between a chart component and a StatisticsType
 */
const statisticsTypeMap = new Map();

/**
 * Sets the mapping for a chart component in relation to a Statistics type
 * @param {StatisticsType} type The type for which the matching component is mapped
 * @returns Decorator function that performs the actual mapping on initialization of the chart component
 */
export function renderChartFor(type: StatisticsType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    statisticsTypeMap.set(type, objectElement);
  };
}

/**
 * Requests the matching chart component based on a given Statistics type
 * @param {StatisticsType} type The Statistics type for which the chart component is requested
 * @returns The chart component's constructor that matches the given Statistics type
 */
export function renderChartStatisticsType(type: StatisticsType) {
  return statisticsTypeMap.get(type);
}
