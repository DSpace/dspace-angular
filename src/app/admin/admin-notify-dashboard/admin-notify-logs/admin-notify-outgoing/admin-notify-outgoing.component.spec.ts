import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyOutgoingComponent } from './admin-notify-outgoing.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '../../../../shared/mocks/active-router.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { RouteService } from '../../../../core/services/route.service';
import { routeServiceStub } from '../../../../shared/testing/route-service.stub';
import { RequestService } from '../../../../core/data/request.service';
import { getMockRemoteDataBuildService } from '../../../../shared/mocks/remote-data-build.service.mock';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

describe('AdminNotifyOutgoingComponent', () => {
  let component: AdminNotifyOutgoingComponent;
  let fixture: ComponentFixture<AdminNotifyOutgoingComponent>;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;


  beforeEach(async () => {
    rdbService = getMockRemoteDataBuildService();
    requestService = jasmine.createSpyObj('requestService', {
      'generateRequestId': 'client/1234',
      'send': '',
    });
    halService = jasmine.createSpyObj('halService', {
      'getRootHref': '/api'
    });
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifyOutgoingComponent ],
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

    fixture = TestBed.createComponent(AdminNotifyOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
