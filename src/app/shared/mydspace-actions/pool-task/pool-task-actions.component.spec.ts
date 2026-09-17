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
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Item } from '@dspace/core/shared/item.model';
import { PoolTaskSearchResult } from '@dspace/core/shared/object-collection/pool-task-search-result.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { PoolTask } from '@dspace/core/tasks/models/pool-task-object.model';
import { ProcessTaskResponse } from '@dspace/core/tasks/models/process-task-response';
import { PoolTaskDataService } from '@dspace/core/tasks/pool-task-data.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { getMockRequestService } from '@dspace/core/testing/request.service.mock';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { getMockSearchService } from '@dspace/core/testing/search-service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { SearchService } from '../../search/search.service';
import { PoolTaskActionsComponent } from './pool-task-actions.component';

let mockDataService: PoolTaskDataService;
let mockClaimedTaskDataService: ClaimedTaskDataService;

let component: PoolTaskActionsComponent;
let fixture: ComponentFixture<PoolTaskActionsComponent>;

let mockObject: PoolTask;
let notificationsServiceStub: NotificationsServiceStub;
let router: RouterStub;

const searchService = getMockSearchService();

const requestService = getMockRequestService();

const item = Object.assign(new Item(), {
  bundles: of({}),
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
const rdItem = createSuccessfulRemoteDataObject(item);
const workflowitem = Object.assign(new WorkflowItem(), { item: of(rdItem) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockObject = Object.assign(new PoolTask(), { workflowitem: of(rdWorkflowitem), id: '1234' });

describe('PoolTaskActionsComponent', () => {
  beforeEach(waitForAsync(() => {
    mockDataService = new PoolTaskDataService(null, null, null, null);
    mockClaimedTaskDataService = new ClaimedTaskDataService(null, null, null, null);
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        PoolTaskActionsComponent,
      ],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: PoolTaskDataService, useValue: mockDataService },
        { provide: ClaimedTaskDataService, useValue: mockClaimedTaskDataService },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PoolTaskActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolTaskActionsComponent);
    component = fixture.componentInstance;
    component.item = item;
    component.object = mockObject;
    component.workflowitem = workflowitem;
    notificationsServiceStub = TestBed.inject(NotificationsService as any);
    router = TestBed.inject(Router as any);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should init objects properly', () => {
    component.object = null;
    component.initObjects(mockObject);

    expect(component.item).toEqual(item);

    expect(component.object).toEqual(mockObject);

    expect(component.workflowitem).toEqual(workflowitem);
  });

  it('should display claim task button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-info'));

    expect(btn).not.toBeNull();
  });

  it('should display view button', () => {
    const btn = fixture.debugElement.query(By.css('button[data-test="view-btn"]'));

    expect(btn).not.toBeNull();
  });

  it('should call claim task with href of getPoolTaskEndpointById', ((done) => {

    const poolTaskHref = 'poolTaskHref';
    const remoteClaimTaskResponse: any = new ProcessTaskResponse(true, null, null);
    const remoteReloadedObjectResponse: any = createSuccessfulRemoteDataObject(new PoolTask());

    spyOn(mockDataService, 'getPoolTaskEndpointById').and.returnValue(of(poolTaskHref));
    spyOn(mockClaimedTaskDataService, 'claimTask').and.returnValue(of(remoteClaimTaskResponse));
    spyOn(mockClaimedTaskDataService, 'findByItem').and.returnValue(of(remoteReloadedObjectResponse));

    (component as any).objectDataService = mockDataService;

    spyOn(component, 'handleReloadableActionResponse').and.callThrough();

    component.startActionExecution().subscribe( (result) => {

      expect(mockDataService.getPoolTaskEndpointById).toHaveBeenCalledWith(mockObject.id);
      expect(mockClaimedTaskDataService.claimTask).toHaveBeenCalledWith(mockObject.id, poolTaskHref);
      expect(mockClaimedTaskDataService.findByItem).toHaveBeenCalledWith(component.itemUuid);

      expect(result instanceof PoolTaskSearchResult).toBeTrue();

      expect(component.handleReloadableActionResponse).toHaveBeenCalledWith(true, result);

      expect(notificationsServiceStub.success).toHaveBeenCalled();

      done();
    });

  }));

});
