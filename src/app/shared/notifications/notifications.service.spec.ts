import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { storeModuleConfig } from '../../app.reducer';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type';
import { NotificationComponent } from './notification/notification.component';
import {
  NewNotificationAction,
  RemoveAllNotificationsAction,
  RemoveNotificationAction,
} from './notifications.actions';
import { notificationsReducer } from './notifications.reducers';
import { NotificationsService } from './notifications.service';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';

describe('NotificationsService test', () => {
  const store: Store<Notification> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: of(true),
  });
  let service: NotificationsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ notificationsReducer }, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        NotificationComponent, NotificationsBoardComponent,
      ],
      providers: [
        { provide: Store, useValue: store },
        NotificationsService,
        TranslateService,
      ],
    });

    service = TestBed.inject(NotificationsService);
  }));

  it('Success method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.success('Title', of('Content'));
    expect(notification.type).toBe(NotificationType.Success);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Warning method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.warning('Title', of('Content'));
    expect(notification.type).toBe(NotificationType.Warning);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Info method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.info('Title', of('Content'));
    expect(notification.type).toBe(NotificationType.Info);
    expect(store.dispatch).toHaveBeenCalledWith(new NewNotificationAction(notification));
  });

  it('Error method should dispatch NewNotificationAction with proper parameter', () => {
    const notification = service.error('Title', of('Content'));
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
