import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionComponent } from './advanced-workflow-action.component';
import { Component } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { DSOSelectorComponent } from '../../../shared/dso-selector/dso-selector/dso-selector.component';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ClaimedTaskDataServiceStub } from '../../../shared/testing/claimed-task-data-service.stub';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { WorkflowActionDataService } from '../../../core/data/workflow-action-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowActionDataServiceStub } from '../../../shared/testing/workflow-action-data-service.stub';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { WorkflowItemDataServiceStub } from '../../../shared/testing/workflow-item-data-service.stub';

const workflowId = '1';

describe('AdvancedWorkflowActionComponent', () => {
  let component: AdvancedWorkflowActionComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionComponent>;

  let claimedTaskDataService: ClaimedTaskDataServiceStub;
  let notificationService: NotificationsServiceStub;
  let workflowActionDataService: WorkflowActionDataServiceStub;
  let workflowItemDataService: WorkflowItemDataServiceStub;

  beforeEach(async () => {
    claimedTaskDataService = new ClaimedTaskDataServiceStub();
    notificationService = new NotificationsServiceStub();
    workflowActionDataService = new WorkflowActionDataServiceStub();
    workflowItemDataService = new WorkflowItemDataServiceStub();


    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      declarations: [
        TestComponent,
        MockComponent(DSOSelectorComponent),
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
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('sendRequest', () => {
    it('should return true if the request succeeded', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(true, 200)));
      spyOn(workflowActionDataService, 'findById');

      const result = component.sendRequest(workflowId);

      expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith('1', {
        'submit_test': true,
      });
      result.subscribe((value: boolean) => {
        expect(value).toBeTrue();
      });
    });

    it('should return false if the request didn\'t succeeded', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(observableOf(new ProcessTaskResponse(false, 404)));
      spyOn(workflowActionDataService, 'findById');

      const result = component.sendRequest(workflowId);

      expect(claimedTaskDataService.submitTask).toHaveBeenCalledWith('1', {
        'submit_test': true,
      });
      result.subscribe((value: boolean) => {
        expect(value).toBeFalse();
      });
    });
  });
});

@Component({
  selector: 'ds-test-cmp',
  template: ''
})
class TestComponent extends AdvancedWorkflowActionComponent {

  createBody(): any {
    return {
      'submit_test': true,
    };
  }

  getType(): string {
    return 'testaction';
  }

}
