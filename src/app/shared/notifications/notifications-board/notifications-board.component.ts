import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Subscription, take } from 'rxjs';

import { NotificationsService } from '../notifications.service';
import { AppState } from '../../../app.reducer';
import { notificationsStateSelector } from '../selectors';
import { INotification } from '../models/notification.model';
import { NotificationsState } from '../notifications.reducers';
import { INotificationBoardOptions } from '../../../../config/notifications-config.interfaces';
import {
  AccessibilitySettingsService
} from '../../../accessibility/accessibility-settings.service';
import cloneDeep from 'lodash/cloneDeep';
import differenceWith from 'lodash/differenceWith';

@Component({
  selector: 'ds-notifications-board',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './notifications-board.component.html',
  styleUrls: ['./notifications-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsBoardComponent implements OnInit, OnDestroy {

  @Input()
  set options(opt: INotificationBoardOptions) {
    this.attachChanges(opt);
  }

  public notifications: INotification[] = [];
  public position: ['top' | 'bottom' | 'middle', 'right' | 'left' | 'center'] = ['bottom', 'right'];

  // Received values
  private maxStack = 8;
  private sub: Subscription;

  // Sent values
  public rtl = false;
  public animate: 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale' = 'fromRight';

  /**
   * Whether to pause the dismiss countdown of all notifications on the board
   */
  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected service: NotificationsService,
    protected store: Store<AppState>,
    protected cdr: ChangeDetectorRef,
    protected accessibilitySettingsService: AccessibilitySettingsService,
  ) {
  }

  ngOnInit(): void {
    this.sub = this.store.pipe(select(notificationsStateSelector))
      .subscribe((state: NotificationsState) => {
        if (state.length === 0) {
          this.notifications = [];
        } else if (state.length > this.notifications.length) {
          // Add
          const newElem = differenceWith(state, this.notifications, this.byId);
          newElem.forEach((notification) => {
            this.add(notification);
          });
        } else {
          // Remove
          const delElem = differenceWith(this.notifications, state, this.byId);
          delElem.forEach((notification) => {
            this.notifications = this.notifications.filter((item: INotification) => item.id !== notification.id);

          });
        }
        this.cdr.detectChanges();
      });
  }

  private byId = (notificationA: INotification, notificationB: INotification) =>
    notificationA.id === notificationB.id;

  // Add the new notification to the notification array
  add(item: INotification): void {
    const toBlock: boolean = this.block(item);
    if (!toBlock) {
      if (this.notifications.length >= this.maxStack) {
        this.notifications.splice(this.notifications.length - 1, 1);
      }

      // It would be a bit better to handle the retrieval of configured settings in the NotificationsService.
      // Due to circular dependencies this is difficult to implement.
      this.accessibilitySettingsService.getAsNumber('notificationTimeOut', item.options.timeOut)
        .pipe(take(1)).subscribe(timeOut => {
          if (timeOut < 0) {
            timeOut = 0;
          }

          // Deep clone because the unaltered item is read-only
          const modifiedNotification = cloneDeep(item);
          modifiedNotification.options.timeOut = timeOut;
          this.notifications.splice(0, 0, modifiedNotification);
          this.cdr.detectChanges();
      });

    } else {
      // Remove the notification from the store
      // This notification was in the store, but not in this.notifications
      // because it was a blocked duplicate
      this.service.remove(item);
    }
  }

  private block(item: INotification): boolean {
    const toCheck = item.html ? this.checkHtml : this.checkStandard;
    this.notifications.forEach((notification) => {
      if (toCheck(notification, item)) {
        return true;
      }
    });

    if (this.notifications.length > 0) {
      this.notifications.forEach((notification) => {
        if (toCheck(notification, item)) {
          return true;
        }
      });
    }

    let comp: INotification;
    if (this.notifications.length > 0) {
      comp = this.notifications[0];
    } else {
      return false;
    }
    return toCheck(comp, item);
  }

  private checkStandard(checker: INotification, item: INotification): boolean {
    return checker.type === item.type && checker.title === item.title && checker.content === item.content;
  }

  private checkHtml(checker: INotification, item: INotification): boolean {
    return checker.html ? checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html : false;
  }

  // Attach all the changes received in the options object
  private attachChanges(options: any): void {
    Object.keys(options).forEach((a) => {
      if (this.hasOwnProperty(a)) {
        (this as any)[a] = options[a];
      }
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
