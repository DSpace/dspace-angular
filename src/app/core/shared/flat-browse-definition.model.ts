import {
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-data-type';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { FLAT_BROWSE_DEFINITION } from './flat-browse-definition.resource-type';
import { HALLink } from './hal-link.model';
import { NonHierarchicalBrowseDefinition } from './non-hierarchical-browse-definition';
import { ResourceType } from './resource-type';

/**
 * BrowseDefinition model for browses of type 'flatBrowse'
 */
@typedObject
@inheritSerialization(NonHierarchicalBrowseDefinition)
export class FlatBrowseDefinition extends NonHierarchicalBrowseDefinition {
  static type = FLAT_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  type: ResourceType = FLAT_BROWSE_DEFINITION;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    items: HALLink;
  };

  getRenderType(): BrowseByDataType {
    return this.dataType;
  }
}
