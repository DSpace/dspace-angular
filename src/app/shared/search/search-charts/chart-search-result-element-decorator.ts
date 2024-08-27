import { FilterType } from '../models/filter-type.model';
import { SearchChartBarComponent } from './search-chart/search-chart-bar/search-chart-bar.component';
import { SearchChartBarHorizontalComponent } from './search-chart/search-chart-bar-horizontal/search-chart-bar-horizontal.component';
import { SearchChartBarToLeftComponent } from './search-chart/search-chart-bar-to-left/search-chart-bar-to-left.component';
import { SearchChartBarToRightComponent } from './search-chart/search-chart-bar-to-right/search-chart-bar-to-right.component';
import { SearchChartLineComponent } from './search-chart/search-chart-line/search-chart-line.component';
import { SearchChartPieComponent } from './search-chart/search-chart-pie/search-chart-pie.component';

/**
 * Contains the mapping between a chart component and a FilterType
 */
const filterTypeMap = new Map();

filterTypeMap.set(FilterType['chart.bar.horizontal'], SearchChartBarHorizontalComponent);
filterTypeMap.set(FilterType['chart.reverse-bar.horizontal'], SearchChartBarHorizontalComponent);
filterTypeMap.set(FilterType['chart.bar.right-to-left'], SearchChartBarToLeftComponent);
filterTypeMap.set(FilterType['chart.bar.left-to-right'], SearchChartBarToRightComponent);
filterTypeMap.set(FilterType['chart.bar'], SearchChartBarComponent);
filterTypeMap.set(FilterType['chart.reverse-bar'], SearchChartBarComponent);
filterTypeMap.set(FilterType['chart.line'], SearchChartLineComponent);
filterTypeMap.set(FilterType['chart.pie'], SearchChartPieComponent);

/**
 * deprecated
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
