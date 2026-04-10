import { typedObject } from '../cache/builders/build-decorators';
import { TypedObject } from '../cache/typed-object.model';
import { NotificationType } from '../notification-system/models/notification-type';
import { GenericConstructor } from './generic-constructor';
import { LISTABLE_NOTIFICATION_OBJECT } from './object-collection/listable-notification-object.resource-type';
import { ListableObject } from './object-collection/listable-object.model';
import { ResourceType } from './resource-type';

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
