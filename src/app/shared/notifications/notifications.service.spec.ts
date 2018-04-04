import { inject, TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';
import { NotificationComponent } from './notification/notification.component';
import { Store, StoreModule } from '@ngrx/store';
import { notificationsReducer } from './notifications.reducers';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
import {
  NewNotificationAction, NewNotificationWithTimerAction, RemoveAllNotificationsAction,
  RemoveNotificationAction
} from './notifications.actions';
import { Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type';

describe('NotificationsService', () => {
  const store: Store<Notification> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: Observable.of(true)
  });
  let service;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent, NotificationsBoardComponent],
      providers: [NotificationsService],
      imports: [
        StoreModule.forRoot({notificationsReducer}),
      ]
    });

    service = new NotificationsService(store);
  });

  it('Success notification', () => {
    const notification = service.success('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Success);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationWithTimerAction(notification));
  });

  it('Warning notification', () => {
    const notification = service.warning('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Warning);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationWithTimerAction(notification));
  });

  it('Info notification', () => {
    const notification = service.info('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Info);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationWithTimerAction(notification));
  });

  it('Error notification', () => {
    const notification = service.error('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Error);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationWithTimerAction(notification));
  });

  it('Remove notification', () => {
    const notification = new Notification('1234', NotificationType.Info, 'title...', 'description');
    service.remove(notification);
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveNotificationAction(notification.id));
  });

  it('Remove all notification', () => {
    service.removeAll();
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllNotificationsAction());
  });

});
