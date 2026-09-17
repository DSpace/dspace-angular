import { typedObject } from '@dspace/core/cache/builders/build-decorators';
import { CacheableObject } from '@dspace/core/cache/cacheable-object.model';
import { HALLink } from '@dspace/core/shared/hal-link.model';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { excludeFromEquals } from '@dspace/core/utilities/equals.decorators';
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
