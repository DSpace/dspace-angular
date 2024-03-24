import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { APP_DATA_SERVICES_MAP } from '../../../../../config/app-config.interface';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { RequestService } from '../../../../core/data/request.service';
import { RouteService } from '../../../../core/services/route.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { MockActivatedRoute } from '../../../../shared/mocks/active-router.mock';
import { getMockRemoteDataBuildService } from '../../../../shared/mocks/remote-data-build.service.mock';
import { routeServiceStub } from '../../../../shared/testing/route-service.stub';
import { AdminNotifyLogsResultComponent } from '../admin-notify-logs-result/admin-notify-logs-result.component';
import { AdminNotifyIncomingComponent } from './admin-notify-incoming.component';

describe('AdminNotifyIncomingComponent', () => {
  let component: AdminNotifyIncomingComponent;
  let fixture: ComponentFixture<AdminNotifyIncomingComponent>;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;



  beforeEach(async () => {
    rdbService = getMockRemoteDataBuildService();
    halService = jasmine.createSpyObj('halService', {
      'getRootHref': '/api',
    });
    requestService = jasmine.createSpyObj('requestService', {
      'generateRequestId': 'client/1234',
      'send': '',
    });
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AdminNotifyIncomingComponent],
      providers: [
        { provide: SEARCH_CONFIG_SERVICE, useValue: SearchConfigurationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: HALEndpointService, useValue: halService },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        provideMockStore({}),
      ],
    }).overrideComponent(AdminNotifyIncomingComponent, {
      remove: { imports: [AdminNotifyLogsResultComponent] },
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
