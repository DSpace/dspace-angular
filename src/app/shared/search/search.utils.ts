import { FacetValue } from './models/facet-value.model';
import { SearchFilterConfig } from './models/search-filter-config.model';
import { isNotEmpty } from '../empty.util';

/**
 * Get a facet's value by matching its parameter in the search href, this will include the operator of the facet value
 * If the {@link FacetValue} doesn't contain a search link, its raw value will be returned as a fallback
 * @param facetValue
 * @param searchFilterConfig
 */
export function getFacetValueForType(facetValue: FacetValue, searchFilterConfig: SearchFilterConfig): string {
  return _createValue(searchFilterConfig.paramName, facetValue._links, facetValue.value, facetValue.authorityKey);
}

/**
 * Get a facet's value by matching the label with its parameter in the search href, this will include the operator of the facet value
 * If the {@link FacetValue} doesn't contain a search link, its raw label will be returned as a fallback
 * @param facetValue
 * @param searchFilterConfig
 */
export function getFacetValueForTypeAndLabel(facetValue: FacetValue, searchFilterConfig: SearchFilterConfig): string {
  return _createValue(searchFilterConfig.paramName, facetValue._links, facetValue.label, facetValue.authorityKey);
}

function _createValue(paramName: string, facetValueLinks, value, authorityKey) {
  const regex = new RegExp(`[?|&]${escapeRegExp(encodeURIComponent(paramName))}=(${escapeRegExp(encodeURIComponent(value))}[^&]*)`, 'g');
  if (isNotEmpty(facetValueLinks)) {
    const values = regex.exec(facetValueLinks.search.href);
    if (isNotEmpty(values)) {
      return decodeURIComponent(values[1]);
    }
  }
  if (authorityKey) {
    return addOperatorToFilterValue(authorityKey, 'authority');
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
 * Strip the operator (equals, query or authority) from a filter value.
 * @param value The value from which the operator should be stripped.
 */
export function stripOperatorFromFilterValue(value: string) {
  if (value.match(new RegExp(`.+,(equals|query|authority)$`))) {
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
  if (!value.match(new RegExp(`^.+,(equals|query|authority)$`))) {
    return `${value},${operator}`;
  }
  return value;
}
