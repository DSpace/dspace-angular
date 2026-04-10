import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RequestService } from '@dspace/core/data/request.service';
import { WorkflowActionDataService } from '@dspace/core/data/workflow-action-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { Item } from '@dspace/core/shared/item.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '@dspace/core/tasks/models/process-task-response';
import { ClaimedTaskDataServiceStub } from '@dspace/core/testing/claimed-task-data-service.stub';
import {
  EPersonMock,
  EPersonMock2,
} from '@dspace/core/testing/eperson.mock';
import { LocationStub } from '@dspace/core/testing/location.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RequestServiceStub } from '@dspace/core/testing/request-service.stub';
import { routeServiceStub } from '@dspace/core/testing/route-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { WorkflowActionDataServiceStub } from '@dspace/core/testing/workflow-action-data-service.stub';
import { WorkflowItemDataServiceStub } from '@dspace/core/testing/workflow-item-data-service.stub';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER,
  AdvancedWorkflowActionSelectReviewerComponent,
} from './advanced-workflow-action-select-reviewer.component';

const claimedTaskId = '2';
const workflowId = '1';

describe('AdvancedWorkflowActionSelectReviewerComponent', () => {
  const workflowItem: WorkflowItem = new WorkflowItem();
  workflowItem.item = createSuccessfulRemoteDataObject$(new Item());
  let component: AdvancedWorkflowActionSelectReviewerComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionSelectReviewerComponent>;

  let claimedTaskDataService: ClaimedTaskDataServiceStub;
  let location: LocationStub;
  let notificationService: NotificationsServiceStub;
  let router: RouterStub;
  let workflowActionDataService: WorkflowItemDataServiceStub;
  let workflowItemDataService: WorkflowItemDataServiceStub;

  beforeEach(async () => {
    claimedTaskDataService = new ClaimedTaskDataServiceStub();
    location = new LocationStub();
    notificationService = new NotificationsServiceStub();
    router = new RouterStub();
    workflowActionDataService = new WorkflowActionDataServiceStub();
    workflowItemDataService = new WorkflowItemDataServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AdvancedWorkflowActionSelectReviewerComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              id: workflowId,
              wfi: createSuccessfulRemoteDataObject(workflowItem),
            }),
            snapshot: {
              queryParams: {
                claimedTask: claimedTaskId,
                workflow: 'testaction',
                previousSearchQuery: 'Thor%20Love%20and%20Thunder',
              },
            },
          },
        },
        { provide: ClaimedTaskDataService, useValue: claimedTaskDataService },
        { provide: Location, useValue: location },
        { provide: NotificationsService, useValue: notificationService },
        { provide: Router, useValue: router },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: WorkflowActionDataService, useValue: workflowActionDataService },
        { provide: WorkflowItemDataService, useValue: workflowItemDataService },
        { provide: RequestService, useClass: RequestServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionSelectReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  describe('previousPage', () => {
    it('should navigate back to the Workflow tasks page with the previous query', () => {
      spyOn(location, 'getState').and.returnValue({
        previousQueryParams: {
          configuration: 'workflow',
          query: 'Thor Love and Thunder',
        },
      });

      component.ngOnInit();
      component.previousPage();

      expect(router.navigate).toHaveBeenCalledWith(['/mydspace'], {
        queryParams: {
          configuration: 'workflow',
          query: 'Thor Love and Thunder',
        },
      });
    });
  });

  describe('performAction', () => {
    beforeEach(() => {
      spyOn(component, 'previousPage');
    });

    it('should call the claimedTaskDataService with the list of selected ePersons', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(of(new ProcessTaskResponse(true)));
      component.selectedReviewers = [EPersonMock, EPersonMock2];

      component.performAction();

      expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith(claimedTaskId, {
        [ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER]: true,
        eperson: [EPersonMock.id, EPersonMock2.id],
      });
      expect(notificationService.success).toHaveBeenCalled();
      expect(component.previousPage).toHaveBeenCalled();
    });

    it('should not call the claimedTaskDataService with the list of selected ePersons when it\'s empty', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(of(new ProcessTaskResponse(true)));
      component.selectedReviewers = [];

      component.performAction();

      expect(claimedTaskDataService.submitTask).not.toHaveBeenCalled();
    });

    it('should not call the return to mydspace page when the request failed', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(of(new ProcessTaskResponse(false)));
      component.selectedReviewers = [EPersonMock, EPersonMock2];

      component.performAction();

      expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith(claimedTaskId, {
        [ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER]: true,
        eperson: [EPersonMock.id, EPersonMock2.id],
      });
      expect(notificationService.error).toHaveBeenCalled();
      expect(component.previousPage).not.toHaveBeenCalled();
    });
  });
});
