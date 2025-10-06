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
import { Router } from '@angular/router';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ClaimedTask } from '@dspace/core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '@dspace/core/tasks/models/process-task-response';
import { PoolTaskDataService } from '@dspace/core/tasks/pool-task-data.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { getMockRequestService } from '@dspace/core/testing/request.service.mock';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { getMockSearchService } from '@dspace/core/testing/search-service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { SearchService } from '../../../search/search.service';
import { ClaimedTaskActionsApproveComponent } from './claimed-task-actions-approve.component';

let component: ClaimedTaskActionsApproveComponent;
let fixture: ComponentFixture<ClaimedTaskActionsApproveComponent>;

const searchService = getMockSearchService();

const requestService = getMockRequestService();

let mockPoolTaskDataService: PoolTaskDataService;
let mockWorkflowItemDataService: WorkflowItemDataService;

describe('ClaimedTaskActionsApproveComponent', () => {
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });
  const claimedTaskService = jasmine.createSpyObj('claimedTaskService', {
    submitTask: of(new ProcessTaskResponse(true)),
  });

  beforeEach(waitForAsync(() => {
    mockPoolTaskDataService = new PoolTaskDataService(null, null, null, null);
    mockWorkflowItemDataService = jasmine.createSpyObj('WorkflowItemDataService', {
      'invalidateByHref': of(false),
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ClaimedTaskActionsApproveComponent,
      ],
      providers: [
        { provide: ClaimedTaskDataService, useValue: claimedTaskService },
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestService },
        { provide: PoolTaskDataService, useValue: mockPoolTaskDataService },
        { provide: WorkflowItemDataService, useValue: mockWorkflowItemDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedTaskActionsApproveComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsApproveComponent);
    component = fixture.componentInstance;
    component.object = object;
    spyOn(component, 'initReloadAnchor').and.returnValue(undefined);
    fixture.detectChanges();
  });

  it('should display approve button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-success'));

    expect(btn).not.toBeNull();
  });

  it('should display spin icon when approve is pending', () => {
    component.processing$.next(true);
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-success .fa-spin'));

    expect(span).not.toBeNull();
  });

  describe('submitTask', () => {
    let expectedBody;

    beforeEach(() => {
      spyOn(component.processCompleted, 'emit');
      spyOn(component, 'startActionExecution').and.returnValue(of(null));

      expectedBody = {
        [component.option]: 'true',
      };

      component.submitTask();
      fixture.detectChanges();
    });

    it('should start the action execution', () => {
      expect(component.startActionExecution).toHaveBeenCalled();
    });
  });

  describe('actionExecution', () => {

    it('should call claimedTaskService\'s submitTask', (done) => {

      const expectedBody = {
        [component.option]: 'true',
      };

      component.actionExecution().subscribe(() => {
        expect(claimedTaskService.submitTask).toHaveBeenCalledWith(object.id, expectedBody);
        done();
      });
    });

  });

  describe('reloadObjectExecution', () => {

    it('should return the component object itself', (done) => {
      component.reloadObjectExecution().subscribe((val) => {
        expect(val).toEqual(component.object);
        done();
      });
    });
  });

});
