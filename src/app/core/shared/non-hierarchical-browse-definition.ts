import {
  autoserialize,
  autoserializeAs,
  inheritSerialization,
} from 'cerialize';

import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-data-type';
import { BrowseDefinition } from './browse-definition.model';
import { SortOption } from './sort-option.model';

/**
 * Super class for NonHierarchicalBrowseDefinition models,
 * e.g. FlatBrowseDefinition and ValueListBrowseDefinition
 */
@inheritSerialization(BrowseDefinition)
export abstract class NonHierarchicalBrowseDefinition extends BrowseDefinition {

  @autoserialize
  sortOptions: SortOption[];

  @autoserializeAs('order')
  defaultSortOrder: string;

  @autoserialize
  dataType: BrowseByDataType;
}
