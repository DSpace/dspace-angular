import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { ObjectUpdatesService } from '../../core/data/object-updates/object-updates.service';
import {
  INotification,
  Notification,
} from '../notifications/models/notification.model';
import { NotificationType } from '../notifications/models/notification-type';
import { NotificationsService } from '../notifications/notifications.service';
import { RouterStub } from '../testing/router.stub';
import { AbstractTrackableComponent } from './abstract-trackable.component';

describe('AbstractTrackableComponent', () => {
  let comp: AbstractTrackableComponent;
  let fixture: ComponentFixture<AbstractTrackableComponent>;
  let objectUpdatesService;
  let scheduler: TestScheduler;

  const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
  const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
  const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');

  const notificationsService = jasmine.createSpyObj('notificationsService',
    {
      info: infoNotification,
      warning: warningNotification,
      success: successNotification,
    },
  );
  let router: RouterStub;

  const url = 'http://test-url.com/test-url';

  beforeEach(waitForAsync(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false), // should always return something --> its in ngOnInit
        isValidPage: observableOf(true),
      },
    );
    router = new RouterStub();
    router.url = url;

    scheduler = getTestScheduler();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AbstractTrackableComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: Router, useValue: router },
      ], schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractTrackableComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should discard object updates', () => {
    comp.discard();

    expect(objectUpdatesService.discardFieldUpdates).toHaveBeenCalledWith(url, infoNotification);
  });
  it('should undo the discard of object updates', () => {
    comp.reinstate();

    expect(objectUpdatesService.reinstateFieldUpdates).toHaveBeenCalledWith(url);
  });

  describe('isReinstatable', () => {
    beforeEach(() => {
      objectUpdatesService.isReinstatable.and.returnValue(observableOf(true));
    });

    it('should return an observable that emits true', () => {
      const expected = '(a|)';
      scheduler.expectObservable(comp.isReinstatable()).toBe(expected, { a: true });
    });
  });

  describe('hasChanges', () => {
    beforeEach(() => {
      objectUpdatesService.hasUpdates.and.returnValue(observableOf(true));
    });

    it('should return an observable that emits true', () => {
      const expected = '(a|)';
      scheduler.expectObservable(comp.hasChanges()).toBe(expected, { a: true });
    });
  });

});
