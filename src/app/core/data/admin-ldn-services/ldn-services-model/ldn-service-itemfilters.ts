import { typedObject } from '@dspace/core/cache/builders/build-decorators';
import { CacheableObject } from '@dspace/core/cache/cacheable-object.model';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { excludeFromEquals } from '@dspace/core/utilities/equals.decorators';
import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { LDN_SERVICE_CONSTRAINT_FILTER } from './ldn-service.resource-type';

/** A single filter value and its properties. */
@typedObject
@inheritSerialization(CacheableObject)
export class Itemfilter extends CacheableObject {
  static type = LDN_SERVICE_CONSTRAINT_FILTER;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: string;

  @deserialize
  _links: {
    self: {
      href: string;
    };
  };

  get self(): string {
    return this._links.self.href;
  }
}
