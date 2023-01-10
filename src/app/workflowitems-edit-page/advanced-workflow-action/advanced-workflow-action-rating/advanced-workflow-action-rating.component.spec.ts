import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionRatingComponent } from './advanced-workflow-action-rating.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
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
import { RouterStub } from '../../../shared/testing/router.stub';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../shared/utils/var.directive';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const workflowId = '1';

describe('AdvancedWorkflowActionRatingComponent', () => {
  let component: AdvancedWorkflowActionRatingComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionRatingComponent>;

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
        FormsModule,
        RatingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        AdvancedWorkflowActionRatingComponent,
        VarDirective,
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
        { provide: Router, useValue: new RouterStub() },
        { provide: WorkflowActionDataService, useValue: workflowActionDataService },
        { provide: WorkflowItemDataService, useValue: workflowItemDataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
