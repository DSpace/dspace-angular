import { autoserialize, autoserializeAs, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { CacheableObject } from '../cache/object-cache.reducer';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { BROWSE_DEFINITION } from './browse-definition.resource-type';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';
import { SortOption } from './sort-option.model';

@typedObject
export class BrowseDefinition extends CacheableObject {
  static type = BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

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

  @deserialize
  _links: {
    self: HALLink;
    entries: HALLink;
    items: HALLink;
  };
}
