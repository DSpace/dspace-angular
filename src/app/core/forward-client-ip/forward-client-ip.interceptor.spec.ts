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

import { REQUEST } from '../../../express.tokens';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { ForwardClientIpInterceptor } from './forward-client-ip.interceptor';

describe('ForwardClientIpInterceptor', () => {
  let service: DspaceRestService;
  let httpMock: HttpTestingController;

  let requestUrl;
  let clientIp;

  beforeEach(() => {
    requestUrl = 'test-url';
    clientIp = '1.2.3.4';

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DspaceRestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ForwardClientIpInterceptor,
          multi: true,
        },
        { provide: REQUEST, useValue: { get: () => undefined, connection: { remoteAddress: clientIp } } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add an X-Forwarded-For header matching the client\'s IP', () => {
    service.get(requestUrl).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(requestUrl);
    expect(httpRequest.request.headers.get('X-Forwarded-For')).toEqual(clientIp);
  });
});
