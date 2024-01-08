import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotifySearchResultComponent } from './admin-notify-search-result.component';
import { AdminNotifyMessagesService } from '../services/admin-notify-messages.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { cold } from 'jasmine-marbles';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { ActivatedRoute } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router.stub';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';

describe('AdminNotifySearchResultComponent', () => {
  let component: AdminNotifySearchResultComponent;
  let fixture: ComponentFixture<AdminNotifySearchResultComponent>;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;
  let adminNotifyMessageService: AdminNotifyMessagesService;
  const requestUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';
  const testObject = {
    uuid: 'test-property',
    name: 'test-property',
    values: ['value-1', 'value-2']
  } as ConfigurationProperty;


  beforeEach(async () => {
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: '' })
    });
    adminNotifyMessageService = jasmine.createSpyObj('adminNotifyMessageService', {
      getDetailedMessages: EMPTY
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('a', {
        a: {
          payload: testObject
        }
      })
    });
    objectCache = {} as ObjectCacheService;


    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifySearchResultComponent ],
      providers: [
        {provide: AdminNotifyMessagesService, useValue: adminNotifyMessageService},
        { provide: RouteService, useValue: routeServiceStub },
        { provide: ActivatedRoute, useValue: new RouterStub() },
        { provide: HALEndpointService, useValue: halService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: rdbService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifySearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
