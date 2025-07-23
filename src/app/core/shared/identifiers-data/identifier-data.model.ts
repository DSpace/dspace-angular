import { typedObject } from '@core/cache/builders/build-decorators';
import { CacheableObject } from '@core/cache/cacheable-object.model';
import { HALLink } from '@core/shared/hal-link.model';
import { ResourceType } from '@core/shared/resource-type';
import { excludeFromEquals } from '@core/utilities/equals.decorators';
import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { Identifier } from './identifier.model';
import { IDENTIFIERS } from './identifier-data.resource-type';

@typedObject
export class IdentifierData implements CacheableObject {
  static type = IDENTIFIERS;
  /**
   * The type for this IdentifierData
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The
   */
  @autoserialize
  identifiers: Identifier[];

  /**
   * The {@link HALLink}s for this IdentifierData
   */
   @deserialize
     _links: {
     self: HALLink;
   };
}
