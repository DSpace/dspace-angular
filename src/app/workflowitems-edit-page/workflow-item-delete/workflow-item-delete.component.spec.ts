import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  ActivatedRouteStub,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
  getMockRequestService,
  LocationStub,
  NotificationsService,
  NotificationsServiceStub,
  RequestService,
  RouterStub,
  RouteService,
  TranslateLoaderMock,
  WorkflowItem,
  WorkflowItemDataService,
} from '@dspace/core';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { VarDirective } from '../../shared/utils/var.directive';
import { WorkflowItemDeleteComponent } from './workflow-item-delete.component';

describe('WorkflowItemDeleteComponent', () => {
  let component: WorkflowItemDeleteComponent;
  let fixture: ComponentFixture<WorkflowItemDeleteComponent>;
  let wfiService;
  let wfi;
  let itemRD$;
  let id;

  function init() {
    wfiService = jasmine.createSpyObj('workflowItemService', {
      delete: observableOf(true),
    });
    itemRD$ = createSuccessfulRemoteDataObject$(itemRD$);
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    id = 'de11b5e5-064a-4e98-a7ac-a1a6a65ddf80';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), WorkflowItemDeleteComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, { wfi: createSuccessfulRemoteDataObject(wfi) }) },
        { provide: Router, useClass: RouterStub },
        { provide: RouteService, useValue: {} },
        { provide: Location, useValue: new LocationStub() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: WorkflowItemDataService, useValue: wfiService },
        { provide: RequestService, useValue: getMockRequestService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
