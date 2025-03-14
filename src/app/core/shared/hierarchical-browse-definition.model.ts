import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-data-type';
import { typedObjectWithSubType } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { BrowseDefinition } from './browse-definition.model';
import { HALLink } from './hal-link.model';
import { HIERARCHICAL_BROWSE_DEFINITION } from './hierarchical-browse-definition.resource-type';
import { ResourceType } from './resource-type';

/**
 * BrowseDefinition model for browses of type 'hierarchicalBrowse'
 */
@typedObjectWithSubType('browseType')
@inheritSerialization(BrowseDefinition)
export class HierarchicalBrowseDefinition extends BrowseDefinition {
  static browseType = HIERARCHICAL_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  browseType: ResourceType = HIERARCHICAL_BROWSE_DEFINITION;

  @autoserialize
  facetType: string;

  @autoserialize
  vocabulary: string;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    vocabulary: HALLink;
  };

  getRenderType(): BrowseByDataType {
    return BrowseByDataType.Hierarchy;
  }
}
