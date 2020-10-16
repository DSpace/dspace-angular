import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { DSpaceHeaderInterceptor } from './dspace-header.interceptor';
import { UIURLCombiner } from '../url-combiner/ui-url-combiner';

describe(`DSpaceHeaderInterceptor`, () => {
  let service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;
  // Dummy request path
  const requestUrl = 'test-url';

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

  it('should add an X-DSpace-UI header matching the configured URL', () => {
    // We don't care about the response to this request. It's just here to
    // check whether the header was inserted as expected.
    service.get(requestUrl).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(requestUrl);
    expect(httpRequest.request.headers.has('X-DSpace-UI'));
    expect(httpRequest.request.headers.get('X-DSpace-UI'))
          .toEqual(new UIURLCombiner('/').toString().toLowerCase());
  });
});
