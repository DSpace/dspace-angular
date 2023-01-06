import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionSelectReviewerComponent } from './advanced-workflow-action-select-reviewer.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
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

const workflowId = '1';

describe('AdvancedWorkflowActionSelectReviewerComponent', () => {
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
    fixture = TestBed.createComponent(AdvancedWorkflowActionSelectReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
