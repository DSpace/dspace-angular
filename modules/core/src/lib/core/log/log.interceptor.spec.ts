import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { coreReducers } from '@dspace/core';
import { CorrelationIdService } from '@dspace/core';
import { RestRequestMethod } from '../data';
import { DspaceRestService } from '@dspace/core';
import { CookieServiceMock } from '../mocks';
import { CookieService } from '../services';
import { UUIDService } from '../shared';
import { mockStoreModuleConfig } from '../utilities';
import { RouterStub } from '../utilities';
import { LogInterceptor } from '@dspace/core';


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


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot(coreReducers, mockStoreModuleConfig),
      ],
      providers: [
        DspaceRestService,
        // LogInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LogInterceptor,
          multi: true,
        },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: Router, useValue: router },
        { provide: CorrelationIdService, useClass: CorrelationIdService },
        { provide: UUIDService, useClass: UUIDService },
      ],
    });

    service = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    correlationIdService = TestBed.inject(CorrelationIdService);

    cookieService.set('CORRELATION-ID','123455');
    correlationIdService.initCorrelationId();
  });


  it('headers should be set', (done) => {
    service.request(RestRequestMethod.POST, 'server/api/core/items', 'test', { withCredentials: false }).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });

    const httpRequest = httpMock.expectOne('server/api/core/items');
    httpRequest.flush(mockPayload, { status: mockStatusCode, statusText: mockStatusText });
    expect(httpRequest.request.headers.has('X-CORRELATION-ID')).toBeTrue();
    expect(httpRequest.request.headers.has('X-REFERRER')).toBeTrue();
  });

  it('headers should have the right values', (done) => {
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
