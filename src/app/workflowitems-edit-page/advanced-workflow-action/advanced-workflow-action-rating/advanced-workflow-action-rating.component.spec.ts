import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { RequestService } from '@dspace/core';
import { WorkflowActionDataService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { RouteService } from '@dspace/core';
import { Item } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { WorkflowItemDataService } from '@dspace/core';
import { ClaimedTaskDataService } from '@dspace/core';
import { ProcessTaskResponse } from '@dspace/core';
import { RatingAdvancedWorkflowInfo } from '@dspace/core';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core';
import { ClaimedTaskDataServiceStub } from '@dspace/core';
import { LocationStub } from '@dspace/core';
import { NotificationsServiceStub } from '@dspace/core';
import { RequestServiceStub } from '@dspace/core';
import { routeServiceStub } from '@dspace/core';
import { RouterStub } from '@dspace/core';
import { WorkflowActionDataServiceStub } from '@dspace/core';
import { WorkflowItemDataServiceStub } from '@dspace/core';
import { VarDirective } from '../../../shared/utils/var.directive';
import {
  ADVANCED_WORKFLOW_TASK_OPTION_RATING,
  AdvancedWorkflowActionRatingComponent,
} from './advanced-workflow-action-rating.component';

const claimedTaskId = '2';
const workflowId = '1';

describe('AdvancedWorkflowActionRatingComponent', () => {
  const workflowItem: WorkflowItem = new WorkflowItem();
  workflowItem.item = createSuccessfulRemoteDataObject$(new Item());
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
        NgbModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        AdvancedWorkflowActionRatingComponent,
        VarDirective,
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
        { provide: Location, useValue: new LocationStub() },
        { provide: NotificationsService, useValue: notificationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: WorkflowActionDataService, useValue: workflowActionDataService },
        { provide: WorkflowItemDataService, useValue: workflowItemDataService },
        { provide: RequestService, useClass: RequestServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
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

  describe('performAction', () => {
    let ratingAdvancedWorkflowInfo: RatingAdvancedWorkflowInfo;
    beforeEach(() => {
      ratingAdvancedWorkflowInfo = new RatingAdvancedWorkflowInfo();
      ratingAdvancedWorkflowInfo.maxValue = 5;
      spyOn(component, 'getAdvancedInfo').and.returnValue(ratingAdvancedWorkflowInfo);
      spyOn(component, 'previousPage');
      // The form validators are set in the HTML code so the getAdvancedInfo needs to return a value
      fixture.detectChanges();
    });

    describe('with required review', () => {
      beforeEach(() => {
        ratingAdvancedWorkflowInfo.descriptionRequired = true;
        fixture.detectChanges();
      });

      it('should call the claimedTaskDataService with the rating and the required description when it has been rated and return to the mydspace page', () => {
        spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true)));
        component.ratingForm.setValue({
          review: 'Good job!',
          rating: 4,
        });

        component.performAction();

        expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith(claimedTaskId, {
          [ADVANCED_WORKFLOW_TASK_OPTION_RATING]: true,
          review: 'Good job!',
          score: 4,
        });
        expect(notificationService.success).toHaveBeenCalled();
        expect(component.previousPage).toHaveBeenCalled();
      });

      it('should not call the claimedTaskDataService when the required description is empty', () => {
        spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true)));
        component.ratingForm.setValue({
          review: '',
          rating: 4,
        });

        component.performAction();

        expect(claimedTaskDataService.submitTask).not.toHaveBeenCalled();
        expect(notificationService.success).not.toHaveBeenCalled();
        expect(component.previousPage).not.toHaveBeenCalled();
      });
    });

    describe('with an optional review', () => {
      beforeEach(() => {
        ratingAdvancedWorkflowInfo.descriptionRequired = false;
        fixture.detectChanges();
      });

      it('should call the claimedTaskDataService with the optional review when provided and return to the mydspace page', () => {
        spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true)));
        component.ratingForm.setValue({
          review: 'Good job!',
          rating: 4,
        });

        component.performAction();

        expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith(claimedTaskId, {
          [ADVANCED_WORKFLOW_TASK_OPTION_RATING]: true,
          review: 'Good job!',
          score: 4,
        });
        expect(notificationService.success).toHaveBeenCalled();
        expect(component.previousPage).toHaveBeenCalled();
      });

      it('should call the claimedTaskDataService when the optional description is empty and return to the mydspace page', () => {
        spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true)));
        component.ratingForm.setValue({
          review: '',
          rating: 4,
        });

        component.performAction();

        expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith(claimedTaskId, {
          [ADVANCED_WORKFLOW_TASK_OPTION_RATING]: true,
          score: 4,
        });
        expect(notificationService.success).toHaveBeenCalled();
        expect(component.previousPage).toHaveBeenCalled();
      });
    });
  });
});
