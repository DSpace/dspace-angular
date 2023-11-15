import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarinZipDownloadPageComponent } from './clarin-zip-download-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { FileService } from '../../core/shared/file.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';

describe('ClarinZipDownloadPageComponent', () => {
  let component: ClarinZipDownloadPageComponent;
  let fixture: ComponentFixture<ClarinZipDownloadPageComponent>;

  let authService: AuthService;
  let fileService: FileService;
  let authorizationService: AuthorizationDataService;
  let hardRedirectService: HardRedirectService;
  let activatedRoute;
  let router;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;
  let bitstreamService: BitstreamDataService;
  let bitstreamFormatService: BitstreamFormatDataService;
  let objectCache: ObjectCacheService;
  let notificationService: NotificationsServiceStub;

  let bitstream: Bitstream;

  const url = 'fake-bitstream-url';
  const bitstreamFormatHref = 'rest-api/bitstreamformats';

  beforeEach(async () => {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {}
    });
    authorizationService = jasmine.createSpyObj('authorizationSerivice', {
      isAuthorized: observableOf(true)
    });

    fileService = jasmine.createSpyObj('fileService', {
      retrieveFileDownloadLink: observableOf('content-url-with-headers')
    });

    hardRedirectService = jasmine.createSpyObj('fileService', {
      redirect: {}
    });
    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        content: {href: 'bitstream-content-link'},
        self: {href: 'bitstream-self-link'},
      }
    });

    activatedRoute = {
      data: observableOf({
        bitstream: createSuccessfulRemoteDataObject(
          bitstream
        )
      })
    };

    router = jasmine.createSpyObj('router', ['navigateByUrl']);

    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    rdbService = getMockRemoteDataBuildService();
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    bitstreamFormatService = jasmine.createSpyObj('bistreamFormatService', {
      getBrowseEndpoint: observableOf(bitstreamFormatHref)
    });

    bitstreamService = new BitstreamDataService(requestService, rdbService, objectCache, halService, null, bitstreamFormatService, null, null);
    notificationService = new NotificationsServiceStub();

    await TestBed.configureTestingModule({
      declarations: [ ClarinZipDownloadPageComponent ],
      imports: [CommonModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: AuthService, useValue: authService },
        { provide: FileService, useValue: fileService },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: RequestService, useValue: requestService },
        { provide: HALEndpointService, useValue: halService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatService },
        { provide: ObjectCacheService, useValue: objectCache },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarinZipDownloadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
