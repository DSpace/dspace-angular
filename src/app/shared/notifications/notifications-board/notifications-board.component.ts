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
import { BehaviorSubject, Subscription, of as observableOf } from 'rxjs';
import difference from 'lodash/difference';
import isEqual from 'lodash/isEqual';

import { NotificationsService } from '../notifications.service';
import { AppState } from '../../../app.reducer';
import { notificationsStateSelector } from '../selectors';
import { INotification } from '../models/notification.model';
import { NotificationsState } from '../notifications.reducers';
import { INotificationBoardOptions } from '../../../../config/notifications-config.interfaces';
import { LiveRegionService } from '../../live-region/live-region.service';
import { hasNoValue, isNotEmptyOperator } from '../../empty.util';
import { take } from 'rxjs/operators';
import { IProcessNotification } from '../models/process-notification.model';

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
  public processNotifications: IProcessNotification[] = [];
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
    private service: NotificationsService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    protected liveRegionService: LiveRegionService,
  ) {
  }

  ngOnInit(): void {
    this.sub = this.store.pipe(select(notificationsStateSelector))
      .subscribe((state: NotificationsState) => {
        if (state.length === 0) {
          this.notifications = [];
        } else if (state.length > this.notifications.length) {
          // Add
          const newElem = difference(state, [...this.notifications,...this.processNotifications]);
          newElem.forEach((notification: IProcessNotification) => {

            if ('processId' in notification) {
              this.addProccess(notification);
            } else {
              this.add(notification);
            }

          });
        } else {
          // Remove
          const delElem = difference([...this.notifications,...this.processNotifications], state);
          delElem.forEach((notification) => {
            this.notifications = this.notifications.filter((item: INotification) => item.id !== notification.id);
            this.processNotifications = this.processNotifications.filter((item: INotification) => item.id !== notification.id);
          });
        }
        this.cdr.detectChanges();
      });
  }

  // Add the new process notification to the processNotifications array
  addProccess(item: IProcessNotification): void {
    this.processNotifications.push(item);
  }

  // Add the new notification to the notification array
  add(item: INotification): void {
    const toBlock: boolean = this.block(item);
    if (!toBlock) {
      if (this.notifications.length >= this.maxStack) {
        this.notifications.splice(this.notifications.length - 1, 1);
      }
      this.notifications.splice(0, 0, item);
      this.addContentToLiveRegion(item);
    } else {
      // Remove the notification from the store
      // This notification was in the store, but not in this.notifications
      // because it was a blocked duplicate
      this.service.remove(item);
    }
  }

  /**
   * Adds the content of the notification (if any) to the live region, so it can be announced by screen readers.
   */
  private addContentToLiveRegion(item: INotification) {
    let content = item.content;

    if (!item.options.announceContentInLiveRegion || hasNoValue(content)) {
      return;
    }

    if (typeof content === 'string') {
      content = observableOf(content);
    }

    content.pipe(
      isNotEmptyOperator(),
      take(1),
    ).subscribe(contentStr => this.liveRegionService.addMessage(contentStr));
  }

  /**
   * Whether to block the provided item because a duplicate notification with the exact same information already
   * exists within the notifications array.
   * @param item The item to check
   * @return true if the notifications array already contains a notification with the exact same information as the
   * provided item. false otherwise.
   * @private
   */
  private block(item: INotification): boolean {
    const toCheck = item.html ? this.checkHtml : this.checkStandard;

    this.notifications.forEach((notification) => {
      if (toCheck(notification, item)) {
        return true;
      }
    });

    return false;
  }

  private checkStandard(checker: INotification, item: INotification): boolean {
    return checker.type === item.type && checker.title === item.title && isEqual(checker.content, item.content);
  }

  private checkHtml(checker: INotification, item: INotification): boolean {
    return checker.html ? checker.type === item.type && checker.title === item.title && isEqual(checker.content, item.content) && checker.html === item.html : false;
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
