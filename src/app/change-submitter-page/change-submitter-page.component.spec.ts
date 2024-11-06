import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeSubmitterPageComponent } from './change-submitter-page.component';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../core/cache/builders/remote-data-build.service';
import { RequestService } from '../core/data/request.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { getMockRequestService } from '../shared/mocks/request.service.mock';
import { createPaginatedList } from '../shared/testing/utils.test';
import { HALEndpointServiceStub } from '../shared/testing/hal-endpoint-service.stub';
import { getMockRemoteDataBuildService } from '../shared/mocks/remote-data-build.service.mock';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../shared/mocks/dso-name.service.mock';

describe('ChangeSubmitterPageComponent', () => {
  let component: ChangeSubmitterPageComponent;
  let fixture: ComponentFixture<ChangeSubmitterPageComponent>;

  let activatedRoute;
  let requestService: RequestService;
  let mockDataService: WorkspaceitemDataService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;

  beforeEach(async () => {
    activatedRoute = {
      snapshot: {
        queryParams: new Map([
          ['shareToken', 'fake-share-token'],
        ])
      }
    };
    requestService = getMockRequestService();
    mockDataService = jasmine.createSpyObj('WorkspaceitemDataService', {
      searchBy: observableOf(createSuccessfulRemoteDataObject$(createPaginatedList([]))),
    });
    halService = Object.assign(new HALEndpointServiceStub('some-url'));
    rdbService = getMockRemoteDataBuildService();

    await TestBed.configureTestingModule({
      declarations: [ ChangeSubmitterPageComponent ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: RequestService, useValue: requestService },
        { provide: WorkspaceitemDataService, useValue: mockDataService },
        { provide: HALEndpointService, useValue: halService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: DSONameService, useValue: DSONameServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeSubmitterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
