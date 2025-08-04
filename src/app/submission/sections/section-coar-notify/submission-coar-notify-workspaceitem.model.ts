import { typedObject } from '@dspace/core/cache/builders/build-decorators';
import { CacheableObject } from '@dspace/core/cache/cacheable-object.model';
import { COAR_NOTIFY_WORKSPACEITEM } from '@dspace/core/shared/section-coar-notify-service.resource-type';
import { excludeFromEquals } from '@dspace/core/utilities/equals.decorators';
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
