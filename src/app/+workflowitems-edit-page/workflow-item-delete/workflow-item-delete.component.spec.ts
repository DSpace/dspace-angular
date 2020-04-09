import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowItemDeleteComponent } from './workflow-item-delete.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../shared/mocks/mock-translate-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../shared/testing/router-stub';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { RouteService } from '../../core/services/route.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VarDirective } from '../../shared/utils/var.directive';
import { of as observableOf } from 'rxjs';
import { RequestService } from '../../core/data/request.service';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';

describe('WorkflowItemDeleteComponent', () => {
  let component: WorkflowItemDeleteComponent;
  let fixture: ComponentFixture<WorkflowItemDeleteComponent>;
  let wfiService;
  let wfi;
  let itemRD$;
  let id;

  function init() {
    wfiService = jasmine.createSpyObj('workflowItemService', {
      delete: observableOf(true)
    });
    itemRD$ = createSuccessfulRemoteDataObject$(itemRD$);
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    id = 'de11b5e5-064a-4e98-a7ac-a1a6a65ddf80';
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [WorkflowItemDeleteComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, { wfi: createSuccessfulRemoteDataObject(wfi) }) },
        { provide: Router, useClass: RouterStub },
        { provide: RouteService, useValue: {} },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: WorkflowItemDataService, useValue: wfiService },
        { provide: RequestService, useValue: getMockRequestService() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowItemDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call delete on the workflow-item service when sendRequest is called', () => {
    component.sendRequest(id);
    expect(wfiService.delete).toHaveBeenCalledWith(id);
  });
});
