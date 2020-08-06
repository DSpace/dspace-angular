import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpXsrfTokenExtractor } from '@angular/common/http';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RestRequestMethod } from '../data/rest-request-method';
import { XsrfInterceptor } from './xsrf.interceptor';

/**
 * A Mock TokenExtractor which just returns whatever token it is initialized with.
 * This mock object is injected into our XsrfInterceptor, so that it always finds
 * the same fake XSRF token.
 */
class MockTokenExtractor extends HttpXsrfTokenExtractor {
  constructor(private token: string|null) { super(); }

  getToken(): string|null { return this.token; }
}

describe(`XsrfInterceptor`, () => {
  let service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;

  // Create a MockTokenExtractor which always returns "test-token". This will
  // be used as the test HttpXsrfTokenExtractor, see below.
  const testToken = 'test-token';
  const mockTokenExtractor = new MockTokenExtractor(testToken);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DSpaceRESTv2Service,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: XsrfInterceptor,
          multi: true,
        },
        { provide: HttpXsrfTokenExtractor, useValue: mockTokenExtractor },
      ],
    });

    service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should add an X-XSRF-TOKEN header when we’re sending an HTTP POST request', () => {
    service.request(RestRequestMethod.POST, 'server/api/core/items', 'test').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`server/api/core/items`);

    expect(httpRequest.request.headers.has('X-XSRF-TOKEN'));
    const token = httpRequest.request.headers.get('X-XSRF-TOKEN');
    expect(token).toBeDefined();
    expect(token).toBe(testToken.toString());
  });

  it('should NOT add an X-XSRF-TOKEN header when we’re sending an HTTP GET request', () => {
    service.request(RestRequestMethod.GET, 'server/api/core/items').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`server/api/core/items`);

    expect(!httpRequest.request.headers.has('X-XSRF-TOKEN'));
  });

  it('should NOT add an X-XSRF-TOKEN header when we’re sending an HTTP POST to an untrusted URL', () => {
    // POST to a URL which is NOT our REST API
    service.request(RestRequestMethod.POST, 'https://untrusted.com', 'test').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`https://untrusted.com`);

    expect(!httpRequest.request.headers.has('X-XSRF-TOKEN'));
  });

});
