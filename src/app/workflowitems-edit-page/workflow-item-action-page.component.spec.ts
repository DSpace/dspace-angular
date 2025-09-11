import {
  CommonModule,
  Location,
} from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { RequestService } from '../core/data/request.service';
import { RouteService } from '../core/services/route.service';
import { WorkflowItem } from '../core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { ModifyItemOverviewComponent } from '../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { LocationStub } from '../shared/testing/location.stub';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { RequestServiceStub } from '../shared/testing/request-service.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { VarDirective } from '../shared/utils/var.directive';
import { WorkflowItemActionPageDirective } from './workflow-item-action-page.component';

const type = 'testType';
describe('WorkflowItemActionPageComponent', () => {
  let component: WorkflowItemActionPageDirective;
  let fixture: ComponentFixture<WorkflowItemActionPageDirective>;
  let wfiService;
  let wfi;
  let itemRD$;
  let id;

  function init() {
    wfiService = jasmine.createSpyObj('workflowItemService', {
      sendBack: of(true),
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
      }), TestComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, { wfi: createSuccessfulRemoteDataObject(wfi) }) },
        { provide: Router, useClass: RouterStub },
        { provide: RouteService, useValue: {} },
        { provide: Location, useValue: new LocationStub() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: WorkflowItemDataService, useValue: wfiService },
        { provide: RequestService, useClass: RequestServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial type correctly', () => {
    expect(component.type).toEqual(type);
  });

  describe('clicking the button with class btn-danger', () => {
    beforeEach(() => {
      spyOn(component, 'performAction');
    });

    it('should call performAction on clicking the btn-danger', () => {
      const button = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
      button.click();
      fixture.detectChanges();
      expect(component.performAction).toHaveBeenCalled();
    });
  });

  describe('clicking the button with class btn-default', () => {
    beforeEach(() => {
      spyOn(component, 'previousPage');
    });

    it('should call performAction on clicking the btn-default', () => {
      const button = fixture.debugElement.query(By.css('.btn-default')).nativeElement;
      button.click();
      fixture.detectChanges();
      expect(component.previousPage).toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'ds-workflow-item-test-action-page',
  templateUrl: 'workflow-item-action-page.component.html',
  imports: [
    CommonModule,
    ModifyItemOverviewComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
class TestComponent extends WorkflowItemActionPageDirective {
  constructor(protected route: ActivatedRoute,
              protected workflowItemService: WorkflowItemDataService,
              protected router: Router,
              protected routeService: RouteService,
              protected notificationsService: NotificationsService,
              protected translationService: TranslateService,
              protected requestService: RequestService,
              protected location: Location,
  ) {
    super(route, workflowItemService, router, routeService, notificationsService, translationService, requestService, location);
  }

  getType(): string {
    return type;
  }

  sendRequest(id: string): Observable<boolean> {
    return of(true);
  }
}
