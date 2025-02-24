import {
  ChangeDetectionStrategy,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  ActivatedRouteStub,
  ClaimedTask,
  ClaimedTaskDataService,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
  getMockRequestService,
  Item,
  NotificationsService,
  NotificationsServiceStub,
  RequestService,
  RouterStub,
  SearchService,
  TranslateLoaderMock,
  WorkflowAction,
  WorkflowActionDataService,
  WorkflowItem,
} from '@dspace/core';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { getMockSearchService } from '../../mocks/search-service.mock';
import { VarDirective } from '../../utils/var.directive';
import { ClaimedTaskActionsComponent } from './claimed-task-actions.component';

let component: ClaimedTaskActionsComponent;
let fixture: ComponentFixture<ClaimedTaskActionsComponent>;

let mockObject: ClaimedTask;
let notificationsServiceStub: NotificationsServiceStub;
let router: RouterStub;

let mockDataService;
let searchService;
let requestServce;
let workflowActionService: WorkflowActionDataService;

let item;
let rdItem;
let workflowitem;
let rdWorkflowitem;
let workflowAction;

function init() {
  mockDataService = jasmine.createSpyObj('ClaimedTaskDataService', {
    approveTask: jasmine.createSpy('approveTask'),
    rejectTask: jasmine.createSpy('rejectTask'),
    returnToPoolTask: jasmine.createSpy('returnToPoolTask'),
  });
  searchService = getMockSearchService();
  requestServce = getMockRequestService();

  item = Object.assign(new Item(), {
    bundles: observableOf({}),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title',
        },
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article',
        },
      ],
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26',
        },
      ],
    },
  });
  rdItem = createSuccessfulRemoteDataObject(item);
  workflowitem = Object.assign(new WorkflowItem(), { item: observableOf(rdItem), id: '333' });
  rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
  mockObject = Object.assign(new ClaimedTask(), { workflowitem: observableOf(rdWorkflowitem), id: '1234' });
  workflowAction = Object.assign(new WorkflowAction(), { id: 'action-1', options: ['option-1', 'option-2'] });

  workflowActionService = jasmine.createSpyObj('workflowActionService', {
    findById: createSuccessfulRemoteDataObject$(workflowAction),
  });
}

describe('ClaimedTaskActionsComponent', () => {
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ClaimedTaskActionsComponent, VarDirective,
      ],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ClaimedTaskDataService, useValue: mockDataService },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestServce },
        { provide: WorkflowActionDataService, useValue: workflowActionService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedTaskActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsComponent);
    component = fixture.componentInstance;
    component.item = item;
    component.object = mockObject;
    component.workflowitem = workflowitem;
    notificationsServiceStub = TestBed.inject(NotificationsService as any);
    router = TestBed.inject(Router as any);
    fixture.detectChanges();
  });

  it('should init objects properly', () => {
    component.object = null;
    component.initObjects(mockObject);

    expect(component.item).toEqual(item);

    expect(component.object).toEqual(mockObject);

    expect(component.workflowitem).toEqual(workflowitem);
  });

  it('should reload page on process completed', waitForAsync(() => {
    spyOn(router, 'navigateByUrl');
    router.url = 'test.url/test';

    component.handleActionResponse(true);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('test.url/test');
    });
  }));

  it('should display an error notification on process failure', waitForAsync(() => {
    component.handleActionResponse(false);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));

  it('should display a view button', waitForAsync(() => {
    component.object = null;
    component.initObjects(mockObject);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const debugElement = fixture.debugElement.query(By.css('.workflow-view'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.nativeElement.innerText.trim()).toBe('submission.workflow.generic.view');
    });

  }));

  it('getWorkflowItemViewRoute should return the combined uri to show a workspaceitem', waitForAsync(() => {
    const href = component.getWorkflowItemViewRoute(workflowitem);
    expect(href).toEqual('/workflowitems/333/view');
  }));

});
