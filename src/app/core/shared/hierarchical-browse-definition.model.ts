import { autoserialize, autoserializeAs, deserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { HIERARCHICAL_BROWSE_DEFINITION } from './hierarchical-browse-definition.resource-type';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';
import { BrowseDefinition } from './browse-definition.model';

/**
 * BrowseDefinition model for browses of type 'hierarchicalBrowse'
 */
@typedObject
@inheritSerialization(BrowseDefinition)
export class HierarchicalBrowseDefinition extends BrowseDefinition {
  static type = HIERARCHICAL_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  type: ResourceType = HIERARCHICAL_BROWSE_DEFINITION;

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
    vocabulary: HALLink;
  };

  getRenderType(): string {
    return 'hierarchy';
  }
}
