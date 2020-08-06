import { ForwardClientIpInterceptor } from './forward-client-ip.interceptor';
import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { REQUEST } from '@nguniversal/express-engine/tokens';

describe('ForwardClientIpInterceptor', () => {
  let service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;

  let requestUrl;
  let clientIp;

  beforeEach(() => {
    requestUrl = 'test-url';
    clientIp = '1.2.3.4';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DSpaceRESTv2Service,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ForwardClientIpInterceptor,
          multi: true,
        },
        { provide: REQUEST, useValue: { get: () => undefined, connection: { remoteAddress: clientIp } }}
      ],
    });

    service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should add an X-Forwarded-For header matching the client\'s IP', () => {
    service.get(requestUrl).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(requestUrl);
    expect(httpRequest.request.headers.get('X-Forwarded-For')).toEqual(clientIp);
  });
});
