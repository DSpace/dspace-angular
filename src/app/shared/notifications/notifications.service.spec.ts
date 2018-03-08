import { inject, TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './models/notification-type';
import { NotificationOptions } from './models/notification-options.model';
import { NotificationAnimationsType } from './models/notification-animations-type';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';
import { NotificationComponent } from './notification/notification.component';
import { StoreModule } from '@ngrx/store';
import { notificationsReducer } from './notifications.reducers';

describe('NotificationsService', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent, NotificationsBoardComponent],
      providers: [NotificationsService],
      imports: [
        StoreModule.forRoot({notificationsReducer}),
      ]
    });
  });

  it('Default options',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.success('Title', 'Content');
      expect(notification.options.clickToClose).toBe(true);
    })
  );

  it('Success method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.success('Title', 'Content');
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Success);
      expect(notification.title).toBe('Title');
      expect(notification.content).toBe('Content');
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Error method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.error('Title', 'Content');
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Error);
      expect(notification.title).toBe('Title');
      expect(notification.content).toBe('Content');
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Warning method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.warning('Title', 'Content');
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Warning);
      expect(notification.title).toBe('Title');
      expect(notification.content).toBe('Content');
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Info method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.info('Title', 'Content');
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Info);
      expect(notification.title).toBe('Title');
      expect(notification.content).toBe('Content');
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Html content',
    inject([NotificationsService], (service: NotificationsService) => {
      const options = new NotificationOptions(
        10000,
        false,
        NotificationAnimationsType.Rotate);
      const html = '<p>I\'m a mock test</p>';
      const notification = service.success(null, null, options, html);
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Success);
      expect(notification.title).toBeNull();
      expect(notification.content).toBeNull();
      expect(notification.html).not.toBeNull();
      expect(notification.options.timeOut).toBe(10000);
      expect(notification.options.clickToClose).toBeFalsy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Rotate);
    })
  );

});
