import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Store, StoreModule } from '@ngrx/store';

import { NotificationComponent } from './notification.component';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { INotificationBoardOptions } from '../../../../config/notifications-config.interfaces';
import { NotificationOptions } from '../models/notification-options.model';
import { NotificationType } from '../models/notification-type';
import { Notification } from '../models/notification.model';
import { notificationsReducer } from '../notifications.reducers';
import { NotificationsService } from '../notifications.service';

describe('NotificationComponent', () => {

  let comp: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let deTitle: DebugElement;
  let elTitle: HTMLElement;
  let deContent: DebugElement;
  let elContent: HTMLElement;
  let elType: HTMLElement;

  beforeEach(async(() => {
    const store: Store<Notification> = jasmine.createSpyObj('store', {
      /* tslint:disable:no-empty */
      notifications: []
    });
    const envConfig: GlobalConfig = {
      notifications: {
        rtl: false,
        position: ['top', 'right'],
        maxStack: 8,
        timeOut: 5000,
        clickToClose: true,
        animate: 'scale'
      }as INotificationBoardOptions,
    } as any;
    const service = new NotificationsService(envConfig, store);

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({notificationsReducer})],
      declarations: [NotificationComponent], // declare the test component
      providers: [
        { provide: NotificationsService, useValue: service },
        ChangeDetectorRef]
    }).compileComponents();  // compile template and css
  }));

  beforeEach(()  => {
    fixture = TestBed.createComponent(NotificationComponent);
    comp = fixture.componentInstance;
    comp.notification = {
      id: '1',
      type: NotificationType.Info,
      title: 'Notif. title',
      content: 'Notif. content',
      options: new NotificationOptions()
    };

    fixture.detectChanges();

    deTitle = fixture.debugElement.query(By.css('.notification-title'));
    elTitle = deTitle.nativeElement;
    deContent = fixture.debugElement.query(By.css('.notification-content'));
    elContent = deContent.nativeElement;
    elType = fixture.debugElement.query(By.css('.notification-icon')).nativeElement;
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  it('should set Title', () => {
    fixture.detectChanges();
    expect(elTitle.textContent).toBe(comp.notification.title as string);
  });

  it('should set Content', () => {
    fixture.detectChanges();
    expect(elContent.textContent).toBe(comp.notification.content as string);
  });

  it('should set type', () => {
    fixture.detectChanges();
    expect(elType).toBeDefined();
  });

  it('shuld has html content', () => {
    fixture = TestBed.createComponent(NotificationComponent);
    comp = fixture.componentInstance;
    const htmlContent = `<a class="btn btn-link p-0 m-0 pb-1" href="/test"><strong>test</strong></a>`
    comp.notification = {
      id: '1',
      type: NotificationType.Info,
      title: 'Notif. title',
      content: htmlContent,
      options: new NotificationOptions(),
      html: true
    };

    fixture.detectChanges();

    deContent = fixture.debugElement.query(By.css('.notification-html'));
    elContent = deContent.nativeElement;
    expect(elContent.innerHTML).toEqual(htmlContent);
  })

});
