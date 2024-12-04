import {
  autoserialize,
  deserialize,
} from 'cerialize';


import { ACCESS_STATUS } from './access-status.resource-type';
import { CacheableObject, typedObject } from '../cache';
import { excludeFromEquals } from '../utilities';
import { HALLink, ResourceType } from '../shared';

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
