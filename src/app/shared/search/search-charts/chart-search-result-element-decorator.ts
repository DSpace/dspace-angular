import { Component } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_CHART_FILTER_FOR_MAP } from '../../../../decorator-registries/render-chart-filter-for-registry';

/**
 * Decorator used to register a chart filter component for a given filter type.
 *
 * @param {FilterType | string} type The filter type the decorated component renders
 */
export function renderChartFilterFor(type: FilterType | string) {
  return function decorator(objectElement: any) {};
}

/**
 * Requests the matching chart component based on a given filter type
 * @param {FilterType} type The filter type for which the chart component is requested
 * @param registry The registry containing all the chart filter components
 * @returns A promise resolving to the chart component's constructor that matches the given filter type
 */
export function renderChartFilterType(
  type: FilterType | string,
  registry: Map<string, () => Promise<any>> = RENDER_CHART_FILTER_FOR_MAP,
): Promise<GenericConstructor<Component>> {
  const lazyComponent: () => Promise<any> = registry.get(type);
  return hasValue(lazyComponent) ? lazyComponent() : undefined;
}
