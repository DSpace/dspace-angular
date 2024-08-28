import {
  ChangeDetectorRef,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { AppConfig } from '../../../../config/app-config.interface';
import { INotificationBoardOptions } from '../../../../config/notifications-config.interfaces';
import { storeModuleConfig } from '../../../app.reducer';
import { ProcessDataService } from '../../../core/data/processes/process-data.service';
import { ThemedFileDownloadLinkComponent } from '../../file-download-link/themed-file-download-link.component';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { Notification } from '../models/notification.model';
import { NotificationOptions } from '../models/notification-options.model';
import { NotificationType } from '../models/notification-type';
import { IProcessNotification } from '../models/process-notification.model';
import { notificationsReducer } from '../notifications.reducers';
import { NotificationsService } from '../notifications.service';
import { ProcessNotificationComponent } from './process-notification.component';

xdescribe('ProcessNotificationComponent', () => {

  let comp: ProcessNotificationComponent;
  let fixture: ComponentFixture<ProcessNotificationComponent>;
  let deTitle: DebugElement;
  let elTitle: HTMLElement;
  let deContent: DebugElement;
  let elContent: HTMLElement;
  let elType: HTMLElement;

  const processService = jasmine.createSpyObj('processService', {
    getFiles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  });

  beforeEach(waitForAsync(() => {
    const store: Store<Notification> = jasmine.createSpyObj('store', {
      /* eslint-disable no-empty, @typescript-eslint/no-empty-function */
      notifications: [],
    });
    const envConfig: Partial<AppConfig> = {
      notifications: {
        rtl: false,
        position: ['top', 'right'],
        maxStack: 8,
        timeOut: 5000,
        clickToClose: true,
        animate: 'scale',
      } as INotificationBoardOptions,
    } as any;

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({ notificationsReducer }, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ProcessNotificationComponent,
      ], // declare the test component
      providers: [
        { provide: Store, useValue: store },
        { provide: ProcessDataService, useValue: processService },
        ChangeDetectorRef,
        NotificationsService,
        TranslateService,
      ],
    }).overrideComponent(ProcessNotificationComponent, { remove: { imports: [ThemedFileDownloadLinkComponent] } }).compileComponents();  // compile template and css

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessNotificationComponent);
    comp = fixture.componentInstance;
    comp.notification = {
      id: '1',
      type: NotificationType.Info,
      title: 'Notif. title',
      content: 'Notif. content',
      options: new NotificationOptions(),
    } as IProcessNotification;

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

  it('should have html content', () => {
    fixture = TestBed.createComponent(ProcessNotificationComponent);
    comp = fixture.componentInstance;
    const htmlContent = '<a class="btn btn-link p-0 m-0 pb-1" href="/test"><strong>test</strong></a>';
    comp.notification = {
      id: '1',
      type: NotificationType.Info,
      title: 'Notif. title',
      content: htmlContent,
      options: new NotificationOptions(),
      html: true,
    } as IProcessNotification;

    fixture.detectChanges();

    deContent = fixture.debugElement.query(By.css('.notification-html'));
    elContent = deContent.nativeElement;
    expect(elContent.innerHTML).toEqual(htmlContent);
  });

});
