import {
  autoserialize,
  deserialize,
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '@dspace/core';
import { CacheableObject } from '@dspace/core';
import { excludeFromEquals } from '@dspace/core';
import { COAR_NOTIFY_WORKSPACEITEM } from '../../../../../modules/core/src/lib/core/coar-notify/section-coar-notify-service.resource-type';

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
