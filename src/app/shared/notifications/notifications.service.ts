import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { uniqueId } from 'lodash';
import { Observable, of as observableOf } from 'rxjs';

import { NotificationOptions } from './models/notification-options.model';
import { NotificationType } from './models/notification-type';
import { INotification, Notification } from './models/notification.model';
import { NewNotificationAction, RemoveAllNotificationsAction, RemoveNotificationAction } from './notifications.actions';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Injectable()
export class NotificationsService {

  constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig,
              private store: Store<Notification>) {
  }

  private add(notification: Notification) {
    let notificationAction;
    notificationAction = new NewNotificationAction(notification);
    this.store.dispatch(notificationAction);
  }

  success(title: any = observableOf(''),
          content: any = observableOf(''),
          options: NotificationOptions = this.getDefaultOptions(),
          html: boolean = false): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Success, title, content, options, html);
    this.add(notification);
    return notification;
  }

  error(title: any = observableOf(''),
        content: any = observableOf(''),
        options: NotificationOptions = this.getDefaultOptions(),
        html: boolean = false): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Error, title, content, options, html);
    this.add(notification);
    return notification;
  }

  info(title: any = observableOf(''),
       content: any = observableOf(''),
       options: NotificationOptions = this.getDefaultOptions(),
       html: boolean = false): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Info, title, content, options, html);
    this.add(notification);
    return notification;
  }

  warning(title: any = observableOf(''),
          content: any = observableOf(''),
          options: NotificationOptions = this.getDefaultOptions(),
          html: boolean = false): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Warning, title, content, options, html);
    this.add(notification);
    return notification;
  }

  remove(notification: INotification) {
    const actionRemove = new RemoveNotificationAction(notification.id);
    this.store.dispatch(actionRemove);
  }

  removeAll() {
    const actionRemoveAll = new RemoveAllNotificationsAction();
    this.store.dispatch(actionRemoveAll);
  }

  private getDefaultOptions(): NotificationOptions {
    return new NotificationOptions(
      this.config.notifications.timeOut,
      this.config.notifications.clickToClose,
      this.config.notifications.animate
    );
  }
}
