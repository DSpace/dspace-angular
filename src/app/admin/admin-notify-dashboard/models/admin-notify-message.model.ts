import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { ADMIN_NOTIFY_MESSAGE } from './admin-notify-message.resource-type';

/**
 * A message that includes admin notify info
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class AdminNotifyMessage extends DSpaceObject {
  static type = ADMIN_NOTIFY_MESSAGE;

  /**
   * The type of the resource
   */
  @excludeFromEquals
  type = ADMIN_NOTIFY_MESSAGE;

  /**
   * The id of the message
   */
  @autoserialize
  id: string;

  /**
   * The id of the notification
   */
  @autoserialize
  notificationId: string;

  /**
   * The type of the notification
   */
  @autoserialize
  notificationType: string;

  /**
   * The type of the notification
   */
  @autoserialize
  coarNotifyType: string;

  /**
   * The type of the activity
   */
  @autoserialize
  activityStreamType: string;

  /**
   * The object the message reply to
   */
  @autoserialize
  inReplyTo: string;

  /**
   * The object the message relates to
   */
  @autoserialize
  object: string;

  /**
   * The name of the related item
   */
  @autoserialize
  relatedItem: string;

  /**
   * The name of the related ldn service
   */
  @autoserialize
  ldnService: string;

  /**
   * The context of the message
   */
  @autoserialize
  context: string;

  /**
   * The related COAR message
   */
  @autoserialize
  message: string;

  /**
   * The attempts of the queue
   */
  @autoserialize
  queueAttempts: number;

  /**
   * Timestamp of the last queue attempt
   */
  @autoserialize
  queueLastStartTime: string;

  /**
   * The type of the activity stream
   */
  @autoserialize
  origin: number | string;

  /**
   * The type of the activity stream
   */
  @autoserialize
  target: number | string;

  /**
   * The label for the status of the queue
   */
  @autoserialize
  queueStatusLabel: string;

  /**
   * The timeout of the queue
   */
  @autoserialize
  queueTimeout: string;

  /**
   * The status of the queue
   */
  @autoserialize
  queueStatus: number;

  /**
   * Thumbnail link used when browsing items with showThumbs config enabled.
   */
  @autoserialize
  thumbnail: string;

  /**
   * The observable pointing to the item itself
   */
  @autoserialize
  item: Observable<AdminNotifyMessage>;

  /**
   * The observable pointing to the access status of the item
   */
  @autoserialize
  accessStatus: Observable<AdminNotifyMessage>;



  @deserialize
  _links: {
    self: {
      href: string;
    };
  };

  get self(): string {
    return this._links.self.href;
  }

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
