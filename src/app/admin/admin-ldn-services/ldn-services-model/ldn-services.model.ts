import {
  autoserialize,
  deserialize,
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { ResourceType } from '../../../core/shared/resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { LDN_SERVICE } from './ldn-service.resource-type';
import { NotifyServicePattern } from './ldn-service-patterns.model';

/**
 * LDN Services bounded to each selected pattern, relation set in service creation
 */

export interface LdnServiceByPattern {
  allowsMultipleRequests: boolean;
  services: LdnService[];
}

/** An LdnService  and its properties. */
@typedObject
@inheritSerialization(CacheableObject)
export class LdnService extends CacheableObject {
  static type = LDN_SERVICE;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: number;

  @deserializeAs('id')
  uuid: string;

  @autoserialize
  name: string;

  @autoserialize
  description: string;

  @autoserialize
  url: string;

  @autoserialize
  score: number;

  @autoserialize
  enabled: boolean;

  @autoserialize
  usesActorEmailId: boolean;

  @autoserialize
  ldnUrl: string;

  @autoserialize
  lowerIp: string;

  @autoserialize
  upperIp: string;

  @autoserialize
  notifyServiceInboundPatterns?: NotifyServicePattern[];

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
