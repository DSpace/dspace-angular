import { autoserialize, autoserializeAs } from 'cerialize';
import { SortOption } from './sort-option.model';
import { ResourceType } from './resource-type';
import { TypedObject } from '../cache/object-cache.reducer';

export class BrowseDefinition implements TypedObject {
  @autoserialize
  id: string;

  @autoserialize
  metadataBrowse: boolean;

  @autoserialize
  sortOptions: SortOption[];

  @autoserializeAs('order')
  defaultSortOrder: string;

  @autoserialize
  type: ResourceType;

  @autoserializeAs('metadata')
  metadataKeys: string[];

  @autoserialize
  _links: {
    [name: string]: string
  }
}
