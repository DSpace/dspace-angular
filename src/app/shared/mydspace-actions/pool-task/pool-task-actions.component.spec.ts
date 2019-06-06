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
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { PoolTaskActionsComponent } from './pool-task-actions.component';
import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { Workflowitem } from '../../../core/submission/models/workflowitem.model';

let component: PoolTaskActionsComponent;
let fixture: ComponentFixture<PoolTaskActionsComponent>;

let mockObject: PoolTask;
let notificationsServiceStub: NotificationsServiceStub;
let router: RouterStub;

const mockDataService = jasmine.createSpyObj('PoolTaskDataService', {
  claimTask: jasmine.createSpy('claimTask')
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
mockObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem), id: '1234' });

describe('PoolTaskActionsComponent', () => {
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
      declarations: [PoolTaskActionsComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: PoolTaskDataService, useValue: mockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PoolTaskActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolTaskActionsComponent);
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

  it('should display claim task button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-info'));

    expect(btn).toBeDefined();
  });

  it('should call claimTask method on claim', fakeAsync(() => {
    spyOn(component, 'reload');
    mockDataService.claimTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.claim();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockDataService.claimTask).toHaveBeenCalledWith(mockObject.id);
    });

  }));

  it('should display a success notification on claim success', async(() => {
    spyOn(component, 'reload');
    mockDataService.claimTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.claim();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  }));

  it('should reload page on claim success', async(() => {
    spyOn(router, 'navigateByUrl');
    router.url = 'test.url/test';
    mockDataService.claimTask.and.returnValue(observableOf({hasSucceeded: true}));

    component.claim();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('test.url/test');
    });
  }));

  it('should display an error notification on claim failure', async(() => {
    mockDataService.claimTask.and.returnValue(observableOf({hasSucceeded: false}));

    component.claim();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));

});
