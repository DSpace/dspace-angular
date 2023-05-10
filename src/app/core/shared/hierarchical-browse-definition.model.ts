import { autoserialize, autoserializeAs, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { HIERARCHICAL_BROWSE_DEFINITION } from './hierarchical-browse-definition.resource-type';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { BrowseDefinition } from './browse-definition';

@typedObject
export class HierarchicalBrowseDefinition extends CacheableObject implements BrowseDefinition {
  static type = HIERARCHICAL_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  type: ResourceType = HIERARCHICAL_BROWSE_DEFINITION;

  @autoserialize
  id: string;

  @autoserialize
  facetType: string;

  @autoserialize
  vocabulary: string;

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
    vocabulary: HALLink;
  };

  getRenderType(): string {
    return 'hierarchy';
  }
}
