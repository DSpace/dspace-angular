import { Component } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_FACET_FOR_MAP } from '../../../../../decorator-registries/render-facet-for-registry';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../../object-collection/shared/listable-object/listable-object.decorator';

/**
 * Contains the mapping between a facet component and a FilterType
 */
const filterTypeMap = new Map();

export const DEFAULT_FILTER_TYPE = FilterType.text;

/**
 * Decorator for a facet component in relation to a filter type
 *
 * @param {FilterType} type The type for which the matching component is mapped
 * @param theme The theme for which the matching component is mapped
 * @returns Decorator function that performs the actual mapping on initialization of the facet component
 */
export function renderFacetFor(type: FilterType, theme = DEFAULT_THEME) {
  return function decorator(objectElement: any) {
  };
}

/**
 * Requests the matching facet component based on a given filter type
 *
 * @param type The filter type for which the facet component is requested
 * @param theme The theme to retrieve the component for
 * @param registry The registry containing all the components
 * @returns The facet component's constructor that matches the given filter type
 */
export function renderFilterType(type: FilterType, theme: string, registry: Map<string, Map<string, () => Promise<any>>> = RENDER_FACET_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [type, theme], [DEFAULT_FILTER_TYPE, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
