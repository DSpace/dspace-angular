import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { SortOption } from './sort-option.model';
import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-decorator';
import { BrowseDefinition } from './browse-definition.model';

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

  @autoserializeAs('metadata')
  metadataKeys: string[];

  @autoserialize
  dataType: BrowseByDataType;
}
