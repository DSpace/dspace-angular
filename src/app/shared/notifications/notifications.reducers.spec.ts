import { notificationsReducer } from './notifications.reducers';
import { NewNotificationAction, RemoveAllNotificationsAction, RemoveNotificationAction } from './notifications.actions';
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

fdescribe('Notification reducers', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent, NotificationsBoardComponent],
      providers: [NotificationsService],
      imports: [
        StoreModule.forRoot({notificationsReducer}),
      ]
    });
  });

  it('should handle state for add, remove and removeAll', fakeAsync((inject([NotificationsService], (service: NotificationsService) => {
      const options = new NotificationOptions(
        10000,
        false,
        NotificationAnimationsType.Rotate);
      const notification1 = new Notification(uniqueId(), NotificationType.Success, 'title1', 'content', options, null);
      const notification2 = new Notification(uniqueId(), NotificationType.Success, 'title2', 'content', options, null);
      const notification3 = new Notification(uniqueId(), NotificationType.Success, 'title3', 'content', options, null);
      const notification4 = new Notification(uniqueId(), NotificationType.Success, 'title4', 'content', options, null);
      const html = '<p>I\'m a mock test</p>';
      const notification5 = new Notification(uniqueId(), NotificationType.Success, null, null, options, html);

      console.log(notification1.id);
      console.log(notification2.id);
      console.log(notification3.id);
      console.log(notification4.id);
      console.log(notification5.id);



      let state = notificationsReducer(undefined, new NewNotificationAction(notification1));
      tick(2000);
      console.log('Length: #' + state.length);
      expect(state.length).toEqual(1);

      state = notificationsReducer(undefined, new NewNotificationAction(notification2));
      tick(2000);
      console.log('Length: #' + state.length);
      expect(state.length).toEqual(2);

      state = notificationsReducer(undefined, new NewNotificationAction(notification3));
      tick(2000);
      console.log('Length: #' + state.length);
      expect(state.length).toEqual(3);

      state = notificationsReducer(undefined, new NewNotificationAction(notification4));
      tick(2000);
      console.log('Length: #' + state.length);
      expect(state.length).toEqual(4);

      state = notificationsReducer(undefined, new NewNotificationAction(notification5));
      tick(2000);
      console.log('Length: #' + state.length);
      expect(state.length).toEqual(5);

      state = notificationsReducer(undefined, new RemoveNotificationAction(notification4.id));
      expect(state.length).toEqual(4);
      state = notificationsReducer(undefined, new RemoveNotificationAction(notification5.id));
      expect(state.length).toEqual(3);

      state = notificationsReducer(undefined, new RemoveAllNotificationsAction());
      expect(state.length).toEqual(0);
    })
    ))
  );
});
