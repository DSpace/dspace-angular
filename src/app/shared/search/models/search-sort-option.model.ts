import { autoserialize } from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { ResourceType } from '../../../core/shared/resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { SEARCH_SORT_OPTION } from './types/search-sort-option.resource-type';

@typedObject
export class SearchSortOption {
  static type = SEARCH_SORT_OPTION;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  name: string;

  @autoserialize
  sortOrder: string;
}
