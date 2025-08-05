import { ChangeDetectorRef } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { INotificationBoardOptions } from '@dspace/config/notifications-config.interfaces';
import { Notification } from '@dspace/core/notification-system/models/notification.model';
import { NotificationOptions } from '@dspace/core/notification-system/models/notification-options.model';
import { NotificationType } from '@dspace/core/notification-system/models/notification-type';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import uniqueId from 'lodash/uniqueId';

import { AccessibilitySettingsService } from '../../accessibility/accessibility-settings.service';
import { getAccessibilitySettingsServiceStub } from '../../accessibility/accessibility-settings.service.stub';
import { LiveRegionService } from '../../shared/live-region/live-region.service';
import { LiveRegionServiceStub } from '../../shared/live-region/live-region.service.stub';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationsBoardComponent } from './notifications-board.component';

export const bools = { f: false, t: true };

describe('NotificationsBoardComponent', () => {
  let comp: NotificationsBoardComponent;
  let fixture: ComponentFixture<NotificationsBoardComponent>;
  let liveRegionService: LiveRegionServiceStub;

  const mockStoreModuleConfig: any = {
    runtimeChecks: {
      strictStateImmutability: true,
      strictActionImmutability: true,
    },
  };

  const initialState = {
    core: {
      notifications: [
        new Notification(uniqueId(), NotificationType.Success, 'title1', 'content1'),
        new Notification(uniqueId(), NotificationType.Info, 'title2', 'content2'),
      ],
    },
  };

  beforeEach(waitForAsync(() => {
    liveRegionService = new LiveRegionServiceStub();

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        /*        StoreModule.forRoot(),
        StoreModule.forFeature('core', coreReducers, mockStoreModuleConfig),*/
        NotificationsBoardComponent, NotificationComponent,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: LiveRegionService, useValue: liveRegionService },
        { provide: AccessibilitySettingsService, useValue: getAccessibilitySettingsServiceStub() },
        ChangeDetectorRef,
      ],
    }).compileComponents();  // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsBoardComponent);
    comp = fixture.componentInstance;
    comp.options = {
      rtl: false,
      position: ['top', 'right'],
      maxStack: 5,
      timeOut: 5000,
      clickToClose: true,
      animate: 'scale',
    } as INotificationBoardOptions;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  it('should have two notifications', () => {
    expect(comp.notifications.length).toBe(2);
    expect(fixture.debugElement.queryAll(By.css('ds-notification')).length).toBe(2);
  });

  describe('notification countdown', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = fixture.debugElement.query(By.css('div.notifications-wrapper'));
    });

    it('should not be paused by default', () => {
      expect(comp.isPaused$).toBeObservable(cold('f', bools));
    });

    it('should pause on mouseenter', () => {
      wrapper.triggerEventHandler('mouseenter');

      expect(comp.isPaused$).toBeObservable(cold('t', bools));
    });

    it('should resume on mouseleave', () => {
      wrapper.triggerEventHandler('mouseenter');
      wrapper.triggerEventHandler('mouseleave');

      expect(comp.isPaused$).toBeObservable(cold('f', bools));
    });

    it('should be passed to all notifications', () => {
      fixture.debugElement.queryAll(By.css('ds-notification'))
        .map(node => node.componentInstance)
        .forEach(notification => {
          expect(notification.isPaused$).toEqual(comp.isPaused$);
        });
    });
  });

  describe('add', () => {
    beforeEach(() => {
      liveRegionService.addMessage.calls.reset();
    });

    it('should announce content to the live region', fakeAsync(() => {
      const notification = new Notification('id', NotificationType.Info, 'title', 'content');
      comp.add(notification);

      flush();

      expect(liveRegionService.addMessage).toHaveBeenCalledWith('content');
    }));

    it('should not announce anything if there is no content', fakeAsync(() => {
      const notification = new Notification('id', NotificationType.Info, 'title');
      comp.add(notification);

      flush();

      expect(liveRegionService.addMessage).not.toHaveBeenCalled();
    }));

    it('should not announce the content if disabled', fakeAsync(() => {
      const options = new NotificationOptions();
      options.announceContentInLiveRegion = false;

      const notification = new Notification('id', NotificationType.Info, 'title', 'content');
      notification.options = options;
      comp.add(notification);

      flush();

      expect(liveRegionService.addMessage).not.toHaveBeenCalled();
    }));
  });

})
;
