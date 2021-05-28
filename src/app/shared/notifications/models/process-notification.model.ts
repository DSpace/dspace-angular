import { INotificationOptions, NotificationOptions } from './notification-options.model';
import { INotification } from './notification.model';
import { NotificationType } from './notification-type';
import { isEmpty } from '../../empty.util';
import { Observable } from 'rxjs';

export interface IProcessNotification extends INotification {
  processId: string;
  checkTime: number;
}

export class ProcessNotification implements IProcessNotification {

  /**
   * Id of the notification.
   */
  public id: string;

  /**
   * Type of the notification.
   */
  public type: NotificationType;

  /**
   * Title of the notification.
   */
  public title: Observable<string> | string;

  /**
   * Content of the notification.
   */
  public content: Observable<string> | string;

  /**
   * Different configurations of the notification.
   */
  public options: INotificationOptions;

  /**
   * If title is html for or not.
   */
  public html: boolean;

  /**
   * Process ID this notification is emited for.
   */
  public processId: string;

  /**
   * Time interval that the notification will be rechecked.
   */
  public checkTime: number;

  constructor(id: string,
              type: NotificationType,
              processId: string,
              checkTime: number,
              title?: Observable<string> | string,
              options?: NotificationOptions,
              html?: boolean) {
    this.id = id;
    this.type = type;
    this.title = title;
    if (isEmpty(options)) {
      options = Object.assign( new NotificationOptions(), { clickToClose: true });
    }
    this.options = options;
    this.html = html;
    this.processId = processId;
    this.checkTime = checkTime;
  }

}
