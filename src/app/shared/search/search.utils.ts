import { FacetValue } from './facet-value.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { isNotEmpty } from '../empty.util';

/**
 * Get a facet's value by matching its parameter in the search href, this will include the operator of the facet value
 * If the {@link FacetValue} doesn't contain a search link, its raw value will be returned as a fallback
 * @param facetValue
 * @param searchFilterConfig
 */
export function getFacetValueForType(facetValue: FacetValue, searchFilterConfig: SearchFilterConfig): string {
  const regex = new RegExp(`[?|&]${escapeRegExp(searchFilterConfig.paramName)}=(${escapeRegExp(facetValue.value)}[^&]*)`, 'g');
  if (isNotEmpty(facetValue._links)) {
    const values = regex.exec(facetValue._links.search.href);
    if (isNotEmpty(values)) {
      return values[1];
    }
  }
  return addOperatorToFilterValue(facetValue.value, 'equals');
}

/**
 * Escape a string to be used in a JS regular expression
 *
 * @param input the string to escape
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Strip the operator from a filter value
 * Warning: This expects the value to end with an operator, otherwise it might strip unwanted content
 * @param value
 */
export function stripOperatorFromFilterValue(value: string) {
  if (value.lastIndexOf(',') > -1) {
    return value.substring(0, value.lastIndexOf(','));
  }
  return value;
}

/**
 * Add an operator to a string
 * @param value
 * @param operator
 */
export function addOperatorToFilterValue(value: string, operator: string) {
  if (!value.endsWith(`,${operator}`)) {
    return `${value},${operator}`;
  }
  return value;
}
