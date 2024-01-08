import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyIncomingComponent } from './admin-notify-incoming.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '../../../../shared/mocks/active-router.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { RouteService } from '../../../../core/services/route.service';
import { routeServiceStub } from '../../../../shared/testing/route-service.stub';
import { RequestService } from '../../../../core/data/request.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { getMockRemoteDataBuildService } from '../../../../shared/mocks/remote-data-build.service.mock';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

describe('AdminNotifyIncomingComponent', () => {
  let component: AdminNotifyIncomingComponent;
  let fixture: ComponentFixture<AdminNotifyIncomingComponent>;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;



  beforeEach(async () => {
    rdbService = getMockRemoteDataBuildService();
    halService = jasmine.createSpyObj('halService', {
      'getRootHref': '/api'
    });
    requestService = jasmine.createSpyObj('requestService', {
      'generateRequestId': 'client/1234',
      'send': '',
    });
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifyIncomingComponent ],
      providers: [
        { provide: SEARCH_CONFIG_SERVICE, useValue: SearchConfigurationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: HALEndpointService, useValue: halService },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        provideMockStore({}),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
