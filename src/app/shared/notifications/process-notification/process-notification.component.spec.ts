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
import { BehaviorSubject } from 'rxjs';

import { AppConfig } from '../../../../config/app-config.interface';
import { INotificationBoardOptions } from '../../../../config/notifications-config.interfaces';
import { storeModuleConfig } from '../../../app.reducer';
import { ProcessDataService } from '../../../core/data/processes/process-data.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
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

describe('ProcessNotificationComponent', () => {

  let comp: ProcessNotificationComponent;
  let fixture: ComponentFixture<ProcessNotificationComponent>;
  let deTitle: DebugElement;
  let elTitle: HTMLElement;
  let deContent: DebugElement;
  let elContent: HTMLElement;

  const processService = jasmine.createSpyObj('processService', {
    getFiles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    getProcess: createSuccessfulRemoteDataObject$({ processStatus: '' }),
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
    }).compileComponents();  // compile template and css

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
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  it('should set Title', () => {
    fixture.detectChanges();
    expect(elTitle.textContent.trim()).toBe((comp.notification.title as string).trim());
  });

  it('should set Content', () => {
    fixture.detectChanges();
    expect(elContent.textContent.trim()).toBe('process.new.notification.process.processing');
  });

  it('Should display files section when finished is true and files are present', () => {
    comp.finished = new BehaviorSubject<boolean>(true);
    comp.files$ = new BehaviorSubject([{ name: 'file1', sizeBytes: 1024 }]) as BehaviorSubject<Bitstream[]>;
    fixture.detectChanges();
    const filesSection = fixture.debugElement.query(By.css('.notification-content'));
    expect(filesSection).toBeTruthy();
  });

  it('Should not display files section when finished is false', () => {
    comp.finished = new BehaviorSubject<boolean>(false);
    comp.files$ = new BehaviorSubject([{ name: 'file1', sizeBytes: 1024 }]) as BehaviorSubject<Bitstream[]>;
    fixture.detectChanges();
    const filesSection = fixture.debugElement.query(By.css('.notification-content[data-test="files-content"]'));
    expect(filesSection).toBeFalsy();
  });

  it('Should not display files section when no files are present', () => {
    comp.finished = new BehaviorSubject<boolean>(true);
    comp.files$ = new BehaviorSubject([]);
    fixture.detectChanges();
    const filesSection = fixture.debugElement.query(By.css('.notification-content[data-test="files-content"]'));
    expect(filesSection).toBeFalsy();
  });

});
