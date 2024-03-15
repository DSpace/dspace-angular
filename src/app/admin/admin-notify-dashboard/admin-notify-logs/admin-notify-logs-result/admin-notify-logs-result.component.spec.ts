import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { APP_DATA_SERVICES_MAP } from '../../../../../config/app-config.interface';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { RequestService } from '../../../../core/data/request.service';
import { RouteService } from '../../../../core/services/route.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { MockActivatedRoute } from '../../../../shared/mocks/active-router.mock';
import { SearchLabelsComponent } from '../../../../shared/search/search-labels/search-labels.component';
import { ThemedSearchComponent } from '../../../../shared/search/themed-search.component';
import { routeServiceStub } from '../../../../shared/testing/route-service.stub';
import { RouterStub } from '../../../../shared/testing/router.stub';
import { AdminNotifyLogsResultComponent } from './admin-notify-logs-result.component';

describe('AdminNotifyLogsResultComponent', () => {
  let component: AdminNotifyLogsResultComponent;
  let fixture: ComponentFixture<AdminNotifyLogsResultComponent>;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AdminNotifyLogsResultComponent],
      providers: [
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: HALEndpointService, useValue: halService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: RemoteDataBuildService, useValue: rdbService },
        provideMockStore({}),
      ],
    })
      .overrideComponent(AdminNotifyLogsResultComponent, {
        remove: {
          imports: [
            SearchLabelsComponent,
            ThemedSearchComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyLogsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
