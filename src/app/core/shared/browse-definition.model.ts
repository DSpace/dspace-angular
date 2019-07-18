import { autoserialize, autoserializeAs } from 'cerialize';
import { SortOption } from './sort-option.model';
import { ResourceType } from './resource-type';
import { TypedObject } from '../cache/object-cache.reducer';

export class BrowseDefinition implements TypedObject {
  static type = new ResourceType('browse');

  @autoserialize
  id: string;

  @autoserialize
  metadataBrowse: boolean;

  @autoserialize
  sortOptions: SortOption[];

  @autoserializeAs('order')
  defaultSortOrder: string;

  @autoserializeAs('metadata')
  metadataKeys: string[];

  @autoserialize
  _links: {
    [name: string]: string
  }
}
