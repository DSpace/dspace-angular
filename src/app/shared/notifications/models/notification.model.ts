import { INotificationOptions, NotificationOptions } from './notification-options.model';
import { NotificationType } from './notification-type';
import { isEmpty } from '../../empty.util';

export interface INotification {
  id: string
  type: NotificationType
  title?: any
  content?: any
  options?: INotificationOptions
}

export class Notification implements INotification {
  public id: string;
  public type: NotificationType;
  public title: any;
  public content: any;
  public options: INotificationOptions;

  constructor(id: string,
              type: NotificationType,
              title?: any,
              content?: any,
              options?: INotificationOptions) {

    this.id = id;
    this.type = type;
    this.title = title;
    this.content = content;
    this.options = isEmpty(options) ? new NotificationOptions() : options;
  }
}
