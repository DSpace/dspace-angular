import {
  autoserialize,
  deserialize,
} from 'cerialize';

import {
  CacheableObject,
  typedObject,
} from '../cache';
import {
  HALLink,
  ResourceType,
} from '../shared';
import { excludeFromEquals } from '../utilities';
import { ACCESS_STATUS } from './access-status.resource-type';

@typedObject
export class AccessStatusObject implements CacheableObject {
  static type = ACCESS_STATUS;

  /**
   * The type for this AccessStatusObject
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The access status value
   */
  @autoserialize
  status: string;

  /**
   * The {@link HALLink}s for this AccessStatusObject
   */
   @deserialize
     _links: {
     self: HALLink;
   };
}
