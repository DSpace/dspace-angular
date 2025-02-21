import { typedObject } from '@dspace/core';
import { TypedObject } from '@dspace/core';
import { NotificationType } from '@dspace/core';
import { ListableObject } from '@dspace/core';
import { GenericConstructor } from '@dspace/core';
import { ResourceType } from '@dspace/core';
import { LISTABLE_NOTIFICATION_OBJECT } from './listable-notification-object.resource-type';

/**
 * Object representing a notification message inside a list of objects
 */
@typedObject
export class ListableNotificationObject extends ListableObject implements TypedObject {

  static type: ResourceType = LISTABLE_NOTIFICATION_OBJECT;
  type: ResourceType = LISTABLE_NOTIFICATION_OBJECT;

  protected renderTypes: string[];

  constructor(
    public notificationType: NotificationType = NotificationType.Error,
    public message: string = 'listable-notification-object.default-message',
    ...renderTypes: string[]
  ) {
    super();
    this.renderTypes = renderTypes;
  }

  /**
   * Method that returns as which type of object this object should be rendered.
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [...this.renderTypes, this.constructor as GenericConstructor<ListableObject>];
  }

}
