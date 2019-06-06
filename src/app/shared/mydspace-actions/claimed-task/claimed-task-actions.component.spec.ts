import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MockTranslateLoader } from '../../mocks/mock-translate-loader';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service-stub';
import { RouterStub } from '../../testing/router-stub';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ClaimedTaskActionsComponent } from './claimed-task-actions.component';
import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';

let component: ClaimedTaskActionsComponent;
let fixture: ComponentFixture<ClaimedTaskActionsComponent>;

let mockObject: ClaimedTask;
let notificationsServiceStub: NotificationsServiceStub;
let router: RouterStub;

const mockDataService = jasmine.createSpyObj('PoolTaskDataService', {
  approveTask: jasmine.createSpy('approveTask'),
  rejectTask: jasmine.createSpy('rejectTask'),
  returnToPoolTask: jasmine.createSpy('returnToPoolTask'),
});

const item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const rdItem = new RemoteData(false, false, true, null, item);
const workflowitem = Object.assign(new Workflowitem(), { item: observableOf(rdItem) });
const rdWorkflowitem = new RemoteData(false, false, true, null, workflowitem);
mockObject = Object.assign(new ClaimedTask(), { workflowitem: observableOf(rdWorkflowitem), id: '1234' });

describe('ClaimedTaskActionsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [ClaimedTaskActionsComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: ClaimedTaskDataService, useValue: mockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsComponent);
    component = fixture.componentInstance;
    component.object = mockObject;
    notificationsServiceStub = TestBed.get(NotificationsService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should init objects properly', () => {
    component.object = null;
    component.initObjects(mockObject);

    expect(component.object).toEqual(mockObject);

    expect(component.workflowitem$).toBeObservable(cold('(b|)', {
      b: rdWorkflowitem.payload
    }))
  });

  it('should display edit task button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-info'));

    expect(btn).toBeDefined();
  });

  it('should call approveTask method when approving a task', fakeAsync(() => {
    spyOn(component, 'reload');
    mockDataService.approveTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.approve();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockDataService.approveTask).toHaveBeenCalledWith(mockObject.id);
    });

  }));

  it('should display a success notification on approve success', async(() => {
    spyOn(component, 'reload');
    mockDataService.approveTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.approve();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  }));

  it('should reload page on approve success', async(() => {
    spyOn(router, 'navigateByUrl');
    router.url = 'test.url/test';
    mockDataService.approveTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.approve();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('test.url/test');
    });
  }));

  it('should display an error notification on approve failure', async(() => {
    mockDataService.approveTask.and.returnValue(observableOf({hasSucceeded: false}));

    component.approve();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));

  it('should call rejectTask method when rejecting a task', fakeAsync(() => {
    spyOn(component, 'reload');
    mockDataService.rejectTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.reject('test reject');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockDataService.rejectTask).toHaveBeenCalledWith('test reject', mockObject.id);
    });

  }));

  it('should display a success notification on reject success', async(() => {
    spyOn(component, 'reload');
    mockDataService.rejectTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.reject('test reject');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  }));

  it('should reload page on reject success', async(() => {
    spyOn(router, 'navigateByUrl');
    router.url = 'test.url/test';
    mockDataService.rejectTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.reject('test reject');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('test.url/test');
    });
  }));

  it('should display an error notification on reject failure', async(() => {
    mockDataService.rejectTask.and.returnValue(observableOf({hasSucceeded: false}));

    component.reject('test reject');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));

  it('should call returnToPoolTask method when returning a task to pool', fakeAsync(() => {
    spyOn(component, 'reload');
    mockDataService.returnToPoolTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.returnToPool();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockDataService.returnToPoolTask).toHaveBeenCalledWith( mockObject.id);
    });

  }));

  it('should display a success notification on return to pool success', async(() => {
    spyOn(component, 'reload');
    mockDataService.returnToPoolTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.returnToPool();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  }));

  it('should reload page on return to pool success', async(() => {
    spyOn(router, 'navigateByUrl');
    router.url = 'test.url/test';
    mockDataService.returnToPoolTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.returnToPool();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('test.url/test');
    });
  }));

  it('should display an error notification on return to pool failure', async(() => {
    mockDataService.returnToPoolTask.and.returnValue(observableOf({hasSucceeded: false}));

    component.returnToPool();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));
});
