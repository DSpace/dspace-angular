import { typedObject } from '../../../core/cache/builders/build-decorators';
import { SEARCH_SORT_OPTION } from './types/search-sort-option.resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { autoserialize } from 'cerialize';
import { ResourceType } from '../../../core/shared/resource-type';

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
