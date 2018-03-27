import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './models/notification-type';
import { NotificationOptions } from './models/notification-options.model';
import { NotificationAnimationsType } from './models/notification-animations-type';
import { NotificationsBoardComponent } from './notifications-board/notifications-board.component';
import { NotificationComponent } from './notification/notification.component';
import { Store, StoreModule } from '@ngrx/store';
import { notificationsReducer } from './notifications.reducers';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
import { AppState } from '../../app.reducer';
import { notificationsStateSelector } from './selectors';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';

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
      const notification = service.success('Title', Observable.of('Content'));
      expect(notification.options.clickToClose).toBe(true);
    })
  );

  it('Success method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.success('Title', 'Content');
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Success);
      expect(notification.title).toBe(Observable.of('Title'));
      expect(notification.content).toBe(Observable.of('Content'));
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Error method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.error(Observable.of('Title'), Observable.of('Content'));
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Error);
      expect(notification.title).toBe(Observable.of('Title'));
      expect(notification.content).toBe(Observable.of('Content'));
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Warning method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.warning(Observable.of('Title'), Observable.of('Content'));
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Warning);
      expect(notification.title).toBe(Observable.of('Title'));
      expect(notification.content).toBe(Observable.of('Content'));
      expect(notification.html).toBeUndefined();
      expect(notification.options.timeOut).toBe(0);
      expect(notification.options.clickToClose).toBeTruthy();
      expect(notification.options.animate).toBe(NotificationAnimationsType.Scale);
    })
  );

  it('Info method',
    inject([NotificationsService], (service: NotificationsService) => {
      const notification = service.info(Observable.of('Title'), Observable.of('Content'));
      expect(notification.id !== undefined).toBeTruthy();
      expect(notification.type).toBe(NotificationType.Info);
      expect(notification.title).toBe(Observable.of('Title'));
      expect(notification.content).toBe(Observable.of('Content'));
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

  it('Remove',
    inject([NotificationsService, Store], fakeAsync((service: NotificationsService, store: Store<AppState>) => {
      const options = new NotificationOptions(
        10000,
        false,
        NotificationAnimationsType.Rotate);

      const id = 'notificationsReducer';
      // let state = store[id];
      //
      // // let notifications = store.select(notificationsStateSelector);
      // store.subscribe((state) => {
      //   const id = 'notificationsReducer';
      //   console.log('Length: ' + state[id].length);
      //   // state[id].forEach( (n, i) => {
      //   //   console.log('Notification #' + i);
      //   //   console.log(n);
      // });
      const notification1 = service.success('Title', Observable.of('Content'));
      tick(2000);
      expect(store[id].length).toBe(1);
      const notification2 = service.error(Observable.of('Title'), Observable.of('Content'));
      tick(2000);
      expect(store[id].length).toBe(2);
      const notification3 = service.warning(Observable.of('Title'), Observable.of('Content'));
      tick(2000);
      expect(store[id].length).toBe(3);
      const notification4 = service.info(Observable.of('Title'), Observable.of('Content'));
      tick(2000);
      expect(store[id].length).toBe(4);
      const html = '<p>I\'m a mock test</p>';
      const notification5 = service.success(null, null, options, html);
      tick(2000);
      expect(store[id].length).toBe(5);

      // expect(notifications)

      service.remove(notification1);
      tick(2000);
      expect(store[id].length).toBe(0);

    }) )
  );

});
