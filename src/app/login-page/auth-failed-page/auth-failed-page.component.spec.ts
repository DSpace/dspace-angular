import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import {createSuccessfulRemoteDataObject$} from '../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { HELP_DESK_PROPERTY } from '../../item-page/tombstone/tombstone.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthFailedPageComponent } from './auth-failed-page.component';
import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';

describe('DuplicateUserErrorComponent', () => {
  let component: AuthFailedPageComponent;
  let fixture: ComponentFixture<AuthFailedPageComponent>;
  let mockConfigurationDataService: ConfigurationDataService;
  let requestService: RequestService;
  let activatedRoute: any;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;
  let notificationService: NotificationsServiceStub;

  const rootUrl = 'root url';
  const queryParams = 'netid[idp]';
  const encodedQueryParams = 'netid%5Bidp%5D&email=';

  activatedRoute = {
    params: observableOf({}),
    snapshot: {
      queryParams: {
        netid: queryParams
      }
    }
  };

  mockConfigurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: HELP_DESK_PROPERTY,
      values: [
        'email'
      ]
    }))
  });

  requestService = jasmine.createSpyObj('requestService', {
    send: observableOf('response'),
    generateRequestId: observableOf('123456'),
  });

  halService = jasmine.createSpyObj('authService', {
    getRootHref: rootUrl,
  });

  rdbService = getMockRemoteDataBuildService();
  notificationService = new NotificationsServiceStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ AuthFailedPageComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ConfigurationDataService, useValue: mockConfigurationDataService },
        { provide: RequestService, useValue: requestService },
        { provide: HALEndpointService, useValue: halService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: NotificationsService, useValue: notificationService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFailedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send request with encoded netId and email param', () => {
    component.ngOnInit();
    component.sendEmail();
    expect(requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({
      href: rootUrl + '/autoregistration?netid=' + encodedQueryParams,
    }));
    expect(component).toBeTruthy();
  });
});
