import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { DSpaceHeaderInterceptor } from './dspace-header.interceptor';
import { UIURLCombiner } from '../url-combiner/ui-url-combiner';

describe(`DSpaceHeaderInterceptor`, () => {
  let service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;

  // Mock url/payload/statuses are fake as we are not testing the results
  // of any below requests. We are only testing for X-DSpace-UI header.
  const mockRequestUrl = 'test-url';
  const mockPayload = { id: 1 };
  const mockStatusCode = 200;
  const mockStatusText = 'SUCCESS';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DSpaceRESTv2Service,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DSpaceHeaderInterceptor,
          multi: true,
        },
      ],
    });

    service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should add an X-DSpace-UI header matching the configured URL', (done) => {
    // start a request, subscribing to it
    service.get(mockRequestUrl).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });

    // check that a single request was made to URL & expected header is there
    const httpRequest = httpMock.expectOne(mockRequestUrl);
    expect(httpRequest.request.headers.has('X-DSpace-UI'));
    expect(httpRequest.request.headers.get('X-DSpace-UI'))
          .toEqual(new UIURLCombiner('/').toString().toLowerCase());

    // end request, providing dummy values to the response
    httpRequest.flush(mockPayload,
        { status: mockStatusCode, statusText: mockStatusText });
  });
});
