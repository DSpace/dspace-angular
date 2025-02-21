import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of as observableOf } from 'rxjs';

import { RequestService } from '@dspace/core';
import { WorkflowActionDataService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { RouteService } from '@dspace/core';
import { WorkflowItemDataService } from '@dspace/core';
import { ClaimedTaskDataService } from '@dspace/core';
import { ProcessTaskResponse } from '@dspace/core';
import { ClaimedTaskDataServiceStub } from '@dspace/core';
import { NotificationsServiceStub } from '@dspace/core';
import { RequestServiceStub } from '@dspace/core';
import { routeServiceStub } from '@dspace/core';
import { WorkflowActionDataServiceStub } from '@dspace/core';
import { WorkflowItemDataServiceStub } from '@dspace/core';
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
            data: observableOf({
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
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '',
  standalone: true,
  imports: [RouterTestingModule],
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
