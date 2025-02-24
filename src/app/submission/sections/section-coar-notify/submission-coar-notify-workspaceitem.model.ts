import {
  CacheableObject,
  COAR_NOTIFY_WORKSPACEITEM,
  excludeFromEquals,
  typedObject,
} from '@dspace/core';
import {
  autoserialize,
  deserialize,
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

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
