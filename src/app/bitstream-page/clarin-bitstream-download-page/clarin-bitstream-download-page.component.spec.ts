import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarinBitstreamDownloadPageComponent } from './clarin-bitstream-download-page.component';
import { AuthService } from '../../core/auth/auth.service';
import { FileService } from '../../core/shared/file.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

describe('ClarinBitstreamDownloadPageComponent', () => {
  let component: ClarinBitstreamDownloadPageComponent;
  let fixture: ComponentFixture<ClarinBitstreamDownloadPageComponent>;

  let authService: AuthService;
  let fileService: FileService;
  let authorizationService: AuthorizationDataService;
  let hardRedirectService: HardRedirectService;
  let activatedRoute;
  let router;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;

  let bitstream: Bitstream;

  const url = 'fake-bitstream-url';

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
      }),
      snapshot: {
        queryParams: new Map([
          ['redirectUrl', url],
        ])
      }
    };
    router = jasmine.createSpyObj('router', ['navigateByUrl']);
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    rdbService = getMockRemoteDataBuildService();

    await TestBed.configureTestingModule({
      declarations: [ ClarinBitstreamDownloadPageComponent ],
      imports: [ CommonModule, TranslateModule.forRoot() ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: AuthService, useValue: authService },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: RequestService, useValue: requestService },
        { provide: HALEndpointService, useValue: halService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: FileService, useValue: fileService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarinBitstreamDownloadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
