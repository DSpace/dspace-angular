import { of as observableOf } from 'rxjs';
import { NotificationOptions } from '../notifications/models/notification-options.model';
import { INotification } from '../notifications/models/notification.model';

export class NotificationsServiceStub {

  success(title: any = observableOf(''),
          content: any = observableOf(''),
          options: NotificationOptions = this.getDefaultOptions(),
          html?: any): INotification {
    return
  }

  error(title: any = observableOf(''),
        content: any = observableOf(''),
        options: NotificationOptions = this.getDefaultOptions(),
        html?: any): INotification {
    return
  }

  info(title: any = observableOf(''),
       content: any = observableOf(''),
       options: NotificationOptions = this.getDefaultOptions(),
       html?: any): INotification {
    return
  }

  warning(title: any = observableOf(''),
          content: any = observableOf(''),
          options: NotificationOptions = this.getDefaultOptions(),
          html?: any): INotification {
    return
  }

  remove(notification: INotification) {
    return
  }

  removeAll() {
    return
  }

  private getDefaultOptions(): NotificationOptions {
    return new NotificationOptions();
  }
}
