import { autoserialize, autoserializeAs } from 'cerialize';
import { TypedObject } from '../cache/object-cache.reducer';
import { BROWSE_DEFINITION } from './browse-definition.resource-type';
import { HALLink } from './hal-link.model';
import { SortOption } from './sort-option.model';

export class BrowseDefinition implements TypedObject {
  static type = BROWSE_DEFINITION;

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

  get self(): string {
    return this._links.self.href;
  }

  @autoserialize
  _links: {
    self: HALLink;
    entries: HALLink;
    items: HALLink;
  };
}
