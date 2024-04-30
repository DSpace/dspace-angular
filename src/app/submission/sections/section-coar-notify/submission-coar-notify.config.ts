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
import { SUBMISSION_COAR_NOTIFY_CONFIG } from './section-coar-notify-service.resource-type';

export  interface LdnPattern {
  pattern: string,
  multipleRequest: boolean
}
/** A SubmissionCoarNotifyConfig and its properties. */
@typedObject
@inheritSerialization(CacheableObject)
export class SubmissionCoarNotifyConfig extends CacheableObject {
  static type = SUBMISSION_COAR_NOTIFY_CONFIG;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: string;

  @deserializeAs('id')
  uuid: string;

  @autoserialize
  patterns: LdnPattern[];

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
