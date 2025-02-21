import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../cache';
import { CacheableObject } from '../cache';
import { HALLink } from '../shared';
import { ResourceType } from '../shared';
import { excludeFromEquals } from '../utilities';
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
