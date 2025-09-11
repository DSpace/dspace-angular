import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RequestService } from '../../../../core/data/request.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER } from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-select-reviewer/advanced-workflow-action-select-reviewer.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { ClaimedTaskDataServiceStub } from '../../../testing/claimed-task-data-service.stub';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { RouterStub } from '../../../testing/router.stub';
import { SearchServiceStub } from '../../../testing/search-service.stub';
import { AdvancedClaimedTaskActionSelectReviewerComponent } from './advanced-claimed-task-action-select-reviewer.component';


const taskId = 'claimed-task-1';
const workflowId = 'workflow-1';

describe('AdvancedClaimedTaskActionSelectReviewerComponent', () => {
  const object = Object.assign(new ClaimedTask(), {
    id: taskId,
    workflowitem: of(Object.assign(new WorkflowItem(), {
      id: workflowId,
    })),
  });
  let component: AdvancedClaimedTaskActionSelectReviewerComponent;
  let fixture: ComponentFixture<AdvancedClaimedTaskActionSelectReviewerComponent>;

  let route: ActivatedRouteStub;
  let claimedTaskDataService: ClaimedTaskDataServiceStub;
  let notificationService: NotificationsServiceStub;
  let router: RouterStub;
  let searchService: SearchServiceStub;

  beforeEach(async () => {
    route = new ActivatedRouteStub();
    claimedTaskDataService = new ClaimedTaskDataServiceStub();
    notificationService = new NotificationsServiceStub();
    router = new RouterStub();
    searchService = new SearchServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AdvancedClaimedTaskActionSelectReviewerComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: ClaimedTaskDataService, useValue: claimedTaskDataService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: RequestService, useValue: {} },
        { provide: Router, useValue: router },
        { provide: SearchService, useValue: searchService },
        Location,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedClaimedTaskActionSelectReviewerComponent);
    component = fixture.componentInstance;
    component.object = object;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  it('should display select reviewer button', () => {
    const btn = fixture.debugElement.query(By.css('.selectReviewerAction'));

    expect(btn).not.toBeNull();
  });

  it('should navigate to the advanced workflow page when clicked', () => {
    component.workflowTaskPageRoute = `/workflowitems/${workflowId}/advanced`;
    fixture.debugElement.query(By.css('.selectReviewerAction')).nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith([`/workflowitems/${workflowId}/advanced`], {
      queryParams: {
        workflow: ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER,
        claimedTask: taskId,
      },
    });
  });
});
