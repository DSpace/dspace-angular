import { autoserialize } from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import {
  SortDirection,
  SortOptions,
} from '../../../core/cache/models/sort-options.model';
import { ResourceType } from '../../../core/shared/resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { SEARCH_SORT_OPTION } from './types/search-sort-option.resource-type';

/**
 * An option to sort search results by
 */
@typedObject
export class SearchSortOption {
  static type = SEARCH_SORT_OPTION;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * Name of the sort option, defines what to sort the search results by
   */
  @autoserialize
  name: string;

  /**
   * The direction of the sort order, asc or desc
   */
  @autoserialize
  sortOrder: string;

  get option(): SortOptions {
    return new SortOptions(this.name, this.sortOrder === 'asc' ? SortDirection.ASC : SortDirection.DESC);
  }
}
