import { StatisticsChartBarComponent } from './statistics-chart/statistics-chart-bar/statistics-chart-bar.component';
import { StatisticsChartLineComponent } from './statistics-chart/statistics-chart-line/statistics-chart-line.component';
import { StatisticsChartPieComponent } from './statistics-chart/statistics-chart-pie/statistics-chart-pie.component';
import { StatisticsTableComponent } from './statistics-chart/statistics-table/statistics-table.component';
import { StatisticsType } from './statistics-type.model';

/**
 * Contains the mapping between a chart component and a StatisticsType
 */
const statisticsTypeMap = new Map();

statisticsTypeMap.set(StatisticsType['chart.bar'], StatisticsChartBarComponent);
statisticsTypeMap.set(StatisticsType['chart.pie'], StatisticsChartPieComponent);
statisticsTypeMap.set(StatisticsType['chart.line'], StatisticsChartLineComponent);
statisticsTypeMap.set(StatisticsType.table, StatisticsTableComponent);

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
