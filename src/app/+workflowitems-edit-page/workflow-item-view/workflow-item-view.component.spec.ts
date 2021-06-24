import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../core/services/route.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VarDirective } from '../../shared/utils/var.directive';
import { of as observableOf } from 'rxjs';
import { RequestService } from '../../core/data/request.service';
import {
  createFailedRemoteDataObject$,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../../shared/remote-data.utils';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { RouterStub } from '../../shared/testing/router.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { Item } from '../../core/shared/item.model';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { createRelationshipsObservable } from '../../+item-page/simple/item-types/shared/item.component.spec';
import { WorkflowItemViewComponent } from './workflow-item-view.component';
import { By } from '@angular/platform-browser';

describe('WorkflowItemViewComponent', () => {

  const mockItem: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: [],
    relationships: createRelationshipsObservable()
  });

  const mockWfi = new WorkflowItem();
  mockWfi.item = createSuccessfulRemoteDataObject$(mockItem);

  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: observableOf({ wfi: createSuccessfulRemoteDataObject(mockWfi) })
  });

  let comp: WorkflowItemViewComponent;
  let fixture: ComponentFixture<WorkflowItemViewComponent>;
  let wfi;
  let itemRD$;
  let id;

  function init() {
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
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [WorkflowItemViewComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useClass: RouterStub },
        { provide: RouteService, useValue: {} },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: RequestService, useValue: getMockRequestService() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WorkflowItemViewComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('when the item is loading', () => {
    beforeEach(() => {
      comp.itemRD$ = createPendingRemoteDataObject$();
      // comp.itemRD$ = observableOf(new RemoteData(true, true, true, null, undefined));
      fixture.detectChanges();
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });

  describe('when the item failed loading', () => {
    beforeEach(() => {
      comp.itemRD$ = createFailedRemoteDataObject$('server error', 500);
      fixture.detectChanges();
    });

    it('should display an error component', () => {
      const error = fixture.debugElement.query(By.css('ds-error'));
      expect(error.nativeElement).toBeDefined();
    });
  });

});
