import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestService } from '@dspace/core/data/request.service';
import { WorkflowActionDataService } from '@dspace/core/data/workflow-action-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '@dspace/core/tasks/models/process-task-response';
import { ClaimedTaskDataServiceStub } from '@dspace/core/testing/claimed-task-data-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RequestServiceStub } from '@dspace/core/testing/request-service.stub';
import { routeServiceStub } from '@dspace/core/testing/route-service.stub';
import { WorkflowActionDataServiceStub } from '@dspace/core/testing/workflow-action-data-service.stub';
import { WorkflowItemDataServiceStub } from '@dspace/core/testing/workflow-item-data-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { DSOSelectorComponent } from '../../../shared/dso-selector/dso-selector/dso-selector.component';
import { WorkflowItemActionPageDirective } from '../../workflow-item-action-page.component';
import { AdvancedWorkflowActionComponent } from './advanced-workflow-action.component';

const workflowId = '1';

describe('AdvancedWorkflowActionComponent', () => {
  let component: AdvancedWorkflowActionComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionComponent>;

  let claimedTaskDataService: ClaimedTaskDataServiceStub;
  let notificationService: NotificationsServiceStub;
  let workflowActionDataService: WorkflowActionDataServiceStub;
  let workflowItemDataService: WorkflowItemDataServiceStub;
  let mockLocation;

  beforeEach(async () => {
    claimedTaskDataService = new ClaimedTaskDataServiceStub();
    notificationService = new NotificationsServiceStub();
    workflowActionDataService = new WorkflowActionDataServiceStub();
    workflowItemDataService = new WorkflowItemDataServiceStub();
    mockLocation = jasmine.createSpyObj(['getState']);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        TestComponent,
        WorkflowItemActionPageDirective,
        MockComponent(DSOSelectorComponent),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              id: workflowId,
            }),
            snapshot: {
              queryParams: {
                workflow: 'testaction',
              },
            },
          },
        },
        { provide: ClaimedTaskDataService, useValue: claimedTaskDataService },
        { provide: Location, useValue: mockLocation },
        { provide: NotificationsService, useValue: notificationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: WorkflowActionDataService, useValue: workflowActionDataService },
        { provide: WorkflowItemDataService, useValue: workflowItemDataService },
        { provide: RequestService, useClass: RequestServiceStub },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('sendRequest', () => {
    it('should return true if the request succeeded', () => {
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(of(new ProcessTaskResponse(true, 200)));
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
      spyOn(claimedTaskDataService, 'submitTask').and.returnValue(of(new ProcessTaskResponse(false, 404)));
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
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '',
  standalone: true,
  imports: [
    RouterTestingModule,
  ],
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
