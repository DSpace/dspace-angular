import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../cache/builders/build-decorators';
import { CacheableObject } from '../../../cache/cacheable-object.model';
import { ResourceType } from '../../../shared/resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
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
