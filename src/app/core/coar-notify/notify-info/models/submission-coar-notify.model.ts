import {
  autoserialize,
  deserialize,
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../cache/builders/build-decorators';
import { CacheableObject } from '../../../cache/cacheable-object.model';
import { ResourceType } from '../../../shared/resource-type';
import { SUBMISSION_COAR_NOTIFY_CONFIG } from '../../../shared/section-coar-notify-service.resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';

export  interface LdnPattern {
  pattern: string,
  multipleRequest: boolean
}
/** A SubmissionCoarNotifyConfig and its properties. */
@typedObject
@inheritSerialization(CacheableObject)
export class SubmissionCoarNotifyModel extends CacheableObject {
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
