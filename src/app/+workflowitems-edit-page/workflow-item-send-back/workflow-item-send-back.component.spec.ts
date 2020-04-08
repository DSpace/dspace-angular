import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import { WorkflowItemSendBackComponent } from './workflow-item-send-back.component';

describe('WorkflowItemSendBackComponent', () => {
  let component: WorkflowItemSendBackComponent;
  let fixture: ComponentFixture<WorkflowItemSendBackComponent>;
  let wfiService;
  let wfi;
  let itemRD$;
  let id;

  function init() {
    wfiService = jasmine.createSpyObj('workflowItemService', {
      sendBack: observableOf(true)
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
      declarations: [WorkflowItemSendBackComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, { wfi: createSuccessfulRemoteDataObject(wfi) }) },
        { provide: Router, useClass: RouterStub },
        { provide: RouteService, useValue: {} },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: WorkflowItemDataService, useValue: wfiService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowItemSendBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendBack on the workflow-item service when sendRequest is called', () => {
    component.sendRequest(id);
    expect(wfiService.sendBack).toHaveBeenCalledWith(id);
  });
});
