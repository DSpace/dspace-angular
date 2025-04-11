import { inheritSerialization, deserialize } from 'cerialize';
import { typedObjectWithSubType } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { FLAT_BROWSE_DEFINITION } from './flat-browse-definition.resource-type';
import { ResourceType } from './resource-type';
import { NonHierarchicalBrowseDefinition } from './non-hierarchical-browse-definition';
import { HALLink } from './hal-link.model';

/**
 * BrowseDefinition model for browses of type 'flatBrowse'
 */
@typedObjectWithSubType('browseType')
@inheritSerialization(NonHierarchicalBrowseDefinition)
export class FlatBrowseDefinition extends NonHierarchicalBrowseDefinition {
  static browseType = FLAT_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  browseType: ResourceType = FLAT_BROWSE_DEFINITION;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    items: HALLink;
  };

  getRenderType(): string {
    return this.dataType;
  }
}
