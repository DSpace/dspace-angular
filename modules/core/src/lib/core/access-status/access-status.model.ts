import {
  autoserialize,
  deserialize,
} from 'cerialize';
import { typedObject } from '@dspace/core';
import { CacheableObject } from '@dspace/core';
import { HALLink } from '@dspace/core';
import { ResourceType } from '@dspace/core';
import { excludeFromEquals } from '@dspace/core';

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
