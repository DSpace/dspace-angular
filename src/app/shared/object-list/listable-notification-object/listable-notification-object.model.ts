import { typedObject } from '../../../../../modules/core/src/lib/core/cache/builders/build-decorators';
import { TypedObject } from '../../../../../modules/core/src/lib/core/cache/typed-object.model';
import { NotificationType } from '../../../../../modules/core/src/lib/core/notifications/models/notification-type';
import { ListableObject } from '../../../../../modules/core/src/lib/core/object-collection/listable-object.model';
import { GenericConstructor } from '../../../../../modules/core/src/lib/core/shared/generic-constructor';
import { ResourceType } from '../../../../../modules/core/src/lib/core/shared/resource-type';
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
