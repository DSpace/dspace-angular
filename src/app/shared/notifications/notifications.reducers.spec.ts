import { notificationsReducer } from './notifications.reducers';
import {
  NewNotificationAction, NewNotificationWithTimerAction, RemoveAllNotificationsAction,
  RemoveNotificationAction
} from './notifications.actions';
import { NotificationsService } from './notifications.service';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';
import { StoreModule } from '@ngrx/store';
import { NotificationComponent } from './notification/notification.component';
import { NotificationOptions } from './models/notification-options.model';
import { NotificationAnimationsType } from './models/notification-animations-type';
import { NotificationType } from './models/notification-type';
import { Notification } from './models/notification.model';
import { uniqueId } from 'lodash';

describe('Notifications reducer', () => {

  let notification1;
  let notification2;
  let notification3;
  let notification4;
  let notificationHtml;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent, NotificationsBoardComponent],
      providers: [NotificationsService],
      imports: [
        StoreModule.forRoot({notificationsReducer}),
      ]
    });

    const options = new NotificationOptions(
      0,
      true,
      NotificationAnimationsType.Rotate);
    notification1 = new Notification(uniqueId(), NotificationType.Success, 'title1', 'content', options, null);
    notification2 = new Notification(uniqueId(), NotificationType.Success, 'title2', 'content', options, null);
    notification3 = new Notification(uniqueId(), NotificationType.Success, 'title3', 'content', options, null);
    notification4 = new Notification(uniqueId(), NotificationType.Success, 'title4', 'content', options, null);
    const html = '<p>I\'m a mock test</p>';
    notificationHtml = new Notification(uniqueId(), NotificationType.Success, null, null, options, html);
  });

  it('should handle state for add', (inject([NotificationsService], (service: NotificationsService) => {
      const state1 = notificationsReducer(undefined, new NewNotificationAction(notification1));
      expect(state1.length).toEqual(1);

      const state2 = notificationsReducer(state1, new NewNotificationWithTimerAction(notification2));
      expect(state2.length).toEqual(2);

      const state3 = notificationsReducer(state2, new NewNotificationAction(notificationHtml));
      expect(state3.length).toEqual(3);
    })
    )
  );

  it('should handle state for remove', (inject([NotificationsService], (service: NotificationsService) => {
        const state1 = notificationsReducer(undefined, new NewNotificationAction(notification1));
        expect(state1.length).toEqual(1);

        const state2 = notificationsReducer(state1, new NewNotificationAction(notification2));
        expect(state2.length).toEqual(2);

        const state3 = notificationsReducer(state2, new RemoveNotificationAction(notification1.id));
        expect(state3.length).toEqual(1);

      })
    )
  );

  it('should handle state for removeAll', (inject([NotificationsService], (service: NotificationsService) => {
        const state1 = notificationsReducer(undefined, new NewNotificationAction(notification1));
        expect(state1.length).toEqual(1);

        const state2 = notificationsReducer(state1, new NewNotificationAction(notification2));
        expect(state2.length).toEqual(2);

        const state3 = notificationsReducer(state2, new RemoveAllNotificationsAction());
        expect(state3.length).toEqual(0);
      })
    )
  );

  it('should handle state for add, remove and removeAll', (inject([NotificationsService], (service: NotificationsService) => {
        const state1 = notificationsReducer(undefined, new NewNotificationAction(notification1));
        expect(state1.length).toEqual(1);

        const state2 = notificationsReducer(state1, new NewNotificationAction(notification2));
        expect(state2.length).toEqual(2);

        const state3 = notificationsReducer(state2, new NewNotificationAction(notification3));
        expect(state3.length).toEqual(3);

        const state4 = notificationsReducer(state3, new NewNotificationAction(notification4));
        expect(state4.length).toEqual(4);

        const state5 = notificationsReducer(state4, new NewNotificationWithTimerAction(notificationHtml));
        expect(state5.length).toEqual(5);

        const state6 = notificationsReducer(state5, new RemoveNotificationAction(notification4.id));
        expect(state6.length).toEqual(4);

        const state7 = notificationsReducer(state6, new RemoveNotificationAction(notificationHtml.id));
        expect(state7.length).toEqual(3);

        const state8 = notificationsReducer(state7, new RemoveAllNotificationsAction());
        expect(state8.length).toEqual(0);
      })
    )
  );

});
