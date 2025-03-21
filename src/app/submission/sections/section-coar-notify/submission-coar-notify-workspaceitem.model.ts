import {
  autoserialize,
  deserialize,
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { COAR_NOTIFY_WORKSPACEITEM } from './section-coar-notify-service.resource-type';

/** An CoarNotify  and its properties. */
@typedObject
@inheritSerialization(CacheableObject)
export class SubmissionCoarNotifyWorkspaceitemModel extends CacheableObject {
  static type = COAR_NOTIFY_WORKSPACEITEM;

  @excludeFromEquals
  @autoserialize
  endorsement?: number[];

  @deserializeAs('id')
  review?: number[];

  @autoserialize
  ingest?: number[];

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
