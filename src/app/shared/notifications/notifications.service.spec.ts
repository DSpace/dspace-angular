import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';
import { NotificationComponent } from './notification/notification.component';
import { Store, StoreModule } from '@ngrx/store';
import { notificationsReducer } from './notifications.reducers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NewNotificationAction, RemoveAllNotificationsAction, RemoveNotificationAction } from './notifications.actions';
import { Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type';
import { GlobalConfig } from '../../../config/global-config.interface';

describe('NotificationsService test', () => {
  const store: Store<Notification> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: Observable.of(true)
  });
  let service;
  let envConfig: GlobalConfig;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent, NotificationsBoardComponent],
      providers: [NotificationsService],
      imports: [
        StoreModule.forRoot({notificationsReducer}),
      ]
    });

    envConfig = {
      notifications: {
        rtl: false,
        position: ['top', 'right'],
        maxStack: 8,
        timeOut: 5000,
        clickToClose: true,
        animate: 'scale'
      },
    } as any;

    service = new NotificationsService(envConfig, store);
  });

  it('Success method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.success('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Success);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Warning method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.warning('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Warning);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Info method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.info('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Info);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Error method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.error('Title', Observable.of('Content'));
    expect(notification.type).toBe(NotificationType.Error);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Remove method should dispatch RemoveNotificationAction with proper id', () => {
    const notification = new Notification('1234', NotificationType.Info, 'title...', 'description');
    service.remove(notification);
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveNotificationAction(notification.id));
  });

  it('RemoveAll method should dispatch RemoveAllNotificationsAction', () => {
    service.removeAll();
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllNotificationsAction());
  });

});
