import { INotificationOptions, NotificationOptions } from './notification-options.model';
import { NotificationType } from './notification-type';
import { isEmpty } from '../../empty.util';
import { ElementRef, TemplateRef } from '@angular/core';
import { Deserialize, Serialize, serialize } from 'cerialize';
import { deserialize } from 'cerialize';
import { NotificationsService } from '../notifications.service';

export interface INotification {
  id: string
  type: NotificationType
  title?: any
  content?: any
  options?: INotificationOptions
  html?: any;
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
              options?: NotificationOptions) {

    this.id = id;
    this.type = type;
    this.title = title;
    this.content = content;
    this.options = isEmpty(options) ? new NotificationOptions() : options;
  }

  get html() {
    if (this.title === '' && this.content === '') {
      return NotificationsService.htmlArray.get(this.id);
    } else {
      return null;
    }
  }


}
