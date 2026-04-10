import {
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-data-type';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { HALLink } from './hal-link.model';
import { NonHierarchicalBrowseDefinition } from './non-hierarchical-browse-definition';
import { ResourceType } from './resource-type';
import { VALUE_LIST_BROWSE_DEFINITION } from './value-list-browse-definition.resource-type';

/**
 * BrowseDefinition model for browses of type 'valueList'
 */
@typedObject
@inheritSerialization(NonHierarchicalBrowseDefinition)
export class ValueListBrowseDefinition extends NonHierarchicalBrowseDefinition {
  static type = VALUE_LIST_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  type: ResourceType = VALUE_LIST_BROWSE_DEFINITION;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    entries: HALLink;
  };

  getRenderType(): BrowseByDataType {
    return this.dataType;
  }
}
