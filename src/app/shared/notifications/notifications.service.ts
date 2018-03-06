import { Injectable } from '@angular/core';
import { INotification, Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type';
import { NotificationOptions } from './models/notification-options.model';
import { uniqueId } from 'lodash';
import { Store } from '@ngrx/store';
import {
  NewNotificationAction,
  NewNotificationWithTimerAction,
  RemoveAllNotificationsAction,
  RemoveNotificationAction
} from './notifications.actions';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class NotificationsService {

  constructor(private store: Store<Notification>,
              private domSanitizer: DomSanitizer,) {
  }

  private add(notification: Notification) {
    let notificationAction;
    if (notification.options.timeOut > 0) {
      notificationAction = new NewNotificationWithTimerAction(notification);
    } else {
      notificationAction = new NewNotificationAction(notification);
    }
    this.store.dispatch(notificationAction);
  }

  success(title: any = '', content: any = '',  options = new NotificationOptions(), html?: any): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Success, title, content, options, html);
    this.add(notification);
    return notification;
  }

  error(title: any = '', content: any = '',  options = new NotificationOptions(), html?: any): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Error, title, content, options, html);
    this.add(notification);
    return notification;
  }

  info(title: any = '', content: any = '', options = new NotificationOptions(), html?: any): INotification {
    const notification = new Notification(uniqueId(), NotificationType.Info, title, content, options, html);
    this.add(notification);
    return notification;
  }

  warning(title: any = '', content: any = '', options = new NotificationOptions(), html?: any): INotification {
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

}
