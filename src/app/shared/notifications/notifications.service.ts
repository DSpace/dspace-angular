import {Injectable, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {NotificationEvent} from './interfaces/notification-event.type';
import {Notification} from './interfaces/notification.type';
import {Icons, defaultIcons} from './interfaces/icons';
import { NotificationType } from './models/notification-type';

@Injectable()
export class NotificationsService {

    public emitter = new Subject<NotificationEvent>();
    public icons: Icons = defaultIcons;

    set(notification: Notification, to: boolean): Notification {
        notification.id = notification.override && notification.override.id ? notification.override.id : Math.random().toString(36).substring(3);
        notification.click = new EventEmitter<{}>();
        notification.timeoutEnd = new EventEmitter<{}>();

        this.emitter.next({command: 'set', notification: notification, add: to});
        return notification;
    };

    success(title: any = '', content: any = '', override?: any): Notification {
        return this.set({title: title, content: content || '', type: NotificationType.Success, override: override}, true);
    }

    // error(title: any = '', content: any = '', override?: any): Notification {
    //     return this.set({title: title, content: content || '', type: NotificationType.Error, override: override}, true);
    // }

    danger(title: any = '', content: any = '', override?: any): Notification {
        return this.set({title: title, content: content || '', type: NotificationType.Danger, override: override}, true);
    }

    info(title: any = '', content: any = '', override?: any): Notification {
        return this.set({title: title, content: content || '', type: NotificationType.Info, override: override}, true);
    }

    warn(title: any = '', content: any = '', override?: any): Notification {
        return this.set({title: title, content: content || '', type: NotificationType.Warning, override: override}, true);
    }

    // bare(title: any = '', content: any = '', override?: any): Notification {
    //     return this.set({title: title, content: content || '', type: 'bare', icon: 'bare', override: override}, true);
    // }

    // With type method
    create(title: any = '', content: any = '', type = 'success', override?: any): Notification {
        return this.set({title: title, content: content, type: type, icon: (this.icons as any)[type], override: override}, true);
    }

    // HTML Notification method
    html(html: any, type = 'success', override?: any, icon = 'bare'): Notification {
        return this.set({html: html, type: type, icon: (this.icons as any)[icon], override: override}, true);
    }

    // Remove all notifications method
    remove(id?: string): void {
        if (id) {
            this.emitter.next({command: 'clean', id: id});
        } else {
            this.emitter.next({command: 'cleanAll'});
        }
    }
}
