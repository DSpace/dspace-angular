import { Injectable } from '@angular/core';
import { INotification, Notification } from './models/notification.model';
// import {Icons, defaultIcons} from './interfaces/icons';
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

  public static htmlArray = new Map<string, any>();

  // public emitter = new Subject<NotificationEvent>();
  // public icons: Icons = defaultIcons;
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

  success(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(uniqueId(), NotificationType.Success, title, content, options);
    this.add(notification);
    return notification;
  }

  error(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(uniqueId(), NotificationType.Error, title, content, options);
    this.add(notification);
    return notification;
  }

  info(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(uniqueId(), NotificationType.Info, title, content, options);
    this.add(notification);
    return notification;
  }

  warning(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(uniqueId(), NotificationType.Warning, title, content, options);
    this.add(notification);
    return notification;
  }

  html(html: any, type = NotificationType.Success, options = new NotificationOptions()): Notification {
    const notification = new Notification(uniqueId(), type, '', '', options);
    NotificationsService.htmlArray.set(notification.id, html);
    // notification.html = true;
    this.add(notification);
    return notification;
  }

  remove(notification: INotification) {
    const actionRemove = new RemoveNotificationAction(notification.id);
    NotificationsService.htmlArray.delete(notification.id);
    this.store.dispatch(actionRemove);
  }

  removeAll() {
    const actionRemoveAll = new RemoveAllNotificationsAction();
    NotificationsService.htmlArray.clear();
    this.store.dispatch(actionRemoveAll);
  }

}
