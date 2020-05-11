import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

import { NotificationsService } from '../notifications.service';
import { notificationsReducer } from '../notifications.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsBoardComponent } from './notifications-board.component';
import { AppState, storeModuleConfig } from '../../../app.reducer';
import { NotificationComponent } from '../notification/notification.component';
import { Notification } from '../models/notification.model';
import { NotificationType } from '../models/notification-type';
import { uniqueId } from 'lodash';
import { INotificationBoardOptions } from '../../../../config/notifications-config.interfaces';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';

describe('NotificationsBoardComponent', () => {
  let comp: NotificationsBoardComponent;
  let fixture: ComponentFixture<NotificationsBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({notificationsReducer}, {
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }
        })],
      declarations: [NotificationsBoardComponent, NotificationComponent], // declare the test component
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        ChangeDetectorRef]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(inject([NotificationsService, Store], (service: NotificationsService, store: Store<AppState>) => {
    store
      .subscribe((state) => {
        const notifications = [
          new Notification(uniqueId(), NotificationType.Success, 'title1', 'content1'),
          new Notification(uniqueId(), NotificationType.Info, 'title2', 'content2')
        ];
        state.notifications = notifications;
      });

    fixture = TestBed.createComponent(NotificationsBoardComponent);
    comp = fixture.componentInstance;
    comp.options = {
      rtl: false,
      position: ['top', 'right'],
      maxStack: 5,
      timeOut: 5000,
      clickToClose: true,
      animate: 'scale'
    } as INotificationBoardOptions;

    fixture.detectChanges();
  }));

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  it('should have two notifications', () => {
    expect(comp.notifications.length).toBe(2);
  });

})
;
