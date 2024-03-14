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
import { AdminNotifyOutgoingComponent } from './admin-notify-outgoing.component';

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
      'getRootHref': '/api',
    });
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: SEARCH_CONFIG_SERVICE, useValue: SearchConfigurationService },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: HALEndpointService, useValue: halService },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        provideMockStore({}),
      ],
    })
      .overrideComponent(AdminNotifyOutgoingComponent, {
        remove: { imports: [AdminNotifyLogsResultComponent] },
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
