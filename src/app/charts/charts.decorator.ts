import { Component } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_CHART_TYPE_FOR_MAP } from '../../decorator-registries/render-chart-type-for-registry';
import { ChartType } from './models/chart-type';

/**
 * Decorator used to register a chart component for a given chart type.
 * @param {ChartType} chartType The chart type the decorated component renders
 */
export function renderChartTypeFor(chartType: ChartType) {
  return function decorator(objectElement: any) {};
}

/**
 * Requests the matching chart component based on a given chart type
 * @param {ChartType} chartType The chart type for which the chart component is requested
 * @param registry The registry containing all the chart components
 * @returns A promise resolving to the chart component's constructor that matches the given chart type
 */
export function rendersChartType(
  chartType: ChartType,
  registry: Map<string, () => Promise<any>> = RENDER_CHART_TYPE_FOR_MAP,
): Promise<GenericConstructor<Component>> {
  const lazyComponent: () => Promise<any> = registry.get(chartType);
  return hasValue(lazyComponent) ? lazyComponent() : undefined;
}
