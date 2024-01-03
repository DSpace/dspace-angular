import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../../../core/cache/builders/build-decorators';
import { ADMIN_NOTIFY_MESSAGE } from './admin-notify-message.resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';

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
   * The type of the notification
   */
  @autoserialize
  coarNotifyType: string;

  /**
   * The type of the activity stream
   */
  @autoserialize
  source: number;

  /**
   * The type of the activity stream
   */
  @autoserialize
  target: number;

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
