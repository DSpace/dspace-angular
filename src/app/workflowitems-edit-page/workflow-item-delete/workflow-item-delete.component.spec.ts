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
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { RequestService } from '../../../../modules/core/src/lib/core/data/request.service';
import { getMockRequestService } from '../../../../modules/core/src/lib/core/mocks/request.service.mock';
import { TranslateLoaderMock } from '../../../../modules/core/src/lib/core/mocks/translate-loader.mock';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import { RouteService } from '../../../../modules/core/src/lib/core/services/route.service';
import { WorkflowItem } from '../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../../../../modules/core/src/lib/core/submission/workflowitem-data.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { ActivatedRouteStub } from '../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { LocationStub } from '../../../../modules/core/src/lib/core/utilities/testing/location.stub';
import { NotificationsServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { RouterStub } from '../../../../modules/core/src/lib/core/utilities/testing/router.stub';
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
