import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdvancedWorkflowActionSelectReviewerComponent,
  ADVANCED_WORKFLOW_TASK_OPTION_SELECT_REVIEWER
} from './advanced-workflow-action-select-reviewer.component';
import { ActivatedRoute } from '@angular/router';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { WorkflowItemDataServiceStub } from '../../../shared/testing/workflow-item-data-service.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkflowActionDataServiceStub } from '../../../shared/testing/workflow-action-data-service.stub';
import { WorkflowActionDataService } from '../../../core/data/workflow-action-data.service';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ClaimedTaskDataServiceStub } from '../../../shared/testing/claimed-task-data-service.stub';
import { of as observableOf } from 'rxjs';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { createSuccessfulRemoteDataObject$, createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { Item } from '../../../core/shared/item.model';
import { EPersonMock, EPersonMock2 } from '../../../shared/testing/eperson.mock';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const claimedTaskId = '2';
const workflowId = '1';

describe('AdvancedWorkflowActionSelectReviewerComponent', () => {
  const workflowItem: WorkflowItem = new WorkflowItem();
  workflowItem.item = createSuccessfulRemoteDataObject$(new Item());
  let component: AdvancedWorkflowActionSelectReviewerComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionSelectReviewerComponent>;

  let claimedTaskDataService: ClaimedTaskDataServiceStub;
  let notificationService: NotificationsServiceStub;
  let workflowActionDataService: WorkflowItemDataServiceStub;
  let workflowItemDataService: WorkflowItemDataServiceStub;

  beforeEach(async () => {
    claimedTaskDataService = new ClaimedTaskDataServiceStub();
    notificationService = new NotificationsServiceStub();
    workflowActionDataService = new WorkflowActionDataServiceStub();
    workflowItemDataService = new WorkflowItemDataServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        AdvancedWorkflowActionSelectReviewerComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: observableOf({
              id: workflowId,
              wfi: createSuccessfulRemoteDataObject(workflowItem),
            }),
            snapshot: {
              queryParams: {
                claimedTask: claimedTaskId,
                workflow: 'testaction',
              },
            },
          },
        },
        { provide: ClaimedTaskDataService, useValue: claimedTaskDataService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: WorkflowActionDataService, useValue: workflowActionDataService },
        { provide: WorkflowItemDataService, useValue: workflowItemDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionSelectReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'previousPage');
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  describe('performAction', () => {
    it('should call the claimedTaskDataService with the list of selected ePersons', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true)));
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
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true)));
      component.selectedReviewers = [];

      component.performAction();

      expect(claimedTaskDataService.submitTask).not.toHaveBeenCalled();
    });

    it('should not call the return to mydspace page when the request failed', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(false)));
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
