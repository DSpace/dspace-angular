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
  return _createValue(searchFilterConfig.paramName, facetValue._links, facetValue.value);
}

/**
 * Get a facet's value by matching the label with its parameter in the search href, this will include the operator of the facet value
 * If the {@link FacetValue} doesn't contain a search link, its raw label will be returned as a fallback
 * @param facetValue
 * @param searchFilterConfig
 */
export function getFacetValueForTypeAndLabel(facetValue: FacetValue, searchFilterConfig: SearchFilterConfig): string {
  return _createValue(searchFilterConfig.paramName, facetValue._links, facetValue.label);
}

function _createValue(paramName: string, facetValueLinks, value) {
  const regex = new RegExp(`[?|&]${escapeRegExp(paramName)}=(${escapeRegExp(value)}[^&]*)`, 'g');
  if (isNotEmpty(facetValueLinks)) {
    const values = regex.exec(facetValueLinks.search.href);
    if (isNotEmpty(values)) {
      return values[1];
    }
  }
  return addOperatorToFilterValue(value, 'equals');
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
