import { inheritSerialization, deserialize } from 'cerialize';
import { typedObjectWithSubType } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { VALUE_LIST_BROWSE_DEFINITION } from './value-list-browse-definition.resource-type';
import { ResourceType } from './resource-type';
import { NonHierarchicalBrowseDefinition } from './non-hierarchical-browse-definition';
import { HALLink } from './hal-link.model';

/**
 * BrowseDefinition model for browses of type 'valueList'
 */
@typedObjectWithSubType('browseType')
@inheritSerialization(NonHierarchicalBrowseDefinition)
export class ValueListBrowseDefinition extends NonHierarchicalBrowseDefinition {
  static browseType = VALUE_LIST_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  browseType: ResourceType = VALUE_LIST_BROWSE_DEFINITION;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    entries: HALLink;
  };

  getRenderType(): string {
    return this.dataType;
  }
}
