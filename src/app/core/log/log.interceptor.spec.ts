import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RestRequestMethod } from '@dspace/config/rest-request-method';
import { coreReducers } from '@dspace/core/core.reducers';
import { CorrelationIdService } from '@dspace/core/correlation-id/correlation-id.service';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { CookieService } from '../cookies/cookie.service';
import { OrejimeService } from '../cookies/orejime.service';
import {
  CORRELATION_ID_COOKIE,
  CORRELATION_ID_OREJIME_KEY,
} from '../cookies/orejime-configuration';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { UUIDService } from '../shared/uuid.service';
import { CookieServiceMock } from '../testing/cookie.service.mock';
import { RouterStub } from '../testing/router.stub';
import { LogInterceptor } from './log.interceptor';

describe('LogInterceptor', () => {
  let service: DspaceRestService;
  let httpMock: HttpTestingController;
  let cookieService: CookieService;
  let correlationIdService: CorrelationIdService;
  const router = Object.assign(new RouterStub(),{ url : '/statistics' });

  // Mock payload/statuses are dummy content as we are not testing the results
  // of any below requests. We are only testing for X-XSRF-TOKEN header.
  const mockPayload = {
    id: 1,
  };
  const mockStatusCode = 200;
  const mockStatusText = 'SUCCESS';

  const mockOrejimeService = jasmine.createSpyObj('OrejimeService', ['getSavedPreferences']);

  const mockStoreModuleConfig: any = {
    runtimeChecks: {
      strictStateImmutability: true,
      strictActionImmutability: true,
    },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(),
        StoreModule.forFeature('core', coreReducers, mockStoreModuleConfig),
      ],
      providers: [
        DspaceRestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LogInterceptor,
          multi: true,
        },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: Router, useValue: router },
        { provide: CorrelationIdService, useClass: CorrelationIdService },
        { provide: UUIDService, useClass: UUIDService },
        { provide: OrejimeService, useValue: mockOrejimeService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    correlationIdService = TestBed.inject(CorrelationIdService);

    cookieService.set(CORRELATION_ID_COOKIE,'123455');
    correlationIdService.setCorrelationId();
  });


  it('headers should be set when cookie is accepted', (done) => {
    mockOrejimeService.getSavedPreferences.and.returnValue(of({ [CORRELATION_ID_OREJIME_KEY]: true }));

    service.request(RestRequestMethod.POST, 'server/api/core/items', 'test', { withCredentials: false }).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });

    const httpRequest = httpMock.expectOne('server/api/core/items');
    httpRequest.flush(mockPayload, { status: mockStatusCode, statusText: mockStatusText });
    expect(httpRequest.request.headers.has('X-CORRELATION-ID')).toBeTrue();
    expect(httpRequest.request.headers.has('X-REFERRER')).toBeTrue();
  });

  it('headers should not be set when cookie is declined', (done) => {
    mockOrejimeService.getSavedPreferences.and.returnValue(of({ [CORRELATION_ID_OREJIME_KEY]: false }));

    service.request(RestRequestMethod.POST, 'server/api/core/items', 'test', { withCredentials: false }).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });

    const httpRequest = httpMock.expectOne('server/api/core/items');
    httpRequest.flush(mockPayload, { status: mockStatusCode, statusText: mockStatusText });
    expect(httpRequest.request.headers.has('X-CORRELATION-ID')).toBeFalse();
    expect(httpRequest.request.headers.has('X-REFERRER')).toBeTrue();
  });

  it('headers should have the right values when cookie is accepted', (done) => {
    mockOrejimeService.getSavedPreferences.and.returnValue(of({ [CORRELATION_ID_OREJIME_KEY]: true }));

    service.request(RestRequestMethod.POST, 'server/api/core/items', 'test', { withCredentials: false }).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });

    const httpRequest = httpMock.expectOne('server/api/core/items');
    httpRequest.flush(mockPayload, { status: mockStatusCode, statusText: mockStatusText });
    expect(httpRequest.request.headers.get('X-CORRELATION-ID')).toEqual('123455');
    expect(httpRequest.request.headers.get('X-REFERRER')).toEqual('/statistics');
  });
});
