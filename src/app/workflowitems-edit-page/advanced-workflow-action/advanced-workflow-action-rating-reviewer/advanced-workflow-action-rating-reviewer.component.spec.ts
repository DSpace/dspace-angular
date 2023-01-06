import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionRatingReviewerComponent } from './advanced-workflow-action-rating-reviewer.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { WorkflowActionDataService } from '../../../core/data/workflow-action-data.service';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { ClaimedTaskDataServiceStub } from '../../../shared/testing/claimed-task-data-service.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { WorkflowActionDataServiceStub } from '../../../shared/testing/workflow-action-data-service.stub';
import { WorkflowItemDataServiceStub } from '../../../shared/testing/workflow-item-data-service.stub';

const workflowId = '1';

describe('AdvancedWorkflowActionRatingReviewerComponent', () => {
  let component: AdvancedWorkflowActionRatingReviewerComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionRatingReviewerComponent>;

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
      declarations: [
        AdvancedWorkflowActionRatingReviewerComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: observableOf({
              id: workflowId,
            }),
            snapshot: {
              queryParams: convertToParamMap({
                workflow: 'testaction',
              }),
            },
          },
        },
        { provide: ClaimedTaskDataService, useValue: claimedTaskDataService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: WorkflowActionDataService, useValue: workflowActionDataService },
        { provide: WorkflowItemDataService, useValue: workflowItemDataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionRatingReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
