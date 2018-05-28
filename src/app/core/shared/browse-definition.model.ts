import { autoserialize, autoserializeAs } from 'cerialize';
import { SortOption } from './sort-option.model';

export class BrowseDefinition {
  @autoserialize
  id: string;

  @autoserialize
  metadataBrowse: boolean;

  @autoserialize
  sortOptions: SortOption[];

  @autoserializeAs('order')
  defaultSortOrder: string;

  @autoserialize
  type: string;

  @autoserializeAs('metadata')
  metadataKeys: string[];

  @autoserialize
  _links: {
    [name: string]: string
  }
}
