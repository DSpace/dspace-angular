import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NotificationEvent } from './interfaces/notification-event.type';
import { INotification, Notification } from './models/notification.model';
// import {Icons, defaultIcons} from './interfaces/icons';
import { NotificationType } from './models/notification-type';
import { NotificationOptions } from './models/notification-options.model';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import {
  NewNotificationAction, NewNotificationWithTimerAction, RemoveAllNotificationsAction,
  RemoveNotificationAction
} from './notifications.actions';

@Injectable()
export class NotificationsService {

  // public emitter = new Subject<NotificationEvent>();
  // public icons: Icons = defaultIcons;
  constructor(private store: Store<Notification>) {

  }

  // private set(notification: Notification, to: boolean): Notification {
  //     notification.id = notification.override && notification.override.id ? notification.override.id : Math.random().toString(36).substring(3);
  //     notification.click = new EventEmitter<{}>();
  //     notification.timeoutEnd = new EventEmitter<{}>();
  //
  //     this.emitter.next({command: 'set', notification: notification, add: to});
  //     return notification;
  // };

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
    const notification = new Notification(_.uniqueId(), NotificationType.Success, title, content, options);
    this.add(notification);
    return notification;
  }

  // error(title: any = '', content: any = '', override?: any): Notification {
  //     return this.set({title: title, content: content || '', type: NotificationType.Error, override: override}, true);
  // }

  danger(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(_.uniqueId(), NotificationType.Danger, title, content, options);
    this.add(notification);
    return notification;
  }

  info(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(_.uniqueId(), NotificationType.Info, title, content, options);
    this.add(notification);
    return notification;
  }

  warning(title: any = '', content: any = '', options = new NotificationOptions()): Notification {
    const notification = new Notification(_.uniqueId(), NotificationType.Warning, title, content, options);
    this.add(notification);
    return notification;
  }

  // bare(title: any = '', content: any = '', override?: any): Notification {
  //     return this.set({title: title, content: content || '', type: 'bare', icon: 'bare', override: override}, true);
  // }

  // With type method
  // create(title: any = '', content: any = '', type = 'success'): Notification {
  //   return this.set({
  //     title: title,
  //     content: content,
  //     type: type,
  //     icon: (this.icons as any)[type],
  //     override: override
  //   }, true);
  // }

  // HTML Notification method
  // html(html: any, type = 'success', override?: any, icon = 'bare'): Notification {
  //   return this.set({html: html, type: type, icon: (this.icons as any)[icon], override: override}, true);
  // }

  html(html: any, type = NotificationType.Success, options = new NotificationOptions()): Notification {
    const notification = new Notification(_.uniqueId(), type, null, null, options);
    notification.html = html;
    this.add(notification);
    return notification;
  }

  // Remove all notifications method
  // remove(id?: string): void {
  //   if (id) {
  //     this.emitter.next({command: 'clean', id: id});
  //   } else {
  //     this.emitter.next({command: 'cleanAll'});
  //   }
  // }
  remove(notification: INotification) {
    const actionRemove = new RemoveNotificationAction(notification.id);
    this.store.dispatch(actionRemove);
  }

  removeAll() {
    const actionRemoveAll = new RemoveAllNotificationsAction();
    this.store.dispatch(actionRemoveAll);
  }

}
